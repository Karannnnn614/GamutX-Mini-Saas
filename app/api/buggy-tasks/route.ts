// TODO: This file intentionally contains bugs for debugging demonstration.
// BUGS:
// 1. Missing error handling
// 2. No authentication check
// 3. SQL injection vulnerability (if not using Supabase properly)
// 4. Missing input validation
// 5. Incorrect status codes
// 6. Memory leak potential

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// BUG: No request validation or rate limiting
export async function POST(request: NextRequest) {
  // BUG: No try-catch block for error handling
  const supabase = await createClient();

  // BUG: No authentication check
  const body = await request.json();

  // BUG: No input validation
  const { taskTitle, taskDescription, userId } = body;

  // BUG: Directly using user input without sanitization
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: taskTitle, // Could be undefined
      description: taskDescription, // Could be undefined
      user_id: userId, // Accepting userId from client (security issue!)
    })
    .select();

  // BUG: Not checking for error properly
  if (error) {
    // BUG: Wrong status code for database error
    return NextResponse.json({ error }, { status: 400 });
  }

  // BUG: Returning 200 instead of 201 for resource creation
  return NextResponse.json(data, { status: 200 });
}

// BUG: GET endpoint without pagination
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // BUG: No authentication check
  // BUG: Fetching all records without limit (memory leak for large datasets)
  const { data, error } = await supabase.from("tasks").select("*");

  // BUG: Not handling null/undefined data
  return NextResponse.json({ tasks: data });
}

// BUG: DELETE without proper authorization
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // BUG: No validation that user owns the task
  const { error } = await supabase.from("tasks").delete().eq("id", id); // Could be null

  // BUG: Always returning success even if delete failed
  return NextResponse.json({ success: true });
}
