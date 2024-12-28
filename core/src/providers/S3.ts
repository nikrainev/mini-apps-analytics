import { Injectable } from '@nestjs/common';
import {
    HeadObjectCommand,
    S3Client,
    GetObjectCommand,
    DeleteObjectCommandOutput,
    ListObjectsCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import { vars } from '../config/vars';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const {
    s3: {
        region,
        accessKey,
        secretKey,
        endpoint,
    },
} = vars;

@Injectable()
export class S3 {
    public client: S3Client;
    constructor() {
        this.client = new S3Client({
            forcePathStyle: false,
            endpoint: endpoint,
            region,
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secretKey,
            },
        });
    }

    public async checkIsObjectExist({
        key, bucket,
    }:{ key:string, bucket:string }):Promise<{
        isExist: boolean,
        url: string,
        createdAt?: Date,
    }> {
        try {
            const result = await this.client.send(new HeadObjectCommand({
                Key: key,
                Bucket: bucket,
            }));

            const url = await getSignedUrl(this.client, new GetObjectCommand({
                Key: key,
                Bucket: bucket,
            }), { expiresIn: 0 });

            return {
                isExist: true,
                url: url?.split('?')?.[0] || '',
                createdAt: result.LastModified,
            };
        } catch (e) {
            return {
                isExist: false,
                url: '',
                createdAt: undefined,
            };
        }
    }

    public async deleteFolderWithContent({
        key, bucket,
    }:{ key:string, bucket:string }) {
        const DeletePromises: Promise<DeleteObjectCommandOutput>[] = [];
        const { Contents } = await this.client.send(
            new ListObjectsCommand({
                Bucket: bucket,
                Prefix: key,
            }),
        );
        if (!Contents) return;
        Contents.forEach(({ Key }) => {
            DeletePromises.push(
                this.client.send(
                    new DeleteObjectCommand({
                        Bucket: bucket,
                        Key,
                    }),
                ),
            );
        });

        await Promise.all(DeletePromises);
    }
}
