import { DateString } from '@/shared/types/app.types';

export interface IChat {
    id: string,
    name: string,
    messagesCount: number,
    dateStart: DateString,
    dateEnd: DateString,
    uploadedAt: DateString,
}

export interface IMessagesTimeStat {
    weekDays: number[],
    hours: number[],
}

export interface IMessagesCountStat {
    myCount: number,
    avgMeLength: number,
    otherCount: number,
    avgOtherLength: number,
}

export interface ISchemeStat {
    responseTime: number[],
    messageSize: number[],
    messageGroupSize: number[],
    messageChainSize: number[],
    chainStart: {
        me: number,
        other: number,
    }
}

export interface IDialogStats {
    id: string;
    title: string;
    dialogTitle: string;
    timeStat: IMessagesTimeStat,
    countStat: IMessagesCountStat,
    schemeStat: ISchemeStat,
    ownerUserId: string;
    dialogDataId: string;
    createdAt: DateString;
}