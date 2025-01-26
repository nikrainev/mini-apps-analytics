import mongoose, { HydratedDocument } from 'mongoose';
import { DateString } from '../common/types/app.types';
export type AppPathDocument = HydratedDocument<AppPath>;
export interface IAppPath {
    id?: mongoose.Types.ObjectId;
    _id?: mongoose.Types.ObjectId;
    appId: number;
    url: string;
    path: string;
    title: string;
    description: string;
    createdAt: DateString;
    updatedAt: DateString;
    publishedAt: DateString;
}
export declare class AppPath {
    appId: number;
    url: string;
    path: string;
    createdAt: Date;
}
export declare const AppPathSchema: mongoose.Schema<AppPath, mongoose.Model<AppPath, any, any, any, mongoose.Document<unknown, any, AppPath> & AppPath & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, AppPath, mongoose.Document<unknown, {}, mongoose.FlatRecord<AppPath>> & mongoose.FlatRecord<AppPath> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
