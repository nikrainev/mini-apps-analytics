'use client';

import React, { FC } from 'react';

import { FormControl } from '@chakra-ui/form-control';
import { Button, Card, Input, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useLoginMe } from '@/api/auth/authRequests';
import { SIGNUP_PAGE } from '@/shared/const/app/CLIENT_URL';
import { NS_AUTH } from '@/shared/const/app/I18_NAMESPACES';
import { Field } from '@/uikit';
import { RainBowBg } from '@/uikit';
import { PasswordInput } from '@/uikit/chakra-codegen/password-input';

import styles from './Login.module.scss';

enum FieldsNames {
    Email = 'email',
    Password = 'password',
}

interface IFormData {
    [FieldsNames.Email]: string,
    [FieldsNames.Password]: string
}


const Login:FC = () => {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<IFormData>();

    const { t } = useTranslation(NS_AUTH);

    const {
        onRequest,
        state
    } = useLoginMe();
    
    
    const onSubmit = async (values:IFormData) => {
        onRequest({
            data: values
        });
    };


    return (
        <div className={styles.cont}>
            <RainBowBg />
            <Card.Root minW="m">
                <Card.Header>
                    <Card.Title>
                        {t('logIn.heading')}
                    </Card.Title>
                </Card.Header>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <FormControl>
                        <Card.Body>
                            <Stack gap="4" w="full">
                                <Field
                                    label={t('logIn.email')}
                                    isRequired
                                >
                                    <Input
                                        {...register(FieldsNames.Email, {
                                            required: 'This is required',
                                            minLength: { value: 4, message: 'Minimum length should be 4' },
                                        })}
                                    />
                                </Field>
                                <Field
                                    label={t('logIn.password')}
                                    isRequired
                                >
                                    <PasswordInput
                                        {...register(FieldsNames.Password, {
                                            required: 'This is required',
                                            minLength: { value: 4, message: 'Minimum length should be 4' },
                                        })}
                                    />
                                </Field>
                            </Stack>
                        </Card.Body>
                        <Card.Footer justifyContent="space-between">
                            <Link
                                href={SIGNUP_PAGE}
                            >
                                {t('logIn.signUp')}
                            </Link>
                            <Button variant="solid" type='submit'>
                                {t('logIn.heading')}
                            </Button>
                        </Card.Footer>
                    </FormControl>
                </form>
            </Card.Root>
        </div>
    );
};

export default Login;
