import { ReactNode } from 'react';

import {
    Box,
    CloseButton,
    Flex,
    Icon,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
    Drawer
} from '@chakra-ui/react';
import Link from 'next/link';
import { IconType } from 'react-icons';
import {
    FiHome,
    FiMessageCircle,
} from 'react-icons/fi';

import { DASHBOARD_PAGE } from '@/shared/const/app/CLIENT_URL';
import { DrawerContent } from '@/uikit/chakra-codegen/drawer';

import styles from './SideBar.module.scss';

interface LinkItemProps {
    name: string
    icon: IconType
}

interface NavItemProps extends FlexProps {
    icon: IconType
    children: React.ReactNode
}

interface SidebarProps extends BoxProps {
    onClose: () => void
}

const LinkItems: Array<LinkItemProps & {
    href: string,
}> = [
    { 
        name: 'Profiles',
        icon: FiHome,
        href: DASHBOARD_PAGE
    },
    {
        name: 'Messengers',
        icon: FiMessageCircle,
        href: DASHBOARD_PAGE
    },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            borderRight="1px"
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Empathy
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <Link
                    href={link.href}
                    key={link.name}
                >
                    <NavItem icon={link.icon}>
                        {link.name}
                    </NavItem>
                </Link>
            ))}
        </Box>
    );
};

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
    return (
        <Box
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'cyan.400',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Box>
    );
};

const SideBar = ({
    children
}:{
    children: ReactNode
}) => {
    const { open, onOpen, onClose } = useDisclosure();

    return (
        <Box minH="100vh">
            <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
            <Drawer.Root
                open={open}
                size="full"
            >
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer.Root>
            <div className={styles.content}>
                {children}
            </div>
        </Box>
    );
};

export default SideBar;