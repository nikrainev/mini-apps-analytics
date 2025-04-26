import { FC } from 'react';

import {
    Card, DataList, Stack,
} from '@chakra-ui/react';
import { format } from 'date-fns';

import { IPersonKnowledge } from '@/shared/types/person.types';

import styles from './KnowledgeItem.module.scss';

interface IProps {
    knowledge: IPersonKnowledge
}

const KnowledgeItem:FC<IProps> = ({
    knowledge,
}) => {
    return (
        <Card.Root width="320px">
            <Card.Body gap="1">
                <Stack gap="2">
                    <DataList.Root size="md">
                        <DataList.Item>
                            <DataList.ItemLabel>Name</DataList.ItemLabel>
                            <DataList.ItemValue>{knowledge.title}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>File</DataList.ItemLabel>
                            <DataList.ItemValue>{knowledge.fileName}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Uploaded at</DataList.ItemLabel>
                            <DataList.ItemValue>{format(new Date(knowledge.createdAt), 'yyyy-MM-dd HH:mm')}</DataList.ItemValue>
                        </DataList.Item>
                    </DataList.Root>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export default KnowledgeItem;