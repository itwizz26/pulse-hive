import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<FastifyRequest>();
        const response = ctx.getResponse<FastifyReply>();

        // 1. Look for an existing tracing footprint or mint a fresh UUID
        const correlationHeader = request.headers['x-correlation-id'];
        const correlationId = typeof correlationHeader === 'string' && correlationHeader 
        ? correlationHeader 
        : randomUUID();

        // 2. Attach to current request context so ProxyService can forward it down the mesh
        request.headers['x-correlation-id'] = correlationId;

        return next.handle().pipe(
        tap(() => {
            // 3. Stamp the correlation ID onto the final response returned to the client
            response.header('x-correlation-id', correlationId);
        }),
        );
    }
}
