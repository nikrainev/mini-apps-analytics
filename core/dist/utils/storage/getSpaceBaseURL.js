"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpaceBaseURL = void 0;
const getSpaceBaseURL = ({ bucket, endpoint, }) => {
    const endpointSplit = endpoint.split('//');
    return `${endpointSplit[0]}//${bucket}.${endpointSplit[1]}`;
};
exports.getSpaceBaseURL = getSpaceBaseURL;
//# sourceMappingURL=getSpaceBaseURL.js.map