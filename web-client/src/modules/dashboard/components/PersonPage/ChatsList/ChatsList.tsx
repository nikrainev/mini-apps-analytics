import React, { FC } from 'react';

import {
    Text,
} from '@chakra-ui/react';

import { IDialogStats } from '@/shared/types/chat.types';

import { ChatItem } from './ChatItem';
import styles from './ChatsList.module.scss';
import { ChatUploader } from './ChatUploader';

interface IProps {
    personId: string,
    dialogs:  IDialogStats[]
}

const ChatsList:FC<IProps> = ({
    personId,
    dialogs,
}) => {
    return (
        <div className={styles.cont}>
            <div className={styles.header}>
                <Text textStyle="2xl">
                    Chats
                </Text>
                <ChatUploader
                    personId={personId}
                />
            </div>
            <div className={styles.chatsList}>
                {dialogs.map((d) => (
                    <ChatItem
                        key={d.id}
                        chatData={{
                            id: d.id,
                            name: d.title,
                            dateEnd: '2025-04-16T21:37:45.680Z',
                            dateStart: '2023-10-16T21:37:45.680Z',
                            messagesCount: d.countStat.myCount + d.countStat.otherCount,
                            uploadedAt: d.createdAt,
                        }}
                        intensity={d.schemeStat.messageChainSize}
                    />
                ))}
            </div>
        </div>
    );
};

export default ChatsList;