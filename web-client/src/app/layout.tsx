'use client';

import React, { ReactElement } from 'react';

import '../styles/globals.css';
import { appWithTranslation } from 'next-i18next';

import AppContextProvider from '@/store/AppContextProvider';

export const DEFAULT_TITLE = 'MiniApps';

function MyApp({
    children,
}: {
    children: ReactElement
}) {
    return (
        <html lang="en">
            <head>
                <title>{DEFAULT_TITLE}</title>
                <meta name="description" content={DEFAULT_TITLE} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
                <meta name="msapplication-TileColor" content="#ffc40d" />
            </head>
            <body>
                <AppContextProvider>
                    {children}
                </AppContextProvider>
            </body>
        </html>
    );
}

// @ts-ignore
export default appWithTranslation(MyApp);
