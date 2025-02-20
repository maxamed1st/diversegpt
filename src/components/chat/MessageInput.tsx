"use client"

import { ArrowUp } from "lucide-react"
import { useState } from "react"

export default function MessageInput({ 
  action, 
  disabled 
}: { 
  action: (message: string) => void;
  disabled?: boolean;
}) {
  const [message, setMessage] = useState("");

  return (
    <div className="w-full h-24 flex">
      <textarea
          className="w-full resize-none min-h-[3em] text-base-content/95 bg-base-100 border border-base-300 rounded-md px-3 py-2 text-sm focus:ring-0 outline-none"
          name="message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          required
          autoFocus
        />

      <button 
        className="w-12 h-full flex items-center justify-center"
        onClick={() => {
          action(message);
          setMessage("");
        }}
        disabled={disabled}
      >
        <ArrowUp className={disabled ? "opacity-50" : ""} />
      </button>
    </div>
  )
}
