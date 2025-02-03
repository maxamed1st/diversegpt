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
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <h4 className="font-medium">Danger Zone</h4>
        </div>
        
        <div className="rounded-lg border border-red-600/20 p-6 bg-red-600/5 shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <h5 className="font-medium">Delete Account</h5>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>

            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-fit px-4 py-2 text-sm font-medium text-red-600 border border-red-600/30 rounded-md hover:bg-red-600/10 transition-colors"
              >
                Delete account
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-600/90 transition-colors"
                >
                  Yes, delete my account
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
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
