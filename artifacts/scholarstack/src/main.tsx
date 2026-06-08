import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://workspaceapi-server-production-1863.up.railway.app";

const originalFetch = window.fetch.bind(window);
window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === "string" && input.startsWith("/api/")) {
    return originalFetch(`${API_BASE_URL}${input}`, init);
  }
  if (input instanceof URL && input.pathname.startsWith("/api/")) {
    return originalFetch(`${API_BASE_URL}${input.pathname}${input.search}`, init);
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById("root")!).render(<App />);
