'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useChatListStore } from '@/store/useChatListStore';
import { useUserStore } from '@/store/useUserStore';
import { useToastStore } from '@/components/Toast';
import MessageInput from './MessageInput';
import MessageBox from './MessageBox'
import { useMessages } from '@/hooks/handleMessages';
import { Chat, Message } from "@/types/general";
import { createOptimisticUserMessage, createLoadingMessage } from '@/utils/messageUtils';

interface ChatInterfaceProps {
  chatId: string | null;
  isNewChat: boolean;
  initialPersonas?: any[];
}

export default function ChatInterface({ 
  chatId, 
  isNewChat, 
  initialPersonas 
}: ChatInterfaceProps) {
  const router = useRouter();
  const { addChat } = useChatListStore();
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  
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

  const displayMessages = isNewChat ? localMessages : messages;
  const isProcessing = isSending || isCreatingChat;

  const handleMessageSubmit = async (message: string) => {
    if (isProcessing) return;

    try {
      if (isNewChat) {
        setIsCreatingChat(true);
        
        // Show optimistic updates immediately
        const tempChatId = 'temp-' + crypto.randomUUID();
        const userMessage = createOptimisticUserMessage(message, tempChatId);
        const loadingMessage = createLoadingMessage(tempChatId);
        setLocalMessages([userMessage, loadingMessage]);

        // Create new chat
        const createChat = await fetch('/api/chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message,
            personaIds: initialPersonas?.map(p => p.id) || []
          }),
        });

        if (!createChat.ok) {
          throw new Error('Failed to create chat');
        }

        const { chat }: { chat: Chat } = await createChat.json();
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
      useToastStore.getState().showToast(
        'Failed to send message',
        'error'
      );
    }
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* Main chat container */}
        {/* Messages area - scrollable area */}
        <div className="flex-1 overflow-y-auto">
        <MessageBox
          messages={displayMessages}
          hasMore={!isNewChat && hasMore}
          onLoadMoreAction={loadMoreMessages}
          isLoading={isLoading}
          error={error}
        />
        </div>

        {/* Message input - fixed at bottom */}
        <div className="flex-shrink-0 p-4">
          <MessageInput 
            action={handleMessageSubmit}
            disabled={isProcessing || isLoading}
            subscriptionStatus={useUserStore().user?.subscriptionStatus}
          />
        </div>
    </div>
  );
}

