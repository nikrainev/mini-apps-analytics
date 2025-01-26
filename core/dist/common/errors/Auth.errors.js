"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCacheNotFoundError = void 0;
const common_1 = require("@nestjs/common");
const Auth_errorCodes_1 = require("../errorsCodes/Auth.errorCodes");
class AuthCacheNotFoundError extends common_1.NotFoundException {
    constructor() {
        super([Auth_errorCodes_1.AuthCodes.authCacheNotFound]);
    }
}
exports.AuthCacheNotFoundError = AuthCacheNotFoundError;
//# sourceMappingURL=Auth.errors.js.map