import { NextResponse } from "next/server";
import { z } from "zod";
import checkAuth from "@/utils/checkAuth";
import generateChatResponses from "@/lib/generateResponses";
import { db } from "@/db";

const chatSchemaValidation = z.object({
  message: z.string().min(1),
})

export default async function(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const chatId = (await params).chatId
  const body = await request.json();

  const result = chatSchemaValidation.safeParse(body);
  if (!result.success) {
    console.error("Invalid input", result.error.flatten());
    return NextResponse.json(
      { error: "Invalid input", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const { message } = result.data;
  const { userId } = await checkAuth();

  if (!userId) {
    console.error("Authentication required");
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  if (!message) {
    console.error("message is required");
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
    console.error("Chat not found");
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
    console.error("User not found");
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  if (user.subscriptionStatus !== "active" && user.subscriptionStatus !== "trialing") {
    console.error("Subscription required", user.subscriptionStatus);
    return NextResponse.json(
      { error: "Subscription required" },
      { status: 400 }
    );
  }

  // generate response for each persona and save to db
  const responses = await generateChatResponses({ chatId, userMessage: message, userId });
  const data = { userId, responses }

  return NextResponse.json(data);
}
