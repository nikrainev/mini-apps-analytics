import React, { ReactElement } from 'react';

import { AppProvider } from './AppContext';

interface PropsAppContextProvider {
    children: ReactElement | ReactElement[];
}

const AppContextProvider: React.FC<PropsAppContextProvider> = ({
    children,
}) => {
    return (
        <AppProvider>
            {children}
        </AppProvider>
    );
};

export default React.memo(AppContextProvider);
