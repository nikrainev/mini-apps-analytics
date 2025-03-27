import React, {
    createContext,
    ReactElement,
    useContext,
    useState,
    useEffect,
} from 'react';

import { AppStore } from '@/store/AppStore';
import { AuthStore } from '@/store/AuthStore';

interface IContext {
    appStore: AppStore,
    authStore: AuthStore
}

const AppContext = createContext({} as IContext);
export const useApp = () => useContext(AppContext);

interface PropsInterface {
    children: ReactElement | ReactElement[];
}

export const AppProvider = (props: PropsInterface) => {
    const { children } = props;

    return (
        <AppContext.Provider
            value={{
                appStore: new AppStore(),
                authStore: new AuthStore()
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
