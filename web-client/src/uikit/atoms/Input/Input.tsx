import React from 'react';

import { Input as ChakraInput, InputProps as ChakraInputProps } from '@chakra-ui/react';

export type InputProps = ChakraInputProps;

export const Input: React.FC<InputProps> = (props) => {
    return <ChakraInput {...props} />;
};
