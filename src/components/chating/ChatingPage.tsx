'use client';

import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import MessageContainer from './MessageContainer';
import io from 'socket.io-client';
import { usePathname } from 'next/navigation';
import ChatingNavigation from './ChatingNavigation';
import ChatingModal from './ChatingModal';
import { formatCreatedAt } from '../chats/useFormatCreatedAt';

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

export default function ChatingPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [chatName, setChatName] = useState<string>('');
    const [getUserToggle, setGetUserToggle] = useState<boolean>(true);

    const pathname = usePathname();
    const chatId = pathname.split('/')[2];
    const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
    const userId = typeof window !== 'undefined' ? sessionStorage.getItem('userId') : null;

    const getUsers = async () => {
        const response = await fetch('https://fastcampus-chat.net/chat', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                serverId: `${process.env.NEXT_PUBLIC_SERVER_KEY}`,
            },
        });
        const data = await response.json();

        for (let i = 0; i < data.chats.length; i++) {
            if (chatId == data.chats[i].id) {
                setChatName(data.chats[i].name);
                setUsers(data.chats[i].users);
            }
        }
    };

    const findUserName = (userId: string): string | void => {
        for (let i = 0; i < users.length; i++) {
            if (userId == users[i].id) {
                return users[i].username;
            }
        }
    };


    const findUserPicture = (userId: string): string | void => {
        for (let i = 0; i < users.length; i++) {
            if (userId == users[i].id) {
                return users[i].picture;
            }
        }
    };

    useEffect(() => {
        getUsers();
    }, [getUserToggle]);

    useEffect(() => {
        socketInitilizer();
    }, []);

    const socket = io(`wss://fastcampus-chat.net/chat?chatId=${chatId}`, {
        extraHeaders: {
            Authorization: `Bearer ${accessToken}`,
            serverId: `${process.env.NEXT_PUBLIC_SERVER_KEY}`,
        },
    });

    const socketInitilizer = () => {
        socket.on('connect', () => {
            console.log('Socket connected');
        });

        socket.emit('fetch-messages');

        socket.on('messages-to-client', (messageObject) => {
            setMessages(messageObject.messages.reverse());
        });

        socket.on('message-to-client', (messageObject) => {
            setMessages((prevMessages) => [messageObject, ...prevMessages]);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socket.emit('users');

        // socket.on('users-to-client', (data) => {
        //     console.log(data, 'users-to-client');
        // });

        socket.on('join', (data) => {
            console.log(data, 'join');
            setGetUserToggle(!getUserToggle);
        });
        socket.on('leave', (data) => {
            console.log(data, 'leave');
            setGetUserToggle(!getUserToggle);
        });
    };

    return (
        <main>
            <ChatingNavigation chatName={chatName} />
            <ChatingModal users={users} chatId={chatId} />

            <MessagesContainer>
                {messages
                    ? messages.map((message: Message, i: number) =>
                          userId == message.userId.split(':')[1] || userId == message.userId.split(':')[0] ? (
                              <MyMessageWrapper key={message.id}>
                                  <MyMessageText>{message.text}</MyMessageText>
                                  <MyMessageTime>{formatCreatedAt(message.createdAt)}</MyMessageTime>
                              </MyMessageWrapper>
                          ) : messages[i].userId == messages[i + 1]?.userId ||
                            messages[i].userId == messages[i + 1]?.userId.split(':')[1] ? (
                              <YourMessageWrapper key={message.id}>
                                  <YourMessageTextWrapper>
                                      <YourMessageText>{message.text}</YourMessageText>
                                      <YourMessageTime>{formatCreatedAt(message.createdAt)}</YourMessageTime>
                                  </YourMessageTextWrapper>
                              </YourMessageWrapper>
                          ) : (
                              <YourMessageWrapper key={message.id}>
                                  <YourMessageNameWrapper>
                                      <YourMessagePicture
                                          src={
                                              findUserPicture(
                                                  message.userId.split(':')[message.userId.split(':').length - 1],

                                              )
                                                  ? 'https://gravatar.com/avatar/0211205be1e2bce90bbe53c5e0d8aaff?s=200&d=retro'
                                                  : findUserPicture(
                                                        message.userId.split(':')[message.userId.split(':').length - 1],
                                                    ) || ''
                                          }
                                      />
                                      <YourMessageName>
                                          {findUserName(message.userId.split(':')[message.userId.split(':').length - 1])
                                              ? '(퇴장한 사용자)'
                                              : findUserName(
                                                    message.userId.split(':')[message.userId.split(':').length - 1],
                                                ) || ''}

                                      </YourMessageName>
                                  </YourMessageNameWrapper>
                                  <YourMessageTextWrapper>
                                      <YourMessageText>{message.text}</YourMessageText>
                                      <YourMessageTime>{formatCreatedAt(message.createdAt)}</YourMessageTime>
                                  </YourMessageTextWrapper>
                              </YourMessageWrapper>
                          ),
                      )
                    : ''}
            </MessagesContainer>
            <MessageContainer socket={socket} />
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
