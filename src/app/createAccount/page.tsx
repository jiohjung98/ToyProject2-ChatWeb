'use client';

import React from 'react';
import styled from 'styled-components';

// components
import RegisterForm from '@/components/Register/RegisterForm';

const page = () => {
    const accessToken = sessionStorage.getItem('accessToken');

    if (accessToken) {
        return null;
    } else {
        return (
            <CreatreAccountContainer>
                <RegisterForm />
            </CreatreAccountContainer>
        );
    }
};

export default page;

const CreatreAccountContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
