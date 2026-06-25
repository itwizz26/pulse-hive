import { Controller, All, Req, Res } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ProxyService } from './proxy.service';

@Controller()
export class ProxyController {
    constructor(private readonly proxyService: ProxyService) {}

    // Wildcard capture matching absolutely any sub-routes, parameters, or verbs
    @All('*')
    async handleAllRequests(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        return this.proxyService.forward(req, reply);
    }
}