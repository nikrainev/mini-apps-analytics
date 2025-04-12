import { IUploadPersonFileReq, IUploadPersonFileRes } from '@/api/rag/contracts';
import { RAG_PERSON_FILE_ITEM_API } from '@/api/rag/path';
import { RequestMethods } from '@/shared/const/http';
import { useRequest } from '@/shared/hooks/useRequest';

export const useUploadPersonFile = (params:{
    personId: string,
}) => useRequest<never, IUploadPersonFileRes>({
    url: RAG_PERSON_FILE_ITEM_API({
        personId: params.personId,
    }),
    method: RequestMethods.Post,
});