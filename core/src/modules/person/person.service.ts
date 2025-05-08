import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePersonBody, CreatePersonRes } from './requests/createPerson.request';
import { GetPersonsReq, GetPersonsRes } from './requests/getPersons.request';
import { GetPersonParams, GetPersonRes } from './requests/getPerson.request';
import { Person, PersonDocument, PersonPublic } from 'schemas/person.scheme';
import { PERSON_KNOWLEDGE_COLLECTION } from 'common/const/VECTOR_COLLECTIONS_NAMES';
import { forwardRef, Inject } from '@nestjs/common';
import { QdrantProvider } from 'providers/QdrantClient';

export class PersonService {
    constructor(
        @InjectModel(Person.name)
        private personModel: Model<PersonDocument>,
        @Inject(forwardRef(() => QdrantProvider))
        private readonly qdrantProvider: QdrantProvider,
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

        await this.qdrantProvider.client.createCollection(PERSON_KNOWLEDGE_COLLECTION({
            personId: newPerson.id,
        }), {
            vectors: {
                size: 256,
                distance: 'Cosine',
            },
            sparse_vectors: {
                'sparse-vector-name': {
                    index: {
                        on_disk: false,
                    },
                },
            },
        });

        await newPerson.save();

        return {
            person: new PersonPublic(newPerson),
        };
    }

    async getPerson({ personId }:GetPersonParams):Promise<GetPersonRes> {
        const person = await this.personModel.findOne({
            _id: personId,
        });

        return {
            person: new PersonPublic(person as PersonDocument),
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
