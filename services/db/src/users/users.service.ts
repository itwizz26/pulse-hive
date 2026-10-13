
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(input: {
        email: string;
        password: string;
        role?: string;
        displayName?: string;
    }) {
        const email = input.email?.trim().toLowerCase();
        const password = input.password;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new BadRequestException('A valid email address is required');
        }

        if (!password || password.length < 1) {
        throw new BadRequestException('Password hash is required');
        }

        const existing = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true },
        });

        if (existing) {
        throw new ConflictException(
            'A user account with this email address already exists',
        );
        }

        const user = await this.prisma.user.create({
        data: {
            email,
            password,
            role: input.role?.trim() || 'user',
            displayName: input.displayName?.trim() || null,
        },
        select: {
            id: true,
            email: true,
            role: true,
            displayName: true,
            bio: true,
            createdAt: true,
            memberships: {
            select: { tenantId: true },
            take: 1,
            },
        },
        });

        return {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
        bio: user.bio,
        tenantId: user.memberships[0]?.tenantId ?? null,
        createdAt: user.createdAt,
        };
    }

    async getUserByEmail(emailInput: string) {
        const email = emailInput?.trim().toLowerCase();

        if (!email) {
        throw new BadRequestException('Email is required');
        }

        const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
            memberships: {
            select: { tenantId: true },
            take: 1,
            },
        },
        });

        if (!user) {
        return null;
        }

        // Auth requires the password hash to verify credentials.
        // Keep this endpoint internal to the service network.
        const { memberships, ...userData } = user;

        return {
        ...userData,
        tenantId: memberships[0]?.tenantId ?? null,
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
            select: { tenantId: true },
            take: 1,
            },
        },
        });

        if (!user) {
        throw new NotFoundException('User not found');
        }

        return {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
        bio: user.bio,
        tenantId: user.memberships[0]?.tenantId ?? null,
        createdAt: user.createdAt,
        };
    }

    async updateProfile(
        id: string,
        input: { displayName: string },
    ) {
        const displayName = input.displayName?.trim();

        if (!displayName) {
        throw new BadRequestException('Display name is required');
        }

        const existing = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true },
        });

        if (!existing) {
        throw new NotFoundException('User not found');
        }

        const user = await this.prisma.user.update({
        where: { id },
        data: { displayName },
        select: {
            id: true,
            email: true,
            role: true,
            displayName: true,
        },
        });

        return user;
    }

    async onboardTenant(
        userId: string,
        input: {
        name: string;
        tenantCode: string;
        slug: string;
        },
    ) {
        const name = input.name?.trim();
        const tenantCode = input.tenantCode?.trim().toUpperCase();
        const slug = input.slug?.trim().toLowerCase();

        if (!name) {
        throw new BadRequestException('Tenant name is required');
        }

        if (!/^[A-Z]{3}-[0-9]{3}$/.test(tenantCode ?? '')) {
        throw new BadRequestException(
            'tenantCode must follow the format XXX-NNN',
        );
        }

        if (!slug) {
        throw new BadRequestException('Tenant slug is required');
        }

        return this.prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: { id: userId },
            select: {
            id: true,
            memberships: { select: { id: true }, take: 1 },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.memberships.length > 0) {
            throw new ConflictException(
            'User already belongs to a tenant',
            );
        }

        const existingTenant = await tx.tenant.findFirst({
            where: {
            OR: [{ tenantCode }, { slug }],
            },
            select: { id: true },
        });

        if (existingTenant) {
            throw new ConflictException(
            'Tenant code or slug is already in use',
            );
        }

        const tenant = await tx.tenant.create({
            data: {
            name,
            tenantCode,
            slug,
            },
        });

        await tx.userTenant.create({
            data: {
            userId,
            tenantId: tenant.id,
            role: 'owner',
            },
        });

        return tenant;
        });
    }
}
