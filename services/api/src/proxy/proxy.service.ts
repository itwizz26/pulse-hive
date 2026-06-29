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
            return reply.code(404).send({ statusCode: 404, error: 'Not Found', message: `No route for: '${targetKey}'` });
        }

        const downstreamUrl = `${baseTarget}${req.url}`;
        const bodyBuffer = (req as RawBodyRequest<FastifyRequest>).rawBody;

        try {
            const forwardHeaders: Record<string, string> = {};
            
            // 1. Copy incoming headers
            Object.entries(req.headers).forEach(([key, value]) => {
                if (value && typeof value === 'string' && !['content-length', 'host', 'transfer-encoding'].includes(key.toLowerCase())) {
                    forwardHeaders[key] = value;
                }
            });

            // 2. Centralized Auth Logic (applies to all routes)
            const authHeader = req.headers['authorization'];
            if (authHeader?.startsWith('Bearer ')) {
                try {
                    const token = authHeader.split(' ')[1];
                    const decoded = jwt.verify(token, this.jwtSecret) as unknown as IRequestUserContext;
                    
                    // Inject user context headers for downstream services
                    forwardHeaders['x-user-id'] = decoded.id;
                    forwardHeaders['x-user-role'] = decoded.role;
                    if (decoded.tenantId) forwardHeaders['x-tenant-id'] = decoded.tenantId;
                } catch (jwtError) {
                    return reply.code(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Invalid token' });
                }
            } else if (targetKey !== 'auth') {
                // Only reject if the route is NOT 'auth' and the token is missing
                return reply.code(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Missing token' });
            }

            // 3. Finalize headers and forward
            if (['POST', 'PUT', 'PATCH'].includes(req.method) && bodyBuffer) {
                forwardHeaders['content-type'] = req.headers['content-type'] || 'application/json';
                forwardHeaders['content-length'] = Buffer.byteLength(bodyBuffer).toString();
            }

            forwardHeaders['x-forwarded-for'] = req.ip;
            forwardHeaders['host'] = new URL(baseTarget).host;

            const response = await fetch(downstreamUrl, {
                method: req.method,
                headers: forwardHeaders,
                body: bodyBuffer,
                duplex: 'half',
            } as any);

            // 4. Forward response
            response.headers.forEach((value, key) => {
                if (key.toLowerCase() !== 'transfer-encoding') reply.header(key, value);
            });

            const responseData = await response.text();
            try {
                return reply.code(response.status).send(JSON.parse(responseData));
            } catch {
                return reply.code(response.status).send(responseData);
            }

        } catch (error: any) {
            console.error(`[Gateway Routing Crash] to ${downstreamUrl}:`, error);
            return reply.code(503).send({ statusCode: 503, error: 'Service Unavailable', message: error.message });
        }
    }
}