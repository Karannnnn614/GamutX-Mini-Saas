import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { evaluateTask } from "@/lib/ai/evaluator";

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

    // Fetch task from database
    const { data: task, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check if already evaluated
    if (task.ai_score !== null) {
      return NextResponse.json(
        { error: "Task already evaluated" },
        { status: 400 }
      );
    }

    // Fetch file content if file exists
    let fileContent: string | undefined;

    if (task.file_url) {
      try {
        const fileResponse = await fetch(task.file_url);
        if (fileResponse.ok) {
          fileContent = await fileResponse.text();
        }
      } catch (error) {
        console.error("Failed to fetch file content:", error);
      }
    }

    // Run AI evaluation
    const evaluation = await evaluateTask({
      title: task.title,
      description: task.description,
      fileContent,
    });

    // Update task with evaluation results
    const { data: updatedTask, error: updateError } = await supabase
      .from("tasks")
      .update({
        ai_score: evaluation.score,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
      })
      .eq("id", taskId)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to update task:", updateError);
      return NextResponse.json(
        { error: "Failed to save evaluation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate task", message: (error as Error).message },
      { status: 500 }
    );
  }
}
