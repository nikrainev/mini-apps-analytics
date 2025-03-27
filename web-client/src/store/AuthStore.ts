import { makeAutoObservable, observable } from 'mobx';

export class AuthStore {
    isInit =  false;
    isLoading = true;
    isAuthorized = true;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth ({
        isAuthorized,
    }:{
        isAuthorized: boolean
    }) {
        this.isAuthorized = isAuthorized;
        this.isInit = true;

        setTimeout(() => {
            this.isLoading = false;
        }, 300);
    };
}