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
    <Card className="overflow-hidden border-2">
      <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">AI Evaluation Results</CardTitle>
            <CardDescription className="text-base mt-1">
              Powered by advanced AI analysis
            </CardDescription>
          </div>
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30"></div>
              <div
                className={`relative text-6xl font-black ${getScoreColor(
                  ai_score
                )} drop-shadow-lg`}
              >
                {ai_score}
                <span className="text-3xl">/10</span>
              </div>
            </div>
            <div className="mt-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {getScoreLabel(ai_score)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Strengths Preview */}
        <div className="rounded-xl border-l-4 border-green-500 mt-6 bg-green-50/50 dark:bg-green-950/20 p-5">
          <div className="mb-4 flex items-center space-x-3">
            <div className="rounded-full bg-green-500 p-2">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-green-900 dark:text-green-100">
              Key Strengths
            </h3>
          </div>
          {is_paid ? (
            <ul className="space-y-3">
              {strengths?.map((strength, index) => (
                <li key={index} className="flex items-start space-x-3 text-sm">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white font-bold">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-gray-700 dark:text-gray-300">
                    {strength}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg bg-white/80 dark:bg-gray-900/50 p-4 backdrop-blur-sm">
              <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {strengths?.[0] || "Preview not available"}
              </div>
              <div className="blur-sm">
                <div className="h-3 bg-gradient-to-r from-green-200 to-green-100 dark:from-green-800 dark:to-green-900 rounded mb-2"></div>
                <div className="h-3 bg-gradient-to-r from-green-200 to-green-100 dark:from-green-800 dark:to-green-900 rounded w-3/4"></div>
              </div>
            </div>
          )}
        </div>

        {/* Improvements Preview */}
        <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 p-5">
          <div className="mb-4 flex items-center space-x-3">
            <div className="rounded-full bg-amber-500 p-2">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">
              Growth Opportunities
            </h3>
          </div>
          {is_paid ? (
            <ul className="space-y-3">
              {improvements?.map((improvement, index) => (
                <li key={index} className="flex items-start space-x-3 text-sm">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs text-white font-bold">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-gray-700 dark:text-gray-300">
                    {improvement}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg bg-white/80 dark:bg-gray-900/50 p-4 backdrop-blur-sm">
              <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {improvements?.[0] || "Preview not available"}
              </div>
              <div className="blur-sm">
                <div className="h-3 bg-gradient-to-r from-amber-200 to-amber-100 dark:from-amber-800 dark:to-amber-900 rounded mb-2"></div>
                <div className="h-3 bg-gradient-to-r from-amber-200 to-amber-100 dark:from-amber-800 dark:to-amber-900 rounded w-3/4"></div>
              </div>
            </div>
          )}
        </div>

        {/* Unlock Full Report */}
        {!is_paid && onUnlock && (
          <div className="relative overflow-hidden rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 dark:from-purple-950/50 dark:via-blue-950/50 dark:to-purple-950/50 p-6 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full blur-3xl opacity-20"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 p-3 shadow-lg">
                  <Lock className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Unlock Full Report
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Get complete detailed feedback and actionable insights
                  </p>
                </div>
              </div>
              <Button
                onClick={onUnlock}
                disabled={isUnlocking}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-bold px-8"
              >
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
