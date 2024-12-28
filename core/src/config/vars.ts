import 'dotenv/config';
import { parseNumber } from '../utils/parsers/parseNumber';
import { parseString } from '../utils/parsers/parseString';
import * as process from 'process';
import { AppEnv } from '../common/const/AppEnv';

export const vars = Object.freeze({
    port: parseNumber(process.env.PORT, 3001),
    appEnv: parseString(process.env.APP_ENV, AppEnv.Local),
    jwtSalt: parseString(process.env.JWT_SALT, ''),
    authApiUrl: parseString(process.env.AUTH_API_URL, ''),
    learningSocketApi: parseString(process.env.LEARNING_SOCKET_API_URL, ''),
    ipGeoInfoToken: parseString(process.env.IP_GEO_INFO_TOKEN, ''),
    recordingUserId: parseNumber(process.env.RECORDING_ROOM_SOCKET_USER_ID, -3412),
    liveKit: {
        host: parseString(process.env.LIVE_KIT_HOST, ''),
        apiKey: parseString(process.env.LIVE_KIT_API_KEY, ''),
        secretKey: parseString(process.env.LIVE_KIT_SECRET_KEY, ''),
        roomMaxParticipants: 100,
    },
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
    recordings: {
        defaultTemplateURL: parseString(process.env.RECORDING_DEFAUL_TEMPLATE_BASE_URL, ''),
        maxACLUpdateAttempts: 10,
        maxResultSentAttempts: 20,
        maxStartAttempts: 50,
        maxFindNotSavedAttempts: 10,
    },
    lesson: {
        defaultDurationS: 3000,
        IGLessonMaxDurationH: parseNumber(process.env.IG_LESSON_MAX_DURATION_HOURS, 5),
        increaseLessonDurationS: parseNumber(process.env.LESSON_DURATION_INCREASE_PARTITION_S, 600),
    },
    amoCrm: {
        baseUrl: parseString(process.env.AMO_CRM_BASE_URL, ''),
    },
    webClientURL: parseString(process.env.WEB_CLIENT_URL, ''),
    redis: {
        host: parseString(process.env.REDIS_HOST, ''),
        port: parseNumber(process.env.REDIS_PORT, 0),
        username: parseString(process.env.REDIS_USERNAME, ''),
        password: parseString(process.env.REDIS_PASSWORD, ''),
    },
});
