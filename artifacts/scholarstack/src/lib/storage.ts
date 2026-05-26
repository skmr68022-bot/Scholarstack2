import { supabase } from "./supabase";

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadPDF(file: File, scholarId: string): Promise<string> {
  const path = `${scholarId}/${Date.now()}-${sanitizeFilename(file.name)}`;
  const { error } = await supabase.storage
    .from("notes")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(`PDF upload failed: ${error.message}`);
  return getPublicUrl("notes", path);
}

export async function uploadVideo(file: File, scholarId: string): Promise<string> {
  const path = `${scholarId}/${Date.now()}-${sanitizeFilename(file.name)}`;
  const { error } = await supabase.storage
    .from("videos")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(`Video upload failed: ${error.message}`);
  return getPublicUrl("videos", path);
}

export async function uploadThumbnail(file: File, scholarId: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${scholarId}/${Date.now()}-thumb.${ext}`;
  const { error } = await supabase.storage
    .from("thumbnails")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(`Thumbnail upload failed: ${error.message}`);
  return getPublicUrl("thumbnails", path);
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;
  const { error } = await supabase.storage
    .from("profiles")
    .upload(path, file, { cacheControl: "3600", upsert: true });
  if (error) throw new Error(`Avatar upload failed: ${error.message}`);
  return getPublicUrl("profiles", path);
}

export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  return !error;
}
