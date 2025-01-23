import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DateString } from '../common/types/app.types';

export type AppCenterQueryDocument = HydratedDocument<AppCenterQuery>;


export interface IAppCenterQuery {
    id?: mongoose.Types.ObjectId;
    _id?: mongoose.Types.ObjectId;
    query: string,
    createdAt: DateString,
}

@Schema({
    toObject: {
        getters: true,
    },
})

@Schema()
export class AppCenterQuery {
    @Prop({
        type: String,
    })
    query: string;

    @Prop({
        type: Date,
        default: new Date(),
    })
    createdAt: Date;
}

export const AppCenterQuerySchema = SchemaFactory.createForClass(AppCenterQuery);
