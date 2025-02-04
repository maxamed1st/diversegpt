import { Persona } from "@/types/general";
import { usePersonasStore } from "@/store/usePersonasStore";
import { Pencil, X } from "lucide-react";
import { useState } from "react";

export default function PersonaItem({ persona }: { persona: Persona }) {
  const [editPersona, setEditPersona] = useState(false);
  const updatePersona = usePersonasStore((state) => state.updatePersona);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const updatedPersona = {
      ...persona,
      name: formData.get('name') as string,
      systemPrompt: formData.get('systemPrompt') as string,
    };

    try {
      // Check if the persona has been updated
      if (updatedPersona.name == persona.name && updatedPersona.systemPrompt == persona.systemPrompt) {
        setEditPersona(false);
        return;
      }

      const response = await fetch(`/api/personas`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPersona),
      });

      if (!response.ok) {
        throw new Error('Failed to update persona');
      }

      updatePersona(updatedPersona);
      setEditPersona(false);
    } catch (error) {
      console.error('Failed to update persona:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    editPersona ? (
      <form onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-lg border border-base-300 p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <input
            type="text"
            name="name"
            defaultValue={persona.name}
            required
            className="text-lg text-base-content/70 font-medium rounded-md px-2 py-1 bg-base-100 border border-base-300 focus:border-primary focus:ring-0 outline-none"
          />
          <button 
            type="button"
            onClick={() => setEditPersona(false)}
            className="text-base-content/45 hover:text-base-content/80 transition-colors">
            <X size={18} />
          </button>
        </div>
        <textarea
          className="w-full resize-none overflow-hidden min-h-[3em] text-base-content/95 bg-base-100 border border-base-300 rounded-md px-3 py-2 text-sm focus:ring-0 focus:border-primary outline-none"
          name="systemPrompt"
          defaultValue={persona.systemPrompt}
          required
          autoFocus
          onChange={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onFocus={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = `${(e.target.scrollHeight)}px`;
          }}
        />
        <div className="ml-auto">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-content rounded-md hover:bg-accent hover:text-accent-content transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    ) : (
      <li className="rounded-lg border border-base-300 p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg text-base-content/70 font-medium">{persona.name}</h3>
          <button 
            onClick={() => setEditPersona(true)}
            className="text-base-content/45 hover:text-base-content/80 transition-colors">
            <Pencil size={18} />
          </button>
        </div>
        <p className="text-sm text-base-content/95">
          {persona.systemPrompt}
        </p>
      </li>
    )
  )
}
