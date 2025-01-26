export interface IUUIDWithDash {
    str: string;
    isValid: boolean;
}
export declare const splitUUIDWithDash: ({ str }: {
    str: string;
}) => IUUIDWithDash;
