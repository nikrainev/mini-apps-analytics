import { NotFoundException } from '@nestjs/common';
import { AuthCodes } from '../errorsCodes/Auth.errorCodes';

export class UserNotFoundError extends NotFoundException {
    constructor() {
        super([AuthCodes.userNotFound]);
    }
}
