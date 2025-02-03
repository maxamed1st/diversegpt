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
    editPersona ?
      <form onSubmit={handleSubmit}
        className="flex flex-col gap-2 border rounded-lg border-black p-2">
        <div className="flex justify-between">
          <input
            type="text"
            name="name"
            defaultValue={persona.name}
            required
          />
          <button onClick={() => setEditPersona(false)}>
            <X size={18} />
          </button>
        </div>
        <textarea
          className="resize-none overflow-hidden h-auto min-h-[3em] pr-2 pt-1"
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </form>
      :
      <li key={persona.id} className="flex flex-col border rounded-lg border-black p-2">
        <div className="flex justify-between">
          {persona.name}
          <button onClick={() => setEditPersona(true)}>
            <Pencil size={18} />
          </button>
        </div>
        <div className="pr-2 pt-1">
          {persona.systemPrompt}
        </div>
      </li>
  )
}
