import { DateString } from '@/shared/types/app.types';

export interface IUserMePublic {
    id: string
    email: string;
    firstname: string;
    lastname: string;
    createdAt: DateString;
}