import { Session } from "next-auth";

export type Persona = {
  id: string;
  name: string;
  systemPrompt: string;
  userId: string;
}

export type ExtendedSession = {
  data: (Session & {
    personas: Persona[];
  }) | null;
};

export type chatType = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
}

export type chatPersonaType = {
  id: string;
  chatId: string;
  personaId: string;
}

export type Chat = {
  id: string;
  name: string;
  createdAt: Date;
}

export type Message = {
  id: string;
  chatId: string;
  content: string;
  fromUserId: string | undefined;
  fromPersonaId: string | undefined;
  createdAt: Date;
}
