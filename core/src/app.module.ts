import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { JwtAuthGuard } from './middlewares/guards/jwt-auth.guard';
import { JwtStrategy } from './middlewares/guards/jwt.strategy';
import { TechModule } from './controllers/tech/tech.module';
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
