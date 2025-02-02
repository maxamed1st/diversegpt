import { signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Sidebar() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleManagePayment() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/manage_payment');
      const data = await response.json();
      
      if (response.ok && data.url) {
        router.push(data.url);
      } else {
        console.error('Failed to get portal URL:', data.error);
      }
    } catch (error) {
      console.error('Error accessing customer portal:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="flex flex-col">
      <button 
        onClick={handleManagePayment}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Manage payment'}
      </button>
      <Link href="/settings">Settings</Link>
      <button onClick={() => signOut()}>Logout</button>
    </section>
  )
}
