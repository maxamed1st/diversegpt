import { create } from "zustand";
import { User } from "next-auth";

interface UserStore {
  user: User | undefined;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>()((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: undefined}),
}));
