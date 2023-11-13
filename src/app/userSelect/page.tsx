'use client';
import { UserSelectionModal } from '@/components/Users/UserSelectionModal';
import { instance } from '@/lib/api';
import { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MdClose, MdSearch } from 'react-icons/md';
import { useRouter } from 'next/navigation';


interface User {
    id: string;
    password: string;
    name: string;
    picture: string;
    chats: string[];
}

function UserSelect() {
    const [users, setUsers] = useState<User[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const router = useRouter();
    const [newChatId, setNewChatId] = useState<string | null>(null);
    const accessToken = sessionStorage.getItem('accessToken');
    const userId = sessionStorage.getItem('userId');

    const [isPrivate, setIsPrivate] = useState(true); 
    const [showModal, setShowModal] = useState(false);
    const [chatName, setChatName] = useState('');

    // 채팅방
    const handleChatClick = () => {
        if (selectedUsers.length === 1) {
            createChatRoom(`${userId}와 ${selectedUsers[0].name} 1:1 채팅방`, isPrivate);
        } else {
            setShowModal(true);
        }
    };
    
    // 모달 닫기
    const handleCloseModal = () => {
        setShowModal(false);
        setChatName(''); 
        setIsPrivate(true); 
    };

    // 그룹 채팅방
    const handleGroupChatCreate = () => {
        if (!chatName) {
            console.log('채팅방 이름이 입력되지 않았습니다');
            return;
        }

        createChatRoom(chatName, isPrivate);
        setShowModal(false);
    };

  const createChatRoom = async (name: string, isPrivate: boolean) => {
    try {
      const selectedUserIds = selectedUsers.map(user => user.id);

      const response = await fetch('https://fastcampus-chat.net/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'serverId': `${process.env.NEXT_PUBLIC_SERVER_KEY}`,
        },
        body: JSON.stringify({
          name,
          users: [userId, ...selectedUserIds],
          isPrivate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const generatedChatId = `group_${data.id}`;
        setNewChatId(generatedChatId);
        router.push(`/chating/${data.id}?chatId=${generatedChatId}`);
      } else {
        console.error('채팅방 생성 실패');
      }
    } catch (error) {
      console.error('채팅방 생성 중 오류 발생:', error);
    }
  };

    const handleUserSelect = (user: User) => {
        if (selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
            setSelectedUsers(prevSelectedUsers => prevSelectedUsers.filter(selectedUser => selectedUser.id !== user.id));
        } else {
            setSelectedUsers(prevSelectedUsers => [...prevSelectedUsers, user]);
        }
    };

    const getUsers = async () => {
        try {
            let res = await instance.get<unknown, User[]>('/users');
            res = res.filter((user) => user.id !== sessionStorage.getItem('userId'));
            setUsers(res);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    /**사용자 검색 */
    const [userInput, setUserInput] = useState('');
    const getInputValue = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };
    const searched = users.filter((user) => user.name.includes(userInput));

    const clearSearchInput = () => {
        setUserInput('');
    };


    return (
        <>
            <UsersWrap>
                <HeaderText>사용자 선택</HeaderText>
                <SearchUserBox>
                    <SearchButton>
                        <MdSearch className="searchIcon" size="35" color="white" />
                    </SearchButton>
                    <SearchUserInput
                        value={userInput}
                        onChange={getInputValue}
                        type="text"
                        placeholder="사용자를 검색해보세요"
                    />
                    <ClearButton>
                        {userInput && <MdClose className="clearIcon" size="25" onClick={clearSearchInput} />}
                    </ClearButton>
                </SearchUserBox>
                <UserList>
                    {loading && <Loading />}
                    {searched.length !== 0
                        ? searched.map((user: User) => {
                              return <UserSelectionModal key={user.id} user={user}  onUserSelect={handleUserSelect}    />;
                          })
                        : !loading && (
                              <NoUserWrap>
                                  <NoUserText>해당 사용자가 존재하지 않습니다.</NoUserText>
                              </NoUserWrap>
                          )}
                </UserList>
                {selectedUsers.length > 0 && (
                <ChatButtonWrapper>
                    <ChatButton onClick={handleChatClick}>채팅하기</ChatButton>
                </ChatButtonWrapper>
                )}
            {showModal && (
                <Modal>
                    <ModalContent>
                        <h2>채팅방 정보 입력</h2>
                        <label>채팅방 이름</label>
                        <input
                            type="text"
                            value={chatName}
                            onChange={(e) => setChatName(e.target.value)}
                        />
                        {selectedUsers.length > 1 && (
                            <>
                                <label>Private</label>
                                <input
                                    type="checkbox"
                                    checked={isPrivate}
                                    onChange={() => setIsPrivate(!isPrivate)}
                                />
                            </>
                        )}
                        <ModalButton onClick={handleCloseModal}>취소</ModalButton>
                        <ModalButton onClick={handleGroupChatCreate}>완료</ModalButton>
                    </ModalContent>
                </Modal>
            )}
            </UsersWrap>
        </>
    );
}

export default UserSelect;

const UsersWrap = styled.div`
    padding: 3rem;

    display: flex;
    flex-direction: column;

    height: 100vh;
`;

const HeaderText = styled.h1`
    color: #00956e;

    margin-top: 0;

    padding: 1rem;
`;

const UserList = styled.div`
    margin-top: 2rem;

    padding: 1rem;

    height: 80%;

    overflow-y: auto;
`;

const NoUserWrap = styled.div`
    text-align: center;

    margin-top: 8rem;

    display: flex;
    flex-direction: column;
    gap: 3rem;
`;

const NoUserText = styled.h2`
    color: #05664c;
`;

/**사용자 검색 */
const SearchUserBox = styled.div`
    background-color: white;

    border-radius: 20px;
    box-shadow: 0px 2px 30px 0px rgba(0, 0, 0, 0.15);

    width: 100%;
    height: 3.5rem;

    display: flex;
    gap: 3%;
`;

const SearchButton = styled.div`
    background-color: #00956e;
    width: 5rem;

    display: flex;
    align-items: center;
    justify-content: center;

    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
`;

const SearchUserInput = styled.input`
    border: none;

    width: 32rem;

    outline: none;

    font-size: 1.2rem;
`;

const ClearButton = styled.div`
    margin-right: 2.5rem;

    display: flex;
    align-items: center;

    cursor: pointer;

    .clearIcon {
        color: #00956e;
        &:hover {
            color: #05664c;
            transition: 0.4s;
        }
    }
`;

const Loading = styled.div`
    width: 50px;
    height: 50px;

    border: 5.5px solid rgba(255, 255, 255, 0.3);
    border-top: 5.5px solid #00956e;
    border-radius: 50%;

    animation: spin 1s linear infinite;

    margin: 8rem auto 0;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;
const ChatButtonWrapper = styled.div`
    position: absolute;
    top: 3rem; /* 조절 필요한 만큼의 top 값을 주세요 */
    right: 3rem; /* 조절 필요한 만큼의 right 값을 주세요 */

    display: flex;
    justify-content: center;
    align-items: center;
`;

const ChatButton = styled.button`
    background-color: #00956e;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 1rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;

  h2 {
    margin-bottom: 20px;
    color: #00956e;
  }

  label {
    display: block;
    margin-top: 10px;
  }

  input {
    margin-top: 5px;
  }
`;

const ModalButton = styled.button`
  background-color: #00956e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
`;

const PrivateCheckbox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;

  input {
    margin-right: 0.5rem;
  }

  label {
    font-size: 1rem;
  }
`;