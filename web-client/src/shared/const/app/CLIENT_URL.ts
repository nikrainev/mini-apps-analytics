export const LOGIN_PAGE = '/login';
export const SIGNUP_PAGE = '/signup';
export const DASHBOARD_PERSON = ({
    personId
}:{ personId: string }) => `/person/${personId}`;
export const DASHBOARD_PAGE = '/dashboard';