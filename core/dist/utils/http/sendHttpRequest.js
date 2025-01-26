"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendHttpRequest = void 0;
const axios_1 = require("axios");
const sendHttpRequest = (args) => {
    const { url, method, data, params, headers, cancelToken, onUploadProgress, onDownloadProgress, } = args;
    return (0, axios_1.default)({
        url,
        method,
        data,
        params,
        headers,
        cancelToken,
        onUploadProgress,
        onDownloadProgress,
    });
};
exports.sendHttpRequest = sendHttpRequest;
//# sourceMappingURL=sendHttpRequest.js.map