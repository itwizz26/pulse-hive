import { Controller, Post, Get, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

/**
 * 💡 Base prefix. Together with the gateway,
 * this targets: /api/v1/auth/*
 */
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Health Check Endpoint
     * Route: GET /api/v1/auth/health
     */
    @Get('health')
    healthCheck() {
        return {
            status: 'OK',
            timestamp: new Date().toISOString(),
            service: 'Auth Service'
        };
    }

    /**
     * Public Registration Endpoint
     * Route: POST /api/v1/auth/register
     */
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    /**
     * Public Login Endpoint
     * Route: POST /api/v1/auth/login
     */
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    /**
     * Protected Profile Endpoint
     * Route: GET /api/v1/auth/profile
     * 💡 UseGuards(AuthGuard('jwt')) automatically intercepts the request, runs your
     * JwtStrategy validation step, and populates the incoming request with a `user` footprint.
     */
    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    getProfile(@Req() req: any) {
        // Returns the clean token payload data: { id: "usr_...", role: "admin" }
        return req.user;
    }
}