import * as bcrypt from 'bcrypt';

import { ILogOutReq } from './requests/logout.request';
import { LoginMeBody } from './requests/loginMe.request';
import { CreateUserBody, CreateUserRes } from './requests/createUser.request';
import { Model } from 'mongoose';
import { User, UserDocument, UserMePublic } from 'schemas/user.scheme';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { vars } from '../../config/vars';
import { UserRoles } from '../../common/const/user/USER_ROLES';
import { UserNotFoundError } from '../../common/errors/Auth.errors';

const HASH_ROUNDS = 10;

export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        private jwtService: JwtService
    ) {}

    async createUser({
        email, password, lastname, firstname,
    }:CreateUserBody):Promise<CreateUserRes> {
        const passwordSalt = await bcrypt.hash(password, HASH_ROUNDS);

        const newUser = new this.userModel({
            email: email,
            firstname: firstname,
            lastname: lastname,
            createdAt: new Date(),
            roles: [UserRoles.Customer],
            password: passwordSalt,
        });
        
        await newUser.save();

        const token = this.jwtService.sign({
            roles: [UserRoles.Customer],
            userId: newUser.id,
        }, {
            secret: vars.jwtSalt,
            expiresIn: '7d',
        });
        
        return {
            user: new UserMePublic(newUser),
            token,
        };
    }
    
    async loginMe({ email, password }:LoginMeBody):Promise<CreateUserRes> {
        const meUser = await this.userModel.findOne({
            email: email,
        });

        if (!meUser) {
            throw new UserNotFoundError();
        }
        const passwordSalt = await bcrypt.hash(password, HASH_ROUNDS);

        const isMatch = await bcrypt.compare(password, passwordSalt);

        if (!isMatch) {
            throw new UserNotFoundError();
        }

        const token = this.jwtService.sign({
            roles: [UserRoles.Customer],
            userId: meUser.id,
        }, {
            secret: vars.jwtSalt,
            expiresIn: '7d',
        });

        return {
            token,
            user: new UserMePublic(meUser),
        };
    }
    
    async logOut({ userId }:ILogOutReq):Promise<void> {
        return;
    }
}
