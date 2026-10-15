import {
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Put,
    Req,
    Res,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ProxyService } from './proxy.service';

@Controller()
export class ProxyController {
    constructor(private readonly proxyService: ProxyService) {}

    @Get('*')
    async get(
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply,
    ) {
        return this.proxyService.forward(req, reply);
    }

    @Post('*')
    async post(
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply,
    ) {
        return this.proxyService.forward(req, reply);
    }

    @Put('*')
    async put(
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply,
    ) {
        return this.proxyService.forward(req, reply);
    }

    @Patch('*')
    async patch(
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply,
    ) {
        return this.proxyService.forward(req, reply);
    }

    @Delete('*')
    async delete(
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply,
    ) {
        return this.proxyService.forward(req, reply);
    }
}
