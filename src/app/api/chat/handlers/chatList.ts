import { NextResponse } from "next/server";
import { auth } from "@/../auth";
import { getAllChats } from "@/db/queries/chatQueries";

export default async function() {
  const session = await auth();
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const chats = await getAllChats(userId);
  return NextResponse.json({ chats });
}
