import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';

import * as amqp from 'amqplib';

import { OrdersService } from '../orders/orders.service';

const EVENT_EXCHANGE = 'pulsehive.events';
const ORDERS_QUEUE = 'pulsehive.orders';

const PAYMENT_COMPLETED_EVENT = 'payment.completed';
const PAYMENT_STATUS_UPDATED_EVENT = 'payment.status_updated';

interface PaymentEvent {
    eventId?: string;
    eventType: string;
    data: Record<string, unknown>;
}

@Injectable()
export class OrdersMessagingService
    implements OnModuleInit, OnModuleDestroy
{
    private readonly logger = new Logger(OrdersMessagingService.name);

    private connection?: amqp.ChannelModel;
    private channel?: amqp.Channel;

    constructor(private readonly ordersService: OrdersService) {}

    async onModuleInit() {
        await this.connect();
    }

    async onModuleDestroy() {
        await this.close();
    }

    private async connect() {
        const rabbitMqUrl = process.env.RABBITMQ_URL;

        if (!rabbitMqUrl) {
            throw new Error(
                'RABBITMQ_URL environment variable is not configured',
            );
        }

        this.logger.log('Connecting to RabbitMQ...');

        this.connection = await amqp.connect(rabbitMqUrl);

        this.connection.on('error', (error) => {
            this.logger.error('RabbitMQ connection error', error);
        });

        this.connection.on('close', () => {
            this.logger.warn('RabbitMQ connection closed');
        });

        this.channel = await this.connection.createChannel();

        await this.channel.assertExchange(EVENT_EXCHANGE, 'topic', {
            durable: true,
        });

        await this.channel.assertQueue(ORDERS_QUEUE, {
            durable: true,
        });

        await this.channel.bindQueue(
            ORDERS_QUEUE,
            EVENT_EXCHANGE,
            PAYMENT_COMPLETED_EVENT,
        );

        await this.channel.bindQueue(
            ORDERS_QUEUE,
            EVENT_EXCHANGE,
            PAYMENT_STATUS_UPDATED_EVENT,
        );

        await this.channel.consume(ORDERS_QUEUE, async (message) => {
            if (!message) {
                return;
            }

            try {
                const event = JSON.parse(
                    message.content.toString(),
                ) as PaymentEvent;

                if (
                    !event ||
                    typeof event.eventType !== 'string' ||
                    !event.data ||
                    typeof event.data !== 'object' ||
                    Array.isArray(event.data)
                ) {
                    throw new Error('Invalid payment event payload');
                }

                this.logger.log(
                    `Received event ${event.eventType} (${event.eventId ?? 'unknown'})`,
                );

                this.logger.debug(
                    `Event payload: ${JSON.stringify(event.data)}`,
                );

                switch (event.eventType) {
                    case PAYMENT_COMPLETED_EVENT:
                        await this.ordersService.handlePaymentCompleted(
                            event.data as never,
                        );
                        break;

                    case PAYMENT_STATUS_UPDATED_EVENT:
                        await this.ordersService.handlePaymentStatusUpdated(
                            event.data as never,
                        );
                        break;

                    default:
                        throw new Error(
                            `Unsupported payment event type: ${event.eventType}`,
                        );
                }

                this.channel?.ack(message);

                this.logger.log(
                    `Successfully processed event ${event.eventId ?? 'unknown'}`,
                );
            } catch (error) {
                this.logger.error(
                    'Failed to process RabbitMQ message',
                    error instanceof Error ? error.stack : String(error),
                );

                this.channel?.nack(message, false, false);
            }
        });

        this.logger.log(
            `RabbitMQ connected. Listening on queue: ${ORDERS_QUEUE}`,
        );

        this.logger.log(
            `Subscribed to ${PAYMENT_COMPLETED_EVENT} and ${PAYMENT_STATUS_UPDATED_EVENT}`,
        );
    }

    private async close() {
        try {
            await this.channel?.close();
            await this.connection?.close();
        } catch {
            this.logger.warn(
                'Error while closing RabbitMQ connection',
            );
        }
    }
}
