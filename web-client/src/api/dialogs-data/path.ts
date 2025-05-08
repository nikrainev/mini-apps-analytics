import { publicConfig } from '@/configs/publicConfig';

const ROOT_DIALOGS_DATA_PATH = `${publicConfig.backendUrl}/dialogs-data`;
export const DIALOGS_DATA_PERSON_FILE_ITEM_API = ({
    personId
}:{ personId: string }) => `${ROOT_DIALOGS_DATA_PATH}/person/${personId}/file`;