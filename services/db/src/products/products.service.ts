import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    async getProductsByTenantCode(tenantCode: string) {
        const normalizedCode = tenantCode.trim().toUpperCase();

        const tenant = await this.prisma.tenant.findUnique({
            where: {
                tenantCode: normalizedCode,
            },
        });

        if (!tenant) {
            throw new NotFoundException(
                `Tenant ${normalizedCode} was not found`,
            );
        }

        const products = await this.prisma.product.findMany({
            where: {
                tenantId: tenant.id,
                active: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        return products.map((product) => ({
            id: product.id,
            tenantId: product.tenantId,
            name: product.name,
            description: product.description,
            sku: product.sku,
            image: product.image,
            size: product.size,
            price: Number(product.price),
            active: product.active,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        }));
    }
}
