import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TaskForm } from "@/components/task-form";

export default async function NewTaskPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">New Task</h1>
        <p className="text-muted-foreground">
          Submit a coding task for AI-powered evaluation
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <TaskForm />
      </div>
    </div>
  );
}
