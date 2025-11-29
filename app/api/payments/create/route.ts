import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/stripe/client";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { taskId } = await request.json();

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Verify task exists and belongs to user
    const { data: task, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check if task is already paid
    if (task.is_paid) {
      return NextResponse.json(
        { error: "Task already unlocked" },
        { status: 400 }
      );
    }

    // Check if task has been evaluated
    if (!task.ai_score) {
      return NextResponse.json(
        { error: "Task must be evaluated first" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await createCheckoutSession(taskId, user.id);

    // Create pending payment record
    const { error: paymentError } = await supabase.from("payments").insert({
      user_id: user.id,
      task_id: taskId,
      amount: session.amount_total || 0,
      status: "pending",
      stripe_session_id: session.id,
    });

    if (paymentError) {
      console.error("Failed to create payment record:", paymentError);
    }

    return NextResponse.json(
      { sessionId: session.id, url: session.url },
      { status: 200 }
    );
  } catch (error) {
    console.error("Create checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
