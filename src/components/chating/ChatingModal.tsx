'use client';

import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { ChatingModalToggle } from '@/store/atoms';
import { useRouter } from 'next/navigation';
import InviteImg from '../../../public/assets/InviteImg.svg';

interface User {
    username: string;
    id: string;
    picture: string;
}

interface ChatingModalProps {
    users: User[];
    chatId: string;
}

//type
export default function ChatingModal(props: ChatingModalProps) {
    const [modalToggle, setModalToggle] = useRecoilState<boolean>(ChatingModalToggle);
    const router = useRouter();

    const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;

    const leaveChating = async () => {
        await fetch('https://fastcampus-chat.net/chat/leave', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                serverId: `${process.env.NEXT_PUBLIC_SERVER_KEY}`,
            },
            body: JSON.stringify({
                chatId: props.chatId,
            }),
        });
        router.back();
    };

    console.log(props, 'props');

    return (
        <>
            <ModalWrapper
                style={{
                    opacity: `${modalToggle ? '1' : '0'}`,
                    transform: `${modalToggle ? 'translateZ(0)' : 'translate3d(100%, 0, 0)'}`,
                }}
            >
                <ModalTitle>대화상대</ModalTitle>
                {props.users ? (
                    <UsersWrapper>
                        {props.users.map((user: User) => (
                            <UserWrapper>
                                <UserImg src={user.picture} />
                                <UserName>{user.username}</UserName>
                            </UserWrapper>
                        ))}
                        <UserInviteWrapper>
                            <UserInviteImg />
                            <UserInviteName>초대하기</UserInviteName>
                        </UserInviteWrapper>
                    </UsersWrapper>
                ) : (
                    ''
                )}
                <ChatingLeave
                    onClick={() => {
                        setModalToggle(!modalToggle);
                        leaveChating();
                    }}
                >
                    채팅방 나가기
                </ChatingLeave>
            </ModalWrapper>

            <ModalBackground
                style={{
                    visibility: `${modalToggle ? 'visible' : 'hidden'}`,
                    opacity: `${modalToggle ? '1' : '0'}`,
                }}
                onClick={() => setModalToggle(!modalToggle)}
            ></ModalBackground>
        </>
    );
}

const ModalBackground = styled.div`
    width: 100%;
    height: 100vh;

    position: absolute;
    z-index: 2;

    background-color: rgba(0, 0, 0, 0.2);

    transition: all 0.5s;
`;

const ModalWrapper = styled.div`
    width: 70%;
    height: 100%;

    background-color: #fff;

    position: absolute;
    right: 0;

    z-index: 3;

    transition: 0.5s;
`;

const ModalTitle = styled.div`
    width: 100%;
    font-size: 24px;

    padding-left: 20px;
    padding-top: 20px;

    font-weight: 700;
`;

const UsersWrapper = styled.div`
    width: 100%;
    height: 80%;

    overflow: scroll;
    padding-left: 30px;
    padding-top: 30px;
`;

const UserWrapper = styled.div`
    width: 100%;

    display: flex;
    align-items: center;

    margin-bottom: 20px;
`;

const UserImg = styled.img`
    width: 50px;
    height: 50px;

    border-radius: 25px;
`;

const UserName = styled.div`
    font-size: 24px;
    margin-left: 10px;
`;

const UserInviteWrapper = styled.div`
    width: 100%;

    display: flex;
    align-items: center;

    margin-bottom: 20px;
`;

const UserInviteImg = styled(InviteImg)`
    width: 50px;
    height: 50px;

    border-radius: 25px;
    cursor: pointer;
`;

const UserInviteName = styled.div`
    font-size: 24px;
    margin-left: 10px;

    color: #00956e;
    cursor: pointer;
`;

const ChatingLeave = styled.div`
    font-size: 30px;
    color: #950000;

    position: absolute;
    bottom: 0;

    left: 50%;
    transform: translate(-50%, -50%);

    cursor: pointer;
`;
