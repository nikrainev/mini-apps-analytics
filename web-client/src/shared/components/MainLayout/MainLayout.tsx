'use client';

import React, { FC, ReactElement, useEffect, } from 'react';

import { Loader } from '@chakra-ui/react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/navigation';

import { useGetMe } from '@/api/auth/authRequests';
import { SideBar } from '@/shared/components/MainLayout/SideBar';
import { LOGIN_PAGE } from '@/shared/const/app/CLIENT_URL';
import { RequestStatuses } from '@/shared/const/http';
import { UserRoles } from '@/shared/const/user/UserRoles';
import { useApp } from '@/store/AppContext';

import styles from './MainLayout.module.scss';
import { Navbar } from '../Navbar';


interface IMainLayoutProps {
    children?: ReactElement | ReactElement[],
    hideNavbar?: boolean,
    requiredRoles?: UserRoles[],
    allRolesAccepted?: boolean,
    guestOnly?: boolean,
    isLessonPage?: boolean,
    isSetAuthInfoPage?: boolean,
}

const MainLayout: FC<IMainLayoutProps> = ({
    children,
    hideNavbar,
    requiredRoles = [],
    guestOnly,
    isLessonPage,
    allRolesAccepted,
    isSetAuthInfoPage,
}) => {
    const router = useRouter();

    const {
        authStore,
    } = useApp();

    const {
        onRequest: onGetMeReq,
        state: getMeRes
    } = useGetMe();
    
    useEffect(() => {
        if (!authStore.isInit) {
            onGetMeReq();
        }
    }, [authStore.isInit]);

    useEffect(() => {
        if ([
            RequestStatuses.Unauthorized,
            RequestStatuses.Failed,
            RequestStatuses.Succeeded
        ].includes(getMeRes.status)) {
            authStore.setAuth({
                isAuthorized: getMeRes.status === RequestStatuses.Succeeded
            });
        }
    }, [getMeRes.status]);

    useEffect(() => {
        if (authStore.isInit) {
            if (guestOnly && authStore.isAuthorized) {
                router.push('/dashboard');
            }
        }
    }, [requiredRoles, authStore.isInit, guestOnly]);

    useEffect(() => {
        if (authStore.isInit && !authStore.isAuthorized && !guestOnly) {
            router.push(LOGIN_PAGE);
        }
    }, [authStore.isInit, guestOnly]);
    
    if (authStore.isLoading) {
        return (
            <div className={styles.loaderCont}>
                <Loader />
            </div>
        );
    }
    
    return (
        <div>
            {!hideNavbar && (
                <Navbar
                    roles={requiredRoles}
                    isAuth={false}
                />
            )}
            {authStore.isAuthorized ? (
                <SideBar>
                    {children}
                </SideBar>
            ) : (
                <div className={styles.siteContent}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default observer(MainLayout);
