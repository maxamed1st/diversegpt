import { create } from "zustand";
import { Persona } from "@/types/general";

interface PersonaStore {
  personas: Persona[] | undefined;
  setPersonas: (personas: Persona[]) => void;
  updatePersona: (updatedPersona: Persona) => void;
  clearPersonas: () => void;
  getPersonaName: (id: string) => string | undefined;
};

export const usePersonasStore = create<PersonaStore>()((set, get) => ({
  personas: undefined,
  setPersonas: (personas) => set({ personas }),
  updatePersona: (updatedPersona) =>
    set((state) => ({
      personas: state.personas?.map((persona) =>
        persona.id === updatedPersona.id
          ? {
            ...persona,
            name: updatedPersona.name,
            systemPrompt: updatedPersona.systemPrompt
          }
          : persona
      )
    })),
  clearPersonas: () => set({ personas: undefined }),
  getPersonaName: (id) => {
    const persona = get().personas?.find((persona) => persona.id === id);
    return persona?.name;
  }
}));
