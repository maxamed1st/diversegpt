import { auth } from "./server";
import { headers } from "next/headers";

export default async function checkAuth() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const userId = session?.user.id
  const email = session?.user.email

  return { userId, email };
}