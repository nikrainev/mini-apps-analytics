import { Card, Button } from '@chakra-ui/react';
import Link from 'next/link';

import { DASHBOARD_PERSON } from '@/shared/const/app/CLIENT_URL';
import { IPerson } from '@/shared/types/person.types';

interface IProps {
    person: IPerson
}

const PersonItem:React.FC<IProps> = ({
    person,
}) => {
    return (
        <Card.Root width="320px">
            <Card.Body gap="2">
                <Card.Title mb="2">
                    {person.title}
                </Card.Title>
                <Card.Description>
                    {person.desc}
                </Card.Description>
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
                <Link href={DASHBOARD_PERSON({
                    personId: person.id
                })}>
                    <Button variant="outline">View</Button>
                </Link>
            </Card.Footer>
        </Card.Root>
    );
};

export default PersonItem;