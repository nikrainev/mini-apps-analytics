import getConfig from 'next/config';

export const publicConfig:{
    appEnv: 'local',
    backendUrl: string
} = {
    appEnv: process.env.NEXT_PUBLIC_APP_ENV as 'local',
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL as string
};