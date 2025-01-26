import { makeAutoObservable, observable } from 'mobx';

import { Locales } from '@/shared/const/app/Locales';

export class AppStore {
    locale =  Locales.En;

    constructor() {
        makeAutoObservable(this, {
            locale: observable,
        });
    }

    get getAppLocale():Locales {
        return this.locale;
    }

    setLocale (locale: Locales) {
        this.locale = locale;
    };
}