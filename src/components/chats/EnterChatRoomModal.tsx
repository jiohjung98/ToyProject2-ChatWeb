'use client';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { EnterChatRoomModalProps } from './chatsStore';
import { textModalData } from './ModalTextData';

const EnterChatRoomModal = ({ isOpen, onEnterClick, onCancelClick, selectedChat }: EnterChatRoomModalProps) => {
  const handleEnterClick = () => {
    onEnterClick();
  };
  const handleCancelClick = () => {
    onCancelClick();
  };
  return (
    <Container style={{ display: isOpen ? 'flex' : 'none' }}>
      <Overlay onClick={handleCancelClick} />
      <ModalContainer>
        <ModalMainText>
          <span>{textModalData.enter}</span>
        </ModalMainText>
        <ModalBtnContainer>
          <EnterBtn onClick={handleEnterClick}>{textModalData.enterBtn}</EnterBtn>
          <CancelBtn onClick={handleCancelClick}>{textModalData.cancelBtn}</CancelBtn>
        </ModalBtnContainer>
      </ModalContainer>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4); /* 어두운 배경 색상 */
  z-index: 10000;
`;

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: transparent;
`;

const ModalContainer = styled.div`
  position: absolute;
  border: none;
  border-radius: 0.6rem;
  background-color: ${({ theme }) => theme.color.mainGreen};
  box-shadow: ${({ theme }) => theme.shadow.list};
`;

export default EnterChatRoomModal;

const ModalMainText = styled.div`
  margin: 1rem 0 0;
  padding: 1.2rem;

  height: 4rem;

  border-bottom: 1px solid #fff;
  span {
    font-weight: bold;
    font-size: ${({ theme }) => theme.fontSize.xl};
    text-align: center;
    color: #fff;
  }
`;

const ModalBtnContainer = styled.div`
  height: 3rem;

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
