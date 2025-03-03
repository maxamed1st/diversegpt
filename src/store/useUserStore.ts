import { ExtendedUser } from "@/types/general";
import { create } from "zustand";

interface UserStore {
  user: ExtendedUser | undefined;
  setUser: (user: ExtendedUser) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>()((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: undefined}),
}));
