'use client';

import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import React, { useEffect, useState } from 'react';
import MessageContainer from './MessageContainer';
import io from 'socket.io-client';
import { useRouter, usePathname } from 'next/navigation';
import ChattingNavigation from './ChattingNavigation';
import ChattingModal from './ChattingModal';
import { getCookie } from '@/lib/cookie';
import { UserNameRecoil } from '@/store/atoms';

interface Message {
  id: string;
  text: string;
  userId: string;
  createdAt: Date; // Date
}

interface User {
  username: string;
  id: string;
  picture: string;
}

export default function ChattingPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [chatName, setChatName] = useState<string>('');
  const [getUserToggle, setGetUserToggle] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useRecoilState<string | undefined>(UserNameRecoil);

  const router = useRouter();

  const pathname = usePathname();
  const chatId = pathname.split('/')[2];
  const accessToken = getCookie('accessToken');
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const socket = io(`wss://fastcampus-chat.net/chat?chatId=${chatId}`, {
    extraHeaders: {
      Authorization: `Bearer ${accessToken}`,
      serverId: `${process.env.NEXT_PUBLIC_SERVER_KEY}`,
    },
  });

  const getUsers = async () => {
    const response = await fetch(`https://fastcampus-chat.net/chat/only?chatId=${chatId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        serverId: `${process.env.NEXT_PUBLIC_SERVER_KEY}`,
      },
    });
    const data = await response.json();

    // 유저 블락
    if (data.message) router.back();
    let userBlock = true;
    for (let i = 0; i < data.chat.users.length; i++) {
      if (userId == data.chat.users[i].id) {
        userBlock = false;
      }
    }
    if (userBlock) router.push('/');

    // 채팅방 이름, 유저 목록 가져오기
    if (data.chat.users.length == 1 && data.chat.isPrivate) {
      setChatName('상대방이 나간 채팅방입니다.');
    } else if (data.chat.users.length == 2 && data.chat.isPrivate) {
      for (let i = 0; i < data.chat.users.length; i++) {
        if (userId != data.chat.users[i].id) {
          setChatName(data.chat.users[i].username);
        }
      }
    } else {
      setChatName(data.chat.name);
    }
    setUsers(data.chat.users);
  };

  const findUserName = (userId: string): string | undefined => {
    for (let i = 0; i < users.length; i++) {
      if (userId == users[i].id) {
        return users[i].username;
      }
    }
    return undefined;
  };

  const findUserPicture = (userId: string): string | undefined => {
    for (let i = 0; i < users.length; i++) {
      if (userId == users[i].id) {
        return users[i].picture;
      }
    }
    return undefined;
  };

  if (userId) setUserName(findUserName(userId));

  useEffect(() => {
    getUsers();
  }, [getUserToggle]);

  useEffect(() => {
    const FetchMessagesInterval = setInterval(() => {
      socket.emit('fetch-messages');
    }, 2000);
    try {
      socket.on('connect', () => {
        console.log('Socket connected');
        FetchMessagesInterval;
      });

      socket.on('disconnect', () => {
        console.log('disconnect');
      });

      socket.on('messages-to-client', (messageObject) => {
        setLoading(false);
        setMessages(messageObject.messages.reverse());
        clearInterval(FetchMessagesInterval);
      });

      socket.on('message-to-client', (messageObject) => {
        setMessages((prevMessages) => [messageObject, ...prevMessages]);
      });

      socket.on('join', (data) => {
        console.log(data, 'join');
        setUsers(data.users);
        setGetUserToggle(!getUserToggle);
      });

      socket.on('leave', (data) => {
        console.log(data, 'leave');
        setUsers(data.users);
        setGetUserToggle(!getUserToggle);
      });
      return () => {
        socket.disconnect();
      };
    } catch (error) {
      console.log(error);
    }
  }, []);

  // 날짜 변환

  const formatCreatedAt = (createdAt: Date) => {
    const date = new Date(createdAt);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? '오후' : '오전';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${amOrPm} ${formattedHours}시 ${formattedMinutes}분`;
  };

  const formatGetDay = (createdAt: Date) => {
    const date = new Date(createdAt);
    return date.getDate();
  };

  const formatGetFullDay = (createdAt: Date) => {
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  return (
    <main>
      {loading ? (
        <Loading />
      ) : (
        <>
          <ChattingNavigation chatName={chatName} usersLength={users.length} />
          <ChattingModal users={users} chatId={chatId} socket={socket} />

          <MessagesContainer>
            {messages
              ? messages.map((message: Message, i: number) =>
                  message.text.split(':')[0] == 'notice09' ? (
                    <>
                      <NoticeMessageWrapper>
                        <NoticeText>{message.text.split(':')[1]}</NoticeText>
                      </NoticeMessageWrapper>
                      {formatGetDay(messages[i].createdAt) != formatGetDay(messages[i + 1]?.createdAt) ? (
                        <NoticeMessageWrapper>
                          <NoticeText>{formatGetFullDay(message.createdAt)}</NoticeText>
                        </NoticeMessageWrapper>
                      ) : (
                        ''
                      )}
                    </>
                  ) : userId == message.userId || userId == message.userId ? (
                    <>
                      <MyMessageWrapper key={message.id}>
                        <MyMessageText>{message.text}</MyMessageText>
                        <MyMessageTime>{formatCreatedAt(message.createdAt)}</MyMessageTime>
                      </MyMessageWrapper>
                      {formatGetDay(messages[i].createdAt) != formatGetDay(messages[i + 1]?.createdAt) ? (
                        <NoticeMessageWrapper>
                          <NoticeText>{formatGetFullDay(message.createdAt)}</NoticeText>
                        </NoticeMessageWrapper>
                      ) : (
                        ''
                      )}
                    </>
                  ) : messages[i].userId == messages[i + 1]?.userId &&
                    messages[i + 1]?.text.split(':')[0] != 'notice09' ? (
                    <>
                      <YourMessageWrapper key={message.id}>
                        <YourMessageTextWrapper>
                          <YourMessageText>{message.text}</YourMessageText>
                          <YourMessageTime>{formatCreatedAt(message.createdAt)}</YourMessageTime>
                        </YourMessageTextWrapper>
                      </YourMessageWrapper>
                      {formatGetDay(messages[i].createdAt) != formatGetDay(messages[i + 1]?.createdAt) ? (
                        <NoticeMessageWrapper>
                          <NoticeText>{formatGetFullDay(message.createdAt)}</NoticeText>
                        </NoticeMessageWrapper>
                      ) : (
                        ''
                      )}
                    </>
                  ) : (
                    <>
                      <YourMessageWrapper key={message.id}>
                        <YourMessageNameWrapper>
                          <YourMessagePicture
                            src={
                              findUserPicture(message.userId) ||
                              'https://gravatar.com/avatar/0211205be1e2bce90bbe53c5e0d8aaff?s=200&d=retro'
                            }
                          />
                          <YourMessageName>{findUserName(message.userId) || message.userId}</YourMessageName>
                        </YourMessageNameWrapper>
                        <YourMessageTextWrapper>
                          <YourMessageText>{message.text}</YourMessageText>
                          <YourMessageTime>{formatCreatedAt(message.createdAt)}</YourMessageTime>
                        </YourMessageTextWrapper>
                      </YourMessageWrapper>
                      {formatGetDay(messages[i].createdAt) != formatGetDay(messages[i + 1]?.createdAt) ? (
                        <NoticeMessageWrapper>
                          <NoticeText>{formatGetFullDay(message.createdAt)}</NoticeText>
                        </NoticeMessageWrapper>
                      ) : (
                        ''
                      )}
                    </>
                  ),
                )
              : ''}
          </MessagesContainer>
          <MessageContainer socket={socket} />
        </>
      )}
    </main>
  );
}

const MessagesContainer = styled.div`
  width: 100%;
  height: 100vh;

  padding-bottom: 83px;
  background-color: #eee;

  display: flex;
  flex-direction: column-reverse;

  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
`;

const YourMessageWrapper = styled.div`
  width: 100%;
`;

const YourMessageNameWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 10px;
`;

const YourMessageName = styled.div`
  font-size: 24px;
  color: #000;

  display: flex;
  flex-direction: column;
  margin-left: 5px;
`;

const YourMessagePicture = styled.img`
  width: 40px;
  height: 40px;

  border-radius: 20px;
`;

const YourMessageTextWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;

  margin-bottom: 10px;
`;
const YourMessageText = styled.div`
  max-width: 75%;
  padding: 10px;

  margin-left: 40px;

  font-size: 16px;
  word-break: break-all;

  border-radius: 15px;

  background-color: #d9d9d9;
`;

const YourMessageTime = styled.div`
  color: #888;
  font-size: 12px;

  margin-left: 5px;

  display: flex;
  flex-direction: column-reverse;
`;

const MyMessageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 10px;
`;

const MyMessageText = styled.div`
  max-width: 75%;
  height: auto;
  padding: 10px;

  margin-right: 10px;

  font-size: 16px;

  border-radius: 15px;

  background-color: #00956e;
`;

const MyMessageTime = styled.div`
  color: #888;
  font-size: 12px;

  margin-right: 5px;

  display: flex;
  flex-direction: column-reverse;
`;

const Loading = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);

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

const NoticeMessageWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
`;

const NoticeText = styled.div`
  height: auto;

  padding: 10px 15px;
  border-radius: 15px;
  text-align: center;
  font-size: 12px;
  background-color: #888;
  color: #eee;
`;
