import { Injectable } from '@nestjs/common';
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

        const downstreamPath = req.url.replace(`/api/v1/${targetKey}`, '');
        const downstreamUrl = `${baseTarget}${downstreamPath}`;

        try {
        const forwardHeaders: Record<string, string> = {};
        
        Object.entries(req.headers).forEach(([key, value]) => {
            if (value && typeof value === 'string') {
            forwardHeaders[key] = value;
            }
        });

        const isAuthRoute = targetKey === 'auth';
        
        if (!isAuthRoute) {
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.code(401).send({
                statusCode: 401,
                error: 'Unauthorized',
                message: 'Missing or malformed Authorization bearer token at system ingress.',
            });
            }

            const token = authHeader.split(' ')[1];
            
            try {
            // 💡 Typecast using our clean structural interface
            const decoded = jwt.verify(token, this.jwtSecret) as unknown as IRequestUserContext;
            
            // Hydrate the verified context downstream
            forwardHeaders['x-user-id'] = decoded.id; // Map to .id safely
            forwardHeaders['x-user-role'] = decoded.role;
            if (decoded.tenantId) {
                forwardHeaders['x-tenant-id'] = decoded.tenantId;
            }

            delete forwardHeaders['authorization'];

            } catch (jwtError: any) {
            return reply.code(401).send({
                statusCode: 401,
                error: 'Unauthorized',
                message: `Inbound token validation failed: ${jwtError.message}`,
            });
            }
        }

        forwardHeaders['x-forwarded-for'] = req.ip;
        forwardHeaders['host'] = new URL(baseTarget).host;

        const response = await fetch(downstreamUrl, {
            method: req.method,
            headers: forwardHeaders,
            body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
            duplex: 'half',
        } as any);

        response.headers.forEach((value, key) => {
            reply.header(key, value);
        });

        const responseData = await response.text();
        try {
            return reply.code(response.status).send(JSON.parse(responseData));
        } catch {
            return reply.code(response.status).send(responseData);
        }

        } catch (error: any) {
        console.error(`[Gateway Routing Crash] Failed connection to ${downstreamUrl}:`, error.message);
        return reply.code(503).send({
            statusCode: 503,
            error: 'Service Unavailable',
            message: 'The downstream Pulsehive core service is temporarily unresponsive.',
            timestamp: new Date().toISOString(),
        });
        }
    }
}