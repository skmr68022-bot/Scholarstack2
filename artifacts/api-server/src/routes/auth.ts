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
      error: "SUPABASE_SERVICE_ROLE_KEY not configured.",
    });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Step 1: create the user with admin API (auto-confirmed)
  const { data, error } = await adminClient.auth.admin.createUser({
    email: normalizedEmail,
    password: password.trim(),
    email_confirm: true,
    user_metadata: {
      name: name.trim(),
      role,
      expertise: expertise ?? null,
    },
  });

  if (error) {
    req.log.error({ error: error.message, code: error.code }, "Admin createUser failed");

    // If user already exists, still return success so they can sign in
    if (
      error.message?.includes("already") ||
      error.message?.includes("exists") ||
      error.code === "email_exists"
    ) {
      res.json({ success: true, existed: true });
      return;
    }

    res.status(400).json({ success: false, error: error.message });
    return;
  }

  const userId = data.user?.id;

  // Step 2: upsert the profile manually (in case trigger didn't run)
  if (userId) {
    await adminClient.from("profiles").upsert(
      {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        role,
        expertise: expertise ?? null,
        is_verified: false,
      },
      { onConflict: "id" },
    );
  }

  req.log.info({ userId, role }, "User created successfully");
  res.json({ success: true, userId });
});

export default router;
