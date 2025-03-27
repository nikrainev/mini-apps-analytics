import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UserMePublic } from 'schemas/user.scheme';

export class GetMeParams {
    @IsString()
    @Type(() => String)
    token: string;
}

export interface GetMeRes {
    user: UserMePublic
}
