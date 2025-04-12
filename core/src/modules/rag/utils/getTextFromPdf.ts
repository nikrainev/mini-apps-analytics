import * as pdfE from 'pdf.js-extract';

import { MemoryStoredFile } from 'nestjs-form-data';

export const getTextFromPdf = async ({
    file,
}:{
    file: MemoryStoredFile,
}):Promise<string[]> => {
    const pdfExtract = new pdfE.PDFExtract();
    const options = {};

    return new Promise((res) => {
        pdfExtract.extractBuffer(file.buffer, options, (err, data) => {
            if (err) return res([]);

            res(data?.pages.map((p) => {
                let strResult = '';
                let lastY = 0;

                p.content.forEach((c) => {
                    if (c.y !== lastY) {
                        lastY = c.y;
                        strResult = strResult + ' \n' + c.str;
                    }
                    strResult = strResult + c.str;
                });

                return strResult;
            }) || []);
        });
    });
};