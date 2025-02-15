import { create } from "zustand";
import { Chat } from "@/types/general";

interface ChatListStore {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  addChat: (newChat: Chat) => void;
};

export const useChatListStore = create<ChatListStore>()((set) => ({
  chats: [],
  setChats: (chats: Chat[]) => set({ chats }),
  addChat: (newChat) =>
    set((state) => ({
      chats: state.chats ? [newChat, ...state.chats] : [newChat],
    })),
}));
