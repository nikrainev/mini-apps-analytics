export const stringifyError = ({
    error,
}:{
    error: Error
}):string => {
    return JSON.stringify(error, Object.getOwnPropertyNames(error));
};