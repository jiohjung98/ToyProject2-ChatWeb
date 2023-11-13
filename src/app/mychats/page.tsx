'use client';

import React, { useState } from 'react';
import ChatPage from '@/components/chats/ChatPage';
import Navigation from '@/components/Navigation';

const MyChats = () => {
    const userId = typeof window !== 'undefined' ? sessionStorage.getItem('userId') : null;
    return (
        <>
            <ChatPage userType="my" />
            <Navigation />
        </>
    );
};

export default MyChats;
