'use client';
import React, { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { Chat, allChatsState, myChatsState, searchChatsState } from './chatsStore';
import { SearchButton, SearchUserBox } from '@/app/users/page';
import { MdSearch } from 'react-icons/md';

const SearchMyChat = ({ userType }: any) => {
    const [input, setInput] = useState<string>('');
    const [filterChats, setFilteredChats] = useRecoilState(searchChatsState);
    const [allChats, setAllChats] = useRecoilState(allChatsState);
    const [myChats, setAllMyChats] = useRecoilState(myChatsState);
    const onInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInput(e.target.value);
            const filteringChats = (userType === 'my' ? myChats : allChats).filter((chat) =>
                chat.name.toLowerCase().includes(e.target.value.toLowerCase()),
            );

            const filteredChats = [...filteringChats];
            setFilteredChats(filteredChats);
        },
        [myChats, allChats],
    );
    return (
        <Wrapper>
            <SearchUserBox>
                <SearchButton>
                    <MdSearch className="searchIcon" size="35" color="white" />
                </SearchButton>
                <SearchItem type="text" placeholder="검색" onChange={onInputChange} />
            </SearchUserBox>
        </Wrapper>
    );
};

export default SearchMyChat;

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

const SearchItem = styled.input`
    border: none;
    width: 32rem;
    outline: none;
    font-size: 1.2rem;
`;
