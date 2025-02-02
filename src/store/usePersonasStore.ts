import { create } from "zustand";
import { Persona } from "@/types/general";

interface PersonaStore {
  personas: Persona[] | undefined;
  setPersonas: (personas: Persona[]) => void;
  clearPersonas: () => void;
};

export const usePersonasStore = create<PersonaStore>()((set) => ({
  personas: undefined,
  setPersonas: (personas) => set({ personas }),
  clearPersonas: () => set({ personas: undefined }),
}));
