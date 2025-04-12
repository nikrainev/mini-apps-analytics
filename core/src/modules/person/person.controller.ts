import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    forwardRef,
    Get,
    Inject,
    Param,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';

import { PersonService } from './person.service';
import { TransformInterceptor } from 'middlewares/response.interceptor';
import { JwtAuthGuard } from 'middlewares/guards/jwt-auth.guard';
import { IRequest } from 'common/types/fastify.types';
import { Roles } from '../../decorators/role.decorator';
import { UserRoles } from '../../common/const/user/USER_ROLES';
import { CreatePersonBody, CreatePersonRes } from './requests/createPerson.request';
import { GetPersonParams, GetPersonRes } from './requests/getPerson.request';
import { GetPersonsRes } from './requests/getPersons.request';

@Controller('persons')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)

export class PersonsController {
    constructor(
        @Inject(forwardRef(() => PersonService))
        private readonly personService: PersonService,
    ) {}

    @Roles(UserRoles.Customer)
    @UseGuards(JwtAuthGuard)
    @Post('person')
    async createPerson(
        @Req() req:IRequest,
        @Body() body: CreatePersonBody,
    ):Promise<CreatePersonRes> {
        return this.personService.createPerson(body, req.user?.id);
    }

    @Roles(UserRoles.Customer)
    @UseGuards(JwtAuthGuard)
    @Get('person/:personId')
    async getPerson(
        @Param() params: GetPersonParams,
    ):Promise<GetPersonRes> {
        return this.personService.getPerson(params);
    }

    @Roles(UserRoles.Customer)
    @UseGuards(JwtAuthGuard)
    @Get('/me')
    async getPersons(
        @Req() req:IRequest,
    ):Promise<GetPersonsRes> {
        return this.personService.getPersons({
            meUserId: req.user?.id,
        });
    }
}
