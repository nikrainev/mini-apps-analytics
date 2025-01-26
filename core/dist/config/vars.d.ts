import 'dotenv/config';
export declare const vars: Readonly<{
    port: number;
    appEnv: string;
    jwtSalt: string;
    mongo: {
        connectionString: string;
    };
    s3: {
        accessKey: string;
        secretKey: string;
        recordingsBucketName: string;
        region: string;
        endpoint: string;
    };
    webClientURL: string;
    redis: {
        host: string;
        port: number;
        username: string;
        password: string;
    };
    tgToken: "7300312946:AAFFhFnNELkqqZO_ND4MvuxdMTzpZv15nDw";
}>;
