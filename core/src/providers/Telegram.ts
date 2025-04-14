import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { vars } from '../config/vars';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import TelegramBot = require('node-telegram-bot-api')
import { MyLogger } from 'config/MyLogger';

import { } from 'node-telegram-bot-api';

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
            const hookUrl = `${botWebHookUrl}/${meBotToken}`;
            this.client.setWebHook(hookUrl);

            this.logger.log(`Tg Webhook set to ${hookUrl}`);
        }
    }
}
