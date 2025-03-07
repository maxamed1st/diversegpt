'use client';

import { Message } from '@/types/general';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { usePersonasStore } from '@/store/usePersonasStore';

interface MessageBoxProps {
  messages: Message[];
  userId: string;
  hasMore: boolean;
  onLoadMoreAction: () => void;
  isLoading: boolean;
  error: string | null;
}

const MessageSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-end">
        <div className="max-w-[80%] p-3 rounded-lg bg-base-300 animate-pulse">
          <div className="h-4 bg-base-100/50 rounded w-[200px]" />
          <div className="h-4 bg-base-100/50 rounded w-[150px] mt-2" />
        </div>
      </div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex justify-start">
        <div className="max-w-[80%] p-3 rounded-lg bg-base-300 animate-pulse">
          <div className="h-4 bg-base-100/50 rounded w-[200px]" />
          <div className="h-4 bg-base-100/50 rounded w-[150px] mt-2" />
        </div>
      </div>
    ))}
  </div>
);

export default function MessageBox({ 
  messages, 
  userId, 
  hasMore, 
  onLoadMoreAction, 
  isLoading,
  error 
}: MessageBoxProps) {
  const [collapsedMessages, setCollapsedMessages] = useState<Set<string>>(new Set());

  const toggleCollapse = (messageId: string) => {
    setCollapsedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
      {hasMore && (
        <button 
          onClick={onLoadMoreAction} 
          disabled={isLoading}
          className={`w-full text-sm text-gray-500 hover:text-gray-700 mb-4 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Loading...' : 'Load more messages'}
        </button>
      )}
      {isLoading && messages.length === 0 ? (
        <MessageSkeleton />
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const isUser = !message.fromPersonaId;
            const isCollapsed = !isUser && collapsedMessages.has(message.id);
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    isUser 
                      ? 'bg-base-200 rounded-br-none cursor-default' 
                      : 'bg-base-300 rounded-bl-none cursor-pointer hover:bg-base-200'
                  } ${!isUser && 'flex items-start gap-2'}`}
                  onClick={() => !isUser && toggleCollapse(message.id)}
                >
                  <div className="space-y-1">
                    {!isUser && (
                      <div className="text-sm font-medium text-base-content/70">
                        {usePersonasStore.getState().getPersonaName(message.fromPersonaId!)}
                      </div>
                    )}
                    <div>{isCollapsed 
                      ? message.content.slice(0, 100) + '...' 
                      : message.content}
                    </div>
                  </div>
                  {!isUser && (
                    <div className="flex-shrink-0 mt-1">
                      {isCollapsed 
                        ? <ChevronDown className="w-4 h-4" /> 
                        : <ChevronUp className="w-4 h-4" />
                      }
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
