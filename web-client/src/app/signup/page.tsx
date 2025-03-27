import React from 'react';

import type { NextPage } from 'next';

import { Registration } from '@/modules/auth/components/Registration';
import { MainLayout } from '@/shared/components/MainLayout';
import TranslationsProvider from '@/shared/components/TranslationsProvider/TranslationsProvider';
import { NS_AUTH } from '@/shared/const/app/I18_NAMESPACES';

import initTranslations from '../../../i18n';


const LoginPageWR: NextPage = async () => {
    const { resources, t } = await initTranslations('en', [NS_AUTH]);

    return (
        <TranslationsProvider
            namespaces={[NS_AUTH]}
            locale={'en'}
            resources={resources}
        >
            <MainLayout
                guestOnly
            >
                <Registration />
            </MainLayout>
        </TranslationsProvider>
    );
};

export default LoginPageWR;