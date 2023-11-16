'use client';
import { useState } from 'react';
import styled from 'styled-components';
import UserProfileModal from './UserProfileModal';
import { BiSolidCircle } from 'react-icons/bi';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { ConnectUserIdList } from './UserListStore';
import { Chat } from '@/components/chats/chatsStore';
import { instance } from '@/lib/api';

interface User {
  id: string;
  name: string;
  picture: string;
}

const UserItem = ({ user }: { user: User }) => {
  const { name, picture, id } = user;
  const [showModal, setShowModal] = useState(false);
  const clickModal = () => setShowModal(!showModal);
  const connectUserIdList = useRecoilValue(ConnectUserIdList);

  return (
    <>
      <User onClick={clickModal}>
        <UserImg src={picture} />
        <UserInfo>
          <UserName>{name}</UserName>
          <UserState>
            <BiSolidCircle size="13" color={connectUserIdList.users.includes(id) ? '#00956e' : '#950000'} />
            {connectUserIdList.users.includes(id) ? (
              <UserStateTextBlack>online</UserStateTextBlack>
            ) : (
              <UserStateText>offline</UserStateText>
            )}
          </UserState>
        </UserInfo>
      </User>
      {showModal && <UserProfileModal clickModal={clickModal} user={user} />}
    </>
  );
};

export default React.memo(UserItem);

const User = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2.5rem;

  margin-bottom: 2rem;

  border-radius: 20px;

  box-shadow: ${({ theme }) => theme.shadow.list};

  background-color: white;

  padding: 1rem 2rem;

  cursor: pointer;

  &:hover {
    opacity: 70%;
    transition: 0.4s;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserImg = styled.img`
  width: 60px;
  height: 60px;

  border-radius: 70%;

  overflow: hidden;

  margin-top: 5px;
`;

const UserName = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xl};

  line-height: 20px;

  margin: 1rem 0 0;
`;

const UserState = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;

  margin: 0;
`;

const UserStateText = styled.p`
  color: ${({ theme }) => theme.color.darkGray};
  font-size: ${({ theme }) => theme.fontSize.md};
`;

const UserStateTextBlack = styled.p`
  color: black;
  font-size: ${({ theme }) => theme.fontSize.md};
`;