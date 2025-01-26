import React from 'react';

import { Button as ChakraButton } from '@chakra-ui/react';
import { cnb } from 'cnbuilder';

interface IProps {
    className?: string,
}

export const Button:React.FC<IProps> = ({
    className,
}) => {

    return (
        <ChakraButton
            className={cnb(className)}
        />
    );
};

export default React.memo(Button);
