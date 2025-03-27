import { PersonPublic } from 'schemas/person.scheme';

export interface GetPersonsReq {
    meUserId: string,
}

export interface GetPersonsRes {
    persons: PersonPublic[]
}