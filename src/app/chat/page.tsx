"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Chat() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    useRouter().push("/api/auth/signin");
    return;
  }

  return (
    <section>
      <h1>Chat</h1>
    </section>
  );
}
