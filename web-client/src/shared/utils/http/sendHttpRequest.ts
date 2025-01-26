import axios from 'axios';

import { RequestMethod } from '@/shared/const/http';

export function generateHttpRequestCancelSource() {
    return axios.CancelToken.source();
}

interface IOptions {
    method: RequestMethod;
    url: string;
    data?: Record<string, any>;
    formData?: any;
    params?: any;
    headers?: Record<string, string>;
    onUploadProgress?: ((progressEvent: any) => void) | undefined;
    cancelToken?: any;
}

export async function sendHttpRequest(options: IOptions) {
    const { method = 'get', url, data, formData, params, headers, onUploadProgress, cancelToken } = options ?? {};

    try {
        const response = formData
            ? await axios[method](url, formData, {
                data,
                params,
                headers,
                onUploadProgress,
                cancelToken,
            })
            : await axios({
                url,
                method,
                data,
                params,
                headers,
                onUploadProgress,
                cancelToken,
            });

        return response.data;
    } catch (e:any) {
        throw e.response?.data;
    }
}

export async function sendAxiosRequest(options: IOptions): Promise<any> {
    const {
        method = 'get',
        url,
        data,
        params,
        headers,
        onUploadProgress,
        cancelToken,
    } = options;

    return axios({
        url,
        method,
        data,
        params,
        headers,
        onUploadProgress,
        cancelToken,
    });
}