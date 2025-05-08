import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DateString } from '../common/types/app.types';

export type DialogDataDocument = HydratedDocument<DialogData>;

export interface IDialogData {
    id?: mongoose.Types.ObjectId;
    _id?: mongoose.Types.ObjectId;
    ownerUserId: string;
    messages: IDialogMessage[];
    createdAt: DateString;
}

export interface IDialogMessage {
    id?: string;
    _id?: mongoose.Types.ObjectId;
    createdAt: DateString;
    from: string;
    forwardedFrom: string | undefined,
    text: string
}

@Schema({
    toObject: {
        getters: true,
    },
})

@Schema()
export class DialogData {
    @Prop({
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    })
    ownerUserId: string;

    @Prop([{
        from: {
            type: String,
            required: false,
        },
        text: {
            type: String,
            required: false,
        },
        forwardedFrom: {
            type: String,
            required: false,
        },
        createdAt: Date,
    }])
    messages: IDialogMessage[];

    @Prop({
        type: Date,
        default: new Date(),
        required: true,
    })
    createdAt: Date;
}


export const DialogDataSchema = SchemaFactory.createForClass(DialogData);
