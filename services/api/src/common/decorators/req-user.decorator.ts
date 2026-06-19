import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestUserContext } from '../interfaces/request-context.interface';

export const ReqUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): IRequestUserContext => {
    const request = ctx.switchToHttp().getRequest();
    
        return {
        id: request.headers['x-user-id'] as string,
        role: request.headers['x-user-role'] as string,
        tenantId: request.headers['x-tenant-id'] as string,
        };
    },
);