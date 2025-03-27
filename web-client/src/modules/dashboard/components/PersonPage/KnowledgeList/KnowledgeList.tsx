import {
    Box,
} from '@chakra-ui/react';
import { KnowledgeItem } from './KnowledgeItem';


const KnowledgeBlock = () => {
    return (
        <div>
            <KnowledgeItem />
            <KnowledgeItem />
            <KnowledgeItem />
        </div>
    );
};

export default KnowledgeBlock;