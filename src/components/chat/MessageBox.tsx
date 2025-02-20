'use client';

import { Message } from '@/types/general';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MessageBoxProps {
  messages: Message[];
  userId: string;
  hasMore: boolean;
  onLoadMoreAction: () => void;
  error: string | null;
}

export default function MessageBox({ 
  messages, 
  userId, 
  hasMore, 
  onLoadMoreAction, 
  error 
}: MessageBoxProps) {
  const [collapsedMessages, setCollapsedMessages] = useState<Set<string>>(new Set());

  // Sort messages by createdAt
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

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
          className="w-full text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          Load more messages
        </button>
      )}
      <div className="space-y-4">
        {sortedMessages.map((message) => {
          const isUser = message.fromUserId === userId;
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
                <div>{isCollapsed 
                  ? message.content.slice(0, 100) + '...' 
                  : message.content}
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
    </div>
  );
}
