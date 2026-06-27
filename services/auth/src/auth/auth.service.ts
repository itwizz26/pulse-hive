import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        // 💡 Query your PostgreSQL database via Prisma
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { id: user.id, role: user.role };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    // Add this method into your existing AuthService class:
    async register(dto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
        where: { 
            email: dto.email
        },
    });

    if (existingUser) {
        throw new BadRequestException('A user account with this email address already exists.');
    }

    // Hash the password using native bcrypt bindings we unlocked earlier
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // Write to PostgreSQL
    const newUser = await this.prisma.user.create({
        data: {
            email: dto.email,
            password: hashedPassword,
            role: dto.role || 'user',
            displayName: dto.email.split('@')[0],
        },
    });

    // Strip the sensitive password field out before returning the profile payload
    const { password, ...result } = newUser;
        return result;
    }

    async updateProfile(userId: string, updateData: { displayName?: string, bio?: string }) {
        try {
            return await this.prisma.user.update({
                where: { id: userId },
                data: updateData,
            });
        } catch (error) {
            throw new BadRequestException('User profile could not be updated.');
        }
    }

    async onboardCompany(userId: string, companyName: string) {
        // We use a transaction to ensure both operations succeed or both fail
        return await this.prisma.$transaction(async (tx) => {
            // Create the tenant
            const newTenant = await tx.tenant.create({
                data: { name: companyName },
            });

            // Link the user to this tenant
            await tx.user.update({
                where: { id: userId },
                data: { tenantId: newTenant.id },
            });

            return newTenant;
        });
    }
}