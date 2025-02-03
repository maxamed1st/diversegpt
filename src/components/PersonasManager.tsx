import { usePersonasStore } from "@/store/usePersonasStore";
import PersonaItem from "./PersonaItem";

export default function PersonasManager() {
  const personas = usePersonasStore((state) => state.personas);
  const sortedPersonas = personas?.slice().sort((a, b) => {
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="flex flex-col gap-4">
      <h2>Personas</h2>
      <ul className="flex flex-col gap-2">
        {sortedPersonas?.map((persona) => (
          <PersonaItem persona={persona} key={persona.id} />
        ))}
      </ul>
    </div>
  );
}

