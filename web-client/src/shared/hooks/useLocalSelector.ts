import { useCallback, useEffect } from 'react';

import { setCookie } from 'cookies-next';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { useApp } from '@/store/AppContext';

import { useTranslation } from './useTranslation';
import { NS_COMMON } from '../const/app/I18_NAMESPACES';
import { Locales } from '../const/app/Locales';

interface ILocalSelector {
    onChangeLocal: ({ key }:{ key: Locales }) => void,
    appLocale: Locales,
}

export const useLocalSelector = ():ILocalSelector => {
    const {
        appStore,
    } = useApp();

    const { t:tc } = useTranslation(NS_COMMON);

    const languageStr = tc('language');

    const router = useRouter();

    const pathname = usePathname();
    const query = useSearchParams();

    useEffect(() => {
        appStore.setLocale(languageStr as Locales);
    }, [languageStr]);

    const onChangeLocal = useCallback(({ key }:{ key: Locales }) => {
        appStore.setLocale(key);
        //router.push({ pathname, query }, { locale: key });
        setCookie('NEXT_LOCALE', key);
    }, [pathname, query]);

    return {
        onChangeLocal,
        appLocale: appStore.locale
    };
};
