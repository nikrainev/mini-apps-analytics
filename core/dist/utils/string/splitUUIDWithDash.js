"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitUUIDWithDash = void 0;
const UUID_WITHOUT_DASH_LENGTH = 32;
const DASH_INDEXES = [7, 11, 15, 19];
const splitUUIDWithDash = ({ str }) => {
    if (str.length !== UUID_WITHOUT_DASH_LENGTH) {
        return {
            str: '',
            isValid: false,
        };
    }
    const resultStr = str.split('').map((s, index) => {
        if (DASH_INDEXES.includes(index)) {
            return `${s}-`;
        }
        return s;
    });
    return {
        str: resultStr.join(''),
        isValid: true,
    };
};
exports.splitUUIDWithDash = splitUUIDWithDash;
//# sourceMappingURL=splitUUIDWithDash.js.map