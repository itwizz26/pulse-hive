import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UserProfileService {
    constructor(private readonly prisma: PrismaService) {}

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
}
