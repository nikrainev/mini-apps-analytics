"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyLogger = void 0;
const common_1 = require("@nestjs/common");
class MyLogger extends common_1.ConsoleLogger {
    log(message, ...optionalParams) {
        super.log(message, ...optionalParams);
    }
    error(message, stack, context) {
        super.error(message, JSON.stringify(stack), context);
    }
    warn(message, ...optionalParams) {
        super.log(message, optionalParams);
    }
    debug(message, ...optionalParams) {
        super.log(message, optionalParams);
    }
    verbose(message, ...optionalParams) {
        super.log(message, optionalParams);
    }
}
exports.MyLogger = MyLogger;
//# sourceMappingURL=MyLogger.js.map