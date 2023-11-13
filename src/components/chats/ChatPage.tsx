'use client';
// react 관련 import
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
// styled import
import styled from 'styled-components';
// chats 컴포넌트 import
import MyChatItem from '@/components/chats/MyChatItem';
import SearchMyChat from '@/components/chats/SearchMyChat';
// svgr import
import AddChat from '../../../public/assets/addChat.svg';
import Search from '../../../public/assets/search.svg';
import { Chat, allChatsState } from './chatsStore';
import { instance } from '@/lib/api';
import { useRouter } from 'next/navigation';
interface User {
    id: string;
    name: string;
    picture: string;
}

const MyChats = ({ userType }: any) => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [allChats, setAllChats] = useRecoilState(allChatsState);
    const [myChats, setMyChats] = useState<Chat[]>([]);
    const router = useRouter();

    const navigateToUserSelection = () => {
        router.push('userSelect'); // 적절한 경로로 수정하세요.
    };

    const enterChatRoom = (chat: Chat) => {
        if (chat.id && chat.users) {
            const users = chat.users
                .map((user) => `[name:${user.username}, id:${user.id}, picture:${user.picture}]`)
                .join(',');
            const latestMessageQuery = JSON.stringify(chat.latestMessage);

            router.push(
                `/chating/${chat.id}?name=${chat.name}&isPrivate=${
                    chat.isPrivate
                }&users=${users}&latestMessage=${encodeURIComponent(latestMessageQuery)}&updatedAt=${chat.updatedAt}`,
            );
        }
    };

    const getMyChats = async () => {
        try {
            const res = await instance.get<Chat[], any>(`chat`);
            if (res) {
                console.log(res.chats)
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
            const res = await instance.get<Chat[], any>(`chat/all`);
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

    }, []);


    useEffect(() => {
        console.log(allChats);
    }, []);

    const onSearchHandler = () => {
        setSearchOpen(!searchOpen);
    };


    return (
        <Wrapper>
            <Header>
                <MyChatBar>{userType === 'all' ? '오픈 채팅' : '내 채팅'}</MyChatBar>
                <IconBar>
                <SearchIcon onClick={onSearchHandler} />
                <AddChatIcon onClick={navigateToUserSelection} />
            </IconBar>
            </Header>
            <ChatContainer>
                {searchOpen ? <SearchMyChat /> : null}
                {(userType === 'my' ? myChats : allChats).map((chat: Chat) => (
                    <MyChatItem
                        key={chat.id}
                        name={chat.name}
                        latestMessage={chat.latestMessage}
                        users={chat.users}
                        onClick={() => enterChatRoom(chat)}
                    />
                ))}
            </ChatContainer>
        </Wrapper>
    );
};

export default MyChats;

const Wrapper = styled.div`
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height:100vh;
`;

const Header = styled.div`
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
const SearchIcon = styled(Search)`
    cursor: pointer;
`;

const AddChatIcon = styled(AddChat)`
    cursor: pointer;
`;

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    margin: 2rem;
    height: 80%;
    overflow-y: auto;
`;