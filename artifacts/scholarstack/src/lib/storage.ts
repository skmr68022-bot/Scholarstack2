function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function serverUpload(file: File, bucket: string, scholarId: string): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("bucket", bucket);
  fd.append("scholarId", scholarId);
  fd.append("filename", sanitizeFilename(file.name));

  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = await res.json() as { success: boolean; url?: string; error?: string };
  if (!json.success || !json.url) {
    throw new Error(json.error ?? "Upload failed. Please try again.");
  }
  return json.url;
}

export async function uploadPDF(file: File, scholarId: string): Promise<string> {
  return serverUpload(file, "notes", scholarId);
}

export async function uploadVideo(file: File, scholarId: string): Promise<string> {
  return serverUpload(file, "videos", scholarId);
}

export async function uploadThumbnail(file: File, scholarId: string): Promise<string> {
  return serverUpload(file, "thumbnails", scholarId);
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  return serverUpload(file, "profiles", userId);
}

export async function deleteFile(_bucket: string, _path: string): Promise<boolean> {
  return false;
}
