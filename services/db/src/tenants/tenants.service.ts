import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TenantsService {
    constructor(private readonly prisma: PrismaService) {}

    async createTenant(input: {
        tenantCode: string;
        name: string;
        slug: string;
    }) {
        const tenantCode = input.tenantCode.trim().toUpperCase();
        const name = input.name.trim();
        const slug = input.slug.trim().toLowerCase();

        if (!/^[A-Z]{3}-[0-9]{3}$/.test(tenantCode)) {
            throw new BadRequestException(
                'tenantCode must follow the format XXX-NNN',
            );
        }

        if (!name) {
            throw new BadRequestException('Tenant name is required');
        }

        if (!slug) {
            throw new BadRequestException('Tenant slug is required');
        }

        const existingCode = await this.prisma.tenant.findUnique({
            where: { tenantCode },
        });

        if (existingCode) {
            throw new ConflictException(
                `Tenant code ${tenantCode} is already in use`,
            );
        }

        const existingSlug = await this.prisma.tenant.findUnique({
            where: { slug },
        });

        if (existingSlug) {
            throw new ConflictException(
                `Tenant slug ${slug} is already in use`,
            );
        }

        return this.prisma.tenant.create({
            data: {
                tenantCode,
                name,
                slug,
            },
        });
    }

    async getTenantByCode(tenantCode: string) {
        const normalizedCode = tenantCode.trim().toUpperCase();

        return this.prisma.tenant.findUnique({
            where: {
            tenantCode: normalizedCode,
            },
        });
    }
}
