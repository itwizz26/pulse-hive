
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import {
  allocateTenantCode,
  createTenantSlug,
} from '../tenants/tenant-code.util';

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

    // Internal Auth lookup: the password hash is required for verification.
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

  async updateProfile(id: string, input: { displayName: string }) {
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

    return this.prisma.user.update({
      where: { id },
      data: { displayName },
      select: {
        id: true,
        email: true,
        role: true,
        displayName: true,
      },
    });
  }

  async onboardTenant(userId: string, input: { name: string }) {
    const name = input.name?.trim();

    if (!name) {
      throw new BadRequestException('Business name is required');
    }

    if (name.length > 150) {
      throw new BadRequestException(
        'Business name must not exceed 150 characters',
      );
    }

    const slug = createTenantSlug(name);

    if (!slug) {
      throw new BadRequestException(
        'Business name must contain letters or numbers',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Serialize onboarding attempts for this user.
      const lockedUsers = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id"
        FROM "User"
        WHERE "id" = ${userId}
        FOR UPDATE
      `;

      if (lockedUsers.length === 0) {
        throw new NotFoundException('User not found');
      }

      const existingMembership = await tx.userTenant.findFirst({
        where: { userId },
        select: { id: true },
      });

      if (existingMembership) {
        throw new ConflictException(
          'User already belongs to a tenant',
        );
      }

      const existingSlug = await tx.tenant.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (existingSlug) {
        throw new ConflictException(
          'A business with this name or slug already exists',
        );
      }

      const tenantCode = await allocateTenantCode(tx, name);

      const tenant = await tx.tenant.create({
        data: {
          name,
          slug,
          tenantCode,
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
