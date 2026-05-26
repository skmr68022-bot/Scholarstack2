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

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ success: false, error: "Missing email or password." });
    return;
  }

  const url = process.env["SUPABASE_URL"];
  const anonKey = process.env["SUPABASE_ANON_KEY"];

  if (!url || !anonKey) {
    res.status(503).json({ success: false, error: "Supabase not configured on server." });
    return;
  }

  // Call Supabase Auth REST directly so this works even if browser can't reach Supabase
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "apikey": anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    }),
  });

  const data = await response.json() as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    expires_at?: number;
    token_type?: string;
    error?: string;
    error_description?: string;
    user?: { id: string; email?: string };
  };

  if (!response.ok || !data.access_token) {
    const msg = data.error_description ?? data.error ?? "Invalid credentials.";
    req.log.error({ email, status: response.status }, "Login failed");
    res.status(400).json({ success: false, error: msg });
    return;
  }

  req.log.info({ userId: data.user?.id }, "Login successful");
  // Return full session shape so client can write directly to Supabase localStorage
  res.json({
    success: true,
    session: {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      expires_at: data.expires_at,
      token_type: data.token_type ?? "bearer",
      user: data.user,
    },
  });
});

export default router;
