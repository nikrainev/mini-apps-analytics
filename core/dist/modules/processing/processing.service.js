"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessingService = void 0;
const path_1 = require("path");
const MTProto = require('@mtproto/core');
class ProcessingService {
    constructor() { }
    async getBotInfo() {
        const api_id = 21155184;
        const api_hash = '26563d0ac8029e4f6787f50edad5f5b2';
        const mtproto = new MTProto({
            api_id,
            api_hash,
            storageOptions: {
                path: path_1.default.resolve(__dirname, './data/1.json'),
            },
        });
        mtproto.call('bots.getBotInfo', {}).then((result) => {
            console.log('country:', result.country);
        });
    }
}
exports.ProcessingService = ProcessingService;
//# sourceMappingURL=processing.service.js.map