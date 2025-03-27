'use client';
import React from 'react';

import type { NextPage } from 'next';

import { MainPage } from '@/modules/dashboard/components/MainPage';
import { PersonsListProvider } from '@/modules/dashboard/store/MainPageContext';
import { MainLayout } from '@/shared/components';

const DashBoardWR: NextPage = () => {
    return (
        <MainLayout>
            <PersonsListProvider>
                <MainPage />
            </PersonsListProvider>
        </MainLayout>
    );
};

export default DashBoardWR;