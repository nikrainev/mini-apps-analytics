import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import {
    HasMimeType,
    IsFile,
    MemoryStoredFile,
} from 'nestjs-form-data';
import { SUPPORTED_FILE_MIME_TYPES } from '../const/SUPPORTED_FILE_MIME_TYPES';

export class UploadFileParams {
    @IsString()
    @Type(() => String)
    personId: string;
}

export class UploadFileBody {
    @IsFile()
    @HasMimeType(SUPPORTED_FILE_MIME_TYPES)
    file: MemoryStoredFile;

    @IsString()
    title: string;
}

export interface UploadFileRes {
    personId: string;
    fileText: string[],
}
