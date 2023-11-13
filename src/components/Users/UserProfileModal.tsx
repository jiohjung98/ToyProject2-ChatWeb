'use client';
import styled from 'styled-components';
import { ImBubble } from 'react-icons/im';
import { MdClose } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { BiSolidCircle } from 'react-icons/bi';

// types 폴더 나중에 만들어서 type 빼놓기
interface User {
    id: string;
    password: string;
    name: string;
    picture: string;
    chats: string[];
}

interface ConnectUserIdList {
    users: string[];
}

interface UserProfileModalProps {
    clickModal: () => void;
    user: User;
    connectUserIdList: ConnectUserIdList;
}

const UserProfileModal = ({ clickModal, user, connectUserIdList }: UserProfileModalProps) => {
    const router = useRouter();

    const { id, name, picture } = user;
    const accessToken = sessionStorage.getItem('accessToken');
    const userId = sessionStorage.getItem('userId');

    const handleChatClick = async () => {
        try {
            // 채팅 생성 API 호출
            const response = await fetch('https://fastcampus-chat.net/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    serverId: `${process.env.NEXT_PUBLIC_SERVER_KEY}`,
                },
                body: JSON.stringify({
                    name: `1:1 Chat with ${user.name}`,
                    users: [user.id],
                    isPrivate: true,
                }),
            });

            console.log(user.id, userId);

            if (response.ok) {
                const data = await response.json();
                const generatedChatId = `1on1_${user.id}_${userId}`;

                // 생성된 채팅 방으로 이동
                router.push(`/chating/${data.id}?chatId=${generatedChatId}`);
            } else {
                console.error('Failed to create chat room');
            }
        } catch (error) {
            console.error('Error creating chat room:', error);
        }
    };

    return (
        <UserModalBox onClick={clickModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={clickModal}>
                    <MdClose size="40" className="closeIcon" />
                </CloseButton>
                <ModalMain>
                    <UserImg src={picture} />
                    <UserInfo>
                        <UserName>{name}</UserName>
                        <UserState>
                            <BiSolidCircle
                                size="13"
                                color={connectUserIdList.users.includes(id) ? '#00956e' : '#950000'}
                            />
                            {connectUserIdList.users.includes(id) ? (
                                <UserStateTextBlack>online</UserStateTextBlack>
                            ) : (
                                <UserStateText>offline</UserStateText>
                            )}
                        </UserState>
                    </UserInfo>
                    <ToChating onClick={handleChatClick}>
                        <ImBubble size="30" className="chatIcon" />
                        <ChatText>1:1 채팅하기</ChatText>
                    </ToChating>
                </ModalMain>
            </ModalContent>
        </UserModalBox>
    );
};

export default UserProfileModal;

const UserModalBox = styled.div`
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    background-color: rgba(0, 0, 0, 0.4);

    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background-color: white;

    width: 600px;
    height: 500px;

    border-radius: 5%;

    margin: 0 2rem;

    display: flex;
    flex-direction: column;
`;

const CloseButton = styled.div`
    margin: 1.5rem 2.5rem 0 auto;

    cursor: pointer;

    .closeIcon {
        color: ${({ theme }) => theme.color.darkGray};
    }

    &:hover .closeIcon {
        color: ${({ theme }) => theme.color.mainGreen};
        transition: 0.4s;
    }
`;

const ModalMain = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
`;

const UserImg = styled.img`
    width: 150px;
    height: 150px;

    border-radius: 70%;

    overflow: hidden;

    margin-top: 5px;
`;

const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const UserName = styled.h1`
    font-size: ${({ theme }) => theme.fontSize.title};
    margin: 0;
`;

const ToChating = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    cursor: pointer;

    &:hover .chatIcon {
        color: ${({ theme }) => theme.color.mainGreen};
        transition: 0.4s;
    }
`;

const ChatText = styled.p`
    font-weight: 500;
    font-size: ${({ theme }) => theme.fontSize.md};
`;

const UserState = styled.div`
    display: flex;
    align-items: center;
    gap: 0.7rem;
`;

const UserStateText = styled.p`
    color: ${({ theme }) => theme.color.darkGray};
    font-size: ${({ theme }) => theme.fontSize.sm};
`;

const UserStateTextBlack = styled.p`
    color: black;
`;
