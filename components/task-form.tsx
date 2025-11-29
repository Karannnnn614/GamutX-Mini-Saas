"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export function TaskForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;

      let fileUrl: string | undefined;

      // Upload file if provided
      if (file) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        // Note: You would implement file upload endpoint separately
        // For now, we'll skip the file upload in this demo
        // fileUrl would be set here after successful upload
      }

      // Create task
      const response = await fetch("/api/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, fileUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const { task } = await response.json();

      toast({
        title: "Success",
        description: "Task created successfully",
      });

      router.push(`/tasks/${task.id}`);
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your Coding Task</CardTitle>
        <CardDescription>
          Provide details about your coding task for AI evaluation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Binary Search Implementation"
              required
              minLength={3}
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Task Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your coding task, the approach you took, challenges faced, etc."
              required
              minLength={10}
              maxLength={5000}
              rows={10}
            />
            <p className="text-xs text-muted-foreground">
              Be as detailed as possible for better evaluation results
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload Code File (Optional)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file"
                type="file"
                accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.go,.rb,.php"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
              {file && (
                <span className="text-sm text-muted-foreground">
                  {file.name}
                </span>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Creating..." : "Submit Task"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
