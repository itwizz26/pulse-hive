import {
    Body,
    Controller,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';

import { InternalServiceGuard } from '../common/guards/internal-service.guard';
import {
    CreatePendingOrderDto,
    SavePaymentRequestDto,
} from './dto/create-pending-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(InternalServiceGuard)
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
    ) {}

    @Post()
    async createPendingOrder(
        @Body() input: CreatePendingOrderDto,
    ) {
        return this.ordersService.createPendingOrder(input);
    }

    @Patch(':orderId/payment-request')
    async savePaymentRequest(
        @Param('orderId') orderId: string,
        @Body() input: SavePaymentRequestDto,
    ) {
        return this.ordersService.savePaymentRequest(
            orderId,
            input,
        );
    }
}
