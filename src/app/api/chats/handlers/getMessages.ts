import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { eq, count } from "drizzle-orm";
import { message } from "@/db/schema";
import checkAuth from "@/utils/checkAuth";
import { getChatMessages } from "@/db/queries/chatQueries";


const paginationSchema = z.object({
  offset: z.coerce
    .number()
    .int()
    .min(0)
    .default(0)
    .describe("Number of items to skip"),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(24)
    .describe("Number of items to return"),
});

export default async function(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    // Check authentication
    const { userId } = await checkAuth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const chatId = (await params).chatId;
    const { searchParams } = new URL(request.url);
    const pagination = paginationSchema.parse({
      offset: searchParams.get('offset'),
      limit: searchParams.get('limit'),
    });

    // Get total count for pagination info
    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(message)
      .where(eq(message.chatId, chatId));

    const messages = await getChatMessages(chatId, pagination.offset, pagination.limit);

    return NextResponse.json({
      messages,
      hasMore: pagination.offset + messages.length < totalCount,
    });
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error.errors);
      return NextResponse.json(
        {
          error: "Invalid pagination parameters",
        },
        { status: 400 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
