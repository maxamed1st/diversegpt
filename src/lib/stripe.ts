import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function createStripeCustomer(email: string, userId: string) {
  try {
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        userId: userId
      }
    });

    return customer;
  } catch (error) {
    console.error(error);
    throw error
  }
}

export async function createStripeSubscription(customerId: string) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: process.env.STRIPE_PRICE_ID as string,
          quantity: 1,
        },
      ],
      trial_period_days: 3,
    });

    return subscription;
  } catch (error) {
    console.error(error);
    throw error
  }
}

export async function createPortalSession(customerId: string) {
  try {

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.BASE_URL}/chat/new`,
    });

    return portalSession.url;
  } catch (error) {
    console.error(error);
    throw error
  }
}

export async function createStripeCheckoutSession(customerId: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
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
        trial_period_days: 3
      },
      automatic_tax: {
        enabled: true
      },
      tax_id_collection: {
        enabled: true
      },
      customer_update: {
        address: "auto",
        name: "auto"
      }
    });

    return session.url
  } catch (error) {
    console.error(error);
    throw error
  }
}
