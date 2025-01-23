import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DateString } from '../common/types/app.types';

export type AppPathDocument = HydratedDocument<AppPath>;


export interface IAppPath {
    id?: mongoose.Types.ObjectId;
    _id?: mongoose.Types.ObjectId;
    appId: number;
    url: string,
    path: string,
    title: string,
    description: string,
    createdAt: DateString,
    updatedAt: DateString,
    publishedAt: DateString
}

@Schema({
    toObject: {
        getters: true,
    },
})

@Schema()
export class AppPath {
    @Prop({
        type: Number,
    })
    appId: number;

    @Prop({
        type: String,
    })
    url: string;

    @Prop({
        type: String,
    })
    path: string;

    @Prop({
        type: Date,
        default: new Date(),
    })
    createdAt: Date;
}

export const AppPathSchema = SchemaFactory.createForClass(AppPath);
