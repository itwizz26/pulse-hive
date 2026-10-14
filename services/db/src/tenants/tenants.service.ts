
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import {
  allocateTenantCode,
  createTenantSlug,
} from './tenant-code.util';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTenant(input: { name: string; slug?: string }) {
    const name = input.name?.trim();

    if (!name) {
      throw new BadRequestException('Tenant name is required');
    }

    if (name.length > 150) {
      throw new BadRequestException(
        'Tenant name must not exceed 150 characters',
      );
    }

    const slug = input.slug?.trim().toLowerCase() || createTenantSlug(name);

    if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new BadRequestException('A valid tenant slug is required');
    }

    return this.prisma.$transaction(async (tx) => {
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
        data: {
          name,
          slug,
          tenantCode,
        },
      });
    });
  }

  async getTenantByCode(tenantCode: string) {
    const normalizedCode = tenantCode.trim().toUpperCase();

    if (!/^[A-Z0-9]{3}-[0-9]{6}$/.test(normalizedCode)) {
      throw new BadRequestException(
        'tenantCode must follow the format XXX-NNNNNN',
      );
    }

    return this.prisma.tenant.findUnique({
      where: { tenantCode: normalizedCode },
    });
  }
}
