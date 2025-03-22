import { createStripeCustomer, createStripeSubscription } from "@/lib/stripe"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import { users } from "@/db/schema"

export default async function setupStripeCustomerAndSubscription(userId: string, email: string) {
  try {
    const customer = await createStripeCustomer(email, userId)
    await db.update(users)
          .set({ stripeCustomerId: customer.id })
          .where(eq(users.id, userId));

    const subscription = await createStripeSubscription(customer.id)
    await db.update(users)
          .set({subscriptionId: subscription.id, subscriptionStatus: subscription.status })
          .where(eq(users.id, userId));
  } catch (error) {
    console.error('Error setting up Stripe customer and subscription:', error);
  }
}
