import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePersonBody, CreatePersonRes } from './requests/createPerson.request';
import { GetPersonsReq, GetPersonsRes } from './requests/getPersons.request';
import { GetPersonParams, GetPersonRes } from './requests/getPerson.request';
import { Person, PersonDocument, PersonPublic } from 'schemas/person.scheme';

export class PersonService {
    constructor(
        @InjectModel(Person.name)
        private personModel: Model<PersonDocument>,
    ) {}

    async createPerson({
        title,
        desc,
    }:CreatePersonBody, meUserId:string):Promise<CreatePersonRes> {
        const newPerson = new this.personModel({
            title,
            desc,
            ownerUserId: meUserId,
            createdAt: new Date(),
        });

        await newPerson.save();

        return {
            person: new PersonPublic(newPerson),
        };
    }

    async getPerson({ personId }:GetPersonParams):Promise<GetPersonRes> {
        const person = await this.personModel.findOne({
            _id: personId,
        }).exec();

        return {
            person: person?.toObject() as PersonDocument,
        };
    }

    async getPersons({ meUserId }:GetPersonsReq):Promise<GetPersonsRes> {
        const persons = await this.personModel.find({
            ownerUserId: meUserId,
        }).exec();

        return {
            persons: persons.map((p) => new PersonPublic(p)),
        };
    }
}
