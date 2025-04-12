import React, { FC } from 'react';

import {
    Text,
} from '@chakra-ui/react';

import { KnowledgeItem } from './KnowledgeItem';
import styles from './KnowledgeList.module.scss';
import { KnowledgeUploader } from './KnowledgeUploader';

interface IProps {
    personId: string,
}

const KnowledgeBlock:FC<IProps> = ({
    personId,
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
            <KnowledgeItem />
            <KnowledgeItem />
            <KnowledgeItem />
        </div>
    );
};

export default KnowledgeBlock;