export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES ="api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE =  `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/userInfo`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update_profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/profile_Image`;
export const REMOVE_PROFILE_IMAGE = `${AUTH_ROUTES}/remove-profile-image`