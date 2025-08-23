import { create } from 'zustand';

export type UserRole = 'surveyor' | 'admin' | 'superadmin' | null;

export type User = {
  id: string | null;
  username: string | null;
  role: UserRole;
};

interface UserStore {
  user: User;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: {
    id: null,
    username: null,
    role: null,
  },
  setUser: (user: User) => set({ user }),
}));
