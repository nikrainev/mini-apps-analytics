"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const common_errorCodes_1 = require("../common/errorsCodes/common.errorCodes");
let AllExceptionsFilter = class AllExceptionsFilter extends core_1.BaseExceptionFilter {
    catch(exception, host) {
        const h = host.switchToHttp();
        const res = h.getResponse();
        if (exception instanceof common_1.HttpException) {
            return super.catch(exception, host);
        }
        const r = new common_1.UnprocessableEntityException(common_errorCodes_1.commonErrorsCodes.unhandledError);
        const rr = r.getResponse();
        return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).send({
            message: [rr],
            statusCode: 502,
            error: common_errorCodes_1.commonErrorsCodes.unhandledError.code,
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map