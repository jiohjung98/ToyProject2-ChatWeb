'use client';
// react 관련 import
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
// styled import
import styled from 'styled-components';
// chats 컴포넌트 import
import MyChatItem from '@/components/chats/MyChatItem';
import SearchMyChat from '@/components/chats/SearchMyChat';
// svgr import
import { TbMessageCirclePlus } from 'react-icons/tb';
import { Chat, searchChatsState, searchInputState } from './chatsStore';
import { useRouter } from 'next/navigation';
import { sortTime } from './useFormatCreatedAt';

import { getMyChats, getAllChats, partChats } from './getChats';
import { useQuery } from '@tanstack/react-query';
import EnterChatRoomModal from './EnterChatRoomModal';
import io from 'socket.io-client';
import { getCookie } from '@/lib/cookie';

const MyChats = ({ userType }: { userType: string }) => {
  const [addChatOpen, setAddChatOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  // 검색창에 입력 중에 올바른 검색어 비교 위해 Input 값 전역 상태 관리
  const filterInputValue = useRecoilValue(searchInputState);
  const filterChats = useRecoilValue(searchChatsState);

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const router = useRouter();
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  // react-query로 조건부 fetch
  const { data, isLoading } = useQuery<Chat[]>({
    queryKey: ['getChatsKey'],
    queryFn: userType === 'my' ? getMyChats : getAllChats,
    refetchOnWindowFocus: false,
    refetchInterval: 1000,
  });

  const navigateToUserSelection = () => {
    router.push('userSelect');
  };

  // 채팅방 들어갈 때 새 유저면 채팅방에 새로 참여시키고 기존 유저는 그냥 들어가기
  const enterChatRoom = async (chat: Chat) => {
    if (chat.id && chat.users) {
      if (chat.users.every((user) => user.id !== userId)) {
        setSelectedChat(chat);
        setChatModalOpen(true);
        console.log('새로 입장 성공');
      } else {
        router.push(`/chatting/${chat.id}`);
        console.log('기존 유저 들어가기 성공');
      }
    }
  };

  // 입장하기 버튼 눌렀을 때 채팅에 참여시키는 함수
  const onEnterHandler = async () => {
    if (selectedChat && selectedChat.id) {
      partChats(selectedChat.id);
      setChatModalOpen(false);
      // 채팅방 입장 공지
      const accessToken = getCookie('accessToken');

      const response = await fetch(`https://fastcampus-chat.net/user?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          serverId: `${process.env.NEXT_PUBLIC_SERVER_KEY}`,
        },
      });
      const data = await response.json();
      const userName = data.user.name;

      const socket = await io(`wss://fastcampus-chat.net/chat?chatId=${selectedChat.id}`, {
        extraHeaders: {
          Authorization: `Bearer ${accessToken}`,
          serverId: `${process.env.NEXT_PUBLIC_SERVER_KEY}`,
        },
      });

      try {
        socket.on('connect', () => {
          console.log('Socket connected');
          setInterval(() => {
            socket.disconnect();
            router.push(`/chatting/${selectedChat.id}`);
            console.log('새로 입장 성공');
          }, 3000);
        });

        socket.emit('message-to-server', `notice09:${userName}님이 채팅방에 입장하였습니다. `);

        socket.on('disconnect', () => {
          console.log('disconnect');
        });

        setInterval;
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('입장 실패');
    }
  };

  // 입장하기 모달 여닫는 함수
  const onModalHandler = () => {
    setChatModalOpen(!chatModalOpen);
  };

  return (
    <Wrapper>
      <ChatHeader>
        <MyChatBar>{userType === 'all' ? '오픈 채팅' : '내 채팅'}</MyChatBar>
        <AddChatButton onClick={navigateToUserSelection}>
          <TbMessageCirclePlus className="addChatIcon" size="33" />
        </AddChatButton>
      </ChatHeader>
      <SearchMyChat userType={userType} />
      <ChatList>
        <EnterChatRoomModal
          isOpen={chatModalOpen}
          onEnterClick={onEnterHandler}
          onCancelClick={onModalHandler}
          selectedChat={selectedChat}
        />
        {isLoading && <Loading />}
        {userId && data ? (
          filterInputValue ? (
            filterChats.length > 0 ? (
              sortTime(filterChats).map((chat) => (
                <MyChatItem
                  key={chat.id}
                  name={chat.name}
                  latestMessage={chat.latestMessage}
                  users={chat.users}
                  onClick={() => enterChatRoom(chat)}
                  isPrivate={chat.isPrivate}
                />
              ))
            ) : (
              <NoUserWrap>
                <NoUserText>해당 채팅방이 존재하지 않습니다.</NoUserText>
              </NoUserWrap>
            )
          ) : (
            sortTime(data).map((chat) => (
              <MyChatItem
                key={chat.id}
                name={chat.name}
                latestMessage={chat.latestMessage}
                users={chat.users}
                onClick={() => enterChatRoom(chat)}
                isPrivate={chat.isPrivate}
              />
            ))
          )
        ) : null}
      </ChatList>
    </Wrapper>
  );
};

export default MyChats;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  padding: 3rem;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MyChatBar = styled.h1`
  color: ${({ theme }) => theme.color.mainGreen};
  font-size: ${({ theme }) => theme.fontSize.title};
`;

const AddChatButton = styled.div`
  cursor: pointer;

  .addChatIcon {
    color: ${({ theme }) => theme.color.mainGreen};
  }

  &:hover .addChatIcon {
    color: ${({ theme }) => theme.color.darkGreen};
    transition: 0.4s;
  }
`;

const ChatList = styled.div`
  margin-top: 1rem;

  padding: 1rem;

  height: 80%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    /*크롬, 사파리, 오페라, 엣지*/
    display: none;
  }
  -ms-overflow-style: none; /* ie */
  scrollbar-width: none; /* 파이어폭스 */
`;

const Loading = styled.div`
  width: 50px;
  height: 50px;

  border: 5.5px solid rgba(255, 255, 255, 0.3);
  border-top: 5.5px solid ${({ theme }) => theme.color.mainGreen};
  border-radius: 50%;

  animation: spin 1s linear infinite;

  margin: 8rem auto 0;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const NoUserWrap = styled.div`
  text-align: center;

  margin-top: 8rem;

  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const NoUserText = styled.h2`
  color: ${({ theme }) => theme.color.darkGreen};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;
