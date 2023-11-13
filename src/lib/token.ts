import { instance } from './api';

interface ResponseBody {
    accessToken: string;
    refreshToken: string;
}

// API 응답 토큰 확인
export const setToken = ({ accessToken, refreshToken }: ResponseBody) => {
    if (accessToken !== undefined && accessToken !== null) {
        const existingAccessToken = sessionStorage.getItem('accessToken');
        const existingRefreshToken = sessionStorage.getItem('refreshToken');
        if (!existingAccessToken && !existingRefreshToken) {
            sessionStorage.setItem('accessToken', accessToken);
            sessionStorage.setItem('refreshToken', refreshToken);
            // 최초 로그인 시간 + 5일
            const expiresAt = new Date().getTime() + 5 * 24 * 60 * 60 * 1000;
            if (expiresAt) {
                sessionStorage.setItem('expiresAt', JSON.stringify(expiresAt));
            }
        }
    }
};

// 토큰 재발급
export const refreshToken = async () => {
    try {
        sessionStorage.removeItem('accessToken');
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (refreshToken) {
            const res = await instance.post('refresh', {
                refreshToken: refreshToken,
            });
            const data = Object.values(res);
            const accessToken = data[0];
            sessionStorage.setItem('accessToken', accessToken);
            // expiresAt 갱신
            const newExpiresAt = new Date().getTime() + 5 * 24 * 60 * 60 * 1000;
            if (newExpiresAt) {
                sessionStorage.setItem('expiresAt', JSON.stringify(newExpiresAt));
            }
        }
    } catch (e) {
        console.error(e);
    }
};
