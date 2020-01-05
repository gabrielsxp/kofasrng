import axios from 'axios';
import constants from './constants';
import { getToken } from './services/Auth/index';

const instance = axios.create({
    baseURL: constants.BASE_URL,
    validateStatus: (status) => {
        return true; 
    },
});

instance.headers = {
    "Content-Type": 'application/json;charset=UTF-8',
    "Access-Control-Allow-Origin": "*"
}

instance.interceptors.request.use(async config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export default instance;
