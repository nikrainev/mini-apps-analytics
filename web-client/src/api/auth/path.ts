import { publicConfig } from '@/configs/publicConfig';

const ROOT_AUTH_PATH = `${publicConfig.backendUrl}/auth`;
export const AUTH_ME_API = `${ROOT_AUTH_PATH}/me`;
export const AUTH_ME_LOGIN_API = `${ROOT_AUTH_PATH}/me/login`;