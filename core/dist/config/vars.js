"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vars = void 0;
require("dotenv/config");
const parseNumber_1 = require("../utils/parsers/parseNumber");
const parseString_1 = require("../utils/parsers/parseString");
const process = require("process");
const AppEnv_1 = require("../common/const/AppEnv");
exports.vars = Object.freeze({
    port: (0, parseNumber_1.parseNumber)(process.env.PORT, 3001),
    appEnv: (0, parseString_1.parseString)(process.env.APP_ENV, AppEnv_1.AppEnv.Local),
    jwtSalt: (0, parseString_1.parseString)(process.env.JWT_SALT, ''),
    mongo: {
        connectionString: (0, parseString_1.parseString)(process.env.MONGO_CONNECTION_STRING, ''),
    },
    s3: {
        accessKey: (0, parseString_1.parseString)(process.env.S3_ACCESS_KEY_ID, ''),
        secretKey: (0, parseString_1.parseString)(process.env.S3_SECRET_ACCESS_KEY, ''),
        recordingsBucketName: (0, parseString_1.parseString)(process.env.S3_RECORDINGS_BUCKET_NAME, ''),
        region: (0, parseString_1.parseString)(process.env.S3_REGION, ''),
        endpoint: (0, parseString_1.parseString)(process.env.S3_ENDPOINT, ''),
    },
    webClientURL: (0, parseString_1.parseString)(process.env.WEB_CLIENT_URL, ''),
    redis: {
        host: (0, parseString_1.parseString)(process.env.REDIS_HOST, ''),
        port: (0, parseNumber_1.parseNumber)(process.env.REDIS_PORT, 0),
        username: (0, parseString_1.parseString)(process.env.REDIS_USERNAME, ''),
        password: (0, parseString_1.parseString)(process.env.REDIS_PASSWORD, ''),
    },
    tgToken: '7300312946:AAFFhFnNELkqqZO_ND4MvuxdMTzpZv15nDw'
});
//# sourceMappingURL=vars.js.map