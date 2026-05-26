import { Router, type IRouter } from "express";
import { createClient } from "@supabase/supabase-js";
import { createHmac, randomInt } from "crypto";

const router: IRouter = Router();

/* ── In-memory store for pending EMAIL OTPs (TTL: 10 min) ── */
interface EmailOtpEntry {
  otp: string;
  name: string;
  role: string;
  expertise?: string;
  password: string;
  expiry: number;
}
const emailOtpStore = new Map<string, EmailOtpEntry>();

/* ── In-memory store for pending phone OTPs (TTL: 10 min) ── */
interface PhoneOtpEntry {
  verificationId: string;
  name?: string;
  role?: string;
  expertise?: string;
  expiry: number;
}
const phoneOtpStore = new Map<string, PhoneOtpEntry>();

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of emailOtpStore.entries()) { if (v.expiry < now) emailOtpStore.delete(k); }
  for (const [k, v] of phoneOtpStore.entries()) { if (v.expiry < now) phoneOtpStore.delete(k); }
}, 60_000);

/* ── Send email via Resend (falls back to console log for dev) ── */
async function sendOtpEmail(to: string, otp: string, name: string): Promise<boolean> {
  const apiKey = process.env["RESEND_API_KEY"];

  if (!apiKey) {
    // Dev fallback — print OTP to server console
    console.log(`\n╔══════════════════════════════════╗`);
    console.log(`  EMAIL OTP for ${to}`);
    console.log(`  Code: ${otp}`);
    console.log(`╚══════════════════════════════════╝\n`);
    return true;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "ScholarStack <onboarding@resend.dev>",
        to: [to],
        subject: "Your ScholarStack verification code",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0d0d12;border-radius:16px;color:#fff">
            <h2 style="margin:0 0 8px;font-size:22px">Hi ${name},</h2>
            <p style="color:#aaa;margin:0 0 24px">Your ScholarStack verification code is:</p>
            <div style="background:#1a1a2e;border-radius:12px;padding:24px;text-align:center;letter-spacing:12px;font-size:36px;font-weight:900;color:#7c3aed">${otp}</div>
            <p style="color:#666;font-size:13px;margin:24px 0 0">This code expires in 10 minutes. Do not share it with anyone.</p>
          </div>`,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/* ── Helpers ── */

function getAdminClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function normalizePhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("91") && d.length === 12) return d.slice(2);
  if (d.startsWith("0") && d.length === 11) return d.slice(1);
  return d;
}

function phoneEmail(phone: string): string {
  return `91${phone}@phone.scholarstack.in`;
}

function phonePw(phone: string): string {
  const secret = process.env["PHONE_AUTH_SECRET"] ?? "ss_phone_2025";
  return createHmac("sha256", secret).update(phone).digest("hex").slice(0, 32);
}

async function getMCToken(): Promise<string | null> {
  const cid = process.env["MC_CUSTOMER_ID"];
  const pw  = process.env["MC_PASSWORD"];
  if (!cid || !pw) return null;
  const key = Buffer.from(pw).toString("base64");
  try {
    const res = await fetch(
      `https://cpaas.messagecentral.com/auth/v1/authentication/token?customerId=${cid}&key=${encodeURIComponent(key)}&scope=NEW&country=91`,
    );
    const d = await res.json() as { token?: string };
    return d.token ?? null;
  } catch { return null; }
}

async function mcSendOtp(phone: string, token: string): Promise<string | null> {
  const cid = process.env["MC_CUSTOMER_ID"];
  if (!cid) return null;
  try {
    const res = await fetch(
      `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=${cid}&flowType=SMS&mobileNumber=${phone}&otpLength=6&type=SMS`,
      { method: "POST", headers: { authToken: token } },
    );
    const d = await res.json() as { data?: { verificationId?: string }; verificationId?: string };
    return String(d.data?.verificationId ?? (d as Record<string, unknown>)["verificationId"] ?? "") || null;
  } catch { return null; }
}

