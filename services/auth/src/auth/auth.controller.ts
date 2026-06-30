import { Controller, Post, Get, Body, UseGuards, Req, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/user-response.dto';
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
     * Route: POST /api/v1/auth/signup
     */
    @Post('signup')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.signup(registerDto);
    }

    /**
     * Public Login Endpoint
     * Route: POST /api/v1/auth/signin
     */
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.singin(loginDto);
    }

    /**
     * Protected Logout Endpoint
     * Route: POST /api/v1/auth/signout
     */
    @Post('signout')
    @UseGuards(AuthGuard('gateway'))
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: Request) {
        const user = req.user as any;
        await this.authService.signout(user.id);
        return { success: true };
    }

    /**
     * Protected Profile Endpoint
     * Route: GET /api/v1/auth/profile
     * 💡 UseGuards(AuthGuard('jwt')) automatically intercepts the request, runs your
     * JwtStrategy validation step, and populates the incoming request with a `user` footprint.
     */
    @Get('profile')
    @UseGuards(AuthGuard('gateway'))
    async getProfile(@Req() req: any): Promise<UserResponseDto> {
        // Returns the clean token payload data: { id: "usr_...", role: "admin" }
        return await this.authService.getProfile(req.user.id);
    }

    /**
     * Protected Company Onboarding Endpoint
     * Route: GET /api/v1/auth/onboard
     */
    // auth.controller.ts
    @Post('onboard')
    @UseGuards(AuthGuard('gateway'))
    async onboard(@Req() req: Request, @Body() body: any) {
        const user = req.user as any;

        if (!user || !user.id) {
            throw new UnauthorizedException('User not found in request');
        }

        // Access the businessName field from your formData
        return await this.authService.onboardCompany(user.id, body.businessName);
    }
}