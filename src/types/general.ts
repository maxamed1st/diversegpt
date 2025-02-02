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
