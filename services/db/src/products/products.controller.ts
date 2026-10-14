import {
    Controller,
    Get,
    Param,
    UseGuards,
} from '@nestjs/common';

import { InternalServiceGuard } from '../common/guards/internal-service.guard';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(InternalServiceGuard)
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
    ) {}

    @Get('tenant/:tenantCode')
    async getProductsByTenantCode(
        @Param('tenantCode') tenantCode: string,
    ) {
        return this.productsService.getProductsByTenantCode(
            tenantCode,
        );
    }
}
