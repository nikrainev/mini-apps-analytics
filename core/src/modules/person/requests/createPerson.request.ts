import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PersonPublic } from 'schemas/person.scheme';

export class CreatePersonBody {
    @IsString()
    @Type(() => String)
    title: string;

    @IsString()
    @Type(() => String)
    desc: string;
}

export interface CreatePersonRes {
    person: PersonPublic
}
