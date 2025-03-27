import { useEffect } from 'react';

import { Box, Loader, } from '@chakra-ui/react';

import { useGetPersons } from '@/api/persons/personsRequests';
import { usePersonsList } from '@/modules/dashboard/store/MainPageContext';
import { RequestStatuses } from '@/shared/const/http';

import styles from './MainPage.module.scss';
import { PersonsHeader } from './PersonsHeader';
import { PersonsList } from './PersonsList';


const MainPage = () => {
    const {
        personsStore,
    } = usePersonsList();

    const {
        onRequest: onGetPersons,
        state: getPersonsState,
    } = useGetPersons();

    useEffect(() => {
        onGetPersons();
    }, []);

    useEffect(() => {
        if (getPersonsState.status === RequestStatuses.Succeeded) {
            personsStore.setList({
                persons: getPersonsState.result.data.persons,
            });
        }
    }, [getPersonsState]);
    
    return (
        <Box
            ml={{ base: 0, md: 60 }}
            p="4"
            bg="bg" shadow="md" borderRadius="md"
        >
            <PersonsHeader />
            {personsStore.isLoading ? (
                <div className={styles.loaderCont}>
                    <Loader />
                </div>
            ) : (
                <PersonsList />
            )}
        </Box>
    );
};

export default MainPage;