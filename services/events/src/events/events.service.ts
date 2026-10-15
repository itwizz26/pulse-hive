import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';

import * as amqp from 'amqplib';

export const EVENT_EXCHANGE = 'pulsehive.events';

export interface DomainEvent<T = Record<string, unknown>> {
  eventId: string;
  eventType: string;
  version: number;
  occurredAt: string;
  data: T;
}

@Injectable()
export class EventsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventsService.name);

  private connection?: amqp.ChannelModel;
  private channel?: amqp.ConfirmChannel;

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

    this.channel = await this.connection.createConfirmChannel();

    await this.channel.assertExchange(EVENT_EXCHANGE, 'topic', {
      durable: true,
    });

    this.logger.log(
      `RabbitMQ connected. Confirm channel ready. Exchange: ${EVENT_EXCHANGE}`,
    );
  }

  private async close() {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (error) {
      this.logger.warn('Error while closing RabbitMQ connection');
    }
  }

  async publish<T extends Record<string, unknown>>(
    event: DomainEvent<T>,
  ): Promise<void> {
    const channel = this.channel;

    if (!channel) {
      throw new ServiceUnavailableException(
        'RabbitMQ channel is not available',
      );
    }

    const message = Buffer.from(JSON.stringify(event));

    try {
      channel.publish(
        EVENT_EXCHANGE,
        event.eventType,
        message,
        {
          persistent: true,
          contentType: 'application/json',
          contentEncoding: 'utf-8',
          messageId: event.eventId,
          timestamp: Date.now(),
          type: event.eventType,
          headers: {
            version: event.version,
          },
        },
      );

      // Wait until RabbitMQ confirms the published message.
      await channel.waitForConfirms();

      this.logger.log(
        `Published and confirmed event ${event.eventType} (${event.eventId})`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish event ${event.eventType} (${event.eventId})`,
        error instanceof Error ? error.stack : String(error),
      );

      throw new ServiceUnavailableException(
        'RabbitMQ could not confirm the published event',
      );
    }
  }
}
