import { create } from 'zustand';
import { User } from 'firebase/auth';

interface UserState {
  user: User | null;
  credits: number;
  subscription: string | null;
  setUser: (user: User | null) => void;
  setCredits: (credits: number) => void;
  setSubscription: (plan: string | null) => void;
}

export const useStore = create<UserState>((set) => ({
  user: null,
  credits: 0,
  subscription: null,
  setUser: (user) => set({ user }),
  setCredits: (credits) => set({ credits }),
  setSubscription: (subscription) => set({ subscription }),
}));