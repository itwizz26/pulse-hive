import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const logger = new Logger('PulseHiveAuth');
    const app = await NestFactory.create(AppModule);
    const port = Number(process.env.PORT ?? 4001);

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));

    app.setGlobalPrefix('api/v1');
    
    await app.listen(port, '0.0.0.0');
    
    logger.log(`Auth service running on: ${await app.getUrl()}`);
}
bootstrap();
