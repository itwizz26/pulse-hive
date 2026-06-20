import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        // Force connection to PostgreSQL on boot
        await this.$connect();
    }

    async onModuleDestroy() {
        // Graceful teardown when Docker flags a stop
        await this.$disconnect();
    }
}