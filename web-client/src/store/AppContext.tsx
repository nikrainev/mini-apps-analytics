import React, {
    createContext,
    ReactElement,
    useContext,
    useState,
    useEffect,
} from 'react';

import { useLocalSelector } from '@/shared/hooks';
import { AppStore } from '@/store/AppStore';

interface IContext {
    appStore: AppStore
}

const AppContext = createContext({} as IContext);
export const useApp = () => useContext(AppContext);

interface PropsInterface {
    children: ReactElement | ReactElement[];
}

export const AppProvider = (props: PropsInterface) => {
    const { children } = props;

    console.log('inited');

    return (
        <AppContext.Provider
            value={{
                appStore: new AppStore()
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
