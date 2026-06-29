// auth/strategies/gateway.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';

@Injectable()
export class GatewayStrategy extends PassportStrategy(Strategy, 'gateway') {
    constructor() {
        super();
    }

    async validate(req: Request): Promise<any> {
        const userId = req.headers['x-user-id'];
        const role = req.headers['x-user-role'];

        if (!userId) {
        throw new UnauthorizedException('No user context provided by gateway');
        }

        // Return the user object to be attached to req.user
        return { id: userId, role: role };
    }
}