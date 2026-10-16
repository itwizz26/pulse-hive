import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';

import { InternalAccessGuard } from '../access/guards/internal-access.guard';
import { TenantOnboardingService } from './services/tenant-onboarding.service';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
    constructor(
        private readonly tenantsService: TenantsService,
        private readonly onboardingService: TenantOnboardingService,
    ) {}

    @Post('onboard')
    @UseGuards(InternalAccessGuard)
    async onboardTenant(
        @Headers('x-authenticated-user-id') userId: string | undefined,
        @Body() body: { name?: string },
    ) {
        if (!userId?.trim()) {
            throw new BadRequestException(
                'Authenticated user identity is required',
            );
        }

        if (typeof body.name !== 'string' || !body.name.trim()) {
            throw new BadRequestException('Tenant name is required');
        }

        return this.onboardingService.onboardTenant(userId.trim(), {
            name: body.name.trim(),
        });
    }

    @Get('code/:tenantCode')
    async getTenantByCode(@Param('tenantCode') tenantCode: string) {
        return this.tenantsService.getTenantByCode(tenantCode);
    }
}
