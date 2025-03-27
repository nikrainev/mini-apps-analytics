import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UserMePublic } from 'schemas/user.scheme';

export class LoginMeBody {
    @IsString()
    @Type(() => String)
    email: string;

    @IsString()
    @Type(() => String)
    password: string;
}

export interface LoginMeRes {
    user: UserMePublic,
    token: string,
}
