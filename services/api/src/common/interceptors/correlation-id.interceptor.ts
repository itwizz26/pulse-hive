import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        // Capture or generate correlation tracking token
        const correlationId = request.headers['x-correlation-id'] || uuidv4();
        
        // Propagate down request context and write to response headers for client visibility
        request.headers['x-correlation-id'] = correlationId;
        response.header('X-Correlation-Id', correlationId);

        return next.handle();
    }
}