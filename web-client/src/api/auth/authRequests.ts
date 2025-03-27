import { AUTH_ME_API, AUTH_ME_LOGIN_API } from '@/api/auth/path';
import { RequestMethods } from '@/shared/const/http';
import { useRequest } from '@/shared/hooks/useRequest';
import { IUserMePublic } from '@/shared/types/user.types';

export const useGetMe = () => useRequest({
    url: AUTH_ME_API,
    method: RequestMethods.Get,
});

export const useLoginMe = () => useRequest<{
    email: string;
    password: string
}, {
    user: IUserMePublic
}>({
    url: AUTH_ME_LOGIN_API,
    method: RequestMethods.Put,
});

export const useSignUp = () => useRequest<{
    email: string;
    firstname: string;
    lastname: string;
    password: string
}, IUserMePublic>({
    url: AUTH_ME_API,
    method: RequestMethods.Post,
});