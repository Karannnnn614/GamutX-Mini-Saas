import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportHistoryTable } from "@/components/report-history-table";

export default async function DashboardPage() {
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
    .order("created_at", { ascending: false })
    .limit(5);

  const { count: totalTasks } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: evaluatedTasks } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .not("ai_score", "is", null);

  const { count: unlockedReports } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_paid", true);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here an overview of your tasks.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card className="border-2 overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Total Tasks
            </CardDescription>
            <CardTitle className="text-5xl font-black bg-gradient-to-br from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {totalTasks || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-2 overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Evaluated
            </CardDescription>
            <CardTitle className="text-5xl font-black bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {evaluatedTasks || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-2 overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
              Reports Unlocked
            </CardDescription>
            <CardTitle className="text-5xl font-black bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {unlockedReports || 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Tasks */}
      <ReportHistoryTable tasks={tasks || []} />
    </div>
  );
}
