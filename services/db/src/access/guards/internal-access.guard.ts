import {
    CanActivate,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { timingSafeEqual } from 'node:crypto';

@Injectable()
export class InternalAccessGuard implements CanActivate {
    canActivate(context: Parameters<CanActivate['canActivate']>[0]): boolean {
        const request = context.switchToHttp().getRequest<{
            headers: Record<string, string | string[] | undefined>;
        }>();

        const configuredKey = process.env.INTERNAL_SERVICE_KEY;
        const suppliedKey = request.headers['x-internal-service-key'];

        if (
            !configuredKey ||
            typeof suppliedKey !== 'string' ||
            !this.secureEquals(suppliedKey, configuredKey)
        ) {
            throw new UnauthorizedException('Invalid internal service credentials');
        }

        return true;
    }

    private secureEquals(left: string, right: string): boolean {
        const leftBuffer = Buffer.from(left);
        const rightBuffer = Buffer.from(right);

        return (
            leftBuffer.length === rightBuffer.length &&
            timingSafeEqual(leftBuffer, rightBuffer)
        );
    }
}
