import { usePersonasStore } from "@/store/usePersonasStore";
import PersonaItem from "./PersonaItem";

export default function PersonasManager() {
  const personas = usePersonasStore((state) => state.personas);
  const sortedPersonas = personas?.slice().sort((a, b) => {
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Personas</h2>
        <p className="text-sm text-gray-500">
          Manage your AI personas identity and behavior.
        </p>
      </div>
      <ul className="flex flex-col gap-4">
        {sortedPersonas?.map((persona) => (
          <PersonaItem persona={persona} key={persona.id} />
        ))}
      </ul>
    </div>
  );
}

