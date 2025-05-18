import {
    Module,
} from '@nestjs/common';

import { PersonService } from './person.service';
import { PersonsController } from './person.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from 'schemas/person.scheme';
import { QdrantProvider } from 'providers/QdrantClient';
import { DialogStats, DialogStatsSchema } from 'schemas/dialogStats.scheme';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Person.name, schema: PersonSchema },
            { name: DialogStats.name, schema: DialogStatsSchema },
        ]),
    ],
    controllers: [PersonsController],
    providers: [
        PersonService,
        QdrantProvider,
    ],
    exports: [],
})

export class PersonModule {}
