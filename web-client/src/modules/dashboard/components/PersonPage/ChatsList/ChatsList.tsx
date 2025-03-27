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
                <ChatItem />
                <ChatItem />
                <ChatItem />
            </div>
        </div>
    );
};

export default ChatsList;