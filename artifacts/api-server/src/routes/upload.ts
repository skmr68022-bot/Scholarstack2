import { Router, type IRouter } from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";

const router: IRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 150 * 1024 * 1024 }, // 150 MB
});

function getAdminClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

/* ════════════════════════════════════════════════════════════
   POST /api/upload
   Accepts a multipart form with a single "file" field.
   Uses the service role key to upload to Supabase Storage,
   bypassing storage RLS policies entirely.

   Body fields (form-data):
     file       — the file itself
     bucket     — "notes" | "videos" | "thumbnails" | "profiles"
     scholarId  — uploader's UUID (used as folder prefix)
     filename   — sanitized filename (optional, uses original if missing)
   ════════════════════════════════════════════════════════════ */
router.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  const { bucket, scholarId, filename } = (req.body ?? {}) as {
    bucket?: string; scholarId?: string; filename?: string;
  };

  if (!file) {
    res.status(400).json({ success: false, error: "No file attached." });
    return;
  }
  if (!bucket || !scholarId) {
    res.status(400).json({ success: false, error: "bucket and scholarId are required." });
    return;
  }

  const allowed = ["notes", "videos", "thumbnails", "profiles"];
  if (!allowed.includes(bucket)) {
    res.status(400).json({ success: false, error: `Invalid bucket. Must be one of: ${allowed.join(", ")}` });
    return;
  }

  const adminClient = getAdminClient();
  if (!adminClient) {
    res.status(503).json({ success: false, error: "SUPABASE_SERVICE_ROLE_KEY not configured." });
    return;
  }

  const safeName = (filename ?? file.originalname).replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${scholarId}/${Date.now()}-${safeName}`;

  const { error } = await adminClient.storage
    .from(bucket)
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    req.log.error({ error: error.message, bucket, path }, "Storage upload failed");
    res.status(400).json({ success: false, error: error.message });
    return;
  }

  const { data: urlData } = adminClient.storage.from(bucket).getPublicUrl(path);
  req.log.info({ bucket, path, size: file.size }, "File uploaded via server");
  res.json({ success: true, url: urlData.publicUrl });
});

export default router;
