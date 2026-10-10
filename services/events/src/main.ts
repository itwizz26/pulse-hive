import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger('PulseHiveEvents');

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );

    app.useGlobalPipes(
        new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        }),
    );

    const port = Number(process.env.PORT ?? 5000);

    await app.listen(port, '0.0.0.0');

    logger.log(`Events service running on port ${port}`);
}

bootstrap();