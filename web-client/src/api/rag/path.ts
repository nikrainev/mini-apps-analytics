import { publicConfig } from '@/configs/publicConfig';

const ROOT_RAG_PATH = `${publicConfig.backendUrl}/rag`;
export const RAG_PERSON_FILE_ITEM_API = ({
    personId
}:{ personId: string }) => `${ROOT_RAG_PATH}/person/${personId}/file`;