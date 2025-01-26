import useSWR from 'swr';

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());

export const useBaseSWR = (url:string) => {
    return useSWR(`/api/user/${1}`, fetcher);
};