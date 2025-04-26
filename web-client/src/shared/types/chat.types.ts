import { DateString } from '@/shared/types/app.types';

export interface IChat {
    id: string,
    name: string,
    messagesCount: number,
    dateStart: DateString,
    dateEnd: DateString,
    uploadedAt: DateString,
}