import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    MembershipStatus,
    Prisma,
    TenantRole as PrismaTenantRole,
} from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import {
    isTenantRole,
    TenantPermission,
    TenantRole,
    roleHasPermission,
} from '../policies/tenant-permissions';

@Injectable()
export class MembershipService {
    constructor(private readonly prisma: PrismaService) {}

    async createOwnerMembership(
        tx: Prisma.TransactionClient,
        userId: string,
        tenantId: string,
    ) {
        return tx.userTenant.create({
            data: {
                userId,
                tenantId,
                role: PrismaTenantRole.OWNER,
                status: MembershipStatus.ACTIVE,
            },
        });
    }

    async listUserMemberships(userId: string) {
        return this.prisma.userTenant.findMany({
            where: {
                userId,
                status: MembershipStatus.ACTIVE,
            },
            select: {
                id: true,
                role: true,
                status: true,
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        tenantCode: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
    }

    async requireActiveMembership(userId: string, tenantId: string) {
        const membership = await this.prisma.userTenant.findUnique({
            where: {
                userId_tenantId: { userId, tenantId },
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        tenantCode: true,
                    },
                },
            },
        });

        if (!membership || membership.status !== MembershipStatus.ACTIVE) {
            throw new ForbiddenException('An active tenant membership is required');
        }

        if (!isTenantRole(membership.role)) {
            throw new ForbiddenException('Membership has an invalid role');
        }

        return membership;
    }

    async requirePermission(
        userId: string,
        tenantId: string,
        permission: TenantPermission,
    ) {
        const membership = await this.requireActiveMembership(userId, tenantId);

        if (!roleHasPermission(membership.role, permission)) {
            throw new ForbiddenException(
                `Missing tenant permission: ${permission}`,
            );
        }

        return membership;
    }

    async changeRole(
        actorUserId: string,
        targetUserId: string,
        tenantId: string,
        newRole: TenantRole,
    ) {
        if (actorUserId === targetUserId) {
            throw new ForbiddenException('You cannot change your own role');
        }

        if (!isTenantRole(newRole)) {
            throw new BadRequestException('Invalid tenant role');
        }

        return this.prisma.$transaction(
            async (tx) => {
                await this.lockTenant(tx, tenantId);

                const actor = await this.requirePermissionInTransaction(
                    tx,
                    actorUserId,
                    tenantId,
                    'members.change_role',
                );

                const target = await tx.userTenant.findUnique({
                    where: {
                            userId_tenantId: {
                            userId: targetUserId,
                            tenantId,
                        },
                    },
                });

                if (!target || target.status !== MembershipStatus.ACTIVE) {
                    throw new NotFoundException('Active membership not found');
                }

                if (target.role === newRole) {
                    throw new ConflictException('The member already has this role');
                }

                // Only an owner can grant or revoke ownership.
                if (
                    (target.role === PrismaTenantRole.OWNER ||
                    newRole === PrismaTenantRole.OWNER) &&
                    actor.role !== PrismaTenantRole.OWNER
                ) {
                    throw new ForbiddenException(
                        'Only a tenant owner can change ownership',
                    );
                }

                if (
                    target.role === PrismaTenantRole.OWNER &&
                    newRole !== PrismaTenantRole.OWNER
                ) {
                    await this.assertAnotherActiveOwnerExists(tx, tenantId, targetUserId);
                }

                return tx.userTenant.update({
                    where: { id: target.id },
                    data: { role: newRole },
                });
            },
            { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
    }

    async changeMembershipStatus(
        actorUserId: string,
        targetUserId: string,
        tenantId: string,
        newStatus: MembershipStatus,
    ) {
        if (actorUserId === targetUserId) {
            throw new ForbiddenException('You cannot change your own membership status');
        }

        if (!Object.values(MembershipStatus).includes(newStatus)) {
            throw new BadRequestException('Invalid membership status');
        }

        return this.prisma.$transaction(
        async (tx) => {
            await this.lockTenant(tx, tenantId);

            const actor = await this.requirePermissionInTransaction(
                tx,
                actorUserId,
                tenantId,
                newStatus === MembershipStatus.REMOVED
                    ? 'members.remove'
                    : 'members.manage',
            );

            const target = await tx.userTenant.findUnique({
                where: {
                    userId_tenantId: {
                        userId: targetUserId,
                        tenantId,
                    },
                },
            });

            if (!target) {
                throw new NotFoundException('Membership not found');
            }

            if (target.status === MembershipStatus.REMOVED) {
                throw new ConflictException(
                    'Removed members must rejoin through a valid invitation',
                );
            }

            if (target.status === newStatus) {
                throw new ConflictException('Membership already has this status');
            }

            if (
                target.role === PrismaTenantRole.OWNER &&
                actor.role !== PrismaTenantRole.OWNER
            ) {
                throw new ForbiddenException(
                    'Only an owner can manage another owner',
                );
            }

            if (
                target.role === PrismaTenantRole.OWNER &&
                target.status === MembershipStatus.ACTIVE &&
                newStatus !== MembershipStatus.ACTIVE
            ) {
                await this.assertAnotherActiveOwnerExists(tx, tenantId, targetUserId);
            }

            // Supported transitions:
            // ACTIVE -> SUSPENDED or REMOVED
            // SUSPENDED -> ACTIVE or REMOVED
            return tx.userTenant.update({
                where: { id: target.id },
                data: { status: newStatus },
            });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
    }

    private async requirePermissionInTransaction(
        tx: Prisma.TransactionClient,
        userId: string,
        tenantId: string,
        permission: TenantPermission,
    ) {
        const membership = await tx.userTenant.findUnique({
            where: {
                userId_tenantId: { userId, tenantId },
            },
        });

        if (!membership || membership.status !== MembershipStatus.ACTIVE) {
            throw new ForbiddenException('An active tenant membership is required');
        }

        if (!isTenantRole(membership.role)) {
            throw new ForbiddenException('Membership has an invalid role');
        }

        if (!roleHasPermission(membership.role, permission)) {
            throw new ForbiddenException(
                `Missing tenant permission: ${permission}`,
            );
        }

        return membership;
    }

    private async assertAnotherActiveOwnerExists(
        tx: Prisma.TransactionClient,
        tenantId: string,
        excludedUserId: string,
    ) {
        const otherOwnerCount = await tx.userTenant.count({
            where: {
                tenantId,
                userId: { not: excludedUserId },
                role: PrismaTenantRole.OWNER,
                status: MembershipStatus.ACTIVE,
            },
        });

        if (otherOwnerCount === 0) {
            throw new ConflictException(
                'A tenant must retain at least one active owner',
            );
        }
    }

    private async lockTenant(
        tx: Prisma.TransactionClient,
        tenantId: string,
    ) {
        const rows = await tx.$queryRaw<Array<{ id: string }>>`
            SELECT "id"
            FROM "Tenant"
            WHERE "id" = ${tenantId}
            FOR UPDATE
        `;

        if (rows.length === 0) {
            throw new NotFoundException('Tenant not found');
        }
    }
}
