import { instance } from './api';
import { Cookies } from 'react-cookie';

interface ResponseBody {
  accessToken: string;
  refreshToken: string;
}

const cookies = new Cookies();

export const setCookie = (name: string, value: string, options?: object) => {
  return cookies.set(name, value, { ...options });
};

export const getCookie = (name: string) => {
  return cookies.get(name);
};

export const deleteCookie = () => {
  const accessToken = getCookie('accessToken');
  const refreshToken = getCookie('refreshToken');

  setCookie('refreshToken', refreshToken, {
    path: '/',
    secure: '/',
    maxAge: 0,
  });
  setCookie('accessToken', accessToken, {
    path: '/',
    secure: '/',
    maxAge: 0,
  });
};

export const setLoginCookie = ({ accessToken, refreshToken }: ResponseBody) => {
  if (accessToken !== undefined && accessToken !== null) {
    const isExistedCookie = getCookie('refreshToken');

    if (!isExistedCookie) {
      setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: '/',
        maxAge: 2 * 60 * 60 * 1000,
      });
      setCookie('accessToken', accessToken, {
        path: '/',
        secure: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      const expiresAt = new Date().getTime() + 5 * 24 * 60 * 60;

      if (expiresAt) {
        localStorage.setItem('expiresAt', JSON.stringify(expiresAt));
      }
    }
  }
};

interface refreshResponseBody {
  accessToken: string;
}

// 토큰 재발급
export const refreshCookie = async () => {
  try {
    const refreshToken = getCookie('refreshToken');
    if (refreshToken) {
      const res: refreshResponseBody = await instance.post('refresh', {
        refreshToken: refreshToken,
      });
      const { accessToken } = res;
      setCookie('accessToken', accessToken, {
        path: '/',
        secure: '/',
        maxAge: 2 * 60 * 60 * 1000,
      });
      setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      // expiresAt 갱신
      const newExpiresAt = new Date().getTime() + 5 * 24 * 60 * 60;
      if (newExpiresAt) {
        localStorage.setItem('expiresAt', JSON.stringify(newExpiresAt));
      }
    }
  } catch (e) {
    console.error(e);
  }
};
