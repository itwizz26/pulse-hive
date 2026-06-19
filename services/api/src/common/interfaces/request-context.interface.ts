import { FastifyRequest } from 'fastify';

/**
 * Clean, verified security footprint extracted at the API perimeter.
 */
export interface IRequestUserContext {
    id: string;
    role: string;
    tenantId?: string;
}

/**
 * Custom extended FastifyRequest interface if you ever need to attach 
 * parsed data directly to the native request context lifecycle inside NestJS.
 */
export interface IInboundProxyRequest extends FastifyRequest {
    user?: IRequestUserContext;
}
