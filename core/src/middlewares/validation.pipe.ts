import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { commonErrorsCodes } from '../common/errorsCodes/common.errorCodes';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            const errorsData = errors.map((error:any) => ({
                property: error.property,
                constraints: error.constraints,
            }));
            throw new BadRequestException({
                ...commonErrorsCodes.validationError,
                statusCode: 400,
                errors: errorsData,
            });
        }
        return value;
    }

    private toValidate(metatype: any): boolean {
        const types: any[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
