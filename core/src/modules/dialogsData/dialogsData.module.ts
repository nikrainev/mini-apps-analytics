import {
    Module,
} from '@nestjs/common';

import { DialogsDataService } from './dialogsData.service';
import { DialogsDataController } from './dialogsData.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from 'schemas/person.scheme';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { QdrantProvider } from 'providers/QdrantClient';
import { YandexMLProvider } from 'providers/YandexML';
import { DialogData, DialogDataSchema } from 'schemas/dialogData.scheme';
import { DialogStats, DialogStatsSchema } from 'schemas/dialogStats.scheme';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Person.name, schema: PersonSchema },
            { name: DialogData.name, schema: DialogDataSchema },
            { name: DialogStats.name, schema: DialogStatsSchema },
        ]),
        NestjsFormDataModule.config({ storage: MemoryStoredFile }),
    ],
    controllers: [DialogsDataController],
    providers: [
        DialogsDataService,
        QdrantProvider,
        YandexMLProvider,
    ],
    exports: [],
})

export class DialogsDataModule {}
