import { DateString } from '@/shared/types/app.types';

export interface IPerson {
    id: string,
    title: string;
    desc: string;
    createdAt: DateString;
}