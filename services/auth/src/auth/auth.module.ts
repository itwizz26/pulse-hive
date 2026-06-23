import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        PassportModule,
        ConfigModule.forRoot({
            isGlobal: true, // This makes ConfigService available everywhere
        }),
        
        // 2. Use registerAsync to inject ConfigService
        JwtModule.registerAsync({
            imports: [ConfigModule], // Make ConfigModule available to this module
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '60m' },
            }),
            inject: [ConfigService], // Inject the service
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}