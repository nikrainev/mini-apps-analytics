import React, { FC, } from 'react';

import { UserRoles } from '@/shared/const/user/UserRoles';

import { LandingNavbar } from './LandingNavbar';

interface IProps {
    roles: UserRoles[] | null,
    isAuth: boolean,
}

const Navbar: FC<IProps> = ({
    isAuth,
}) => {

    return (
        <LandingNavbar />
    );
};

export default Navbar;
