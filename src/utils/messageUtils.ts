import { Message } from '@/types/general';

export const createOptimisticUserMessage = (content: string, chatId: string): Message => ({
  id: crypto.randomUUID(),
  content,
  chatId,
  fromUserId: undefined,
  fromPersonaId: undefined,
  createdAt: new Date(),
});

export const createLoadingMessage = (chatId: string): Message => ({
  id: crypto.randomUUID(),
  content: 'loading...',
  chatId,
  fromUserId: undefined,
  fromPersonaId: 'loading-indicator',
  createdAt: new Date(),
});

export const sortMessages = (msgs: Message[]): Message[] => {
  return [...msgs].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
};

