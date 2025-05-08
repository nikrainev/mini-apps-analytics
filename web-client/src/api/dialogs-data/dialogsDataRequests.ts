import { DIALOGS_DATA_PERSON_FILE_ITEM_API } from '@/api/dialogs-data/path';
import { IUploadPersonFileRes } from '@/api/rag/contracts';
import { RequestMethods } from '@/shared/const/http';
import { useRequest } from '@/shared/hooks/useRequest';

export const useUploadPersonChatFile = (params:{
    personId: string,
}) => useRequest<never, IUploadPersonFileRes>({
    url: DIALOGS_DATA_PERSON_FILE_ITEM_API({
        personId: params.personId,
    }),
    method: RequestMethods.Post,
});