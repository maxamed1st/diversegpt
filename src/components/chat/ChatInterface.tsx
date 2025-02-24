'use client';

import { useRouter } from 'next/navigation';
import { useChatListStore } from '@/store/useChatListStore';
import MessageInput from './MessageInput';
import MessageBox from './MessageBox'
import { useMessages } from '@/hooks/handleMessages';
import { Chat } from "@/types/general";

interface ChatInterfaceProps {
  chatId: string | null;
  isNewChat: boolean;
  userId: string;
  initialPersonas?: any[];
}

export default function ChatInterface({ 
  chatId, 
  isNewChat, 
  userId,
  initialPersonas 
}: ChatInterfaceProps) {
  const router = useRouter();
  const { addChat } = useChatListStore();
  
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    loadMoreMessages, 
    hasMore,
    isSending 
  } = useMessages({
    chatId: chatId || '',
    initialMessages: []
  });

  const handleMessageSubmit = async (message: string) => {
    if (isSending) return;

    try {
      if (isNewChat) {
        // Create new chat
        const createChat = await fetch('/api/chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message, // Used for chat name generation
            personaIds: initialPersonas?.map(p => p.id) || []
          }),
        });

        if (!createChat.ok) {
          throw new Error('Failed to create chat');
        }

        const { chat }: { chat: Chat } = await createChat.json();
        
        // Add to store
        addChat(chat);

        // Send the initial message
        await sendMessage(message, chat.id);

        // Redirect to new chat
        router.push(`/chat/${chat.id}`);
      } else if (chatId) {
        await sendMessage(message);
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error (show toast/notification)
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen w-full">
      {/* Main chat container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Messages area - takes up most of the space */}
        <div className="flex-1 overflow-auto">
          <MessageBox
            messages={messages}
            userId={userId}
            hasMore={hasMore}
            onLoadMoreAction={loadMoreMessages}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Message input - fixed at bottom */}
        <div className="flex-shrink-0 p-4">
          <MessageInput 
            action={handleMessageSubmit}
            disabled={isSending || isLoading}
          />
        </div>
      </div>
    </div>
  );
}

