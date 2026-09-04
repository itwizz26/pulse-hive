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
            'payment.completed',
        );

        await this.channel.consume(ORDERS_QUEUE, async (message) => {
            if (!message) {
                return;
            }

            try {
                const event = JSON.parse(message.content.toString());

                this.logger.log(
                    `Received event ${event.eventType} (${event.eventId})`,
                );

                this.logger.debug(
                    `Event payload: ${JSON.stringify(event.data)}`,
                );

                await this.ordersService.handlePaymentCompleted(event.data);

                this.channel?.ack(message);

                this.logger.log(
                    `Successfully processed event ${event.eventId}`,
                );
            } catch (error) {
                this.logger.error(
                    'Failed to process RabbitMQ message',
                    error,
                );

                this.channel?.nack(message, false, false);
            }
        });

        this.logger.log(
            `RabbitMQ connected. Listening on queue: ${ORDERS_QUEUE}`,
        );
    }

    private async close() {
        try {
            await this.channel?.close();
            await this.connection?.close();
        } catch {
            this.logger.warn('Error while closing RabbitMQ connection');
        }
    }
}
