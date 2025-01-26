"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationPipeline = void 0;
const common_1 = require("@nestjs/common");
const validationPipeline = async ({ validators, }) => {
    const validationResult = await Promise.all(validators.map((v) => v()));
    const errors = validationResult.filter((e) => e);
    if (errors.length > 0) {
        throw new common_1.BadRequestException(errors);
    }
};
exports.validationPipeline = validationPipeline;
//# sourceMappingURL=validationPipeline.js.map