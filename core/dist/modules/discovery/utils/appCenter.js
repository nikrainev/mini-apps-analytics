"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchApi = void 0;
const searchApi = async ({ query, }) => {
    const url = 'https://tappscenter.org/api/applications';
    const body = {
        'value': query,
        'filters': {
            'platforms': {
                'name': {
                    '$eq': 'weba',
                },
            },
        },
    };
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
};
exports.searchApi = searchApi;
//# sourceMappingURL=appCenter.js.map