import { Module } from '@nestjs/common';

import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { TenantLifecycleService } from './services/tenant-lifecycle.service';
import { TenantOnboardingService } from './services/tenant-onboarding.service';
import { AccessModule } from '../access/access.module';

@Module({
    imports: [AccessModule],
    controllers: [TenantsController],
    providers: [
        TenantsService,
        TenantLifecycleService,
        TenantOnboardingService,
    ],
    exports: [
        TenantsService,
        TenantLifecycleService,
        TenantOnboardingService,
    ],
})

export class TenantsModule {}
