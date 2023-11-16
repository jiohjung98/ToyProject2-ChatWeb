'use client';

import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import { BsFillPeopleFill, BsThreeDots } from 'react-icons/bs';
import { PiChatCircleBold, PiChatsCircleFill } from 'react-icons/pi';
import Link from 'next/link';

export default function Navigation() {
  const pathname = usePathname();
  const path = pathname.split('/')[1];

  return (
    <NavigationContainer>
      <Link href="/">
        <BsFillPeopleFill size="35" color={path == '' ? '#00956e' : '#dbdbdb'} />
      </Link>
      <Link href="mychats">
        <PiChatCircleBold size="35" color={path == 'mychats' ? '#00956e' : '#dbdbdb'} />
      </Link>
      <Link href="allchats">
        <PiChatsCircleFill size="37" color={path == 'allchats' ? '#00956e' : '#dbdbdb'} />
      </Link>
      <Link href="mypage">
        <BsThreeDots size="35" color={path == 'mypage' ? '#00956e' : '#dbdbdb'} />
      </Link>
    </NavigationContainer>
  );
}

const NavigationContainer = styled.div`
  width: 100%;
  height: 80px;

  position: absolute;
  bottom: 0;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
  align-items: center;

  background-color: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;
