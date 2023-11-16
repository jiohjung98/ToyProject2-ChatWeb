import { useEffect, Dispatch, SetStateAction } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCookie, refreshCookie } from '@/lib/cookie';

export const authCheck = (setter?: Dispatch<SetStateAction<boolean>>) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const nowDate = new Date().getTime();
    const expiresAt = localStorage.getItem('expiresAt');

    if (expiresAt) {
      const isExpires = nowDate - JSON.parse(expiresAt);

      if (isExpires >= 0) {
        refreshCookie();
      }
    }

    const isLoggedIn = getCookie('accessToken');

    if (setter && router && pathname) {
      if (isLoggedIn) {
        if (pathname === '/login' || pathname === '/createaccount') {
          setter((prevState) => {
            if (prevState !== true) {
              setTimeout(() => {
                setter(false);
                router.push('/');
              }, 1500);
            }
            return true;
          });
        }
      } else {
        if (pathname !== '/login' && pathname !== '/createaccount') {
          setter((prevState) => {
            if (prevState !== true) {
              setTimeout(() => {
                setter(false);
                router.push('/login');
              }, 1500);
            }
            return true;
          });
        }
      }
    }
  }, [setter]);
};
