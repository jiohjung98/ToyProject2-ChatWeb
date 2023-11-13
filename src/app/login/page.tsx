'use client';

import React from 'react';
import styled from 'styled-components';

// components
import LoginForm from '@/components/Login/LoginForm';

const page = () => {
    const accessToken = sessionStorage.getItem('accessToken');

    if (accessToken) {
        return null;
    } else {
        return (
            <LoginContainer>
                <LoginForm />
            </LoginContainer>
        );
    }
};

export default page;

const LoginContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
