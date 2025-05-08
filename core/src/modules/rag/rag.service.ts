import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Person, PersonDocument } from 'schemas/person.scheme';
import { UploadFileBody, UploadFileRes } from './requests/uploadFile.request';
import { forwardRef, Inject } from '@nestjs/common';
import { QdrantProvider } from 'providers/QdrantClient';
import { getTextFromFile } from './utils/getTextFromFile';
import { YandexMLProvider } from 'providers/YandexML';
import { PERSON_KNOWLEDGE_COLLECTION } from '../../common/const/VECTOR_COLLECTIONS_NAMES';
import { v4 as uuidv4 } from 'uuid';

export class RagService {
    constructor(
        @InjectModel(Person.name)
        private personModel: Model<PersonDocument>,
        @Inject(forwardRef(() => QdrantProvider))
        private readonly qdrantProvider: QdrantProvider,
        @Inject(forwardRef(() => YandexMLProvider))
        private readonly yandexML: YandexMLProvider,
    ) {}

    async uploadFile(personId:string, meUserId:string, body:UploadFileBody):Promise<UploadFileRes> {
        const fileText = await getTextFromFile({
            file: body.file,
        });

        const getEnbeddingsPromise = fileText.map((f) => this.yandexML.embeddings.embedDocuments([f]));

        const embeddings = await Promise.all(getEnbeddingsPromise);

        await this.qdrantProvider.client.upsert(PERSON_KNOWLEDGE_COLLECTION({
            personId: personId,
        }), {
            points: embeddings.map((e) => e[0]).map((e ,index) => ({
                id: uuidv4(),
                payload: {
                    text: fileText[index],
                },
                vector: e,
            })),
        });

        await this.personModel.updateOne({
            _id: personId,
        }, {
            $push: {
                knowledge: {
                    title: body.title,
                    fileName: body.file.originalName,
                    createdAt: new Date(),
                },
            },
        });

        return {
            personId,
            fileText,
        };
    }
}
