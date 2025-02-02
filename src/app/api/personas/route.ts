import { db } from "@/db";
import { personas } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

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
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const body = await req.json();
    const { id, name, systemPrompt } = body;

    if (!id || !name || !systemPrompt) {
      return NextResponse.json(
        { error: "id, name, and systemPrompt are required" },
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
