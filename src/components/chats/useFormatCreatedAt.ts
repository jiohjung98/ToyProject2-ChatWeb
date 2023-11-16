import { Chat } from './chatsStore';

// createdAt 시간 한글화 하는 함수
export const formatCreatedAt = (createdAt: Date) => {
  const date = new Date(createdAt);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = hours >= 12 ? '오후' : '오전';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${amOrPm} ${formattedHours}시 ${formattedMinutes}분`;
};

// lateset message 최근 순으로 오게 정렬하는 함수
export const sortTime = (chats: Chat[]) => {
  if (!Array.isArray(chats)) {
    return [];
  }
  return [...chats].sort((a, b) => {
    const aDateTime = new Date(a.latestMessage?.createdAt || 0);
    const bDateTime = new Date(b.latestMessage?.createdAt || 0);
    return bDateTime.getTime() - aDateTime.getTime();
  });
};
