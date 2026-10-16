import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { MembershipStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

@Injectable()
export class UserIdentityService {
    constructor(private readonly prisma: PrismaService) {}

    private normalizeEmail(value: string): string {
        const email = value?.trim().toLowerCase();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new BadRequestException('A valid email address is required');
        }

        return email;
    }

    private membershipSummary(
        memberships: Array<{
            tenantId: string;
            role: string;
            status: MembershipStatus;
            tenant: {
                id: string;
                name: string;
                slug: string;
                tenantCode: string;
            };
        }>,
    ) {
        return memberships.map((membership) => ({
            tenantId: membership.tenantId,
            tenant: membership.tenant,
            role: membership.role,
            status: membership.status,
        }));
    }

    async createUser(input: {
        email: string;
        password: string;
        displayName?: string;
    }) {
        const email = this.normalizeEmail(input.email);
        const password = input.password;

        if (!password || !BCRYPT_HASH_PATTERN.test(password)) {
            throw new BadRequestException(
                'A valid bcrypt password hash is required',
            );
        }

        const displayName = input.displayName?.trim();

        const existing = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });

        if (existing) {
            throw new ConflictException(
                'A user account with this email address already exists',
            );
        }

        try {
        const user = await this.prisma.user.create({
            data: {
                email,
                password,
                role: 'user',
                displayName: displayName || null,
            },
                select: {
                id: true,
                email: true,
                role: true,
                displayName: true,
                bio: true,
                createdAt: true,
            },
        });

        return {
            ...user,
            tenantId: null,
            memberships: [],
        };
        } catch (error) {
        // The database unique constraint is the final protection against
        // concurrent registration attempts for the same email address.
        if (
            error &&
            typeof error === 'object' &&
            'code' in error &&
            error.code === 'P2002'
        ) {
            throw new ConflictException(
                'A user account with this email address already exists',
            );
        }

        throw error;
        }
    }

    /**
     * Internal Auth lookup.
     * Includes the stored password hash for credential verification.
     * Never expose this response directly to a browser client.
     */
    async getUserByEmail(emailInput: string) {
        const email = this.normalizeEmail(emailInput);

        const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
            memberships: {
            select: {
                tenantId: true,
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
            },
        },
        });

        if (!user) {
            return null;
        }

        const { memberships, ...userData } = user;

        const activeMemberships = memberships.filter(
            (membership) => membership.status === MembershipStatus.ACTIVE,
        );

        return {
            ...userData,
            tenantId: activeMemberships[0]?.tenantId ?? null,
            memberships: this.membershipSummary(memberships),
        };
    }

    async getUserById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                displayName: true,
                bio: true,
                createdAt: true,
                memberships: {
                select: {
                    tenantId: true,
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
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const activeMemberships = user.memberships.filter(
            (membership) => membership.status === MembershipStatus.ACTIVE,
        );

        return {
            ...user,
            tenantId: activeMemberships[0]?.tenantId ?? null,
            memberships: this.membershipSummary(user.memberships),
        };
    }
}
