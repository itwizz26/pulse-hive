import { Injectable, RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest, FastifyReply } from 'fastify';
import * as jwt from 'jsonwebtoken';
import { IRequestUserContext } from '../common/interfaces/request-context.interface';

@Injectable()
export class ProxyService {
    private readonly routeMapping: Record<string, string>;
    private readonly jwtSecret: string;

    constructor(private readonly configService: ConfigService) {
        this.jwtSecret = this.configService.get<string>('JWT_SECRET')!;

        this.routeMapping = {
            auth: this.configService.get<string>('AUTH_SERVICE_URL')!,
            orders: this.configService.get<string>('ORDER_SERVICE_URL')!,
        };
    }

    async forward(req: FastifyRequest, reply: FastifyReply) {
        const urlParts = req.url.split('?')[0].split('/').filter(Boolean);
        const targetKey = urlParts[0];
        const baseTarget = this.routeMapping[targetKey];

        if (!baseTarget) {
            return reply.code(404).send({
                statusCode: 404,
                error: 'Not Found',
                message: `No route for: '${targetKey}'`,
            });
        }

        const downstreamUrl = `${baseTarget}${req.url}`;
        const bodyBuffer = (req as RawBodyRequest<FastifyRequest>).rawBody;

        try {
            const forwardHeaders: Record<string, string> = {};

            // Never trust client-supplied internal credentials or identity.
            Object.entries(req.headers).forEach(([key, value]) => {
                const normalizedKey = key.toLowerCase();

                if (
                    value &&
                    typeof value === 'string' &&
                    ![
                        'content-length',
                        'host',
                        'transfer-encoding',
                        'x-internal-service-key',
                        'x-user-id',
                        'x-user-role',
                        'x-tenant-id',
                    ].includes(normalizedKey)
                ) {
                    forwardHeaders[normalizedKey] = value;
                }
            });

            const internalServiceKey =
                this.configService.get<string>('INTERNAL_SERVICE_KEY');

            if (!internalServiceKey) {
                return reply.code(503).send({
                    statusCode: 503,
                    error: 'Service Unavailable',
                    message: 'Internal service authentication is not configured',
                });
            }

            // Authenticate the gateway to the downstream service.
            forwardHeaders['x-internal-service-key'] = internalServiceKey;

            const authHeader = req.headers['authorization'];
            let userContext: IRequestUserContext | undefined;

            if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
                try {
                    const token = authHeader.slice('Bearer '.length);

                    userContext = jwt.verify(
                        token,
                        this.jwtSecret,
                    ) as IRequestUserContext;

                    if (!userContext.id || !userContext.role) {
                        return reply.code(401).send({
                            statusCode: 401,
                            error: 'Unauthorized',
                            message: 'Invalid token payload',
                        });
                    }

                    forwardHeaders['x-user-id'] = userContext.id;
                    forwardHeaders['x-user-role'] = userContext.role;

                    if (userContext.tenantId) {
                        forwardHeaders['x-tenant-id'] = userContext.tenantId;
                    }
                } catch {
                    return reply.code(401).send({
                        statusCode: 401,
                        error: 'Unauthorized',
                        message: 'Invalid token',
                    });
                }
            } else if (targetKey !== 'auth') {
                return reply.code(401).send({
                    statusCode: 401,
                    error: 'Unauthorized',
                    message: 'Missing token',
                });
            }

            // Order listing requires an authenticated tenant context.
            // Other order routes retain their existing authorization behavior.
            if (
                targetKey === 'orders' &&
                req.method === 'GET' &&
                req.url.split('?')[0] === '/orders' &&
                !userContext?.tenantId
            ) {
                return reply.code(403).send({
                    statusCode: 403,
                    error: 'Forbidden',
                    message: 'Your account is not associated with a tenant',
                });
            }

            if (['POST', 'PUT', 'PATCH'].includes(req.method) && bodyBuffer) {
                forwardHeaders['content-type'] =
                    typeof req.headers['content-type'] === 'string'
                        ? req.headers['content-type']
                        : 'application/json';

                forwardHeaders['content-length'] =
                    Buffer.byteLength(bodyBuffer).toString();
            }

            forwardHeaders['x-forwarded-for'] = req.ip;
            forwardHeaders['host'] = new URL(baseTarget).host;

            const response = await fetch(downstreamUrl, {
                method: req.method,
                headers: forwardHeaders,
                body: bodyBuffer,
                duplex: 'half',
            } as any);

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
            console.error(
                `[Gateway Routing Crash] to ${downstreamUrl}:`,
                error,
            );

            return reply.code(503).send({
                statusCode: 503,
                error: 'Service Unavailable',
                message: 'Downstream service request failed',
            });
        }
    }
}
