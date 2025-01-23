import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { JwtAuthGuard } from './middlewares/guards/jwt-auth.guard';
import { JwtStrategy } from './middlewares/guards/jwt.strategy';
import { TechModule } from './modules/tech/tech.module';
import { AuthModule } from './modules/auth/auth.module';
import { DiscoveryModule } from './modules/discovery/discovery.module';
import { PresentationModule } from './modules/presentation/presentation.module';
import { ProcessingModule } from './modules/processing/processing.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { vars } from './config/vars';
import { MyLogger } from './config/MyLogger';

const {
    mongo: {
        connectionString,
    },
} = vars;

@Global()
@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: vars.jwtSalt,
        }),
        TechModule,
        AuthModule,
        DiscoveryModule,
        PresentationModule,
        ProcessingModule,
        TrackingModule,
        MongooseModule.forRoot(connectionString),
        ScheduleModule.forRoot(),
        MongooseModule.forFeature(
            []),
    ],
    controllers: [],
    providers: [
        JwtModule,
        JwtAuthGuard,
        JwtStrategy,
        MyLogger,
    ],
    exports: [
        JwtModule,
        JwtAuthGuard,
        JwtStrategy,
        MyLogger,
    ],
})
export class AppModule {}
