import { Router, type IRouter } from "express";
import { createClient } from "@supabase/supabase-js";

const router: IRouter = Router();

function getAdminClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

router.post("/auth/signup", async (req, res) => {
  const { name, email, password, role, expertise } = req.body as {
    name: string;
    email: string;
    password: string;
    role: "student" | "scholar";
    expertise?: string;
  };

  if (!name || !email || !password || !role) {
    res.status(400).json({ success: false, error: "Missing required fields." });
    return;
  }

  const adminClient = getAdminClient();
  if (!adminClient) {
    res.status(503).json({
      success: false,
      error: "Server auth not configured. Add SUPABASE_SERVICE_ROLE_KEY to environment.",
    });
    return;
  }

  const { data, error } = await adminClient.auth.admin.createUser({
    email: email.trim().toLowerCase(),
    password: password.trim(),
    email_confirm: true,
    user_metadata: { name: name.trim(), role, expertise: expertise ?? null },
  });

  if (error || !data.user) {
    req.log.error({ error }, "Signup failed");
    res.status(400).json({ success: false, error: error?.message ?? "Signup failed." });
    return;
  }

  const profilePayload = {
    id: data.user.id,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    expertise: expertise ?? null,
    is_verified: false,
  };

  const { error: profileError } = await adminClient
    .from("profiles")
    .upsert(profilePayload, { onConflict: "id" });

  if (profileError) {
    req.log.warn({ profileError }, "Profile upsert failed after signup");
  }

  res.json({ success: true, userId: data.user.id });
});

export default router;
