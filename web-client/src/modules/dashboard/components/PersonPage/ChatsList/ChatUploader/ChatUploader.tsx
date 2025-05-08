import React, { FC } from 'react';

import { FormControl } from '@chakra-ui/form-control';
import {
    Button,
    CloseButton,
    Dialog,
    Input,
    Textarea,
    Portal,
    Stack,
    FileUpload,
    Box,
    Icon,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { HiUpload } from 'react-icons/hi';
import { RiAddFill } from 'react-icons/ri';

import { useUploadPersonChatFile } from '@/api/dialogs-data/dialogsDataRequests';
import { Field } from '@/uikit';

import styles from './ChatUploader.module.scss';

enum FieldsNames {
    Title = 'title',
    File = 'desc',
}

interface IFormData {
    [FieldsNames.Title]: string,
    [FieldsNames.File]: FileList,
}

interface IProps {
    personId: string,
}

const ChatUploader:FC<IProps> = ({
    personId,
}) => {
    const {
        onRequest: onUploadPersonFile,
        state: uploadPersonFileState,
    } = useUploadPersonChatFile({
        personId,
    });

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<IFormData>();

    const onSubmit = (values:IFormData) => {
        const formData = new FormData();

        formData.append('file', values[FieldsNames.File].item(0) as File);
        formData.append('title', values[FieldsNames.Title]);

        onUploadPersonFile({
            formData,
        });
    };

    return (
        <Dialog.Root size='sm'>
            <Dialog.Trigger asChild>
                <Button
                    className={styles.addButton}
                >
                    Upload Chat <RiAddFill />
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Upload dialog data</Dialog.Title>
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
                                            isRequired
                                        >
                                            <FileUpload.Root>
                                                <FileUpload.HiddenInput
                                                    {...register(FieldsNames.File, {
                                                        required: 'This is required',
                                                        minLength: { value: 4, message: 'Minimum length should be 4' },
                                                    })}
                                                />
                                                <FileUpload.Trigger asChild>
                                                    <Button variant="outline" size="sm">
                                                        <HiUpload /> Upload file
                                                    </Button>
                                                </FileUpload.Trigger>
                                                <FileUpload.List />
                                            </FileUpload.Root>
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
                                    Add chat
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

export default ChatUploader;