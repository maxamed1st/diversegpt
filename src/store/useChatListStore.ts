import { create } from "zustand";
import { Chat } from "@/types/general";

interface ChatListStore {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  addChat: (newChat: Chat) => void;
}

export const useChatListStore = create<ChatListStore>()((set) => ({
  chats: [] as Chat[],
  setChats: (chats: Chat[]) => set({ chats: chats || [] }),
  addChat: (newChat: Chat) =>
    set((state) => ({
      chats: [...(Array.isArray(state.chats) ? state.chats : []), newChat],
    })),
}));
