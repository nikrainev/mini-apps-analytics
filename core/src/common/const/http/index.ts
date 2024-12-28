export enum RequestMethods {
    Get = 'get',
    Delete = 'delete',
    Post = 'post',
    Put = 'put',
}

export type RequestMethod = `${RequestMethods}`;
