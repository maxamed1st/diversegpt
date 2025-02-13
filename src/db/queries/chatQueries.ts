import { and, desc, eq } from "drizzle-orm"
import { db } from "../index"
import { message, chat, chatPersona, personas } from "../schema"
import { chatPersonaType, chatType, Persona } from "@/types/general"

// Get all messages in a chat (ordered by creation time)
export const getAllChatMessages = async (chatId: string) => {
  return await db.select()
    .from(message)
    .where(eq(message.chatId, chatId))
    .orderBy(desc(message.createdAt))
}

// Get 1-on-1 conversation between user and specific persona
export const getOneOnOneConversation = async (chatId: string, personaId: string) => {
  return await db.select()
    .from(message)
    .where(
      and(
        eq(message.chatId, chatId),
        eq(message.fromPersonaId, personaId)
      )
    )
    .orderBy(desc(message.createdAt))
}

// Get all personas in a chat
export const getChatPersonas = async (chatId: string) => {
  return await db.select({
    chatId: chatPersona.chatId,
    personaId: chatPersona.personaId,
    name: personas.name,
    systemPrompt: personas.systemPrompt
  })
    .from(chatPersona)
    .innerJoin(personas, eq(chatPersona.personaId, personas.id))
    .where(eq(chatPersona.chatId, chatId))
}

// Create a new message
export const createMessage = async ({
  chatId,
  content,
  fromUserId,
  fromPersonaId,
}: {
  chatId: string
  content: string
  fromUserId?: string
  fromPersonaId?: string
}) => {
  return await db.insert(message)
    .values({
      chatId,
      content,
      fromUserId,
      fromPersonaId,
    })
    .returning()
}

// Create a new chat
export const createChat = async ({
  name,
  userId,
  personaIds,
}: {
  name: string
  userId: string
  personaIds: string[]
}) => {
  const [newChat] = await db.insert(chat)
    .values({
      name,
      userId,
    })
    .returning()

  // Add personas to chat
  let chatPersonas: chatPersonaType[] = []
  if (personaIds.length > 0) {
    chatPersonas = await db.insert(chatPersona)
      .values(
        personaIds.map(personaId => ({
          chatId: newChat.id,
          personaId,
        }))
      )
      .returning()
  }

  return {
    chatId: newChat.id,
    name: newChat.name,
  }
}

// Get chat details with personas
export const getChatDetails = async (chatId: string) => {
  const chatDetails = await db.select()
    .from(chat)
    .where(eq(chat.id, chatId))
    .limit(1)

  const chatPersonas = await getChatPersonas(chatId)

  return {
    ...chatDetails[0],
    personas: chatPersonas
  }
}

