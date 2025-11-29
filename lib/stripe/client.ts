import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
});

export const REPORT_UNLOCK_PRICE = parseInt(
  process.env.REPORT_UNLOCK_PRICE || "999"
);

export async function createCheckoutSession(
  taskId: string,
  userId: string
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Full AI Evaluation Report",
            description: "Unlock complete analysis with detailed feedback",
          },
          unit_amount: REPORT_UNLOCK_PRICE,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tasks/${taskId}?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tasks/${taskId}?payment=cancelled`,
    metadata: {
      task_id: taskId,
      user_id: userId,
    },
  });

  return session;
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
