import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users, accounts } from "@/db/schema";
import { NextResponse } from "next/server";
import { stripe } from "../manage_payment/route";

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();
    const userResult = await db
      .select({ stripeCustomerId: users.stripeCustomerId })
      .from(users)
      .where(eq(users.id, userId));

    if (userResult[0]?.stripeCustomerId) {
      await stripe.customers.del(userResult[0].stripeCustomerId);
    }
    await db.delete(accounts).where(eq(accounts.userId, userId));
    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
