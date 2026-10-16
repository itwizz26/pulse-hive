import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { MembershipService } from '../../access/services/membership.service';
import { TenantLifecycleService } from './tenant-lifecycle.service';

@Injectable()
export class TenantOnboardingService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly tenantLifecycle: TenantLifecycleService,
        private readonly memberships: MembershipService,
    ) {}

    async onboardTenant(userId: string, input: { name: string }) {
        return this.prisma.$transaction(async (tx) => {
            // Serialize onboarding attempts for the same user.
            const lockedUsers = await tx.$queryRaw<Array<{ id: string }>>`
                SELECT "id"
                FROM "User"
                WHERE "id" = ${userId}
                FOR UPDATE
            `;

            if (lockedUsers.length === 0) {
                throw new NotFoundException('User not found');
            }

            const tenant = await this.tenantLifecycle.createTenantInTransaction(
                tx,
                { name: input.name },
            );

            const membership = await this.memberships.createOwnerMembership(
                tx,
                userId,
                tenant.id,
            );

            return {
                ...tenant,
                membership: {
                    userId: membership.userId,
                    tenantId: membership.tenantId,
                    role: membership.role,
                    status: membership.status,
                },
            };
        });
    }
}
