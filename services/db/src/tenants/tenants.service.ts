import { Injectable } from '@nestjs/common';

import {
    CreateTenantInput,
    TenantLifecycleService,
} from './services/tenant-lifecycle.service';

@Injectable()
export class TenantsService {
    constructor(
        private readonly tenantLifecycle: TenantLifecycleService,
    ) {}

    createTenant(input: CreateTenantInput) {
        return this.tenantLifecycle.createTenant(input);
    }

    getTenantByCode(tenantCode: string) {
        return this.tenantLifecycle.getTenantByCode(tenantCode);
    }
}
