import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger('PulseHiveDB');

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );

    const port = Number(process.env.PORT ?? 4003);

    await app.listen(port, '0.0.0.0');

    logger.log(`DB service running on port ${port}`);
}

bootstrap();