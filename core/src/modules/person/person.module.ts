import {
    Module,
} from '@nestjs/common';

import { PersonService } from './person.service';
import { PersonsController } from './person.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from 'schemas/person.scheme';
import { QdrantProvider } from 'providers/QdrantClient';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Person.name, schema: PersonSchema },
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
