import {
    useCallback,
    useRef,
    useState,
} from 'react';

import { CancelTokenSource } from 'axios';

import {
    RequestMethod,
    RequestStatuses,
} from '@/shared/const/http';
import { isFunction } from '@/shared/utils/helpers/isFunction';
import {
    generateHttpRequestCancelSource,
    sendHttpRequest,
} from '@/shared/utils/http/sendHttpRequest';

export type RequestFunc<Req extends Record<string, any>> = (data?: Req, options?: any) => Promise<any>;

export interface IRequest<Req extends Record<string, any>> {
    data?: Req;
    formData?: Record<string, unknown>;
    id?: string;
    nestedId?:  Record<string, string>;
    params?: Record<string, string | number>;
    requestData?: any;
}

interface IRequestOptions {
    ignoreErrors?: boolean;
}

interface GetUrlOptions {
    id?: string;
    nestedId?: Record<string, string>;
    url?: any;
}

export interface IResponseError {
    code: string;
    message?: string;
    data?: any;
}

type ReqBase = Record<string, any>

export interface IResponse<Req extends ReqBase, Res extends ReqBase> {
    errors?: [IResponseError] | [],
    isProcessing?: boolean,
    request: IRequest<Req>,
    result: Res,
    status: RequestStatuses,
}

type UrlFunc = (id:Record<string, string>) => string;

interface IOptions {
    url: string | UrlFunc;
    method: RequestMethod;
    withAbort?: boolean;
    formatData?: (data: any) => any;
}

const DEFAULT_STATE: IResponse<ReqBase, ReqBase> = {
    status: RequestStatuses.Initial,
    isProcessing: false,
    result: {},
    errors: [],
    request: {
        requestData: {},
    },
};

function getUrl({ url, id, nestedId }:GetUrlOptions) {
    if (isFunction(url)) {
        if (nestedId) {
            return url(nestedId);
        }
        return url({ id });
    }
    if (id) {
        return `${url}/${id}`;
    }
    return url;
}

export const useRequest = <Req extends ReqBase, Res extends ReqBase>({
    url,
    method, 
    withAbort,
    formatData
}: IOptions):{
    state: IResponse<Req, Res>,
    onRequest: RequestFunc<Req>,
    onClearState: () => void
} => {
    const [state, setState] = useState<IResponse<ReqBase, ReqBase>>(DEFAULT_STATE);
    const abortController = useRef<CancelTokenSource>(null);

    const send = useCallback(
        async (request: IRequest<Req> = {}, { ignoreErrors }: IRequestOptions = {}) => {
            const { data, id, params, nestedId } = request;

            if (withAbort && abortController.current) {
                abortController.current.cancel();
            }
            abortController.current = generateHttpRequestCancelSource();

            setState({
                ...DEFAULT_STATE,
                isProcessing: true,
                status: RequestStatuses.Processing,
                request,
            });

            try {
                const result = await sendHttpRequest({
                    url: getUrl({ url, id, nestedId }),
                    method,
                    data,
                    params,
                    cancelToken: abortController.current?.token,
                });
                setState({
                    ...DEFAULT_STATE,
                    isProcessing: false,
                    status: RequestStatuses.Succeeded,
                    result,
                    request,
                });
                return result;
            } catch (e:any) {
                if (e?.name !== 'AbortError') {
                    let status = RequestStatuses.Failed;

                    if (e[0]?.statusCode === 401) {
                        status = RequestStatuses.Unauthorized;
                    }

                    setState({
                        ...DEFAULT_STATE,
                        isProcessing: false,
                        status,
                        errors: e?.errors || e,
                        request,
                    });
                    if (!ignoreErrors) {
                        throw e?.errors || e;
                    }
                }
                return null;
            }
        },
        [url, method, withAbort],
    );

    const onRequest: RequestFunc<Req> = useCallback(
        (data: IRequest<Req> = {}, options: IRequestOptions = {}) => {
            if (formatData) {
                const prepared = formatData(data);
                return send(prepared, options);
            }
            return send(data, options);
        },
        [formatData, send],
    );

    const onClearState = useCallback(() => {
        setState(DEFAULT_STATE);
    }, []);

    return {
        state:state as IResponse<Req, Res>,
        onRequest,
        onClearState,
    };
};
