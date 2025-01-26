import React from 'react';

import { Spinner as ChakraSpinner } from '@chakra-ui/react';
import { cnb } from 'cnbuilder';

interface IProps {
    className?: string,
}

export const Spinner:React.FC<IProps> = ({
    className,
}) => {

    return (
        <ChakraSpinner
            className={cnb(className)}
        />
    );
};

export default React.memo(Spinner);
