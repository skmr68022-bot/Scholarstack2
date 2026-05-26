import { Router, type IRouter } from "express";
import { createClient } from "@supabase/supabase-js";

const router: IRouter = Router();

function getAdminClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

/* ════════════════════════════════════════════════════════════
   POST /api/notes
   Inserts a new note using the service role key so that
   RLS policies (which require auth.uid() = scholar_id)
   are bypassed. Caller must pass scholar_id explicitly.
   ════════════════════════════════════════════════════════════ */
router.post("/notes", async (req, res) => {
  const {
    title, description, scholar_id, scholar_name, price, original_price,
    exam, category, board_type, subject, pages, color, tag,
    rating, reviews_count, sales_count, content_type, status,
    file_url, thumbnail_url,
  } = req.body as Record<string, unknown>;

  if (!title || !scholar_id) {
    res.status(400).json({ success: false, error: "title and scholar_id are required." });
    return;
  }

  const adminClient = getAdminClient();
  if (!adminClient) {
    res.status(503).json({ success: false, error: "Server configuration error." });
    return;
  }

  const { data, error } = await adminClient
    .from("notes")
    .insert({
      title, description: description ?? null,
      scholar_id, scholar_name: scholar_name ?? "",
      price: price ?? "Free", original_price: original_price ?? null,
      exam: exam ?? null, category: category ?? null,
      board_type: board_type ?? null, subject: subject ?? null,
      pages: pages ?? 100, color: color ?? "bg-violet-500", tag: tag ?? "New",
      rating: rating ?? 0, reviews_count: reviews_count ?? 0,
      sales_count: sales_count ?? 0,
      content_type: content_type ?? "PDF",
      status: status ?? "review",
      file_url: file_url ?? null, thumbnail_url: thumbnail_url ?? null,
    })
    .select()
    .single();

  if (error) {
    req.log.error({ error: error.message }, "notes insert failed");
    res.status(400).json({ success: false, error: error.message });
    return;
  }

  req.log.info({ id: (data as { id: number }).id, scholar_id }, "Note inserted via server");
  res.json({ success: true, note: data });
});

export default router;
