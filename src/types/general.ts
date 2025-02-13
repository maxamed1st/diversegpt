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
