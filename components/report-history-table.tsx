"use client";

import Link from "next/link";
import { Database } from "@/types/database.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { CheckCircle, Clock, Lock, Trash2 } from "lucide-react";
import { deleteTask } from "@/app/actions/tasks";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface ReportHistoryTableProps {
  tasks: Task[];
}

export function ReportHistoryTable({ tasks }: ReportHistoryTableProps) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setDeletingId(taskId);
    try {
      await deleteTask(taskId);
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No tasks yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Create your first task to get started
          </p>
          <Link href="/tasks/new">
            <Button>Create Task</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Tasks</CardTitle>
        <CardDescription>View and manage your submitted tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{task.title}</h4>
                  {task.ai_score && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Score: {task.ai_score}/10
                    </span>
                  )}
                  {task.is_paid && (
                    <CheckCircle
                      className="h-4 w-4 text-green-600"
                      aria-label="Unlocked"
                    />
                  )}
                  {!task.is_paid && task.ai_score && (
                    <Lock
                      className="h-4 w-4 text-muted-foreground"
                      aria-label="Locked"
                    />
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                  {task.description}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(task.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/tasks/${task.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                  disabled={deletingId === task.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
