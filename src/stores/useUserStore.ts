import { create } from 'zustand';

export type UserRole = 'SURVEYOR' | 'ADMIN' | 'SUPERADMIN';

export type User = {
  id: string;
  username: string;
  role: UserRole;
  token: string;
  name: string;
  email: string;
};

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
}));
