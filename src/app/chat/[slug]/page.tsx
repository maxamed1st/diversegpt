import { redirect } from "next/navigation";
import { auth } from "@/../auth";
import ChatInterface from "@/components/chat/ChatInterface";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { personas } from "@/db/schema";

export default async function ChatPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }

  const slug = (await params).slug;
  const personasIds = await db
    .select({ id: personas.id })
    .from(personas)
    .where(eq(personas.userId, userId));

  // Handle "new" chat creation
  if (slug === "new") {
    return (
      <ChatInterface
        chatId={null}
        isNewChat={true}
        initialPersonas={personasIds}
      />
    );
  }

  // Regular chat handling
  const chatId = slug;
  const chat = await db.query.chat.findFirst({
    where: (chat, { eq }) => eq(chat.id, chatId),
  });

  if (!chat) {
    redirect("/chat/new");
  }


  return (
    <ChatInterface
      chatId={chatId}
      isNewChat={false}
    />
  );
}
