export const parseCookieString = ({
    str
}:{ str: string }):Record<string, any> => {
    const strSplit = str.split('; ');

    return strSplit.reduce((acc:Record<string, any>, cur:string) => {
        const curSplit = cur.split('=');
        return {
            ...acc,
            [curSplit[0]]: curSplit[1],
        };
    }, {});
};
