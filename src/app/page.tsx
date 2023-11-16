'use client';
import UserItem from '@/components/Users/UserItem';
import { instance } from '@/lib/api';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MdClose, MdSearch } from 'react-icons/md';
import Navigation from '@/components/Navigation';
import { io } from 'socket.io-client';
import React from 'react';
import { getCookie } from '@/lib/cookie';
import { useRecoilState } from 'recoil';
import { ConnectUserIdList } from '@/components/Users/UserListStore';
interface User {
  id: string;
  password: string;
  name: string;
  picture: string;
  chats: string[];
}

interface ConnectUserIdListIF {
  users: string[];
}

const Users = () => {
  const [users, setUsers] = useState<User[] | []>([]);
  const [loading, setLoading] = useState(true);
  const getUsers = async () => {
    try {
      let res = await instance.get<unknown, User[]>('/users');
      res = res.filter((user) => user.id !== localStorage.getItem('userId'));
      setUsers(res);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  /**사용자 검색 */
  const [userInput, setUserInput] = useState('');
  const getInputValue = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  }, []);
  const searched = users.filter((user) => user.name.includes(userInput));
  const clearSearchInput = React.useCallback(() => {
    setUserInput('');
  }, []);
  /** 접속 상태 */
  const connectUserIdListRef = useRef<ConnectUserIdListIF>({
    users: [],
  });
  const [connectUserIdList, setConnectUserIdList] = useRecoilState(ConnectUserIdList);
  const accessToken = getCookie('accessToken');
  const socket = io(`https://fastcampus-chat.net/server`, {
    extraHeaders: {
      Authorization: `Bearer ${accessToken}`,
      serverId: `${process.env.NEXT_PUBLIC_SERVER_KEY}`,
    },
  });

  useEffect(() => {
    try {
      socket.on('connect', () => {
        console.log('Socket server connected');
      });

      socket.on('disconnect', () => {
        console.log('server disconnect');
      });

      socket.on('users-server-to-client', (usersIdList) => {
        if (JSON.stringify(usersIdList.users) !== JSON.stringify(connectUserIdListRef.current.users)) {
          connectUserIdListRef.current = usersIdList;
          setConnectUserIdList(usersIdList);
        }
      });
      return () => {
        socket.disconnect();
      };
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <UsersWrap>
        <HeaderText>사용자 목록</HeaderText>
        <SearchUserBox>
          <SearchButton>
            <MdSearch className="searchIcon" size="35" color="white" />
          </SearchButton>
          <SearchUserInput value={userInput} onChange={getInputValue} type="text" placeholder="사용자를 검색해보세요" />
          <ClearButton>
            {userInput && <MdClose className="clearIcon" size="25" onClick={clearSearchInput} />}
          </ClearButton>
        </SearchUserBox>
        <UserList>
          {loading && <Loading />}
          {searched.length !== 0
            ? searched.map((user: User) => {
                return <UserItem key={user.id} user={user} />;
              })
            : !loading && (
                <NoUserWrap>
                  <NoUserText>해당 사용자가 존재하지 않습니다.</NoUserText>
                </NoUserWrap>
              )}
        </UserList>
      </UsersWrap>
      <Navigation />
    </>
  );
};
export default React.memo(Users);
const UsersWrap = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100vh;
`;
const HeaderText = styled.h1`
  color: ${({ theme }) => theme.color.mainGreen};
  font-size: ${({ theme }) => theme.fontSize.title};
`;
const UserList = styled.div`
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
const NoUserWrap = styled.div`
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 3rem;
`;
const NoUserText = styled.h2`
  color: ${({ theme }) => theme.color.darkGreen};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;
/**사용자 검색 */
const SearchUserBox = styled.div`
  background-color: white;
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadow.search};
  height: 3.5rem;
  width: 96%;
  margin: 0 auto;
  display: flex;
  gap: 3%;
`;
const SearchButton = styled.div`
  background-color: ${({ theme }) => theme.color.mainGreen};
  width: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  box-shadow: ${({ theme }) => theme.shadow.search};
`;
const SearchUserInput = styled.input`
  border: none;
  width: 32rem;
  outline: none;
  font-size: ${({ theme }) => theme.fontSize.lg};
`;
const ClearButton = styled.div`
  margin-right: 2.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  .clearIcon {
    color: ${({ theme }) => theme.color.mainGreen};
    &:hover {
      color: ${({ theme }) => theme.color.darkGreen};
      transition: 0.4s;
    }
  }
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
