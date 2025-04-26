import { DateString } from '@/shared/types/app.types';

export interface IPersonKnowledge {
    id: string;
    createdAt: DateString;
    title: string;
    fileName: string;
}

export interface IPerson {
    id: string,
    title: string;
    desc: string;
    createdAt: DateString;
    knowledge: IPersonKnowledge[];
}