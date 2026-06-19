import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { CorrelationIdInterceptor } from './common/interceptors/correlation-id.interceptor';

async function bootstrap() {
	const logger = new Logger('PulsehiveGateway');
	
	// Fastify configuration optimized for proxy throughput
	const adapter = new FastifyAdapter({ 
		logger: false, // Handled via enterprise logging interceptor instead
		trustProxy: true 
	});

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		adapter
	);

	// Global Middlewares/Interceptors
	app.enableCors({
		origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	});
	
	app.useGlobalInterceptors(new CorrelationIdInterceptor());

	const port = process.env.PORT || 4000;
	await app.listen(port, '0.0.0.0');
	
	logger.log(`🚀 Pulsehive API Gateway active on: http://localhost:${port}`);
}

bootstrap();