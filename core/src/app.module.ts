import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { JwtAuthGuard } from './middlewares/guards/jwt-auth.guard';
import { JwtStrategy } from './middlewares/guards/jwt.strategy';
import { TechModule } from './modules/tech/tech.module';
import { AuthModule } from './modules/auth/auth.module';
import { vars } from './config/vars';
import { MyLogger } from './config/MyLogger';
import { User, UserSchema } from './schemas/user.scheme';
import { PersonModule } from './modules/person/person.module';
import { ChatModule } from './modules/chat/chat.module';
import { RagModule } from './modules/rag/rag.module';

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
        RagModule,
        ChatModule,
        AuthModule,
        PersonModule,
        MongooseModule.forRoot(connectionString),
        ScheduleModule.forRoot(),
        MongooseModule.forFeature(
            [{ name: User.name, schema: UserSchema } ]),
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
