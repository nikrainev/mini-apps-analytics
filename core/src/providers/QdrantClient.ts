import { QdrantClient } from '@qdrant/js-client-rest';

import { Injectable } from '@nestjs/common';
import { vars } from 'config/vars';

const {
    qdrant,
} = vars;

@Injectable()
export class QdrantProvider {
    public client: QdrantClient;
    constructor() {
        this.client = new QdrantClient({
            url: qdrant.url,
            apiKey: qdrant.apiKey,
        });
    }
}
