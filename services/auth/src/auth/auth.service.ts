
import {
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
    InternalServerErrorException,
    ConflictException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly dbUrl =
        process.env.DB_SERVICE_URL || 'http://db:4003';

    constructor(
        private readonly jwtService: JwtService,
    ) {}

    private async dbRequest<T>(
        path: string,
        options: RequestInit = {},
    ): Promise<T> {
        const serviceKey = process.env.INTERNAL_SERVICE_KEY;

        if (!serviceKey) {
            throw new InternalServerErrorException(
                'Internal service authentication is not configured',
            );
        }

        let response: Response;

        try {
            response = await fetch(`${this.dbUrl}${path}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'x-internal-service-key': serviceKey,
                    ...options.headers,
                },
            });
        } catch {
            throw new InternalServerErrorException(
                'Database service is unavailable',
            );
        }

        const body = await response.text();
        const result = body ? JSON.parse(body) : null;

        if (!response.ok) {
            if (response.status === 404) {
                throw new NotFoundException(
                    result?.message || 'User not found',
                );
            }

            if (response.status === 409) {
                throw new ConflictException(
                    result?.message || 'The requested resource already exists',
                );
            }

            throw new InternalServerErrorException(
                result?.message || 'Database service request failed',
            );
        }

        return result as T;
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.dbRequest<any>(
            `/users/by-email?email=${encodeURIComponent(
                email.trim().toLowerCase(),
            )}`,
        );

        if (!user || !user.password) {
            return null;
        }

        const passwordMatches = await bcrypt.compare(
            pass,
            user.password,
        );

        if (!passwordMatches) {
            return null;
        }

        const { password, ...safeUser } = user;
        return safeUser;
    }

    async singin(loginDto: LoginDto) {
        const user = await this.validateUser(
            loginDto.email,
            loginDto.password,
        );

        if (!user) {
            throw new UnauthorizedException(
                'Invalid email or password.',
            );
        }

        const payload = {
            id: user.id,
            role: user.role,
        };

        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    async signout(userId: string) {
        console.log(`User ${userId} has logged out.`);
        return { message: 'Successfully logged out' };
    }

    async signup(dto: RegisterDto) {
        const email = dto.email.trim().toLowerCase();

        const existingUser = await this.dbRequest<any>(
            `/users/by-email?email=${encodeURIComponent(email)}`,
        );

        if (existingUser) {
            throw new BadRequestException(
                'A user account with this email address already exists.',
            );
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        return this.dbRequest<UserResponseDto>('/users', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password: hashedPassword,
                role: 'user',
                displayName:
                    dto.displayName?.trim() || email.split('@')[0],
            }),
        });
    }

    async getProfile(userId: string): Promise<UserResponseDto> {
        return this.dbRequest<UserResponseDto>(
            `/users/${encodeURIComponent(userId)}`,
        );
    }

    async updateProfile(
        userId: string,
        data: { displayName: string },
    ) {
        return this.dbRequest<any>(
            `/users/${encodeURIComponent(userId)}/profile`,
            {
                method: 'PATCH',
                body: JSON.stringify({
                    displayName: data.displayName,
                }),
            },
        );
    }

    async onboardCompany(currentUserId: string, companyName: string) {
        const name = companyName?.trim();

        if (!name) {
            throw new BadRequestException('Business name is required');
        }

        if (name.length > 150) {
            throw new BadRequestException(
                'Business name must not exceed 150 characters',
            );
        }

        return this.dbRequest<any>(
            `/users/${encodeURIComponent(currentUserId)}/onboard`,
            {
                method: 'POST',
                body: JSON.stringify({ name }),
            },
        );
    }
}
