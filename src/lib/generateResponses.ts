import { createMessage, getChatMessages, getChatPersonas } from "@/db/queries/chatQueries"
import { generateText, LanguageModel } from "ai"
import { openai } from "@ai-sdk/openai"

export default async function generateResponses({
  chatId,
  userMessage,
  userId
}: {
  chatId: string,
  userMessage: string,
  userId: string
}) {
  // First, save the user's message
  await createMessage({
    chatId,
    content: userMessage,
    fromUserId: userId,
  });

  // Get all personas in this chat with their system prompts
  const chatPersonas = await getChatPersonas(chatId);

  // Get recent messages for context
  const recentMessages = await getChatMessages(chatId, 1, 12); 
  // Format each message in a consistent way
  const context = recentMessages.reverse().map((message) => {
    const role = message.fromUserId === userId ? 'user' : chatPersonas.filter(persona => persona.personaId === message.fromPersonaId)[0].name;
    return `role: ${role}\ncontent: ${message.content}`;
  }).join('\n\n');

  // Generate and save responses from each persona
  try {
    const responses = await Promise.all(chatPersonas.map(async (persona) => {
      const result = await generateText({
        model: openai('gpt-4o-mini') as LanguageModel,
        system: persona.systemPrompt,
        maxTokens: 1200,
        prompt: context + "\n\n" + `role: user\ncontent: ${userMessage}\n\nrole: ${persona.name}\ncontent: `,
      })
      const [savedMessage] = await createMessage({
        chatId,
        content: result.text,
        fromPersonaId: persona.personaId,
      });
      return {
        id: savedMessage.id,
        content: result.text,
        fromPersonaId: persona.personaId,
        createdAt: savedMessage.createdAt,
      }
    }));

    return responses;
  }
  catch (error) {
    console.error('Error generating responses:', error);
    throw error;
  }
}
