import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DateString } from '../common/types/app.types';
import { UserRole } from '../common/const/user/USER_ROLES';

export type MessageQueueDocument = HydratedDocument<MessageQueue>;

export interface IMessageQueue {
    id?: mongoose.Types.ObjectId;
    _id?: mongoose.Types.ObjectId;
    text: string,
    chatId: string,
    createdAt: DateString,
}

@Schema({
    toObject: {
        getters: true,
    },
})

@Schema()
export class MessageQueue {
    @Prop({
        type: String,
        required: true,
    })
    text: string;

    @Prop({
        type: String,
        required: true,
    })
    chatId: string;

    @Prop({
        type: Date,
        default: new Date(),
    })
    createdAt: Date;
}

export const MessageQueueSchema = SchemaFactory.createForClass(MessageQueue);
