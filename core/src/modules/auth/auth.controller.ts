import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    forwardRef,
    Get,
    Inject,
    Post,
    Put,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { TransformInterceptor } from 'middlewares/response.interceptor';
import { JwtAuthGuard } from 'middlewares/guards/jwt-auth.guard';
import { IRequest } from 'common/types/fastify.types';
import { CreateUserBody, CreateUserRes } from './requests/createUser.request';
import { FastifyReply } from 'fastify';
import { addDays } from 'date-fns';
import { Roles } from '../../decorators/role.decorator';
import { UserRoles } from '../../common/const/user/USER_ROLES';
import { UserDocument, UserMePublic } from '../../schemas/user.scheme';
import { LoginMeBody } from './requests/loginMe.request';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)

export class AuthController {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
    ) {}

    @Roles(UserRoles.Customer)
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Req() req:IRequest):Promise<{ user: UserMePublic }> {
        return {
            user: new UserMePublic(req.user as UserDocument),
        };
    }

    @Post('me')
    async createUser(
        @Body() body: CreateUserBody,
        @Res({ passthrough: true }) response: FastifyReply
    ):Promise<CreateUserRes> {
        const result = await this.authService.createUser(body);

        response.setCookie('authToken', result.token, {
            expires: addDays(new Date(), 10),
            httpOnly: true,
            sameSite: true,
            secure: true,
            signed: false,
            path: '/',
        });

        return result;
    }

    @Put('me/login')
    async loginMe(
        @Body() body: LoginMeBody,
        @Res({ passthrough: true }) response: FastifyReply
    ):Promise<CreateUserRes> {
        const result = await this.authService.loginMe(body);

        response.setCookie('authToken', result.token, {
            expires: addDays(new Date(), 10),
            httpOnly: true,
            sameSite: true,
            secure: true,
            signed: false,
            path: '/',
        });

        return result;
    }
}
