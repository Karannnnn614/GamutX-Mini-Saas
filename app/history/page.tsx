import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReportHistoryTable } from "@/components/report-history-table";

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Task History</h1>
        <p className="text-muted-foreground">
          View all your submitted tasks and evaluations
        </p>
      </div>

      <ReportHistoryTable tasks={tasks || []} />
    </div>
  );
}
