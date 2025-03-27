
import { EmptyState, List, VStack } from '@chakra-ui/react';
import { HiColorSwatch } from 'react-icons/hi';

import { usePersonsList } from '@/modules/dashboard/store/MainPageContext';

import { PersonItem } from './PersonItem';
import styles from './PersonsList.module.scss';

const PersonsList = () => {
    const {
        personsStore,
    } = usePersonsList();

    if (personsStore.list.length === 0) {
        return (
            <EmptyState.Root>
                <EmptyState.Content>
                    <EmptyState.Indicator>
                        <HiColorSwatch />
                    </EmptyState.Indicator>
                    <VStack textAlign="center">
                        <EmptyState.Title>
                            You have no created personas.
                        </EmptyState.Title>
                        <EmptyState.Description>
                            Create the first
                        </EmptyState.Description>
                    </VStack>
                </EmptyState.Content>
            </EmptyState.Root>
        );
    }

    return (
        <div className={styles.cont}>
            {personsStore.list.map((p) => (
                <PersonItem
                    key={p.id}
                    person={p}
                />
            ))}
        </div>
    );
};

export default PersonsList;