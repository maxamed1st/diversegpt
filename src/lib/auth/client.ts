import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient()

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  deleteUser,
  forgetPassword,
  resetPassword,
  updateUser,
  changeEmail,
  changePassword,
} = authClient