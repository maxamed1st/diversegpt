import { NextResponse } from "next/server";
import { z } from "zod";
import checkAuth from "@/lib/auth/checkAuth";
import { createChat } from "@/db/queries/chatQueries";
import generateTitleFromUserMessage from "@/utils/generateName";

const createChatSchemaValidation = z.object({
  personaIds: z.string().array(),
  message: z.string().min(1),
})

export default async function(request: Request) {
  const body = await request.json();

  const result = createChatSchemaValidation.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const { personaIds, message } = result.data;
  const { userId } = await checkAuth();

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  if (!personaIds) {
    return NextResponse.json(
      { error: "personaIds are required" },
      { status: 400 }
    );
  }

  // generate chat name
  const title = await generateTitleFromUserMessage({ message });
  // create a new chat and chat personas
  const chat = await createChat({ name: title, userId: userId as string, personaIds: personaIds as string[] });

  return NextResponse.json({ chat }, { status: 200 });
}
