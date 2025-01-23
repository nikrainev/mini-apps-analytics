import {
    ClassSerializerInterceptor,
    Controller,
    forwardRef,
    Inject,
    UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { TransformInterceptor } from 'middlewares/response.interceptor';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)

export class AuthController {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
    ) {}
}
