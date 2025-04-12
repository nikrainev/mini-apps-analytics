import {
    Module,
} from '@nestjs/common';

import { RagService } from './rag.service';
import { RagController } from './rag.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from 'schemas/person.scheme';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { QdrantProvider } from 'providers/QdrantClient';
import { YandexMLProvider } from 'providers/YandexML';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Person.name, schema: PersonSchema },
        ]),
        NestjsFormDataModule.config({ storage: MemoryStoredFile }),
    ],
    controllers: [RagController],
    providers: [
        RagService,
        QdrantProvider,
        YandexMLProvider,
    ],
    exports: [],
})

export class RagModule {}
