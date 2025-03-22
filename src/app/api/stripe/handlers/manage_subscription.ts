import { NextResponse } from "next/server";
import checkAuth from '@/utils/checkAuth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createPortalSession, createStripeCustomer, createStripeCheckoutSession } from "@/lib/stripe";

export default async function() {
  try {
    const { userId, email } = await checkAuth();
    if (!userId || !email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const stripeCustomerId = (await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: {
        stripeCustomerId: true,
      },
    }))?.stripeCustomerId;

    if (!stripeCustomerId) {
      // Create a new customer and checkout session
      const customer = await createStripeCustomer(email, userId);
      const checkoutUrl = await createStripeCheckoutSession(customer.id);

      return NextResponse.json({ url: checkoutUrl });
    }

    // Create a billing portal session for existing customers
    const portalUrl = await createPortalSession(stripeCustomerId);

    return NextResponse.json({ url: portalUrl });
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
