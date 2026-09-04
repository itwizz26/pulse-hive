import { Module } from '@nestjs/common';

import { OrdersModule } from '../orders/orders.module';
import { OrdersMessagingService } from './orders-messaging.service';

@Module({
    imports: [OrdersModule],
    providers: [OrdersMessagingService],
})
export class OrdersMessagingModule {}