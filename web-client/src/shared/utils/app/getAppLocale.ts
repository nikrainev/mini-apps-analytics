import { Locales } from '../../const/app/Locales';
import { parseCookieString } from '../string/parseCookieString';

export const getAppLocale = ({
    nextLocale = Locales.En,
    cookieStr,
}:{
    nextLocale?: string,
    cookieStr?: string,
}):string => {
    let cookieLocale;
    if  (cookieStr) {
        cookieLocale = parseCookieString({
            str: cookieStr,
        }).NEXT_LOCALE;
    }

    return cookieLocale ?? nextLocale;
};
