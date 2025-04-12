import {
    Module,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'schemas/user.scheme';
import { QdrantProvider } from 'providers/QdrantClient';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ]),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        QdrantProvider,
    ],
    exports: [],
})

export class AuthModule {}
