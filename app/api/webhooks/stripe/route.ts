import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe/client";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// This route must not use Edge Runtime
export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    // Construct and verify webhook event
    const event = await constructWebhookEvent(body, signature);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const taskId = session.metadata?.task_id;
        const userId = session.metadata?.user_id;

        if (!taskId || !userId) {
          console.error("Missing metadata in webhook:", session.id);
          break;
        }

        // Update payment status
        const { error: paymentError } = await supabaseAdmin
          .from("payments")
          .update({ status: "completed" })
          .eq("stripe_session_id", session.id);

        if (paymentError) {
          console.error("Failed to update payment:", paymentError);
        }

        // Unlock the task
        const { error: taskError } = await supabaseAdmin
          .from("tasks")
          .update({ is_paid: true })
          .eq("id", taskId)
          .eq("user_id", userId);

        if (taskError) {
          console.error("Failed to unlock task:", taskError);
        }

        console.log("Payment successful for task:", taskId);
        break;
      }

      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Update payment status to failed
        const { error } = await supabaseAdmin
          .from("payments")
          .update({ status: "failed" })
          .eq("stripe_session_id", session.id);

        if (error) {
          console.error("Failed to update payment status:", error);
        }

        console.log("Payment failed for session:", session.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
