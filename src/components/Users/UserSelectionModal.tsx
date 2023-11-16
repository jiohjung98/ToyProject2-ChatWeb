import { useState } from 'react';
import { BiSolidCircle } from 'react-icons/bi';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { ConnectUserIdList } from './UserListStore';

interface User {
  id: string;
  password: string;
  name: string;
  picture: string;
  chats: string[];
}

interface UserSelectionModalProps {
  user: User;
  onUserSelect: (user: User) => void;
}

export const UserSelectionModal = ({ user, onUserSelect }: UserSelectionModalProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const { name, picture, id } = user;

  const connectUserIdList = useRecoilValue(ConnectUserIdList);

  const handleUserClick = () => {
    onUserSelect(user);
    setIsSelected(!isSelected); // 선택 여부 토글
    console.log(user.id);
  };

  return (
    <User isHovered={isHovered} isSelected={isSelected} onClick={handleUserClick}>
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
    </User>
  );
};

const User = styled.div<{ isHovered: boolean; isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 2.5rem;

  margin-bottom: 2rem;

  border-radius: 20px;

  box-shadow: ${({ theme }) => theme.shadow.list};

  background-color: ${({ isHovered, isSelected }) => (isSelected ? 'lightblue' : isHovered ? '#f0f0f0' : 'white')};

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
  flex: 1;
`;

const UserName = styled.h1`
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
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
const UserStateTextBlack = styled.p`
  color: black;
  font-size: ${({ theme }) => theme.fontSize.md};
`;
