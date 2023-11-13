import { Chat } from './chatsStore';

export const formatCreatedAt = (createdAt: Date) => {
    const date = new Date(createdAt);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? '오후' : '오전';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${amOrPm} ${formattedHours}시 ${formattedMinutes}분`;
};

export const sortTime = (chats: Chat[]) => {
    return [...chats].sort((a, b) => {
        const aDateTime = new Date(a.latestMessage?.createdAt || 0);
        const bDateTime = new Date(b.latestMessage?.createdAt || 0);
        return bDateTime.getTime() - aDateTime.getTime();
    });
};
