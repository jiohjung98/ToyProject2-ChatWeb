'use client';

import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { ChattingModalToggle, UserNameRecoil } from '@/store/atoms';
import { useRouter } from 'next/navigation';
import InviteImg from '../../../public/assets/InviteImg.svg';
import { getCookie } from '@/lib/cookie';
import { Socket } from 'socket.io-client';

interface User {
  username: string;
  id: string;
  picture: string;
}

interface ChattingModalProps {
  users: User[];
  chatId: string;
  socket: Socket;
}

//type
export default function ChattingModal(props: ChattingModalProps) {
  const [modalToggle, setModalToggle] = useRecoilState<boolean>(ChattingModalToggle);
  const [userName, setUserName] = useRecoilState<string | undefined>(UserNameRecoil);
  const router = useRouter();

  const accessToken = getCookie('accessToken');
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const findUserName = (userId: string): string | undefined => {
    for (let i = 0; i < props.users.length; i++) {
      if (userId == props.users[i].id) {
        return props.users[i].username;
      }
    }
    return undefined;
  };

  const leaveChatting = async () => {
    await fetch('https://fastcampus-chat.net/chat/leave', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        serverId: `${process.env.NEXT_PUBLIC_SERVER_KEY}`,
      },
      body: JSON.stringify({
        chatId: props.chatId,
      }),
    });
    if (userId) {
      await props.socket.emit('message-to-server', `notice09:${userName}님이 채팅방을 나갔습니다.`);
    }
    router.back();
  };

  return (
    <>
      <ModalWrapper
        style={{
          opacity: `${modalToggle ? '1' : '0'}`,
          transform: `${modalToggle ? 'translateZ(0)' : 'translate3d(100%, 0, 0)'}`,
        }}
      >
        <ModalTitle>대화상대</ModalTitle>
        {props.users ? (
          <UsersWrapper>
            {props.users.map((user: User) => (
              <UserWrapper key={user.id}>
                <UserImg src={user.picture} />
                <UserName>{user.username}</UserName>
              </UserWrapper>
            ))}
            {/* <UserInviteWrapper>
              <UserInviteImg />
              <UserInviteName>초대하기</UserInviteName>
            </UserInviteWrapper> */}
          </UsersWrapper>
        ) : (
          ''
        )}
        <ChattingLeave
          onClick={() => {
            setModalToggle(!modalToggle);
            leaveChatting();
          }}
        >
          채팅방 나가기
        </ChattingLeave>
      </ModalWrapper>

      <ModalBackground
        style={{
          visibility: `${modalToggle ? 'visible' : 'hidden'}`,
          opacity: `${modalToggle ? '1' : '0'}`,
        }}
        onClick={() => setModalToggle(false)}
      ></ModalBackground>
    </>
  );
}

const ModalBackground = styled.div`
  width: 100%;
  height: 100vh;

  position: absolute;
  z-index: 2;

  background-color: rgba(0, 0, 0, 0.2);

  transition: all 0.5s;
`;

const ModalWrapper = styled.div`
  width: 70%;
  height: 100%;

  background-color: #fff;

  position: absolute;
  right: 0;

  z-index: 3;

  transition: 0.5s;
`;

const ModalTitle = styled.div`
  width: 100%;
  font-size: 24px;

  padding-left: 20px;
  padding-top: 20px;

  font-weight: 700;
`;

const UsersWrapper = styled.div`
  width: 100%;
  height: 80%;

  overflow: scroll;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }

  padding-left: 30px;
  padding-top: 30px;
`;

const UserWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;

  margin-bottom: 20px;
`;

const UserImg = styled.img`
  width: 50px;
  height: 50px;

  border-radius: 25px;
`;

const UserName = styled.div`
  font-size: 24px;
  margin-left: 10px;
`;

const UserInviteWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;

  margin-bottom: 20px;
`;

const UserInviteImg = styled(InviteImg)`
  width: 50px;
  height: 50px;

  border-radius: 25px;
  cursor: pointer;
`;

const UserInviteName = styled.div`
  font-size: 24px;
  margin-left: 10px;

  color: #00956e;
  cursor: pointer;
`;

const ChattingLeave = styled.div`
  font-size: 30px;
  color: #950000;

  position: absolute;
  bottom: 0;

  left: 50%;
  transform: translate(-50%, -50%);

  cursor: pointer;
`;
