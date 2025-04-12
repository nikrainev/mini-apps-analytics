import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    forwardRef,
    Inject,
    Param,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';

import { RagService } from './rag.service';
import { TransformInterceptor } from 'middlewares/response.interceptor';
import { JwtAuthGuard } from 'middlewares/guards/jwt-auth.guard';
import { IRequest } from 'common/types/fastify.types';
import { Roles } from '../../decorators/role.decorator';
import { UserRoles } from '../../common/const/user/USER_ROLES';
import { UploadFileBody, UploadFileParams, UploadFileRes } from './requests/uploadFile.request';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('rag')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)

export class RagController {
    constructor(
        @Inject(forwardRef(() => RagService))
        private readonly ragService: RagService,
    ) {}

    @Roles(UserRoles.Customer)
    @UseGuards(JwtAuthGuard)
    @FormDataRequest()
    @Post('person/:personId/file')
    async uploadFile(
        @Body() body:UploadFileBody,
        @Param() params:UploadFileParams,
        @Req() req:IRequest,
    ):Promise<UploadFileRes> {
        return this.ragService.uploadFile(params.personId, req.user?.id,  body);
    }
}
