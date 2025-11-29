import { createClient } from "@/lib/supabase/server";

export async function uploadTaskFile(
  file: File,
  userId: string
): Promise<string> {
  const supabase = await createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("task-files")
    .upload(fileName, file);

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("task-files").getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteTaskFile(fileUrl: string): Promise<void> {
  const supabase = await createClient();

  // Extract the path from the URL
  const url = new URL(fileUrl);
  const path = url.pathname.split("/task-files/")[1];

  if (!path) return;

  const { error } = await supabase.storage.from("task-files").remove([path]);

  if (error) {
    console.error("Failed to delete file:", error);
  }
}
