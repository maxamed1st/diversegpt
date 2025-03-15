"use client"

import { useState, useCallback, useEffect } from 'react';
import { Message } from '@/types/general';
import { sortMessages, createOptimisticUserMessage, createLoadingMessage } from '@/utils/messageUtils';

interface UseMessagesProps {
  chatId: string;
  initialMessages?: Message[];
}

interface PaginationInfo {
  offset: number;
  limit: number;
}

interface UseMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, overrideChatId?: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  hasMore: boolean;
  isSending: boolean;
}

export function useMessages({ chatId, initialMessages = [] }: UseMessagesProps): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    offset: 0,
    limit: 24,
  });

  // Fetch messages
  const fetchMessages = useCallback(async (offset: number, limit: number) => {
    try {
      setError(null);
      if (!chatId) return;
      const response = await fetch(
        `/api/chats/${chatId}/messages?offset=${offset}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const messages = data.messages || [];
      
      if (offset === 0) {
        setMessages(sortMessages(messages));
      } else {
        setMessages(prev => sortMessages([...messages, ...prev]));
      }
      
      setHasMore(!!data.hasMore);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
      throw err;
    }
  }, [chatId, sortMessages]);

  // Initial load
  useEffect(() => {
    const loadInitialMessages = async () => {
      setIsLoading(true);
      try {
        await fetchMessages(0, pagination.limit);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialMessages();
  }, [chatId, fetchMessages, pagination.limit]);

  // Load more messages
  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || isLoading) return;

    const newOffset = pagination.offset + pagination.limit;
    setPagination(prev => ({ ...prev, offset: newOffset }));
    
    await fetchMessages(newOffset, pagination.limit);
  }, [fetchMessages, hasMore, isLoading, pagination.limit, pagination.offset, sortMessages]);

  // Send message
  const sendMessage = useCallback(async (content: string, overrideChatId?: string) => {
    try {
      setIsSending(true);
      setError(null);

      // Add user message
      const userMessage = createOptimisticUserMessage(content, chatId);
      const loadingIndicator = createLoadingMessage(chatId);

      // Optimistically add user message
      setMessages(prev => sortMessages([...prev, userMessage, loadingIndicator]));

      const response = await fetch(`/api/chats/${overrideChatId || chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const updatedUserMessage: Message = {
        ...userMessage,
        fromUserId: data.fromUserId,
      };

      // Add AI responses
      const aiResponses: Message[] = data.responses.map((response: any) => ({
        id: response.id,
        content: response.content,
        chatId,
        createdAt: response.createdAt,
        fromPersonaId: response.fromPersonaId,
      }));

      setMessages(prev => {
        // Remove the optimistic user message and add the updated one with AI responses
        const withoutOptimistic = prev.filter(msg => msg.id !== userMessage.id && msg.id !== loadingIndicator.id);
        return sortMessages([...withoutOptimistic, updatedUserMessage, ...aiResponses]);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [chatId, sortMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    loadMoreMessages,
    hasMore,
    isSending,
  };
}
