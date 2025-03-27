import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PersonDocument } from 'schemas/person.scheme';

export class GetPersonParams {
    @IsString()
    @Type(() => String)
    personId: string;
}

export interface GetPersonRes {
    person: PersonDocument
}
