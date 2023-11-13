'use client';
// react 관련 import
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
// styled import
import styled from 'styled-components';
// chats 컴포넌트 import
import MyChatItem from '@/components/chats/MyChatItem';
import SearchMyChat from '@/components/chats/SearchMyChat';
// svgr import
import AddChat from '../../../public/assets/addChat.svg';
import { Chat, allChatsState, myChatsState, searchChatsState } from './chatsStore';
import { instance } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { sortTime } from './useFormatCreatedAt';
// import AddChatDropdown from './addChatDropdown';
const MyChats = ({ userType }: any) => {
    const [addChatOpen, setAddChatOpen] = useState(false);
    const [allChats, setAllChats] = useRecoilState(allChatsState);
    const [myChats, setMyChats] = useRecoilState(myChatsState);
    const filterChats = useRecoilValue(searchChatsState);
    const router = useRouter();
    const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
    const userId = typeof window !== 'undefined' ? sessionStorage.getItem('userId') : null;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Cache-Control': 'no-cache',
    };

    const enterChatRoom = (chat: Chat) => {
        if (chat.id && chat.users) {
            router.push(`/chating/${chat.id}`);
        }
    };

    const getMyChats = async () => {
        try {
            const res = await instance.get<Chat[], any>(`chat`, { headers });
            if (res) {
                console.log(res.chats);
                setMyChats(res.chats);
            } else {
                console.log('내 채팅 데이터 조회 실패');
            }
        } catch (error) {
            console.error(error);
        }
    };
    const getAllChats = async () => {
        try {
            const res = await instance.get<Chat[], any>(`chat/all`, { headers });
            setAllChats(res.chats);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (userType === 'my') {
            getMyChats();
        } else {
            getAllChats();
        }

        const intervalId = setInterval(() => {
            if (userType === 'my') {
                getMyChats();
                console.log('내 채팅 조회 성공');
            } else {
                getAllChats();
                console.log('모든 채팅 조회 성공');
            }
        }, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const onAddHandler = () => {
        setAddChatOpen(!addChatOpen);
    };

    return (
        <Wrapper>
            <ChatHeader>
                <MyChatBar>{userType === 'all' ? '오픈 채팅' : '내 채팅'}</MyChatBar>
                <IconBar>
                    <AddChatIcon onClick={onAddHandler} />
                </IconBar>
            </ChatHeader>
            <ChatContainer>
                <SearchMyChat />
                {userId
                    ? filterChats.length > 0
                        ? sortTime(filterChats).map((chat) => (
                              <MyChatItem
                                  key={chat.id}
                                  name={chat.name}
                                  latestMessage={chat.latestMessage}
                                  users={chat.users}
                                  onClick={() => enterChatRoom(chat)}
                                  isPrivate={chat.isPrivate}
                              />
                          ))
                        : sortTime(userType === 'my' ? myChats : allChats).map((chat) => (
                              <MyChatItem
                                  key={chat.id}
                                  name={chat.name}
                                  latestMessage={chat.latestMessage}
                                  users={chat.users}
                                  onClick={() => enterChatRoom(chat)}
                                  isPrivate={chat.isPrivate}
                              />
                          ))
                    : null}
            </ChatContainer>
        </Wrapper>
    );
};

export default MyChats;

export const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* height: 100vh; */
`;

const ChatHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 4rem 2rem 1rem;
`;

const MyChatBar = styled.div`
    color: #00956e;
    font-weight: bold;
    font-size: 1.5rem;
`;
const IconBar = styled.div`
    display: flex;
    gap: 1.5rem;
`;

const AddChatIcon = styled(AddChat)`
    position: relative;
    cursor: pointer;
`;

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    margin: 2rem;
    background-color: transparent;
`;
