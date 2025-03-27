import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DateString } from '../common/types/app.types';
import { UserRole } from '../common/const/user/USER_ROLES';

export type UserDocument = HydratedDocument<User>;

export interface IUser {
    id?: mongoose.Types.ObjectId;
    _id?: mongoose.Types.ObjectId;
    email: string,
    firstname: string,
    lastname: string,
    password: string,
    createdAt: DateString,
}

@Schema({
    toObject: {
        getters: true,
    },
})

@Schema()
export class User {
    @Prop({
        type: String,
        match: /^\S+@\S+\.\S+$/,
        unique: true,
        trim: true,
        sparse: true,
        lowercase: true,
        index: true,
    })
    email: string;

    @Prop([{
        type: String,
        required: true,
    }])
    roles: UserRole[];

    @Prop({
        type: String,
        required: true,
    })
    firstname: string;

    @Prop({
        type: String,
        required: true,
    })
    lastname: string;

    @Prop({
        type: String,
        required: true,
    })
    password: string;

    @Prop({
        type: Date,
        default: new Date(),
    })
    createdAt: Date;
}

export class UserMePublic {
    constructor(user:UserDocument) {
        this.id = user.id;
        this.email = user.email;
        this.firstname = user.firstname;
        this.lastname = user.lastname;
    }

    id: mongoose.Types.ObjectId;
    email: string;
    firstname: string;
    lastname: string;
    createdAt: DateString;
}

export const UserSchema = SchemaFactory.createForClass(User);
