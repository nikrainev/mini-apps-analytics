import React from 'react';

import { FormControl } from '@chakra-ui/form-control';
import {
    Button,
    CloseButton,
    Dialog,
    Input,
    Textarea,
    Portal,
    Stack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { RiAddFill } from 'react-icons/ri';

import { useCreatePerson } from '@/api/persons/personsRequests';
import { Field } from '@/uikit';

import styles from './AddPerson.module.scss';

enum FieldsNames {
    Title = 'title',
    Desc = 'desc',
}

interface IFormData {
    [FieldsNames.Title]: string,
    [FieldsNames.Desc]: string,
}


const AddPerson = () => {
    const {
        onRequest: onCreatePerson,
        state: createPersonState,
    } = useCreatePerson();

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<IFormData>();

    const onSubmit = (values:IFormData) => {
        onCreatePerson({
            data: {
                title: values[FieldsNames.Title],
                desc: values[FieldsNames.Desc]
            }
        });
    };
    
    return (
        <Dialog.Root size='sm'>
            <Dialog.Trigger asChild>
                <Button>
                    Add Person <RiAddFill />
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Add Person</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <FormControl>
                                    <Stack gap="4" w="full">
                                        <Field
                                            label='Title'
                                            isRequired
                                        >
                                            <Input
                                                {...register(FieldsNames.Title, {
                                                    required: 'This is required',
                                                    minLength: { value: 4, message: 'Minimum length should be 4' },
                                                })}
                                            />
                                        </Field>
                                        <Field
                                            label='Description'
                                            isRequired
                                        >
                                            <Textarea
                                                {...register(FieldsNames.Desc, {
                                                    required: 'This is required',
                                                    minLength: { value: 4, message: 'Minimum length should be 4' },
                                                })}
                                            />
                                        </Field>
                                    </Stack>
                                </FormControl>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                </Dialog.ActionTrigger>
                                <Button
                                    type='submit'
                                >
                                    Add
                                </Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </form>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default AddPerson;