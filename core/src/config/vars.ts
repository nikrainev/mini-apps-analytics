import 'dotenv/config';
import { parseNumber } from '../utils/parsers/parseNumber';
import { parseString } from '../utils/parsers/parseString';
import * as process from 'process';
import { AppEnv } from '../common/const/AppEnv';

export const vars = Object.freeze({
    port: parseNumber(process.env.PORT, 3001),
    appEnv: parseString(process.env.APP_ENV, AppEnv.Local),
    jwtSalt: parseString(process.env.JWT_SALT, ''),
    mongo: {
        connectionString: parseString(process.env.MONGO_CONNECTION_STRING, ''),
    },
    s3: {
        accessKey: parseString(process.env.S3_ACCESS_KEY_ID, ''),
        secretKey: parseString(process.env.S3_SECRET_ACCESS_KEY, ''),
        recordingsBucketName: parseString(process.env.S3_RECORDINGS_BUCKET_NAME, ''),
        region: parseString(process.env.S3_REGION, ''),
        endpoint: parseString(process.env.S3_ENDPOINT, ''),
    },
    webClientURL: parseString(process.env.WEB_CLIENT_URL, ''),
    redis: {
        host: parseString(process.env.REDIS_HOST, ''),
        port: parseNumber(process.env.REDIS_PORT, 0),
        username: parseString(process.env.REDIS_USERNAME, ''),
        password: parseString(process.env.REDIS_PASSWORD, ''),
    },
    qdrant: {
        url: parseString(process.env.QDRANT_URL, ''),
        apiKey: parseString(process.env.QDRANT_API_KEY, ''),
    },
    yandex: {
        apiToken: parseString(process.env.YANDEX_API_TOKEN, ''),
        mlFolderId:  parseString(process.env.YANDEX_ML_FOLDER_ID, ''),
    },
    nebius: {
        secretKey: parseString(process.env.NEBIUS_SECRET_KEY, ''),
        baseUrl: parseString(process.env.NEBIUS_BASE_URL, ''),
    },
    telegram: {
        meBotToken: parseString(process.env.ME_BOT_TOKEN, ''),
        botWebHookUrl: parseString(process.env.TG_BOT_WEBHOOK, ''),
    },
    openRouter: {
        key: parseString(process.env.OPENROUTER_API_KEY, ''),
    },
    meUserId: parseString(process.env.ME_USER_ID, ''),
    openAI: {
        key: parseString(process.env.OPENAI_API_KEY, ''),
    },
});