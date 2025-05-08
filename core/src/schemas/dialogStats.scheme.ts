import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DateString } from '../common/types/app.types';

export type DialogStatsDocument = HydratedDocument<DialogStats>;

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
    id?: mongoose.Types.ObjectId;
    _id?: mongoose.Types.ObjectId;
    title: string;
    dialogTitle: string;
    timeStat: IMessagesTimeStat,
    countStat: IMessagesCountStat,
    schemeStat: ISchemeStat,
    ownerUserId: string;
    dialogDataId: string;
    createdAt: DateString;
}

@Schema({
    toObject: {
        getters: true,
    },
})

@Schema()
export class DialogStats {
    @Prop({
        type: String,
        required: true,
    })
    title: string;

    @Prop({
        type: String,
        required: true,
    })
    dialogTitle: string;

    @Prop({
        type: Object,
        required: true,
        default: {
            weekDays: [0, 0, 0, 0, 0, 0, 0],
            hours: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    })
    timeStat: IMessagesTimeStat;

    @Prop({
        type: Object,
        required: true,
        default: {
            myCount: 0,
            avgMeLength: 0,
            otherCount: 0,
            avgOtherLength: 0,
        },
    })
    countStat: IMessagesCountStat;

    @Prop({
        type: Object,
        required: true,
        default: {
            responseTime: [],
            messageSize: [],
            messageGroupSize: [],
            messageChainSize: [],
            chainStart: {
                me: 0,
                other: 0,
            },
        },
    })
    schemeStat: ISchemeStat;

    @Prop({
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    })
    ownerUserId: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        ref: 'DialogData',
        required: true,
    })
    dialogDataId: string;

    @Prop({
        type: Date,
        default: new Date(),
        required: true,
    })
    createdAt: Date;
}

export class DialogStatsPublic {
    constructor(person:DialogStatsDocument) {
        this.id = person.id;
        this.title = person.title;
        this.dialogTitle = person.dialogTitle;
        this.createdAt = person.createdAt?.toISOString();
    }

    id: mongoose.Types.ObjectId;
    title: string;
    dialogTitle: string;
    createdAt: DateString;
}

export const DialogStatsSchema = SchemaFactory.createForClass(DialogStats);
