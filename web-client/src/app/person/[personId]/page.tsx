'use client';
import React from 'react';

import type { NextPage } from 'next';

import { PersonPage } from '@/modules/dashboard';
import { PersonsListProvider } from '@/modules/dashboard/store/MainPageContext';
import { MainLayout } from '@/shared/components';

const PersonWR: NextPage = () => {
    return (
        <MainLayout>
            <PersonsListProvider>
                <PersonPage />
            </PersonsListProvider>
        </MainLayout>
    );
};

export default PersonWR;