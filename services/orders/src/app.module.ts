import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { OrdersMessagingModule } from './messaging/orders-messaging.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    DatabaseModule,
    HealthModule,
    OrdersModule,
    OrdersMessagingModule,
  ],
})
export class AppModule {}