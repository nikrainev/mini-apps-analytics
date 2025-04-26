import React from 'react';

import {
    Box, Button, Text,
} from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';

import { ChatItem } from './ChatItem';
import styles from './ChatsList.module.scss';


const ChatsList = () => {
    return (
        <div className={styles.cont}>
            <div className={styles.header}>
                <Text textStyle="2xl">
                    Chats
                </Text>
                <Button>
                    Upload Chat <RiAddFill />
                </Button>
            </div>
            <div className={styles.chatsList}>
                <ChatItem
                    chatData={{
                        id: '1',
                        name: 'Лиза',
                        dateEnd: '2025-04-16T21:37:45.680Z',
                        dateStart: '2023-10-16T21:37:45.680Z',
                        messagesCount: 12394,
                        uploadedAt: '2025-04-16T21:37:45.680Z',
                    }}
                    intensity={[20, 49, 60, 20, 23, 12, 50, 23, 20, 34, 40 ]}
                />
                <ChatItem 
                    chatData={{
                        id: '1',
                        name: 'Вася',
                        dateEnd: '2025-04-16T21:37:45.680Z',
                        dateStart: '2025-04-16T21:37:45.680Z',
                        messagesCount: 60745,
                        uploadedAt: '2025-04-16T21:37:45.680Z',
                    }} 
                    intensity={[20, 49, 60, 70, 23, 24, 50, 23, 20, 70, 60]}
                />
            </div>
        </div>
    );
};

export default ChatsList;