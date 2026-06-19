import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class ProxyService {
    private routeMapping: Record<string, string> = {};

    constructor(private readonly configService: ConfigService) {
        this.routeMapping = {
        auth: this.configService.get<string>('AUTH_SERVICE_URL')!,
        orders: this.configService.get<string>('ORDER_SERVICE_URL')!,
        payments: this.configService.get<string>('PAYMENT_SERVICE_URL')!,
        };

        Object.entries(this.routeMapping).forEach(([segment, target]) => {
        console.log(`[Gateway Engine] /api/v1/${segment} -> ${target}`);
        });
    }

    async forward(req: FastifyRequest, reply: FastifyReply) {
        // req.url is /api/v1/auth/login?param=1
        const urlParts = req.url.split('?')[0].split('/').filter(Boolean);
        const targetKey = urlParts[2]; // Index 0: api, Index 1: v1, Index 2: [service]

        const baseTarget = this.routeMapping[targetKey];
        if (!baseTarget) {
        return reply.code(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `No microservice route mapped for path segment: '${targetKey}'`,
        });
        }

        // Reconstruct the exact path and query string to pass along
        const downstreamPath = req.url.replace(`/api/v1/${targetKey}`, '');
        const downstreamUrl = `${baseTarget}${downstreamPath}`;

        try {
        // Forward headers, preserving correlation IDs, and setting correct proxy footprints
        const forwardHeaders: Record<string, string> = {};
        Object.entries(req.headers).forEach(([key, value]) => {
            if (value && typeof value === 'string') {
            forwardHeaders[key] = value;
            }
        });
        forwardHeaders['x-forwarded-for'] = req.ip;
        forwardHeaders['host'] = new URL(baseTarget).host;

        // Execute high-speed native pass-through fetch
        const response = await fetch(downstreamUrl, {
            method: req.method,
            headers: forwardHeaders,
            body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
            duplex: 'half', // Required by Node's fetch spec for bodies
        } as any);

        // Copy response headers back to client
        response.headers.forEach((value, key) => {
            reply.header(key, value);
        });

        // Handle stream or text extraction
        const responseData = await response.text();
        
        try {
            // If it's JSON, send it back structured properly
            return reply.code(response.status).send(JSON.parse(responseData));
        } catch {
            // Fallback to text if the service returns plain text/html
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