export const TOKEN_KEY = "token";
export const USER = "user";
export const COOKIES = "cookies";
export const setCookies = () => localStorage.setItem(COOKIES, true);
export const getCookies = () => localStorage.getItem(COOKIES);
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const setCurrentUser = (user) => localStorage.setItem(USER, JSON.stringify(user));
export const getCurrentUser = () => JSON.parse(localStorage.getItem(USER));
export const removeCurrentUser = () => localStorage.removeItem(USER);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const logout = () => { localStorage.removeItem(TOKEN_KEY) }
export const login = (token) => localStorage.setItem(TOKEN_KEY, token);