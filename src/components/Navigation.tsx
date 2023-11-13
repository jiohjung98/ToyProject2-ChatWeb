'use client';

import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import { BsFillPeopleFill, BsThreeDots } from 'react-icons/bs';
import { PiChatCircleBold, PiChatsCircleFill } from 'react-icons/pi';

export default function Navigation() {
    const pathname = usePathname();
    const path = pathname.split('/')[1];

    return (
        <NavigationContainer>
            <NavigationAnchor href="users">
                <BsFillPeopleFill size="35" color={path == 'users' ? '#00956e' : '#dbdbdb'} />
            </NavigationAnchor>
            <NavigationAnchor href="mychats">
                <PiChatCircleBold size="35" color={path == 'mychats' ? '#00956e' : '#dbdbdb'} />
            </NavigationAnchor>
            <NavigationAnchor href="allchats">
                <PiChatsCircleFill size="37" color={path == 'allchats' ? '#00956e' : '#dbdbdb'} />
            </NavigationAnchor>
            <NavigationAnchor href="#">
                <BsThreeDots size="35" color={path == '#' ? '#00956e' : '#dbdbdb'} />
            </NavigationAnchor>
        </NavigationContainer>
    );
}

const NavigationContainer = styled.div`
    width: 100%;
    height: 80px;

    position: absolute;
    bottom: 0;

    display: flex;

    background-color: #fff;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const NavigationAnchor = styled.a`
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    text-decoration: none;
`;
