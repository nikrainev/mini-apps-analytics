import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DateString } from '../common/types/app.types';

export type SearchAppDocument = HydratedDocument<SearchApp>;

export interface ISearchApp {
    id?: mongoose.Types.ObjectId;
    _id?: mongoose.Types.ObjectId;
    appId: number;
    requestPayload: any,
    createdAt: DateString,
}

@Schema({
    toObject: {
        getters: true,
    },
})

@Schema()
export class SearchApp {
    @Prop({
        type: Number,
        index: true,
    })
    appId: number;

    @Prop({
        type: Object || null,
        default: null,
    })
    requestPayload: any;

    @Prop({
        type: Date,
        default: new Date(),
    })
    createdAt: Date;
}

export const SearchAppSchema = SchemaFactory.createForClass(SearchApp);
