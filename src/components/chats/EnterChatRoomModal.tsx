'use client';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { EnterChatRoomModalProps } from './chatsStore';
import { textModalData } from './ModalTextData';

const EnterChatRoomModal = ({ isOpen, onEnterClick, onCancelClick, selectedChat }: EnterChatRoomModalProps) => {
  // onEnterClick() props로 넘겨주기
  const handleEnterClick = () => {
    onEnterClick();
  };
  const handleCancelClick = () => {
    onCancelClick();
  };
  return (
    <Wrapper style={{ display: isOpen ? 'block' : 'none' }}>
      <ModalContainer>
        <ModalMainText>
          <span>{textModalData.enter}</span>
        </ModalMainText>
        <ModalBtnContainer>
          <EnterBtn onClick={handleEnterClick}>{textModalData.enterBtn}</EnterBtn>
          <CancelBtn onClick={handleCancelClick}>{textModalData.cancelBtn}</CancelBtn>
        </ModalBtnContainer>
      </ModalContainer>
    </Wrapper>
  );
};

export default EnterChatRoomModal;

const Wrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContainer = styled.div`
  position: absolute;
  top: 40%;
  left: 35%;

  width: 280px;
  height: 140px;

  border: none;
  border-radius: 0.6rem;
  background-color: ${({ theme }) => theme.color.mainGreen};
  box-shadow: ${({ theme }) => theme.shadow.list};

  z-index: 10000;
`;

const ModalMainText = styled.div`
  margin: 1rem 0 0;
  padding: 1.2rem;

  height: 60%;

  border-bottom: 1px solid #fff;
  span {
    font-weight: bold;
    font-size: ${({ theme }) => theme.fontSize.xl};
    text-align: center;
    color: #fff;
  }
`;

const ModalBtnContainer = styled.div`
  height: 40%;

  display: flex;
  justify-content: center;

  border-radius: 0.6rem;

  overflow: hidden;
`;

const EnterBtn = styled.button`
  background-color: ${({ theme }) => theme.color.mainGreen};

  width: 50%;

  border: none;
  border-right: 1px solid #fff;

  font-style: normal;
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSize.md};
  text-align: center;

  color: #fff;
  cursor: pointer;
`;

const CancelBtn = styled(EnterBtn)`
  border: none;
`;
