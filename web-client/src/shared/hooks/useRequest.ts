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
    IReqOptions
} from '@/shared/utils/http/sendHttpRequest';

export type RequestFunc<Req> = (data?: IRequest<Req>, options?: Record<string, any>) => Promise<unknown>;

export interface IRequest<Req> extends ReqBase<Req> {
    data?: Req;
    formData?: FormData,
    id?: string;
    nestedId?:  Record<string, string>;
    params?: Record<string, string | number | undefined>;
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

type ReqBase<R> = { data?: R } & Record<string, any>

export interface IResponse<Req, Res> {
    errors?: [IResponseError] | [],
    isProcessing?: boolean,
    request: IRequest<ReqBase<Req>>,
    result: {
        data: Res
    },
    status: RequestStatuses,
}

type UrlFunc = (id:Record<string, string>) => string;

interface IOptions {
    url: string | UrlFunc;
    method: RequestMethod;
    withAbort?: boolean;
    formatData?: (data: any) => any;
}

const DEFAULT_STATE: IResponse<any, any> = {
    status: RequestStatuses.Initial,
    isProcessing: false,
    result: {
        data: {}
    },
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

export const useRequest = <Req, Res>({
    url,
    method,
    withAbort,
    formatData
}:IOptions):{
    state: IResponse<Req, Res>,
    onRequest: RequestFunc<Req>,
    onClearState: () => void
} => {
    const [state, setState] = useState<IResponse<Req, ReqBase<Res>>>(DEFAULT_STATE);
    const abortController = useRef<CancelTokenSource | null>(null);

    const send = useCallback(
        async (request: IRequest<ReqBase<Req>> = {}, { ignoreErrors = true }: IRequestOptions = {}) => {
            const { data, id, params, nestedId, formData } = request;

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
                const reqArgs:IReqOptions = {
                    url: getUrl({ url, id, nestedId }),
                    method,
                    data,
                    params,
                    formData,
                    cancelToken: abortController.current?.token,
                };

                const result = await sendHttpRequest(reqArgs);
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

                    if (e?.[0]?.statusCode === 401) {
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
        (data: (IRequest<Req> | undefined) = {}, options: IRequestOptions = {}) => {
            if (formatData) {
                const prepared = formatData(data);
                return send(prepared, options);
            }
            return send(data as any, options);
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
