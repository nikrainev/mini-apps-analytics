import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PersonPublic } from 'schemas/person.scheme';

export class GetPersonParams {
    @IsString()
    @Type(() => String)
    personId: string;
}

export interface GetPersonRes {
    person: PersonPublic
}
