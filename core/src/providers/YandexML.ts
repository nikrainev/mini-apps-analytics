import { YandexGPTEmbeddings } from '@langchain/yandex/embeddings';

import { Injectable } from '@nestjs/common';
import { vars } from 'config/vars';

const {
    yandex,
} = vars;

@Injectable()
export class YandexMLProvider {
    public embeddings: YandexGPTEmbeddings;
    constructor() {
        this.embeddings = new YandexGPTEmbeddings({
            apiKey: yandex.apiToken,
            folderID: yandex.mlFolderId,
        });
    }
}
