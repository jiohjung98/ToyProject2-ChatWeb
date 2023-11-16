'use client';
import React from 'react';
import styled from 'styled-components';
import { Chat } from './chatsStore';
import { formatCreatedAt } from '@/components/chats/useFormatCreatedAt';
import { FaLock } from 'react-icons/fa6';
import { eclipsText } from './ModalTextData';
const MyChatItem = ({ name, latestMessage, users, onClick, isPrivate }: Chat) => {
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  // 1대1 채팅일 때 상대방 이름과 이미지 가져오는 함수
  const getPictureName = () => {
    if (users) {
      const otherUser = users.find((user) => user.id !== userId);
      return otherUser;
    }
  };

  const otherUser = getPictureName();
  const otherUserName = otherUser ? otherUser.username : '';
  const otherPicture = otherUser ? otherUser.picture : '';

  const chatsPicture =
    isPrivate && users && users.length > 2 // private 한 그룹 채팅인 경우
      ? '/assets/groupPrivate.svg'
      : isPrivate && users && users.length === 2 // private이면서 1대1 채팅인 경우
      ? otherPicture
      : !isPrivate && users && users.length > 2 // private 아니면서 그룹채팅인 경우
      ? '/assets/groupUsers.svg'
      : !isPrivate && users && users.length === 2
      ? otherPicture // private 하지 않으면서 1대1 인 경우
      : '/assets/noUser.svg';
  const usersNumber = users && users.length > 0 ? users.length : '';
  const chatsName =
    users && users.length === 1 ? '상대방이 채팅방을 나갔습니다.' : users && users.length === 2 ? otherUserName : name;
  return (
    <ChatBox onClick={onClick}>
      <ChatImage src={chatsPicture} alt="chats picutre" />
      <ChatInfo>
        <ChatPart>
          <ChatName>
            {chatsName} <span>{usersNumber}</span>
          </ChatName>
        </ChatPart>
        <LateMessage>
          {latestMessage
            ? latestMessage.text.split(':')[0] == 'notice09'
              ? latestMessage.text.split(':')[1]
              : eclipsText(latestMessage.text, 20)
            : ''}{' '}
        </LateMessage>
      </ChatInfo>
      <MessageCount>
        <ReceiveTime>{latestMessage ? formatCreatedAt(latestMessage.createdAt) : ''}</ReceiveTime>
        <TypeCheckBox>{isPrivate ? <FaLock size="20" className="lockIcon" /> : ''}</TypeCheckBox>
      </MessageCount>
    </ChatBox>
  );
};
export default MyChatItem;
const ChatBox = styled.div`
  margin-bottom: 2rem;
  cursor: pointer;
  background: #ffffff;
  box-shadow: ${({ theme }) => theme.shadow.list};
  border-radius: 20px;
  &:hover {
    opacity: 70%;
    transition: 0.4s;
  }
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  padding: 2rem 2rem 1rem 2rem;
`;
const ChatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex: 1;
  width: 70%;
`;
const ChatImage = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 70%;
`;
const ChatPart = styled.div``;
const ChatName = styled.p`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: bold;
  color: #000;
  margin: 0;
  span {
    font-size: ${({ theme }) => theme.fontSize.lg};
    font-weight: bold;
    color: ${({ theme }) => theme.color.darkGray};
    margin-left: 0.5rem;
  }
`;
const LateMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: normal;
  color: ${({ theme }) => theme.color.darkGray};
  padding: 0;
  margin-top: 0.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const MessageCount = styled.div`
  max-height: 5rem;
  min-height: 5rem;
`;
const ReceiveTime = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: #cdcdcd;
`;
const TypeCheckBox = styled.div`
  text-align: center;
  margin-top: 1rem;
  .lockIcon {
    color: ${({ theme }) => theme.color.mainGreen};
  }
`;
