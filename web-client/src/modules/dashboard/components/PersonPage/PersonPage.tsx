import { useEffect } from 'react';

import {
    Box,
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';

import { useGetPerson } from '@/api/persons/personsRequests';
import { Spinner } from '@/uikit';

import { ChatsList } from './ChatsList';
import { KnowledgeList } from './KnowledgeList';
import styles from './PersonPage.module.scss';
import { ProfileBlock } from './ProfileBlock';


const PersonPage = () => {
    const router = useParams();

    const { onRequest, state } = useGetPerson({
        personId: router.personId as string
    });

    useEffect(() => {
        onRequest();
    }, []);

    if (state.isProcessing || !state.result?.data?.person) {
        return (
            <div className={styles.loaderCont}>
                <Spinner />
            </div>
        );
    }

    return (
        <Box
            ml={{ base: 0, md: 60 }}
            p="8"
            bg="bg"
            shadow="md"
            borderRadius="md"
        >
            <ProfileBlock
                person={state.result.data.person}
            />
            <ChatsList />
            <KnowledgeList
                personId={state.result.data.person.id}
            />
        </Box>
    );
};

export default PersonPage;