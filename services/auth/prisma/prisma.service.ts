import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'; // Import the adapter
import { Pool } from 'pg'; // Import pg pool

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        // 1. Create a connection pool
        const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        });

        // 2. Initialize the adapter with the pool
        const adapter = new PrismaPg(pool);

        // 3. Pass the adapter to the super constructor
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}