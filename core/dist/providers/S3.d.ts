import { S3Client } from '@aws-sdk/client-s3';
export declare class S3 {
    client: S3Client;
    constructor();
    checkIsObjectExist({ key, bucket, }: {
        key: string;
        bucket: string;
    }): Promise<{
        isExist: boolean;
        url: string;
        createdAt?: Date;
    }>;
    deleteFolderWithContent({ key, bucket, }: {
        key: string;
        bucket: string;
    }): Promise<void>;
}
