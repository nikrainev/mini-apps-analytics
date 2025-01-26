"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyError = void 0;
const stringifyError = ({ error, }) => {
    return JSON.stringify(error, Object.getOwnPropertyNames(error));
};
exports.stringifyError = stringifyError;
//# sourceMappingURL=stringifyError.js.map