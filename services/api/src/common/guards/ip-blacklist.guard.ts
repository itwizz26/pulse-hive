import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IpBlacklistGuard implements CanActivate {
    // Can be hooked up to a Redis distributed cache down the line
    private blacklistedIps: Set<string> = new Set([]);

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const clientIp = request.ip;

        return !this.blacklistedIps.has(clientIp);
    }
}