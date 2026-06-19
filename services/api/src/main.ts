import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CorrelationIdInterceptor } from './common/interceptors/correlation-id.interceptor';

async function bootstrap() {
	const logger = new Logger('PulsehiveGateway');

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({ logger: false })
	);

	const configService = app.get(ConfigService);
	const port = configService.get<number>('PORT', 4000);
	const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS', '*');

	app.enableCors({
		origin: allowedOrigins === '*' ? true : allowedOrigins.split(','),
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
		allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, X-Correlation-ID',
	});

	// 💡 CRITICAL: Activate global distributed tracing across the ingress perimeter
	app.useGlobalInterceptors(new CorrelationIdInterceptor());

	await app.listen(port, '0.0.0.0');
	logger.log(`🚀 Pulsehive API Gateway active on: http://localhost:${port}`);
}

bootstrap();