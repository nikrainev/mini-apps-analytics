import { Injectable } from '@nestjs/common';

import { vars } from '../config/vars';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import TelegramBot = require('node-telegram-bot-api')

@Injectable()
export class TelegramAPI {
    public client: TelegramBot;
    constructor() {
        this.client = new TelegramBot(vars.telegram.meBotToken, {
            polling: false,
        });
    }
}
