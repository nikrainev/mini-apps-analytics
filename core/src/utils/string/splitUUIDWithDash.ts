export interface IUUIDWithDash {
    str: string,
    isValid: boolean,
}
const UUID_WITHOUT_DASH_LENGTH = 32;
const DASH_INDEXES = [7, 11, 15, 19];

export const splitUUIDWithDash = ({ str }:{ str: string }):IUUIDWithDash => {
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
