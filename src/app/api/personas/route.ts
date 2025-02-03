import { db } from "@/db";
import { personas } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schemas
const updatePersonaSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  systemPrompt: z.string().min(1),
  userId: z.string().uuid(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  try {
    if (userId) {
      const result = await db.query.personas.findMany({
        where: eq(personas.userId, userId),
      });
      return NextResponse.json(result, { status: 200 });
    }
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const result = updatePersonaSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { id, name, systemPrompt, userId } = result.data;

    if (!id || !name || !systemPrompt || !userId) {
      return NextResponse.json(
        { error: "id, name, systemPrompt and userId are required" },
        { status: 400 }
      );
    }

    // First check if the persona exists and belongs to the user
    const existing = await db.query.personas.findFirst({
      where: and(eq(personas.id, id), eq(personas.userId, userId)),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Persona not found or unauthorized" },
        { status: 404 }
      );
    }

    // Perform the update
    const updated = await db
      .update(personas)
      .set({
        name,
        systemPrompt,
      })
      .where(and(eq(personas.id, id), eq(personas.userId, userId)))
      .returning();

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
