import { NotFoundException } from '@nestjs/common';
import { AuthCodes } from '../errorsCodes/Auth.errorCodes';

export class AuthCacheNotFoundError extends NotFoundException {
    constructor() {
        super([AuthCodes.authCacheNotFound]);
    }
}
