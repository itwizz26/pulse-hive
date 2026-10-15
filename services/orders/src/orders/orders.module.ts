import { Module } from '@nestjs/common';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderQueryService } from './services/order-query.service';

@Module({
    controllers: [OrdersController],
    providers: [
        OrdersService,
        OrderQueryService,
    ],
    exports: [
        OrdersService,
        OrderQueryService,
    ],
})

export class OrdersModule {}
