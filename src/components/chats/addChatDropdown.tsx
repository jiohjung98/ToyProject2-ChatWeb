'use client';
import React, { useState } from 'react';

import styled from 'styled-components';
import { Wrapper } from './ChatPage';

const AddChatDropdown = () => {
    return (
        <Wrapper>
            <DropdownContainer>
                <PrivateBtn>PRIVATE</PrivateBtn>
                <OpenBtn>OPEN</OpenBtn>
            </DropdownContainer>
        </Wrapper>
    );
};

export default AddChatDropdown;

const DropdownContainer = styled.div`
    border: 1px solid #00956e;
    border-radius: 1rem;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1;
`;

const PrivateBtn = styled.button`
    background-color: #00956e;
    color: #fff;
    font-weight: bold;
    border: 1px solid #fff;
    border-radius: 1rem;
    margin: 0.2rem 0.5rem 0;
    box-sizing: border-box;
    overflow: hidden;
`;
const OpenBtn = styled(PrivateBtn)``;