async function mcVerifyOtp(verificationId: string, code: string, token: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://cpaas.messagecentral.com/verification/v3/validateOtp?verificationId=${verificationId}&code=${code}`,
      { method: "GET", headers: { authToken: token } },
    );
    const d = await res.json() as { data?: { verificationStatus?: string }; verificationStatus?: string };
    const status = d.data?.verificationStatus ?? (d as Record<string, unknown>)["verificationStatus"];
    return status === "VERIFICATION_COMPLETED";
  } catch { return false; }
}

async function supabaseLogin(email: string, password: string) {
  const url     = process.env["SUPABASE_URL"]!;
  const anonKey = process.env["SUPABASE_ANON_KEY"]!;
  const res  = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const d = await res.json() as {
    access_token?: string; refresh_token?: string;
    expires_in?: number; expires_at?: number; token_type?: string;
    user?: { id: string; email?: string };
    error?: string; error_description?: string;
  };
  if (!res.ok || !d.access_token) return { session: null, error: d.error_description ?? d.error ?? "Login failed" };
  return {
    session: {
      access_token: d.access_token, refresh_token: d.refresh_token,
      expires_in: d.expires_in, expires_at: d.expires_at,
      token_type: d.token_type ?? "bearer", user: d.user,
    },
    error: null,
  };
}

/* ════════════════════════════════════════════════════════════
   POST /auth/signup
   Generates a 6-digit OTP, emails it via Resend (or logs
   it to console when RESEND_API_KEY is not set), and stores
   signup data in memory. The Supabase user is NOT created
   until the OTP is verified — no rate-limit dependency.
   ════════════════════════════════════════════════════════════ */
router.post("/auth/signup", async (req, res) => {
  const { name, email, password, role, expertise } = req.body as {
    name?: string; email?: string; password?: string; role?: string; expertise?: string;
  };

  if (!name || !email || !password || !role) {
    res.status(400).json({ success: false, error: "Missing required fields." });
    return;
  }
  if (role !== "student" && role !== "scholar") {
    res.status(400).json({ success: false, error: "Invalid role." });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName     = name.trim();

  // Check if email already exists in Supabase
  const adminClient = getAdminClient();
  if (adminClient) {
    const listResult = await adminClient.auth.admin.listUsers();
    if ((listResult.data?.users as Array<{ email?: string }> | undefined)?.some(u => u.email === normalizedEmail)) {
      res.status(400).json({ success: false, error: "An account with this email already exists. Please sign in." });
      return;
    }
  }

  // Generate 6-digit OTP and store signup data
  const otp = String(randomInt(100000, 999999));
  emailOtpStore.set(normalizedEmail, {
    otp, name: trimmedName, role, expertise: expertise?.trim(), password: password.trim(),
    expiry: Date.now() + 10 * 60_000,
  });

  // Send OTP email
  const sent = await sendOtpEmail(normalizedEmail, otp, trimmedName);
  if (!sent) {
    emailOtpStore.delete(normalizedEmail);
    res.status(500).json({ success: false, error: "Failed to send verification email. Please try again." });
    return;
  }

  req.log.info({ email: normalizedEmail, role }, "Email OTP sent for signup");
  res.json({ success: true, requiresOtp: true });
});

/* ════════════════════════════════════════════════════════════
   POST /auth/login  (unchanged — email + password)
   ════════════════════════════════════════════════════════════ */
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ success: false, error: "Missing email or password." });
    return;
  }

  const url     = process.env["SUPABASE_URL"];
  const anonKey = process.env["SUPABASE_ANON_KEY"];
  if (!url || !anonKey) {
    res.status(503).json({ success: false, error: "Supabase not configured on server." });
    return;
  }

  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password: password.trim() }),
  });

  const data = await response.json() as {
    access_token?: string; refresh_token?: string;
    expires_in?: number; expires_at?: number; token_type?: string;
    error?: string; error_description?: string;
    user?: { id: string; email?: string };
  };

  if (!response.ok || !data.access_token) {
    req.log.error({ email, status: response.status }, "Login failed");
    res.status(400).json({ success: false, error: data.error_description ?? data.error ?? "Invalid credentials." });
    return;
  }

  req.log.info({ userId: data.user?.id }, "Login successful");
  res.json({
    success: true,
    session: {
      access_token: data.access_token, refresh_token: data.refresh_token,
      expires_in: data.expires_in, expires_at: data.expires_at,
      token_type: data.token_type ?? "bearer", user: data.user,
    },
  });
});

