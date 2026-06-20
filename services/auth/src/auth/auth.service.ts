import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService, // 💡 Available automatically thanks to @Global()
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
        where: { email: dto.email },
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
        },
    });

    // Strip the sensitive password field out before returning the profile payload
    const { password, ...result } = newUser;
        return result;
    }
}