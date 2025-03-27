import React, {
    createContext,
    ReactElement,
    useContext,
} from 'react';

import { PersonsListStore } from '@/modules/dashboard/store/PersonsListStore';

interface IContext {
    personsStore: PersonsListStore,
}

const PersonsListContext = createContext({} as IContext);
export const usePersonsList = () => useContext(PersonsListContext);

interface PropsInterface {
    children: ReactElement | ReactElement[];
}

export const PersonsListProvider = (props: PropsInterface) => {
    const { children } = props;

    return (
        <PersonsListContext.Provider
            value={{
                personsStore: new PersonsListStore(),
            }}
        >
            {children}
        </PersonsListContext.Provider>
    );
};
