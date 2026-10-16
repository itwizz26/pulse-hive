import { Injectable } from '@nestjs/common';

import {
    TenantPermission,
} from '../policies/tenant-permissions';
import { MembershipService } from './membership.service';

@Injectable()
export class TenantAccessService {
    constructor(
        private readonly memberships: MembershipService,
    ) {}

    async getAvailableTenants(userId: string) {
        return this.memberships.listUserMemberships(userId);
    }

    async authorize(
        userId: string,
        tenantId: string,
        permission: TenantPermission,
    ) {
        return this.memberships.requirePermission(
            userId,
            tenantId,
            permission,
        );
    }
}
