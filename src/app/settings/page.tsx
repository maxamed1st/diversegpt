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
          <p className="text-sm text-base-content/60">
            Manage your account settings and preferences.
          </p>
        </div>
        <div className="space-y-8">
          <PersonasManager />
          <DeleteAccount />
          <div className="pt-6 border-t border-base-content/10">
            <h2 className="text-xl font-semibold mb-2">Feedback & Support</h2>
            <p className="text-base-content/70 mb-2">
              We value your feedback and are here to help with any questions.
            </p>
            <p className="text-base-content/70">
              Contact us at:{" "}
              <a 
                href="mailto:diversegpt@wepco.se" 
                className="text-primary hover:text-primary/80 underline"
              >
                diversegpt@wepco.se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
