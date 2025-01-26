import React, {
    FC,
    ReactElement,
} from 'react';

import { UserRoles } from '@/shared/const/user/UserRoles';

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
    return (
        <div>
            {!hideNavbar && (
                <Navbar
                    roles={requiredRoles}
                    isAuth={false}
                />
            )}
            <div className={styles.siteContent}>
                {children}
            </div>
        </div>
    );
};

export default MainLayout;
