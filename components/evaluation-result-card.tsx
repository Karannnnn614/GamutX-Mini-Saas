"use client";

import { Database } from "@/types/database.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface EvaluationResultCardProps {
  task: Task;
  onUnlock?: () => void;
  isUnlocking?: boolean;
}

export function EvaluationResultCard({
  task,
  onUnlock,
  isUnlocking,
}: EvaluationResultCardProps) {
  const { ai_score, strengths, improvements, is_paid } = task;

  if (!ai_score) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Pending</CardTitle>
          <CardDescription>
            This task has not been evaluated yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    return "Needs Improvement";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Evaluation Results</CardTitle>
            <CardDescription>Analysis completed</CardDescription>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${getScoreColor(ai_score)}`}>
              {ai_score}/10
            </div>
            <div className="text-sm text-muted-foreground">
              {getScoreLabel(ai_score)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Strengths Preview */}
        <div>
          <div className="mb-2 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Strengths</h3>
          </div>
          {is_paid ? (
            <ul className="space-y-2">
              {strengths?.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-600">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-md bg-muted/50 p-4">
              <div className="mb-2 text-sm text-muted-foreground">
                {strengths?.[0] || "Preview not available"}
              </div>
              <div className="blur-sm">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          )}
        </div>

        {/* Improvements Preview */}
        <div>
          <div className="mb-2 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold">Areas for Improvement</h3>
          </div>
          {is_paid ? (
            <ul className="space-y-2">
              {improvements?.map((improvement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-yellow-600">•</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-md bg-muted/50 p-4">
              <div className="mb-2 text-sm text-muted-foreground">
                {improvements?.[0] || "Preview not available"}
              </div>
              <div className="blur-sm">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          )}
        </div>

        {/* Unlock Full Report */}
        {!is_paid && onUnlock && (
          <div className="rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Lock className="h-6 w-6 text-primary" />
                <div>
                  <h4 className="font-semibold">Unlock Full Report</h4>
                  <p className="text-sm text-muted-foreground">
                    Get complete detailed feedback and analysis
                  </p>
                </div>
              </div>
              <Button onClick={onUnlock} disabled={isUnlocking} size="lg">
                {isUnlocking ? "Processing..." : "Unlock for $9.99"}
              </Button>
            </div>
          </div>
        )}

        {is_paid && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-green-800">
            <CheckCircle className="mx-auto mb-2 h-6 w-6" />
            <p className="font-medium">Full Report Unlocked</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
