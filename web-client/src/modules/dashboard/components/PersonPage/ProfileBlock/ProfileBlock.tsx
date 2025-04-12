import { FC } from 'react';

import { Avatar, HStack, defineStyle, Text } from '@chakra-ui/react';

const ringCss = defineStyle({
    outlineWidth: '2px',
    outlineColor: 'colorPalette.500',
    outlineOffset: '2px',
    outlineStyle: 'solid',
});

import { IPerson } from '@/shared/types/person.types';

import styles from './ProfileBlock.module.scss';

interface IProps {
    person: IPerson,
}


const ProfileBlock:FC<IProps> = ({
    person,
}) => {
    return (
        <div className={styles.cont}>
            <Avatar.Root
                css={ringCss}
                colorPalette="blue"
                size="2xl"
            >
                <Avatar.Fallback name="Random" />
                <Avatar.Image src="https://randomuser.me/api/portraits/men/42.jpg" />
            </Avatar.Root>
            <div className={styles.textCol}>
                <Text textStyle="2xl">
                    {person.title}
                </Text>
                <Text>
                    {person.desc}
                </Text>
            </div>
        </div>
    );
};

export default ProfileBlock;