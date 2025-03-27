import React, {ReactNode} from 'react';

import { Field as FieldChakra } from '@chakra-ui/react';

interface IProps {
    className?: string,
    children: ReactNode,
    label?: string,
    isRequired?: boolean,
}

export const Field:React.FC<IProps> = ({
    className,
    children,
    label,
    isRequired
}) => {

    return (
        <FieldChakra.Root>
            {label && (
                <FieldChakra.Label>
                    {label}
                    {isRequired && (
                        <FieldChakra.RequiredIndicator />
                    )}
                </FieldChakra.Label>
            )}
            {children}
            <FieldChakra.HelperText />
            <FieldChakra.ErrorText />
        </FieldChakra.Root>
    );
};

export default React.memo(Field);
