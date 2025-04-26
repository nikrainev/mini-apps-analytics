import { FastifyReply } from 'fastify';
import {
    Catch,
    ArgumentsHost,
    HttpException,
    UnprocessableEntityException,
    HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { commonErrorsCodes } from '../common/errorsCodes/common.errorCodes';
import {vars} from "../config/vars";
import {AppEnv} from "../common/const/AppEnv";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: Error, host: ArgumentsHost): unknown {
        const h = host.switchToHttp();
        const res = h.getResponse<FastifyReply>();

        if (exception instanceof HttpException) {
            return super.catch(exception, host);
        }

        const r = new UnprocessableEntityException(commonErrorsCodes.unhandledError);
        const rr = r.getResponse();

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            message: [rr],
            statusCode: 502,
            error: commonErrorsCodes.unhandledError.code,
            data: vars.appEnv == AppEnv.Local ? exception : null,
        });
    }
}
