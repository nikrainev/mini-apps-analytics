'use client';

import React, { ReactElement } from 'react';

import '../styles/globals.css';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import AppContextProvider from '@/store/AppContextProvider';

const DEFAULT_TITLE = 'Empathy';

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
                <ChakraProvider value={defaultSystem}>
                    <AppContextProvider>
                        {children}
                    </AppContextProvider>
                </ChakraProvider>
            </body>
        </html>
    );
}

// @ts-ignore
export default MyApp;
