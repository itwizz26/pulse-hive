import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        
        // 💡 Robust runtime check: Fail explicitly if the infrastructure environment is misconfigured
        if (!jwtSecret) {
            throw new Error('FATAL: JWT_SECRET is not defined in the environment variables configuration.');
        }

        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret, // 🚀 TypeScript is happy now because it knows this is strictly a string
        });
    }

    async validate(payload: any) {
        // This payload is automatically injected into req.user down the line
        return { id: payload.id, role: payload.role };
    }
}