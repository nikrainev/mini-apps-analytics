import {
    Injectable,
    BadRequestException,
    PipeTransform,
    ArgumentMetadata,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, Types.ObjectId> {
    transform(value: string, metadata: ArgumentMetadata): Types.ObjectId {
        if ( Types.ObjectId.isValid(value) && (new Types.ObjectId(value).toString() === value)) {
            return new Types.ObjectId(value);
        } else {
            throw new BadRequestException(`${metadata.type} is not a valid MongoId`);
        }
    }
}
