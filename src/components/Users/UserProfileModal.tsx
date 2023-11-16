'use client';
import styled from 'styled-components';
import { ImBubble } from 'react-icons/im';
import { MdClose } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { BiSolidCircle } from 'react-icons/bi';
import { getCookie } from '@/lib/cookie';
import { useRecoilValue } from 'recoil';
import { ConnectUserIdList } from './UserListStore';
import { ChangeEvent, useEffect, useState } from 'react';
import { Chat } from '@/components/chats/chatsStore';
import { instance } from '@/lib/api';
// types 폴더 나중에 만들어서 type 빼놓기
interface User {
  id: string;
  name: string;
  picture: string;
}
interface UserProfileModalProps {
  clickModal: () => void;
  user: User;
}
interface ResponseBody {
  chats: [{ id: string; name: string }];
}
const UserProfileModal = ({ clickModal, user }: UserProfileModalProps) => {
  const router = useRouter();
  const { id, name, picture } = user;
  const accessToken = getCookie('accessToken');
  const userId = localStorage.getItem('userId');
  const [myChats, setMyChats] = useState<Chat[]>([]);
  const connectUserIdList = useRecoilValue(ConnectUserIdList);
  const enterChatRoom = (chat: Chat) => {
    if (chat.id && chat.users) {
      const users = chat.users
        .map((user) => `[name:${user.username}, id:${user.id}, picture:${user.picture}]`)
        .join(',');
      const latestMessageQuery = JSON.stringify(chat.latestMessage);
      router.push(`/chatting/${chat.id}`);
    }
  };
  const handleChatClick = async () => {
    try {
      const res = await instance.get<unknown, ResponseBody>(`chat`);
      if (res) {
        const { chats } = res;
        const chatName = `1:1 Chat with ${user.name}`;
        const existingChat = chats ? chats.find((chat) => chat.name === chatName) : null;
        if (existingChat) {
          console.log('이미 채팅방이 존재해요. 그 채팅방으로 이동하겠습니다.');
          enterChatRoom(existingChat);
        } else {
          console.log('채팅방이 없음');
          const response = await fetch('https://fastcampus-chat.net/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
              serverId: `${process.env.NEXT_PUBLIC_SERVER_KEY}`,
            },
            body: JSON.stringify({
              name: `1:1 Chat with ${user.name}`,
              users: [user.id],
              isPrivate: true,
            }),
          });
          console.log(user.id, userId);
          if (response.ok) {
            // 생성된 채팅 방으로 이동
            const data = await response.json();
            const generatedChatId = `1on1_${user.id}_${userId}`;
            router.push(`/chatting/${data.id}`);
          } else {
            console.error('Failed to create chat room');
          }
        }
      } else {
        console.log('내 채팅 데이터 조회 실패');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <UserModalBox onClick={clickModal}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={clickModal}>
          <MdClose size="40" className="closeIcon" />
        </CloseButton>
        <ModalMain>
          <UserImg src={picture} />
          <UserInfo>
            <UserName>{name}</UserName>
            <UserState>
              <BiSolidCircle size="13" color={connectUserIdList.users.includes(id) ? '#00956E' : '#950000'} />
              {connectUserIdList.users.includes(id) ? (
                <UserStateTextBlack>online</UserStateTextBlack>
              ) : (
                <UserStateText>offline</UserStateText>
              )}
            </UserState>
          </UserInfo>
          <ToChatting onClick={handleChatClick}>
            <ImBubble size="30" className="chatIcon" />
            <ChatText>1:1 채팅하기</ChatText>
          </ToChatting>
        </ModalMain>
      </ModalContent>
    </UserModalBox>
  );
};
export default UserProfileModal;
const UserModalBox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;
const ModalContent = styled.div`
  background-color: white;
  width: 600px;
  height: 500px;
  border-radius: 5%;
  margin: 0 2rem;
  display: flex;
  flex-direction: column;
`;
const CloseButton = styled.div`
  margin: 1.5rem 2.5rem 0 auto;
  cursor: pointer;
  .closeIcon {
    color: ${({ theme }) => theme.color.darkGray};
  }
  &:hover .closeIcon {
    color: ${({ theme }) => theme.color.mainGreen};
    transition: 0.4s;
  }
`;
const ModalMain = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
`;
const UserImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 70%;
  overflow: hidden;
  margin-top: 5px;
`;
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const UserName = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.title};
  margin: 0;
`;
const ToChatting = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  &:hover .chatIcon {
    color: ${({ theme }) => theme.color.mainGreen};
    transition: 0.4s;
  }
`;
const ChatText = styled.p`
  font-weight: 500;
  font-size: ${({ theme }) => theme.fontSize.md};
`;
const UserState = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;
const UserStateText = styled.p`
  color: ${({ theme }) => theme.color.darkGray};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
const UserStateTextBlack = styled.p`
  color: black;
`;
