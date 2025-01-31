"use client";

import { useSession, signOut, SessionProvider } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Chat() {
  return (
    <SessionProvider>
      <MainChatComponent />
    </SessionProvider>
  )
}

function MainChatComponent() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (!session?.user) {
    useRouter().push("/api/auth/signin");
    return;
  }
  return (
    <div className="flex flex-col h-screen text-center">
      <h1>Chat</h1>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
