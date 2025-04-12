import { notNullStrings } from '../string/notNullStrings';

export const getUserNamesFromUser = ({
    user,
}:{
    user?: {
        firstName: string | undefined,
        lastName: string | undefined,
    } | null
}):string => {
    return notNullStrings({
        strings: [user?.firstName, user?.lastName]
    });
};