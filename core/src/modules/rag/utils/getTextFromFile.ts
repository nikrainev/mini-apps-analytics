import { MemoryStoredFile } from 'nestjs-form-data';
import { SupportedFileTypes } from '../const/SUPPORTED_FILE_MIME_TYPES';
import { getTextFromPdf } from './getTextFromPdf';

export const getTextFromFile = async ({
    file,
}:{
    file: MemoryStoredFile,
}):Promise<string[]> => {
    switch (file.mimeType) {
        case SupportedFileTypes.TXT:
            return [file.buffer.toString()];
        case SupportedFileTypes.PDF:
            return getTextFromPdf({
                file,
            });
        default:
            return [];
    }
};