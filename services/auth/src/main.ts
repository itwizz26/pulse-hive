import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// 💡 Auto-validate all incoming requests globally
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		transform: true,
	}));

	await app.listen(4001, '0.0.0.0');
	console.log(`Auth service running on: ${await app.getUrl()}`);
}
bootstrap();
