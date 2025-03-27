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

    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: {
        stripeCustomerId: true,
        subscriptionId: true,
        subscriptionStatus: true
      },
    });

    if (!result?.stripeCustomerId) {
      // Create a new customer and checkout session
      const customer = await createStripeCustomer(email, userId);
      const checkoutUrl = await createStripeCheckoutSession(customer.id, 3);

      return NextResponse.json({ url: checkoutUrl });
    }

    if (!result.subscriptionId) {
      // Create a checkout session for customers without a subscription
      const trialday = result.subscriptionStatus === 'inactive' ? 3 : undefined
      const checkoutUrl = await createStripeCheckoutSession(result.stripeCustomerId, trialday);

      return NextResponse.json({ url: checkoutUrl });
    }

    // Create a billing portal session for existing customers
    const portalUrl = await createPortalSession(result.stripeCustomerId);

    return NextResponse.json({ url: portalUrl });
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
