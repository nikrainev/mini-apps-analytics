import mongoose, { HydratedDocument } from 'mongoose';
import { DateString } from '../common/types/app.types';
export type SearchAppDocument = HydratedDocument<SearchApp>;
export interface ISearchApp {
    id?: mongoose.Types.ObjectId;
    _id?: mongoose.Types.ObjectId;
    appId: number;
    requestPayload: any;
    createdAt: DateString;
}
export declare class SearchApp {
    appId: number;
    requestPayload: any;
    createdAt: Date;
}
export declare const SearchAppSchema: mongoose.Schema<SearchApp, mongoose.Model<SearchApp, any, any, any, mongoose.Document<unknown, any, SearchApp> & SearchApp & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, SearchApp, mongoose.Document<unknown, {}, mongoose.FlatRecord<SearchApp>> & mongoose.FlatRecord<SearchApp> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
