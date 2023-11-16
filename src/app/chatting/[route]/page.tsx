'use client';
import ChattingPage from '../../../components/chatting/ChattingPage';
import React, { useEffect, useState } from 'react';
import { getCookie } from '@/lib/cookie';

export default function Chatting() {
  const [isRightWay, setIsRightWay] = useState<boolean>(false);
  useEffect(() => {
    const isUserAccess = getCookie('accessToken');
    if (isUserAccess) {
      setIsRightWay(true);
    } else {
      setIsRightWay(false);
    }
  }, []);
  if (!isRightWay) {
    return null;
  } else {
    return (
      <main>
        <ChattingPage />
      </main>
    );
  }
}
