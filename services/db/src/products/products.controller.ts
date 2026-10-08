import {
    Controller,
    Get,
    Param,
} from '@nestjs/common';

import { ProductsService } from './products.service';

@Controller('products')
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
