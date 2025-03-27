import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UserMePublic } from 'schemas/user.scheme';

export class CreateUserBody {
    @IsString()
    @Type(() => String)
    email: string;
    
    @IsString()
    @Type(() => String)
    firstname: string;

    @IsString()
    @Type(() => String)
    lastname: string;

    @IsString()
    @Type(() => String)
    password: string;
}

export interface CreateUserRes {
    user: UserMePublic,
    token: string,
}
