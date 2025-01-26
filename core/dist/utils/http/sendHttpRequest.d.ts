import { Method, CancelToken } from 'axios';
interface IArgs {
    method: Method;
    url: string;
    data: any;
    params?: Record<string, any>;
    headers?: Record<string, any>;
    cancelToken?: CancelToken;
    onUploadProgress?: (progressEvent: any) => void;
    onDownloadProgress?: (progressEvent: any) => void;
}
export declare const sendHttpRequest: (args: IArgs) => Promise<any>;
export {};
