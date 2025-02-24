
import { create } from "zustand";
import { Chat } from "@/types/general";

interface ChatListStore {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  addChat: (newChat: Chat) => void;
}

const sortChats = (chats: Chat[]) => {
  return [...chats].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const useChatListStore = create<ChatListStore>()((set) => ({
  chats: [] as Chat[],
  setChats: (chats: Chat[]) => set({ 
    chats: sortChats(chats || [])
  }),
  addChat: (newChat: Chat) =>
    set((state) => ({
      chats: sortChats([...(Array.isArray(state.chats) ? state.chats : []), newChat])
    })),
}));
