import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users, accounts } from "@/db/schema";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();
    
    await db.delete(accounts).where(eq(accounts.userId, userId));
    await db.delete(users).where(eq(users.id, userId));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
