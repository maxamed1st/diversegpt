"use client";

import DeleteAccount from "@/components/DeleteAccount";
import EditPersonas from "@/components/PersonasManager";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Settings() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    useRouter().push("/api/auth/signin");
    return;
  }

  return (
    <section className="p-4">
      <EditPersonas />
      <DeleteAccount />
    </section>
  );
}
