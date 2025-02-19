import { Plus } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useChatListStore } from "@/store/useChatListStore"
import { Chat } from "@/types/general";

export default function ChatList() {
  const router = useRouter();
  const { chats, setChats } = useChatListStore();

  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await fetch("/api/chats");
        const data: Chat[] = await response.json();
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    }
    fetchChats();
  }, [])

  return (
    <div className="p-12 flex-1 overflow-y-auto flex flex-col space-y-4">
      <button
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary text-primary-content hover:bg-primary/80 transition"
        onClick={() => router.push("/chat/new")}
      >
        <Plus className="w-5 h-5" />
        New Chat
      </button>
      {chats?.length > 0 && chats.map((chat, index) => (
        <button
          key={index}
          className="flex items-center gap-3 px-4 py-2 bg-base-200 hover:bg-base-300 transition"
          onClick={() => router.push(`/chat/${chat.id}`)}
        >
          {chat.name}
        </button>
      ))
      }
    </div>
  )
}
