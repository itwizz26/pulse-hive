import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
    constructor(
        private readonly tenantsService: TenantsService,
    ) {}

    @Post()
    async createTenant(
        @Body()
        body: {
        tenantCode: string;
        name: string;
        slug: string;
        },
    ) {
        return this.tenantsService.createTenant(body);
    }

    @Get('code/:tenantCode')
    async getTenantByCode(
        @Param('tenantCode') tenantCode: string,
    ) {
        return this.tenantsService.getTenantByCode(
        tenantCode,
        );
    }
}