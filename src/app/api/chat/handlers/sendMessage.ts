import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/../auth";
import { generateChatResponses } from "@/app/api/chat/generateResponse";
import { db } from "@/db";

const chatSchemaValidation = z.object({
  message: z.string().min(1),
})

export default async function(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  const chatId = params.chatId
  const body = request.body;

  const result = chatSchemaValidation.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const { message } = result.data;
  const session = await auth();
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  if (!message) {
    return NextResponse.json(
      { error: "message is required" },
      { status: 400 }
    );
  }

  // make sure chat exists
  const chat = await db.query.chat.findFirst({
    where: (chat, { eq }) => eq(chat.id, chatId),
    columns: {
      id: true
    }
  });

  if (!chat) {
    return NextResponse.json(
      { error: "Chat not found" },
      { status: 404 }
    );
  }

  // check subscription
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
    columns: {
      subscriptionStatus: true
    }
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  if (user.subscriptionStatus !== "active" && user.subscriptionStatus !== "trialing") {
    return NextResponse.json(
      { error: "Subscription required" },
      { status: 400 }
    );
  }

  // generate response for each persona and save to db
  const responses = await generateChatResponses({ chatId, userMessage: message, userId });

  return NextResponse.json({ responses });
}
