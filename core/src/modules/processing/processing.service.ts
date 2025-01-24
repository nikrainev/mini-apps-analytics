import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const MTProto = require('@mtproto/core');

export class ProcessingService  {
    constructor() {}

    async getBotInfo():Promise<any> {
        const api_id = 21155184;
        const api_hash = '26563d0ac8029e4f6787f50edad5f5b2';

        const mtproto = new MTProto({
            api_id,
            api_hash,

            storageOptions: {
                path: path.resolve(__dirname, './data/1.json'),
            },
        });

        mtproto.call('bots.getBotInfo', {

        }).then((result:any) => {
            console.log('country:', result.country);
        });
    }
}
