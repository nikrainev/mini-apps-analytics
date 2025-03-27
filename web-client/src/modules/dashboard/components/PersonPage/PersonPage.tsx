import {
    Box,
} from '@chakra-ui/react';

import { ChatsList } from './ChatsList';
import { KnowledgeList } from './KnowledgeList';
import { ProfileBlock } from './ProfileBlock';


const PersonPage = () => {
    return (
        <Box
            ml={{ base: 0, md: 60 }}
            p="8"
            bg="bg"
            shadow="md"
            borderRadius="md"
        >
            <ProfileBlock />
            <ChatsList />
            <KnowledgeList />
        </Box>
    );
};

export default PersonPage;