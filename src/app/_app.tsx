"use client";

import { SessionProvider } from "next-auth/react"
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { usePersonasStore } from "@/store/usePersonasStore";
import { ExtendedSession } from "@/types/general";
import useDynamicViewport from "@/hooks/useDynamicViewport";

function SyncUserData() {
  const { data: session } = useSession() as { data: unknown } as { data: ExtendedSession | null };
  const { setUser, clearUser } = useUserStore();
  const { setPersonas, clearPersonas } = usePersonasStore();

  useEffect(() => {
    if (session) {
      setUser(session.user);
      setPersonas(session.personas);
    } else {
      clearUser();
      clearPersonas();
    }
  }, [session, setUser, setPersonas, clearUser, clearPersonas]);
  return null
}

function ViewportHandler() {
  useDynamicViewport();
  return null;
}

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SyncUserData />
      {children}
      <ViewportHandler />
    </SessionProvider>
  )
}
