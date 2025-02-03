"use client";

import DeleteAccount from "@/components/DeleteAccount";
import PersonasManager from "@/components/PersonasManager";
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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Settings</h1>
          <p className="text-sm text-gray-500">
            Manage your account settings and preferences.
          </p>
        </div>
        <div className="space-y-8">
          <PersonasManager />
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
}
