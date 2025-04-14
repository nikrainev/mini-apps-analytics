import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { vars } from '../config/vars';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import TelegramBot = require('node-telegram-bot-api')
import { MyLogger } from 'config/MyLogger';

const {
    meBotToken,
    botWebHookUrl,
} = vars.telegram;

@Injectable()
export class TelegramAPI {
    public client: TelegramBot;
    constructor(
        @Inject(forwardRef(() => MyLogger))
        private readonly logger: MyLogger,
    ) {
        this.client = new TelegramBot(meBotToken, {
            polling: false,
        });

        if (botWebHookUrl) {
            this.client.setWebHook(`${botWebHookUrl}/${botWebHookUrl}`);

            this.logger.log(`Tg Webhook set to ${botWebHookUrl}`);
        }
    }
}
