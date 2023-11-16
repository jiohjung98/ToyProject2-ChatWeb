'use client';

import styled from 'styled-components';
import Back from '../../../public/assets/back.svg';
import Menu from '../../../public/assets/menu.svg';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { ChattingModalToggle } from '@/store/atoms';

interface ChattingNaviagtionProps {
  chatName: string;
  usersLength: number;
}

//props type
export default function ChatingNavigation(props: ChattingNaviagtionProps) {
  const [modalToggle, setModalToggle] = useRecoilState<boolean>(ChattingModalToggle);

  const router = useRouter();

  return (
    <NavigationWrapper>
      <BackIcon onClick={() => router.push('/')} />
      <ChatTitle>
        {props.chatName}
        <ChatUsersLength>{props.usersLength}</ChatUsersLength>
      </ChatTitle>

      <MenuIcon
        onClick={() => {
          setModalToggle(!modalToggle);
        }}
      />
    </NavigationWrapper>
  );
}

const NavigationWrapper = styled.div`
  width: 100%;
  height: 83px;

  background-color: rgba(0, 0, 0, 0.02);

  position: absolute;
  top: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  z-index: 1;
`;

const ChatTitle = styled.div`
  font-size: 30px;
  font-weight: 700;
`;

const ChatUsersLength = styled.span`
  margin-left: 10px;
  font-size: 30px;
  color: #aaa;
`;

const BackIcon = styled(Back)`
  cursor: pointer;
  margin-left: 10px;
`;

const MenuIcon = styled(Menu)`
  cursor: pointer;
  margin-right: 10px;
`;
