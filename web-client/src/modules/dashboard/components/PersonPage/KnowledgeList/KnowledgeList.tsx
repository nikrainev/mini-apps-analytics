import React, { FC } from 'react';

import {
    Text,
} from '@chakra-ui/react';

import { IPersonKnowledge } from '@/shared/types/person.types';

import { KnowledgeItem } from './KnowledgeItem';
import styles from './KnowledgeList.module.scss';
import { KnowledgeUploader } from './KnowledgeUploader';

interface IProps {
    personId: string,
    knowledge: IPersonKnowledge[]
}

const KnowledgeBlock:FC<IProps> = ({
    personId,
    knowledge,
}) => {
    return (
        <div className={styles.cont}>
            <div className={styles.header}>
                <Text textStyle="2xl">
                    Knowledge
                </Text>
                <KnowledgeUploader
                    personId={personId}
                />
            </div>
            <div className={styles.list}>
                {knowledge.map((k) => (
                    <KnowledgeItem
                        key={k.id}
                        knowledge={k}
                    />
                ))}
            </div>
        </div>
    );
};

export default KnowledgeBlock;