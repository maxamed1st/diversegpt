import { signOut } from "next-auth/react"
import Link from "next/link"

export default function Sidebar() {
  return (
    <section>
      <Link href="/settings">Settings</Link>
      <button onClick={() => signOut()}>Logout</button>
    </section>
  )
}
