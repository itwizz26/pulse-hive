import { Injectable, RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest, FastifyReply } from 'fastify';
import * as jwt from 'jsonwebtoken';
import { IRequestUserContext } from '../common/interfaces/request-context.interface';

@Injectable()
export class ProxyService {
    private routeMapping: Record<string, string> = {};
    private jwtSecret: string;

    constructor(private readonly configService: ConfigService) {
        this.jwtSecret = this.configService.get<string>('JWT_SECRET')!;
        this.routeMapping = {
            auth: this.configService.get<string>('AUTH_SERVICE_URL')!,
            orders: this.configService.get<string>('ORDER_SERVICE_URL')!,
            payments: this.configService.get<string>('PAYMENT_SERVICE_URL')!,
        };
    }

    async forward(req: FastifyRequest, reply: FastifyReply) {
        const urlParts = req.url.split('?')[0].split('/').filter(Boolean);
        const targetKey = urlParts[2]; 

        const baseTarget = this.routeMapping[targetKey];
        if (!baseTarget) {
            return reply.code(404).send({
                statusCode: 404,
                error: 'Not Found',
                message: `No microservice route mapped for path segment: '${targetKey}'`,
            });
        }

        const downstreamUrl = `${baseTarget}${req.url}`;
        // Access raw body enabled by { rawBody: true } in main.ts
        const bodyBuffer = (req as RawBodyRequest<FastifyRequest>).rawBody;

        try {
            const forwardHeaders: Record<string, string> = {};
            
            // Copy incoming headers, excluding problematic ones
            Object.entries(req.headers).forEach(([key, value]) => {
                const lowerKey = key.toLowerCase();
                if (value && typeof value === 'string' && 
                    !['content-length', 'host', 'transfer-encoding'].includes(lowerKey)) {
                    forwardHeaders[key] = value;
                }
            });

            // JWT/Auth check logic
            const isAuthRoute = targetKey === 'auth';
            if (!isAuthRoute) {
                const authHeader = req.headers['authorization'];
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    return reply.code(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Missing token' });
                }

                try {
                    const token = authHeader.split(' ')[1];
                    const decoded = jwt.verify(token, this.jwtSecret) as unknown as IRequestUserContext;
                    forwardHeaders['x-user-id'] = decoded.id;
                    forwardHeaders['x-user-role'] = decoded.role;
                    if (decoded.tenantId) forwardHeaders['x-tenant-id'] = decoded.tenantId;
                } catch (jwtError) {
                    return reply.code(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Token validation failed' });
                }
            }

            // Set Content-Length and Content-Type explicitly using the raw buffer
            if (['POST', 'PUT', 'PATCH'].includes(req.method) && bodyBuffer) {
                forwardHeaders['content-type'] = req.headers['content-type'] || 'application/json';
                forwardHeaders['content-length'] = Buffer.byteLength(bodyBuffer).toString();
            }

            forwardHeaders['x-forwarded-for'] = req.ip;
            forwardHeaders['host'] = new URL(baseTarget).host;

            const response = await fetch(downstreamUrl, {
                method: req.method,
                headers: forwardHeaders,
                body: bodyBuffer, // Pass buffer directly to avoid stream consumption issues
                duplex: 'half',
            } as any);

            // Forward response headers
            response.headers.forEach((value, key) => {
                if (key.toLowerCase() !== 'transfer-encoding') {
                    reply.header(key, value);
                }
            });

            const responseData = await response.text();
            try {
                return reply.code(response.status).send(JSON.parse(responseData));
            } catch {
                return reply.code(response.status).send(responseData);
            }

        } catch (error: any) {
            // Add this line to see the actual error in the Gateway terminal
            console.error(`[Gateway Routing Crash] Failed connection to ${downstreamUrl}:`, error); 
            
            return reply.code(503).send({
                statusCode: 503,
                error: 'Service Unavailable',
                message: `Downstream connection failed: ${error.message}`, // Detailed message
                timestamp: new Date().toISOString(),
            });
        }
    }
}