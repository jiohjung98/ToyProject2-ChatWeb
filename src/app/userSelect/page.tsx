'use client';
import { UserSelectionModal } from '@/components/Users/UserSelectionModal';
import { instance } from '@/lib/api';
import { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components'
import { MdClose, MdSearch } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { Chat } from '@/components/chats/chatsStore';
import { getCookie } from '@/lib/cookie';
interface User {
    id: string;
    password: string;
    name: string;
    picture: string;
    chats: string[];
}
interface ResponseBody {
    chats: [{ id: string; name: string }];
}
function UserSelect() {
    const [users, setUsers] = useState<User[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const router = useRouter();
  const [newChatId, setNewChatId] = useState<string | null>(null);
  const accessToken = getCookie('accessToken');
//   const accessToken = sessionStorage.getItem('accessToken');
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
//   const userId = getCookie('userId');
    const [isPrivate, setIsPrivate] = useState(true); 
    const [showModal, setShowModal] = useState(false);
    const [chatName, setChatName] = useState('');
    const [myChats, setMyChats] = useState<Chat[]>([]);
    const enterChatRoom = (chat: Chat) => {
        if (chat.id && chat.users) {
            const users = chat.users
                .map((user) => `[name:${user.username}, id:${user.id}, picture:${user.picture}]`)
                .join(',');
            const latestMessageQuery = JSON.stringify(chat.latestMessage);
            router.push(
                `/chatting/${chat.id}`,
            );
        }
    };
    // const getMyChats = async () => {
    //     try {
    //         const res = await instance.get<Chat[], any>(`chat`);
    //         if (res) {
    //             console.log(res.chats)
    //             setMyChats(res.chats);
    //         } else {
    //             console.log('내 채팅 데이터 조회 실패');
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };
  
    // useEffect(() => {
    //     getMyChats()
    //  }, []);
       
    const handleChatClick = async () => {
        if (selectedUsers.length === 1) {
            const selectedUser = selectedUsers[0];
            try {
                const res = await instance.get<unknown, ResponseBody>(`chat`);
                if (res) {
                  const { chats } = res;
                  const chatName = `1:1 Chat with ${selectedUser.name}`;
                  const existingChat = chats ? chats.find((chat) => chat.name === chatName) : null;
                    if (existingChat) {
                        // 이미 존재하는 채팅방으로 이동
                        enterChatRoom(existingChat);
                        console.log('이미 채팅방이 존재해요. 그 채팅방으로 이동하겠습니다.')
                        console.log(existingChat)
                        console.log(userId)
                        console.log(selectedUser.id)
                        console.log(selectedUser.name)
        
                    } else {
                        // 채팅방이 없으면 채팅방 생성 후 이동
                        console.log('채팅방이 없습니다. 새로운 채팅방을 생성하겠습니다.')
                        const isPrivate = true;
                        console.log(selectedUser)
                        console.log(selectedUser.id)
                        console.log(selectedUser.name)
        
                        console.log(myChats)
                        console.log(existingChat)
                        createChatRoom(chatName, isPrivate)
                        console.log(userId)
                    }
                } else {
                    console.error('선택된 사용자의 ID가 없습니다.');
                    console.log(userId)
                }
            } catch (error) {
                console.error(error);
            }
        }
        else {
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
          const selectedUserIds = selectedUsers.map((user) => user.id);
          console.log(userId, selectedUserIds);
          const sortedUserIds = [userId, ...selectedUserIds].sort();   
          console.log(sortedUserIds);
      
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
            router.push(`/chatting/${data.id}`);
          } else {
            console.error('채팅방 생성 실패');
            console.log(userId)
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
                {selectedUsers.length > 0 && (
                <ChatButtonWrapper>
                    <ChatButton onClick={handleChatClick}>채팅하기</ChatButton>
                </ChatButtonWrapper>
                )}
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
            {showModal && (
                <Modal>
                    <ModalContent>
                        <h2>단체채팅 만들기</h2>
                        {selectedUsers.length > 1 && (
                            <>
                                <label>비밀채팅방으로 만드시겠습니까?</label>
                                <input
                                    id='checkbox-wrapper'
                                    type="checkbox"
                                    checked={isPrivate}
                                    onChange={() => setIsPrivate(!isPrivate)}
                                />
                            </>
                        )}
                        <input
                            id='chatName-wrapper'
                            type="text"
                            value={chatName}
                            onChange={(e) => setChatName(e.target.value)}
                            placeholder="채팅방 이름을 입력하세요" 
                        />
                        <div className='button-wrapper'>
                            <ModalButton onClick={handleCloseModal}>취소</ModalButton>
                            <ModalButton onClick={handleGroupChatCreate}>완료</ModalButton>
                        </div>
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
    top: 4rem;
    right: 3rem; 
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
  border-radius: 12px; 
  width: 400px;
  height: 280px;
  text-align: left; 
  h2 {
    margin-bottom: 20px;
    color: #00956e;
  }
  .checkbox-wrapper {
    display: flex;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 20px;
    height: 20px;
    label {
      margin-right: 5px; 
      white-space: nowrap;
    }
    input {
      margin-right: 5px;
    }
  }
  #chatName-wrapper {
    margin-top: 1rem;
    width: calc(100% - 16px);
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  .group-chat-text {
    margin-top: 10px;
    font-size: 0.9rem;
    color: #777;
  }
  .button-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 3rem;
  }
`;
const ModalButton = styled.button`
  background-color: #00956e;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 1rem;
`;