"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EvaluationResultCard } from "@/components/evaluation-result-card";
import { LoadingSpinner } from "@/components/loading";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Play } from "lucide-react";
import { Database } from "@/types/database.types";
import Link from "next/link";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

export default function TaskPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const taskId = params.id as string;

  useEffect(() => {
    loadTask();

    // Check for payment success
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      toast({
        title: "Success",
        description: "Payment successful! Full report unlocked.",
      });
    } else if (paymentStatus === "cancelled") {
      toast({
        title: "Cancelled",
        description: "Payment was cancelled.",
        variant: "destructive",
      });
    }
  }, [taskId, searchParams]);

  const loadTask = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`);
      if (!response.ok) throw new Error("Failed to load task");
      const data = await response.json();
      setTask(data.task);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const response = await fetch("/api/tasks/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Evaluation failed");
      }

      const data = await response.json();
      setTask(data.task);

      toast({
        title: "Success",
        description: "Task evaluated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to evaluate task",
        variant: "destructive",
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleUnlock = async () => {
    setIsUnlocking(true);
    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create checkout");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to initiate payment",
        variant: "destructive",
      });
      setIsUnlocking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">Task not found</h3>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Task Details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{task.title}</CardTitle>
                <CardDescription>
                  Created {new Date(task.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              {!task.ai_score && (
                <Button onClick={handleEvaluate} disabled={isEvaluating}>
                  <Play className="mr-2 h-4 w-4" />
                  {isEvaluating ? "Evaluating..." : "Run AI Evaluation"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Description</h3>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {task.description}
                </p>
              </div>
              {task.file_url && (
                <div>
                  <h3 className="mb-2 font-semibold">Attached File</h3>
                  <a
                    href={task.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View File
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Results */}
        {task.ai_score && (
          <EvaluationResultCard
            task={task}
            onUnlock={handleUnlock}
            isUnlocking={isUnlocking}
          />
        )}
      </div>
    </div>
  );
}
