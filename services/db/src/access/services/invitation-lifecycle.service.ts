import {
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
import { createHash, randomBytes } from 'node:crypto';

import { PrismaService } from '../../database/prisma.service';
import { MembershipService } from './membership.service';
import {
    isTenantRole,
    TenantRole,
} from '../policies/tenant-permissions';

const DEFAULT_INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class InvitationLifecycleService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly memberships: MembershipService,
    ) {}

    async createInvitation(input: {
        actorUserId: string;
        tenantId: string;
        email: string;
        role: TenantRole;
        expiresInMs?: number;
    }) {
        await this.memberships.requirePermission(
            input.actorUserId,
            input.tenantId,
            'members.invite',
        );

        if (!isTenantRole(input.role) || input.role === 'OWNER') {
            throw new ForbiddenException(
                'This role cannot be assigned through an invitation',
            );
        }

        const email = input.email.trim().toLowerCase();
        if (!email || !email.includes('@')) {
            throw new ConflictException('A valid invitation email is required');
        }

        const rawToken = randomBytes(32).toString('base64url');
        const tokenHash = this.hashToken(rawToken);
        const expiresInMs = input.expiresInMs ?? DEFAULT_INVITATION_TTL_MS;

        if (expiresInMs <= 0 || expiresInMs > 30 * 24 * 60 * 60 * 1000) {
            throw new ConflictException(
                'Invitation expiry must be within 30 days',
            );
        }

        const invitation = await this.prisma.tenantInvitation.create({
            data: {
                tenantId: input.tenantId,
                email,
                role: input.role,
                tokenHash,
                expiresAt: new Date(Date.now() + expiresInMs),
                invitedByUserId: input.actorUserId,
            },
            select: {
                id: true,
                tenantId: true,
                email: true,
                role: true,
                expiresAt: true,
                createdAt: true,
            },
        });

        // The raw token is returned once for delivery by the caller.
        // Never persist or log it. The caller must deliver it securely.
        return { invitation, token: rawToken };
    }

    async revokeInvitation(actorUserId: string, invitationId: string) {
        const invitation = await this.prisma.tenantInvitation.findUnique({
            where: { id: invitationId },
        });

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        await this.memberships.requirePermission(
            actorUserId,
            invitation.tenantId,
            'members.manage',
        );

        if (invitation.acceptedAt || invitation.revokedAt) {
            throw new ConflictException(
                'Invitation is already accepted or revoked',
            );
        }

        return this.prisma.tenantInvitation.update({
            where: { id: invitation.id },
            data: { revokedAt: new Date() },
            select: {
                id: true,
                tenantId: true,
                email: true,
                revokedAt: true,
            },
        });
    }

    async acceptInvitation(userId: string, rawToken: string) {
        const token = rawToken.trim();
        if (!token) {
            throw new NotFoundException('Invitation not found');
        }

        const tokenHash = this.hashToken(token);

        return this.prisma.$transaction(async (tx) => {
            const invitation = await tx.tenantInvitation.findUnique({
                where: { tokenHash },
            });

            if (!invitation) {
                throw new NotFoundException('Invitation not found');
            }

            if (
                invitation.acceptedAt ||
                invitation.revokedAt ||
                invitation.expiresAt <= new Date()
            ) {
                throw new ConflictException(
                    'Invitation is no longer valid',
                );
            }

            const user = await tx.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    emailVerifiedAt: true,
                },
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            if (!user.emailVerifiedAt) {
                throw new ForbiddenException(
                    'Verify your email before accepting an invitation',
                );
            }

            if (
                user.email.trim().toLowerCase() !==
                invitation.email.trim().toLowerCase()
            ) {
                throw new ForbiddenException(
                    'Invitation email does not match the verified account',
                );
            }

            const existing = await tx.userTenant.findUnique({
                where: {
                    userId_tenantId: {
                        userId,
                        tenantId: invitation.tenantId,
                    },
                },
            });

            if (
                existing &&
                existing.status !== MembershipStatus.REMOVED
            ) {
                throw new ConflictException(
                    'User already has a membership for this tenant',
                );
            }

            if (!isTenantRole(invitation.role) || invitation.role === 'OWNER') {
                throw new ForbiddenException(
                    'Invitation contains an invalid role',
                );
            }

            const membership = existing
                ? await tx.userTenant.update({
                    where: { id: existing.id },
                    data: {
                        role: invitation.role as PrismaTenantRole,
                        status: MembershipStatus.ACTIVE,
                    },
                })
                : await tx.userTenant.create({
                    data: {
                        userId,
                        tenantId: invitation.tenantId,
                        role: invitation.role as PrismaTenantRole,
                        status: MembershipStatus.ACTIVE,
                    },
                });

            const claimed = await tx.tenantInvitation.updateMany({
                where: {
                    id: invitation.id,
                    acceptedAt: null,
                    revokedAt: null,
                    expiresAt: { gt: new Date() },
                },
                data: { acceptedAt: new Date() },
            });

            if (claimed.count !== 1) {
                throw new ConflictException(
                    'Invitation has already been used or revoked',
                );
            }

            return {
                membership: {
                    id: membership.id,
                    userId: membership.userId,
                    tenantId: membership.tenantId,
                    role: membership.role,
                    status: membership.status,
                },
            };
        });
    }

    private hashToken(token: string): string {
        return createHash('sha256').update(token).digest('hex');
    }
}
