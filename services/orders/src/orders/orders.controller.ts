import { Body, Controller, Post } from '@nestjs/common';

import { CreatePendingOrderDto } from './dto/create-pending-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    async createPendingOrder(@Body() input: CreatePendingOrderDto) {
        return this.ordersService.createPendingOrder(input);
    }
}
