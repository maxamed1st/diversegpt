import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from '@/../auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = (await db.select().from(users).where(eq(users.email, session.user.email))).at(0);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      // Create a new customer if they don't have one
      const customer = await stripe.customers.create({
        email: user.email as string,
        metadata: {
          userId: user.id
        }
      });

      await db.update(users)
        .set({ stripeCustomerId: customer.id })
        .where(eq(users.id, user.id));

      stripeCustomerId = customer.id;
    }

    // For new customers, send them to checkout
    if (user.subscriptionStatus === 'inactive') {
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID as string,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.BASE_URL}/chat/new`,
        cancel_url: `${process.env.BASE_URL}/settings`,
        subscription_data: {
          trial_period_days: 1
        }
      })
      return NextResponse.json({
        url: session.url
      });
    }

    // Create a billing portal session for existing customers
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.BASE_URL}/chat/new`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
