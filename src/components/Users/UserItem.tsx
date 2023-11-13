'use client';
import { useState } from 'react';
import styled from 'styled-components';
import UserProfileModal from './UserProfileModal';
import { BiSolidCircle } from 'react-icons/bi';
import React from 'react';

interface User {
    id: string;
    password: string;
    name: string;
    picture: string;
    chats: string[];
}

interface ConnectUserIdList {
    users: string[];
}

interface UserItemProps {
    user: User;
    connectUserIdList: ConnectUserIdList;
}

const UserItem = ({ user, connectUserIdList }: UserItemProps) => {
    const { name, picture, id } = user;
    const [showModal, setShowModal] = useState(false);
    const clickModal = () => setShowModal(!showModal);

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
            {showModal && (
                <UserProfileModal clickModal={clickModal} user={user} connectUserIdList={connectUserIdList} />
            )}
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

const UserImg = styled.img`
    width: 60px;
    height: 60px;

    border-radius: 70%;

    overflow: hidden;

    margin-top: 5px;
`;

const UserInfo = styled.div`
    line-height: 10px;
`;

const UserName = styled.h2`
    font-size: ${({ theme }) => theme.fontSize.xl};
`;

const UserState = styled.div`
    display: flex;
    align-items: center;
    gap: 0.7rem;
`;

const UserStateText = styled.p`
    color: ${({ theme }) => theme.color.darkGray};
    font-size: ${({ theme }) => theme.fontSize.md};
`;

const UserStateTextBlack = styled.p`
    color: black;
    font-size: ${({ theme }) => theme.fontSize.md};
`;
