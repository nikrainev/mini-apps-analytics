import {
    Text
} from '@chakra-ui/react';

import { AddPerson } from './AddPerson';
import styles from './PersonsHeader.module.scss';

const PersonsHeader = () => {
    return (
        <div className={styles.cont}>
            <Text textStyle="2xl">
                Persons
            </Text>
            <AddPerson />
        </div>
    );
};

export default PersonsHeader;