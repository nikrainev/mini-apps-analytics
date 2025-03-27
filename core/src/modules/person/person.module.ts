import {
    Module,
} from '@nestjs/common';

import { PersonService } from './person.service';
import { PersonsController } from './person.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from 'schemas/person.scheme';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Person.name, schema: PersonSchema },
        ]),
    ],
    controllers: [PersonsController],
    providers: [
        PersonService,
    ],
    exports: [],
})

export class PersonModule {}
