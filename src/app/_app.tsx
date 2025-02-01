"use client";

import { useSession, SessionProvider } from "next-auth/react"

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MainAppComponent children={children} />
    </SessionProvider>
  )
}

function MainAppComponent({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      {children}
    </>
  );
}
