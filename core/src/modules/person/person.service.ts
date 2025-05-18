import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePersonBody, CreatePersonRes } from './requests/createPerson.request';
import { GetPersonsReq, GetPersonsRes } from './requests/getPersons.request';
import { GetPersonParams, GetPersonRes } from './requests/getPerson.request';
import { Person, PersonDocument, PersonPublic } from 'schemas/person.scheme';
import { PERSON_DIALOGS_COLLECTION, PERSON_KNOWLEDGE_COLLECTION } from 'common/const/VECTOR_COLLECTIONS_NAMES';
import { forwardRef, Inject } from '@nestjs/common';
import { QdrantProvider } from 'providers/QdrantClient';
import { DialogStats, DialogStatsDocument, DialogStatsPublic } from 'schemas/dialogStats.scheme';

export class PersonService {
    constructor(
        @InjectModel(Person.name)
        private personModel: Model<PersonDocument>,
        @Inject(forwardRef(() => QdrantProvider))
        private readonly qdrantProvider: QdrantProvider,
        @InjectModel(DialogStats.name)
        private dialogStatsModel: Model<DialogStatsDocument>,
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

        await this.qdrantProvider.client.createCollection(PERSON_DIALOGS_COLLECTION({
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

        const dialogStats = await this.dialogStatsModel.find({
            personId: new mongoose.Types.ObjectId(personId),
        });

        return {
            person: new PersonPublic(person as PersonDocument),
            dialogs: dialogStats.map((d) => new DialogStatsPublic(d as DialogStatsDocument)),
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
