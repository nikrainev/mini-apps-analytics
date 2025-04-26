'use client';

import React, { FC } from 'react';

import { FormControl } from '@chakra-ui/form-control';
import { Button, Card, Input, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useSignUp } from '@/api/auth/authRequests';
import { NS_AUTH } from '@/shared/const/app/I18_NAMESPACES';
import { Field } from '@/uikit';
import { RainBowBg } from '@/uikit';
import { PasswordInput } from '@/uikit/chakra-codegen/password-input';

import styles from './Registration.module.scss';

enum FieldsNames {
    Email = 'email',
    Firstname = 'firstname',
    Lastname = 'lastname',
    Password = 'password',
}

interface IFormData {
    [FieldsNames.Email]: string,
    [FieldsNames.Firstname]: string,
    [FieldsNames.Lastname]: string,
    [FieldsNames.Password]: string
}

const Registration:FC = () => {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<IFormData>();
    
    const { t } = useTranslation(NS_AUTH);

    const {
        onRequest,
        state
    } = useSignUp();

    const onSubmit = async (values:IFormData) => {
        onRequest({
            data: values,
        });
    };

    return (
        <div className={styles.cont}>
            <RainBowBg />
            <Card.Root maxW="sm">
                <Card.Header>
                    <Card.Title>
                        {t('signUp.heading')}
                    </Card.Title>
                    <Card.Description>
                        {t('signUp.desc')}
                    </Card.Description>
                </Card.Header>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <FormControl>
                        <Card.Body>
                            <Stack gap="4" w="full">
                                <Field
                                    label={t('signUp.firstName')}
                                    isRequired
                                >
                                    <Input
                                        {...register(FieldsNames.Firstname, {
                                            required: 'This is required',
                                            minLength: { value: 4, message: 'Minimum length should be 4' },
                                        })}
                                    />
                                </Field>
                                <Field
                                    label={t('signUp.lastName')}
                                    isRequired
                                >
                                    <Input
                                        {...register(FieldsNames.Lastname, {
                                            required: 'This is required',
                                            minLength: { value: 4, message: 'Minimum length should be 4' },
                                        })}
                                    />
                                </Field>
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
                    </FormControl>
                    <Card.Footer justifyContent="space-between">
                        <Link
                            href='login'
                        >
                            {t('signUp.logIn')}
                        </Link>
                        <Button
                            variant="solid"
                            loading={isSubmitting}
                            type='submit'
                        >
                            {t('signUp.heading')}
                        </Button>
                    </Card.Footer>
                </form>
            </Card.Root>
        </div>
    );
};

export default Registration;
