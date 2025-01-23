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
    tgToken: '7300312946:AAFFhFnNELkqqZO_ND4MvuxdMTzpZv15nDw'
});
