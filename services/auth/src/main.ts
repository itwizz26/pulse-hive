import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // 💡 Auto-validate all incoming requests globally
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true, // Strips out properties that are not on the DTO
      transform: true, // Auto-transforms payloads to match their DTO classes
    }));

    await app.listen(4001, '0.0.0.0');
}
bootstrap();
