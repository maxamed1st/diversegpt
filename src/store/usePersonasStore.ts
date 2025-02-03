import { create } from "zustand";
import { Persona } from "@/types/general";

interface PersonaStore {
  personas: Persona[] | undefined;
  setPersonas: (personas: Persona[]) => void;
  updatePersona: (updatedPersona: Persona) => void;
  clearPersonas: () => void;
};

export const usePersonasStore = create<PersonaStore>()((set) => ({
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
}));
