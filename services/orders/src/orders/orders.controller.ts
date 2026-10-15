import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Headers,
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

import { OrderQueryService } from './services/order-query.service';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(InternalServiceGuard)
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly orderQueryService: OrderQueryService,
    ) {}

    @Get()
    async findOrders(
        @Headers('x-tenant-id') tenantId?: string,
    ) {
        if (!tenantId?.trim()) {
            throw new ForbiddenException(
                'Authenticated tenant context is required',
            );
        }

        return this.orderQueryService.findOrders(tenantId);
    }

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
