import { atom } from 'recoil';

export const ChattingModalToggle = atom({
  key: 'ChattingModalToggle',
  default: false,
});

interface User {
  id: string;
  name: string;
  picture: string;
}

export const UserProfile = atom<User>({
  key: 'UserProfile',
  default: {
    id: '',
    name: '',
    picture: '',
  },
});

export const UserProfileModal = atom<boolean>({
  key: 'UserProfileModal',
  default: false,
});
