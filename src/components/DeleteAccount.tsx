"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { deleteUser } from "@/utils/deleteUser"
import { AlertTriangle } from "lucide-react"

export default function DeleteAccount() {
  const { data: session } = useSession();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteUser(session?.user?.id as string);
      signOut();
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-error">
          <AlertTriangle className="h-5 w-5" />
          <h4 className="font-medium">Danger Zone</h4>
        </div>
        
        <div className="rounded-lg border border-error/20 p-6 bg-error/5 shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <h5 className="font-medium">Delete Account</h5>
              <p className="text-sm text-base-content/60">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>

            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-fit px-4 py-2 text-sm font-medium text-error border border-error/30 rounded-md hover:bg-error/10 transition-colors"
              >
                Delete account
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-error rounded-md hover:bg-error hover:text-error-content transition-colors"
                >
                  Yes, delete my account
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 text-sm text-secondary-content font-medium bg-secondary rounded-md hover:bg-accent hover:text-accent-content transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
