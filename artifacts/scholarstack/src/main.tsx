import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://workspaceapi-server-production-1863.up.railway.app";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

async function directSupabaseEmailLogin(init?: RequestInit): Promise<Response> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return Response.json(
      { success: false, error: "Supabase frontend variables are missing." },
      { status: 503 },
    );
  }

  const body = JSON.parse(String(init?.body ?? "{}")) as { email?: string; password?: string };
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: body.email?.trim().toLowerCase(),
      password: body.password?.trim(),
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) {
    return Response.json(
      { success: false, error: data.error_description ?? data.error ?? "Invalid login credentials." },
      { status: 400 },
    );
  }

  return Response.json({
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
}

const originalFetch = window.fetch.bind(window);
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const path =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? `${input.pathname}${input.search}`
        : "";

  if (path === "/api/auth/login") {
    try {
      const res = await originalFetch(`${API_BASE_URL}${path}`, init);
      // If Railway replies normally, use it. If it is down/HTML/error, fallback below.
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        return Response.json(json, { status: res.status });
      } catch {
        return directSupabaseEmailLogin(init);
      }
    } catch {
      return directSupabaseEmailLogin(init);
    }
  }

  if (typeof input === "string" && input.startsWith("/api/")) {
    return originalFetch(`${API_BASE_URL}${input}`, init);
  }
  if (input instanceof URL && input.pathname.startsWith("/api/")) {
    return originalFetch(`${API_BASE_URL}${input.pathname}${input.search}`, init);
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById("root")!).render(<App />);
