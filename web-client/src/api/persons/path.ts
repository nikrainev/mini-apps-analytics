import { publicConfig } from '@/configs/publicConfig';

const ROOT_PERSONS_PATH = `${publicConfig.backendUrl}/persons`;
export const PERSON_API = `${ROOT_PERSONS_PATH}/person`;
export const PERSON_ITEM_API = ({
    personId
}:{ personId: string }) => `${ROOT_PERSONS_PATH}/person/${personId}`;
export const PERSON_ME_API = `${ROOT_PERSONS_PATH}/me`;