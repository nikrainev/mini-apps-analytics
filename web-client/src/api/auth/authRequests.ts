import { RequestMethods } from '@/shared/const/http';
import { useRequest } from '@/shared/hooks/useRequest';

export const useGetMe = () => useRequest({
    url: '',
    method: RequestMethods.Get,
});