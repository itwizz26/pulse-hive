import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { MembershipStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

const BCRYPT_HASH_PATTERN =
    /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

const VERIFICATION_TOKEN_HASH_PATTERN = /^[a-f0-9]{64}$/;

@Injectable()
export class UserIdentityService {
    constructor(private readonly prisma: PrismaService) {}

    private normalizeEmail(value: string): string {
        const email = value?.trim().toLowerCase();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new BadRequestException(
                'A valid email address is required',
            );
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
                    emailVerifiedAt: true,
                },
            });

            return {
                ...user,
                tenantId: null,
                memberships: [],
            };
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
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
     * Internal Auth lookup. Includes the password hash for credential
     * verification. Never expose this response directly to a browser.
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
            (membership) =>
                membership.status === MembershipStatus.ACTIVE,
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
                emailVerifiedAt: true,
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
            (membership) =>
                membership.status === MembershipStatus.ACTIVE,
        );

        return {
            ...user,
            tenantId: activeMemberships[0]?.tenantId ?? null,
            memberships: this.membershipSummary(user.memberships),
        };
    }

    /**
     * Save a hash of the verification token, never the raw token.
     * Outstanding tokens are invalidated before issuing a replacement.
     */
    async issueEmailVerificationToken(
        userId: string,
        tokenHash: string,
        expiresAtInput: string,
    ) {
        if (!VERIFICATION_TOKEN_HASH_PATTERN.test(tokenHash)) {
            throw new BadRequestException(
                'A valid verification token hash is required',
            );
        }

        const expiresAt = new Date(expiresAtInput);
        const now = new Date();

        if (
            Number.isNaN(expiresAt.getTime()) ||
            expiresAt <= now ||
            expiresAt.getTime() > now.getTime() + 31 * 60 * 1000
        ) {
            throw new BadRequestException(
                'Verification token expiry must be within the next 30 minutes',
            );
        }

        return this.prisma.$transaction(async (tx) => {
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

            if (user.emailVerifiedAt) {
                return {
                    issued: false,
                    alreadyVerified: true,
                    email: user.email,
                };
            }

            await tx.emailVerificationToken.updateMany({
                where: {
                    userId,
                    usedAt: null,
                },
                data: {
                    usedAt: now,
                },
            });

            await tx.emailVerificationToken.create({
                data: {
                    userId,
                    tokenHash,
                    expiresAt,
                },
            });

            return {
                issued: true,
                alreadyVerified: false,
                email: user.email,
            };
        });
    }

    /**
     * Consume a valid token once and mark the associated account verified.
     */
    async verifyEmailToken(tokenHash: string) {
        if (!VERIFICATION_TOKEN_HASH_PATTERN.test(tokenHash)) {
            throw new BadRequestException(
                'Invalid or expired verification link',
            );
        }

        const now = new Date();

        return this.prisma.$transaction(async (tx) => {
            const token =
                await tx.emailVerificationToken.findUnique({
                    where: { tokenHash },
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                emailVerifiedAt: true,
                            },
                        },
                    },
                });

            if (
                !token ||
                token.usedAt ||
                token.expiresAt <= now
            ) {
                throw new BadRequestException(
                    'Invalid or expired verification link',
                );
            }

            const consumed =
                await tx.emailVerificationToken.updateMany({
                    where: {
                        id: token.id,
                        usedAt: null,
                        expiresAt: { gt: now },
                    },
                    data: { usedAt: now },
                });

            if (consumed.count !== 1) {
                throw new BadRequestException(
                    'Invalid or expired verification link',
                );
            }

            const user = await tx.user.update({
                where: { id: token.user.id },
                data: token.user.emailVerifiedAt
                    ? {}
                    : { emailVerifiedAt: now },
                select: {
                    id: true,
                    email: true,
                    emailVerifiedAt: true,
                },
            });

            return {
                verified: true,
                email: user.email,
                emailVerifiedAt: user.emailVerifiedAt,
            };
        });
    }
}
