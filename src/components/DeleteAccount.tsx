"use client"

import { useSession, signOut } from "next-auth/react"
import { deleteUser } from "@/utils/deleteUser"

export default function DeleteAccount() {
  const { data: session } = useSession();
  return (
    <button onClick={async () => {
        try {
          await deleteUser(session?.user?.id as string);
          signOut();
        } catch (error) {
          console.error('Failed to delete account:', error);
        }
      }}>Delete account</button>
  )
}
