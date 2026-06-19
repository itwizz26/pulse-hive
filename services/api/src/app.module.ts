import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyService } from './proxy/proxy.service';
import { ProxyController } from './proxy/proxy.controller';
import { environmentValidationSchema } from './config/configuration';

@Module({
	imports: [
		ConfigModule.forRoot({
		isGlobal: true,
		validationSchema: environmentValidationSchema,
		validationOptions: {
			allowUnknown: true,
			abortEarly: false,
		},
		}),
	],
	controllers: [ProxyController],
	providers: [ProxyService],
})
export class AppModule {}