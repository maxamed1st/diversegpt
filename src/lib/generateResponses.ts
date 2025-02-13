import { createMessage, getChatPersonas } from "@/db/queries/chatQueries"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export default async function generateResponses ({
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

  // Generate and save responses from each persona
  try {
    const responses = await Promise.all(chatPersonas.map(async (persona) => {
      const result = await generateText({
        model: anthropic('claude-3-5-sonnet-latest'),
        system: persona.systemPrompt,
        prompt: userMessage,
      })
      await createMessage({
        chatId,
        content: result.text,
        fromUserId: persona.personaId,
      });
      return {
        text: result.text,
        personaId: persona.personaId
      }
    }));

    return responses;
  }
  catch (error) {
    console.error('Error generating responses:', error);
    throw error;
  }
}
