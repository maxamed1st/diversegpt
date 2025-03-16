import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users, accounts } from "@/db/schema";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from '@/../auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();
    const session = await auth();
    const authenticatedUserId = session?.user?.id;

    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (userId !== authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
