import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { setToken } from './token';
import { refreshToken } from './token';

export const instance = axios.create({
    baseURL: 'https://fastcampus-chat.net/',
});

function requestInterceptor(config: AxiosRequestConfig): any {
    const accessToken = sessionStorage.getItem('accessToken');

    if (accessToken) {
        return {
            ...config,
            headers: {
                'content-type': 'application/json',
                serverId: `${process.env.NEXT_PUBLIC_SERVER_KEY}`,
                Authorization: `Bearer ${accessToken}`,
            },
        };
    } else {
        return {
            ...config,
            headers: {
                'content-type': 'application/json',
                serverId: `${process.env.NEXT_PUBLIC_SERVER_KEY}`,
            },
        };
    }
}

instance.interceptors.request.use(requestInterceptor);

function responseFulfilledInterceptor(res: AxiosResponse) {
    if (200 <= res.status && res.status < 300) {
        if (res.data.message === 'User created') {
            return res.data;
        } else {
            setToken(res.data);
            return res.data;
        }
    }
    if (res.status === 401) {
        refreshToken();
    }
    return Promise.reject(res.data);
}

function responseRejectedInterceptor(error: AxiosError) {
    return error.code;
}

instance.interceptors.response.use(responseFulfilledInterceptor, responseRejectedInterceptor);
