import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import {
  allocateTenantCode,
  createTenantSlug,
} from './tenant-code.util';

export interface CreateTenantInput {
  name: string;
  slug?: string;
}

@Injectable()
export class TenantLifecycleService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeInput(input: CreateTenantInput) {
    const name = input.name?.trim();

    if (!name) {
      throw new BadRequestException('Tenant name is required');
    }

    if (name.length > 150) {
      throw new BadRequestException(
        'Tenant name must not exceed 150 characters',
      );
    }

    const slug =
      input.slug?.trim().toLowerCase() || createTenantSlug(name);

    if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new BadRequestException('A valid tenant slug is required');
    }

    return { name, slug };
  }

  async createTenant(input: CreateTenantInput) {
    const normalized = this.normalizeInput(input);

    return this.prisma.$transaction((tx) =>
      this.createTenantInTransaction(tx, normalized),
    );
  }

  async createTenantInTransaction(
    tx: Prisma.TransactionClient,
    input: CreateTenantInput,
  ) {
    const { name, slug } = this.normalizeInput(input);

    const existingSlug = await tx.tenant.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existingSlug) {
      throw new ConflictException(
        `Tenant slug "${slug}" is already in use`,
      );
    }

    const tenantCode = await allocateTenantCode(tx, name);

    return tx.tenant.create({
      data: { name, slug, tenantCode },
    });
  }

  async getTenantByCode(tenantCode: string) {
    const normalizedCode = tenantCode?.trim().toUpperCase();

    if (!normalizedCode || !/^[A-Z0-9]{3}-[0-9]{6}$/.test(normalizedCode)) {
      throw new BadRequestException(
        'tenantCode must follow the format XXX-NNNNNN',
      );
    }

    return this.prisma.tenant.findUnique({
      where: { tenantCode: normalizedCode },
    });
  }
}
