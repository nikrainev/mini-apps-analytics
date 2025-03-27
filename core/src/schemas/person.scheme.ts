import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DateString } from '../common/types/app.types';
import {UserDocument} from "./user.scheme";

export type PersonDocument = HydratedDocument<Person>;

export interface IPerson {
    id?: mongoose.Types.ObjectId;
    _id?: mongoose.Types.ObjectId;
    title: string;
    desc: string;
    createdAt: DateString;
}

@Schema({
    toObject: {
        getters: true,
    },
})

@Schema()
export class Person {
    @Prop({
        type: String,
        required: true,
    })
    title: string;

    @Prop({
        type: String,
        required: true,
    })
    desc: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    })
    ownerUserId: string;

    @Prop({
        type: Date,
        default: new Date(),
        required: true,
    })
    createdAt: Date;
}

export class PersonPublic {
    constructor(person:PersonDocument) {
        this.id = person.id;
        this.title = person.title;
        this.desc = person.desc;
        this.createdAt = person.createdAt?.toISOString();
    }

    id: mongoose.Types.ObjectId;
    title: string;
    desc: string;
    createdAt: DateString;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