/* ════════════════════════════════════════════════════════════
   POST /auth/verify-email-otp
   Verifies the 6-digit OTP we generated. On success:
   1. Creates the Supabase user (email_confirm: true)
   2. Upserts their profile
   3. Logs in and returns the session
   ════════════════════════════════════════════════════════════ */
router.post("/auth/verify-email-otp", async (req, res) => {
  const { email, token } = req.body as { email?: string; token?: string };
  if (!email || !token) {
    res.status(400).json({ success: false, error: "Email and OTP code are required." });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const pending = emailOtpStore.get(normalizedEmail);

  if (!pending) {
    res.status(400).json({ success: false, error: "No pending signup found. Please start the signup again." });
    return;
  }
  if (pending.expiry < Date.now()) {
    emailOtpStore.delete(normalizedEmail);
    res.status(400).json({ success: false, error: "OTP has expired. Please sign up again." });
    return;
  }
  if (token.trim() !== pending.otp) {
    res.status(400).json({ success: false, error: "Incorrect code. Please try again." });
    return;
  }

  // OTP correct — create the Supabase user now
  emailOtpStore.delete(normalizedEmail);

  const adminClient = getAdminClient();
  if (!adminClient) {
    res.status(503).json({ success: false, error: "SUPABASE_SERVICE_ROLE_KEY not configured." });
    return;
  }

  const { data, error } = await adminClient.auth.admin.createUser({
    email: normalizedEmail,
    password: pending.password,
    email_confirm: true,
    user_metadata: { name: pending.name, role: pending.role, expertise: pending.expertise ?? null },
  });

  if (error) {
    req.log.error({ error: error.message }, "createUser after OTP failed");
    res.status(400).json({ success: false, error: error.message });
    return;
  }

  const userId = data.user?.id;
  if (userId) {
    await adminClient.from("profiles").upsert(
      { id: userId, name: pending.name, email: normalizedEmail, role: pending.role, expertise: pending.expertise ?? null, is_verified: true },
      { onConflict: "id" },
    );
  }

  // Log in to get the session
  const { session, error: loginErr } = await supabaseLogin(normalizedEmail, pending.password);
  if (!session) {
    req.log.error({ loginErr }, "Login after OTP verify failed");
    res.status(500).json({ success: false, error: "Account created but sign-in failed. Please use the Sign In tab." });
    return;
  }

  req.log.info({ userId, role: pending.role }, "Email OTP verified — user created and session issued");
  res.json({ success: true, session });
});

/* ════════════════════════════════════════════════════════════
   POST /auth/send-phone-otp
   Sends a 6-digit SMS OTP via MessageCentral.
   ════════════════════════════════════════════════════════════ */
router.post("/auth/send-phone-otp", async (req, res) => {
  const { phone, name, role, expertise } = req.body as {
    phone?: string; name?: string; role?: string; expertise?: string;
  };

  if (!phone) {
    res.status(400).json({ success: false, error: "Phone number is required." });
    return;
  }

  const normalized = normalizePhone(phone);
  if (normalized.length !== 10) {
    res.status(400).json({ success: false, error: "Please enter a valid 10-digit Indian mobile number." });
    return;
  }

  const mcToken = await getMCToken();
  if (!mcToken) {
    res.status(503).json({ success: false, error: "SMS service not available. Check MC_CUSTOMER_ID and MC_PASSWORD." });
    return;
  }

  const verificationId = await mcSendOtp(normalized, mcToken);
  if (!verificationId) {
    res.status(500).json({ success: false, error: "Failed to send OTP. Please try again." });
    return;
  }

  phoneOtpStore.set(normalized, {
    verificationId,
    name: name?.trim(),
    role: role ?? "student",
    expertise: expertise?.trim(),
    expiry: Date.now() + 10 * 60_000,
  });

  req.log.info({ phone: normalized }, "Phone OTP sent via MessageCentral");
  res.json({ success: true, message: `OTP sent to +91 ${normalized}` });
});

/* ════════════════════════════════════════════════════════════
   POST /auth/verify-phone-otp
   Verifies the SMS OTP. Creates Supabase user if new, then
   logs in and returns a session.
   ════════════════════════════════════════════════════════════ */
router.post("/auth/verify-phone-otp", async (req, res) => {
  const { phone, otp } = req.body as { phone?: string; otp?: string };
  if (!phone || !otp) {
    res.status(400).json({ success: false, error: "Phone and OTP are required." });
    return;
  }

  const normalized = normalizePhone(phone);
  const pending    = phoneOtpStore.get(normalized);

  if (!pending) {
    res.status(400).json({ success: false, error: "No OTP found for this number. Please request a new one." });
    return;
  }
  if (pending.expiry < Date.now()) {
    phoneOtpStore.delete(normalized);
    res.status(400).json({ success: false, error: "OTP has expired. Please request a new one." });
    return;
  }

  const mcToken = await getMCToken();
  if (!mcToken) {
    res.status(503).json({ success: false, error: "SMS service unavailable." });
    return;
  }

  const valid = await mcVerifyOtp(pending.verificationId, otp.trim(), mcToken);
  if (!valid) {
    res.status(400).json({ success: false, error: "Incorrect OTP. Please try again." });
    return;
  }

  phoneOtpStore.delete(normalized);

  const adminClient = getAdminClient();
  const url         = process.env["SUPABASE_URL"];
  const anonKey     = process.env["SUPABASE_ANON_KEY"];
  if (!adminClient || !url || !anonKey) {
    res.status(503).json({ success: false, error: "Server configuration error." });
    return;
  }

  const pEmail = phoneEmail(normalized);
  const pPw    = phonePw(normalized);
  const role   = (pending.role === "scholar" ? "scholar" : "student") as "student" | "scholar";
  const name   = pending.name?.trim() || `User${normalized.slice(-4)}`;

  // Try login first (existing user)
  const { session: existingSession } = await supabaseLogin(pEmail, pPw);
  if (existingSession) {
    req.log.info({ phone: normalized }, "Phone login — existing user");
    res.json({ success: true, session: existingSession });
    return;
  }

  // New user — create account
  const { data, error } = await adminClient.auth.admin.createUser({
    email: pEmail,
    password: pPw,
    email_confirm: true,
    user_metadata: { name, role, phone: normalized, expertise: pending.expertise ?? null },
  });

  if (error && !error.message?.includes("already") && !error.message?.includes("exists")) {
    req.log.error({ error: error.message }, "Phone signup createUser failed");
    res.status(400).json({ success: false, error: error.message });
    return;
  }

  const userId = data?.user?.id;
  if (userId) {
    await adminClient.from("profiles").upsert(
      { id: userId, name, email: pEmail, role, expertise: pending.expertise ?? null, is_verified: true },
      { onConflict: "id" },
    );
  }

  const { session, error: loginErr } = await supabaseLogin(pEmail, pPw);
  if (!session) {
    req.log.error({ loginErr }, "Phone signup login failed after create");
    res.status(500).json({ success: false, error: "Account created but sign-in failed. Please try email login." });
    return;
  }

  req.log.info({ phone: normalized, userId }, "Phone signup + login successful");
  res.json({ success: true, session });
});

export default router;
