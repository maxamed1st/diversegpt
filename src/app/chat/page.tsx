import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Chat() {
  const { data: session } = useSession();

  if (!session?.user) {
    useRouter().push("/api/auth/signin");
    return;
  }

  return (
    <div>
      <h1>Chat</h1>
    </div>
  );
}
