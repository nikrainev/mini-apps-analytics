"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3 = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const vars_1 = require("../config/vars");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const { s3: { region, accessKey, secretKey, endpoint, }, } = vars_1.vars;
let S3 = class S3 {
    constructor() {
        this.client = new client_s3_1.S3Client({
            forcePathStyle: false,
            endpoint: endpoint,
            region,
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secretKey,
            },
        });
    }
    async checkIsObjectExist({ key, bucket, }) {
        try {
            const result = await this.client.send(new client_s3_1.HeadObjectCommand({
                Key: key,
                Bucket: bucket,
            }));
            const url = await (0, s3_request_presigner_1.getSignedUrl)(this.client, new client_s3_1.GetObjectCommand({
                Key: key,
                Bucket: bucket,
            }), { expiresIn: 0 });
            return {
                isExist: true,
                url: url?.split('?')?.[0] || '',
                createdAt: result.LastModified,
            };
        }
        catch (e) {
            return {
                isExist: false,
                url: '',
                createdAt: undefined,
            };
        }
    }
    async deleteFolderWithContent({ key, bucket, }) {
        const DeletePromises = [];
        const { Contents } = await this.client.send(new client_s3_1.ListObjectsCommand({
            Bucket: bucket,
            Prefix: key,
        }));
        if (!Contents)
            return;
        Contents.forEach(({ Key }) => {
            DeletePromises.push(this.client.send(new client_s3_1.DeleteObjectCommand({
                Bucket: bucket,
                Key,
            })));
        });
        await Promise.all(DeletePromises);
    }
};
exports.S3 = S3;
exports.S3 = S3 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], S3);
//# sourceMappingURL=S3.js.map