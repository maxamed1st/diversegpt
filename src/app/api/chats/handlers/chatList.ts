import { NextResponse } from "next/server";
import checkAuth from "@/utils/checkAuth";
import { getAllChats } from "@/db/queries/chatQueries";

export default async function() {
  const { userId } = await checkAuth();

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const chats = await getAllChats(userId);
  return NextResponse.json({ chats });
}
