import { Injectable } from '@nestjs/common';
import {
    S3Client,
} from '@aws-sdk/client-s3';

import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import readline from "readline";

const apiId = 123456;
const apiHash = "123456abcdfg";
const stringSession = new StringSession(""); // fill this later with the value from session.save()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

@Injectable()
export class MtProtoTG {
    public client: S3Client;
    constructor () {
        const client = new TelegramClient(stringSession, apiId, apiHash, {
            connectionRetries: 5,
        });
    }

}
