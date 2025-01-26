import mongoose, { HydratedDocument } from 'mongoose';
import { DateString } from '../common/types/app.types';
export type AppCenterQueryDocument = HydratedDocument<AppCenterQuery>;
export interface IAppCenterQuery {
    id?: mongoose.Types.ObjectId;
    _id?: mongoose.Types.ObjectId;
    query: string;
    createdAt: DateString;
}
export declare class AppCenterQuery {
    query: string;
    createdAt: Date;
}
export declare const AppCenterQuerySchema: mongoose.Schema<AppCenterQuery, mongoose.Model<AppCenterQuery, any, any, any, mongoose.Document<unknown, any, AppCenterQuery> & AppCenterQuery & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, AppCenterQuery, mongoose.Document<unknown, {}, mongoose.FlatRecord<AppCenterQuery>> & mongoose.FlatRecord<AppCenterQuery> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
