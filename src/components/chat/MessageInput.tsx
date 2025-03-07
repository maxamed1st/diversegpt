"use client"

import { ArrowUp } from "lucide-react"
import { useState } from "react"

export default function MessageInput({ 
  action, 
  disabled,
  subscriptionStatus
}: { 
  action: (message: string) => void;
  disabled?: boolean;
  subscriptionStatus?: string | null;
}) {
  const [message, setMessage] = useState("");

  const isNewUser = subscriptionStatus === "inactive";
  const isSubscriptionInactive = subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing';

  return (
    <div className="w-full h-24 flex">
      <textarea
          className="w-full resize-none min-h-[3em] text-base-content/95 bg-base-100 border border-base-300 rounded-md px-3 py-2 text-sm focus:ring-0 outline-none"
          name="message"
          placeholder= {isNewUser ? "set up payment method in the menu to start your trial period" :
          isSubscriptionInactive ? "You need to set up subscription to chat" : "type a message..."}
          disabled={isSubscriptionInactive}
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
        disabled={disabled || isSubscriptionInactive}
      >
        <ArrowUp className={disabled ? "opacity-50" : ""} />
      </button>
    </div>
  )
}
