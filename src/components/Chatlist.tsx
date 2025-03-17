import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useChatListStore } from "@/store/useChatListStore"
import { Chat } from "@/types/general";
import { useToastStore } from "@/components/Toast";

export default function ChatList({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) {
  const router = useRouter();
  const { chats, setChats } = useChatListStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await fetch("/api/chats");
        const { chats: data }: { chats: Chat[] } = await response.json();
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
        useToastStore.getState().showToast("Failed to fetch chats", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchChats();
  }, []);

  return (
    <div className="p-12 flex-1 overflow-y-auto flex flex-col space-y-4">
      <button
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary text-primary-content hover:bg-primary/80 transition"
        onClick={() => {
          router.push("/chat/new")
          setIsOpen(false) 
          }}
      >
        <Plus className="w-5 h-5" />
        New Chat
      </button>
      
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="animate-pulse h-12 bg-base-200 rounded"
            />
          ))}
        </div>
      ) : chats?.length > 0 ? (
        chats.map((chat) => (
          <button
            key={chat.id}
            className="flex items-center gap-3 px-4 py-2 bg-base-200 hover:bg-base-300 transition rounded"
            onClick={() => {
                router.push(`/chat/${chat.id}`)
                setIsOpen(false)
                }}
          >
            {chat.name}
          </button>
        ))
      ) : (
        <div className="text-center text-base-content/60">
          No chats yet. Start a new conversation!
        </div>
      )}
    </div>
  );
}
