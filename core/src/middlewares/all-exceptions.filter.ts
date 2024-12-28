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
        });
    }
}
