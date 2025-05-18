import { PERSON_API, PERSON_ITEM_API, PERSON_ME_API } from '@/api/persons/path';
import { RequestMethods } from '@/shared/const/http';
import { useRequest } from '@/shared/hooks/useRequest';
import { IDialogStats } from '@/shared/types/chat.types';
import { IPerson } from '@/shared/types/person.types';

export const useCreatePerson = () => useRequest<{
    title: string,
    desc: string,
}, {
    person: IPerson
}>({
    url: PERSON_API,
    method: RequestMethods.Post,
});

export const useGetPerson = (args:{
    personId: string,
}) => useRequest<never, {
    person: IPerson,
    dialogs: IDialogStats[],
}>({
    url: PERSON_ITEM_API({ personId: args.personId }),
    method: RequestMethods.Get,
});

export const useGetPersons = () => useRequest<never,{
    persons: IPerson[]
}>({
    url: PERSON_ME_API,
    method: RequestMethods.Get,
});