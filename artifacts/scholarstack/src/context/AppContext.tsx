import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import {
  getProfile, upsertProfile, updateProfile as dbUpdateProfile,
  getPurchasedNoteIds, getBookmarkedNoteIds, addPurchase, toggleBookmarkDB,
  getAllNotes, getAllProfiles, getPendingScholars, updateScholarApproval,
  updateNoteStatus, insertNote, getNotes,
} from "../lib/db";
import type { Note, Profile, ScholarApproval } from "../lib/database.types";
import type { User } from "@supabase/supabase-js";

/* ── Apply session: persist to localStorage AND update Supabase client state ── */
async function applySession(session: {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  expires_at?: number;
  token_type?: string;
  user?: unknown;
}) {
  window.localStorage.setItem("ss_auth_v2", JSON.stringify(session));
  try {
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  } catch {
    // setSession failure is non-fatal — localStorage is already set and
    // the auth listener will pick it up on next page load
  }
}

/* ─── Types ───────────────────────────────────────────────── */

export type Role = "student" | "scholar" | "admin" | null;

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "scholar" | "admin";
}

export interface UploadItem {
  id: number;
  title: string;
  type: string;
  price: string;
  original?: string;
  sales: number;
  earnings: string;
  rating: number;
  reviews: number;
  status: "review" | "live" | "rejected";
  category?: string;
  exam?: string;
  scholar?: string;
  scholarId?: string;
  description?: string;
  pages?: number;
  color?: string;
  tag?: string;
  subject?: string;
  boardType?: string;
  fileUrl?: string;
  submittedAt?: number;
}

export interface PendingScholar {
  id: number;
  name: string;
  tag: string;
  avatar: string;
  bg: string;
}

export interface AdminUser {
  id: number;
  profileId: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  status: string;
}

/* ─── Context interface ───────────────────────────────────── */

interface AppContextType {
  role: Role;
  setRole: (r: Role) => void;
  currentUser: CurrentUser | null;
  loading: boolean;
  authLoading: boolean;
  login: (email: string, password: string, loginRole: "student" | "scholar" | "admin") => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; email: string; password: string; phone?: string; role: "student" | "scholar"; expertise?: string }) => Promise<{ success: boolean; error?: string }>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
  sendPhoneOtp: (phone: string, name?: string, role?: string, expertise?: string) => Promise<{ success: boolean; error?: string }>;
  verifyPhoneOtp: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  signupWithPhone: (data: { name: string; phone: string; role: "student" | "scholar"; expertise?: string }) => Promise<{ success: boolean; error?: string }>;
  loginWithPhone: (phone: string, role: "student" | "scholar") => Promise<{ success: boolean; error?: string }>;
  completePhoneLogin: (phone: string, role: "student" | "scholar") => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  purchased: Set<number>;
  addPurchased: (noteId: number, amount: string, method: string) => Promise<void>;
  bookmarked: Set<number>;
  toggleBookmark: (noteId: number) => Promise<void>;
  uploads: UploadItem[];
  addUpload: (item: UploadItem & { fileUrl?: string; thumbnailUrl?: string }) => Promise<{ success: boolean; error?: string }>;
  approveContent: (id: number) => Promise<void>;
  rejectContent: (id: number) => Promise<void>;
  pendingScholars: PendingScholar[];
  removeScholar: (id: number) => Promise<void>;
  approveScholar: (id: number) => Promise<void>;
  users: AdminUser[];
  banUser: (id: number) => Promise<void>;
  refreshUploads: () => Promise<void>;
  updateUserProfile: (updates: { name?: string; expertise?: string; avatar_url?: string }) => Promise<{ success: boolean; error?: string }>;
}

/* ─── Helpers ─────────────────────────────────────────────── */

function computeEarnings(price: string, sales: number): string {
  if (price === "Free" || !price) return "₹0";
  const amount = parseInt(price.replace(/[^0-9]/g, "")) || 0;
  const total = Math.round(amount * sales * 0.7);
  if (total >= 100000) return `₹${(total / 100000).toFixed(1)}L`;
  if (total >= 1000) return `₹${Math.round(total / 1000)}K`;
  return `₹${total}`;
}

function noteToUploadItem(note: Note): UploadItem {
  return {
    id: note.id,
    title: note.title,
    type: note.content_type,
    price: note.price,
    original: note.original_price ?? undefined,
    sales: note.sales_count,
    earnings: computeEarnings(note.price, note.sales_count),
    rating: Number(note.rating),
    reviews: note.reviews_count,
    status: note.status,
    category: note.category ?? undefined,
    exam: note.exam ?? undefined,
    scholar: note.scholar_name,
    scholarId: note.scholar_id ?? undefined,
    description: note.description ?? undefined,
    pages: note.pages,
    color: note.color,
    tag: note.tag,
    subject: note.subject ?? undefined,
    boardType: note.board_type ?? undefined,
    fileUrl: note.file_url ?? undefined,
    submittedAt: new Date(note.created_at).getTime(),
  };
}

function profileToAdminUser(profile: Profile, idx: number): AdminUser {
  return {
    id: idx + 1,
    profileId: profile.id,
    name: profile.name,
    email: profile.email ?? "",
    role: profile.role.charAt(0).toUpperCase() + profile.role.slice(1),
    plan: profile.role === "scholar" ? (profile.is_verified ? "Verified" : "Pending") : "Free",
    status: "active",
  };
}

function approvalToPendingScholar(a: ScholarApproval, idx: number): PendingScholar {
  const initials = (a.scholar_name ?? "S")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const bgs = [
    "from-pink-400 to-rose-400",
    "from-orange-400 to-red-400",
    "from-blue-400 to-indigo-400",
    "from-green-400 to-teal-400",
    "from-purple-400 to-violet-400",
  ];
  return {
    id: a.id,
    name: a.scholar_name ?? "Scholar",
    tag: a.expertise ?? "Education",
    avatar: initials,
    bg: bgs[idx % bgs.length],
  };
}

/* ─── Context ─────────────────────────────────────────────── */

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [purchased, setPurchased] = useState<Set<number>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [pendingScholars, setPendingScholars] = useState<PendingScholar[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  /* ── load role-specific data after auth ── */
  const loadRoleData = useCallback(async (profile: Profile) => {
    if (profile.role === "student") {
      const [pIds, bIds] = await Promise.all([
        getPurchasedNoteIds(profile.id),
        getBookmarkedNoteIds(profile.id),
      ]);
      setPurchased(new Set(pIds));
      setBookmarked(new Set(bIds));
    }
    if (profile.role === "scholar") {
      // Use server endpoint (service-role key) so RLS cannot block phone-auth scholars
      try {
        const res = await fetch(`/api/notes?scholarId=${profile.id}`);
        const json = await res.json() as { success: boolean; notes?: Note[] };
        if (json.success && json.notes) {
          setUploads(json.notes.map(noteToUploadItem));
        }
      } catch {
        // Fallback to direct DB call (requires valid Supabase session)
        const notes = await getNotes({ scholarId: profile.id });
        setUploads(notes.map(noteToUploadItem));
      }
    }
    if (profile.role === "admin") {
      // Use server endpoint (service-role key) for all notes + Supabase client for profiles/approvals
      const [notesRes, allProfiles, approvals] = await Promise.all([
        fetch("/api/notes?all=true").then(r => r.json() as Promise<{ success: boolean; notes?: Note[] }>),
        getAllProfiles(),
        getPendingScholars(),
      ]);
      setUploads((notesRes.success && notesRes.notes ? notesRes.notes : await getAllNotes()).map(noteToUploadItem));
      setUsers(allProfiles.map(profileToAdminUser));
      setPendingScholars(
        (approvals as ScholarApproval[]).map(approvalToPendingScholar),
      );
    }
  }, []);

  const applyProfile = useCallback(
    async (profile: Profile) => {
      setCurrentUser({
        id: profile.id,
        name: profile.name,
        email: profile.email ?? "",
        role: profile.role,
      });
      setRole(profile.role);
      await loadRoleData(profile);
    },
    [loadRoleData],
  );

  const loadUser = useCallback(
    async (user: User) => {
      const fallbackName =
        (user.user_metadata?.name as string | undefined) ??
        user.email?.split("@")[0] ??
        "User";
      const fallbackRole =
        (user.user_metadata?.role as "student" | "scholar" | "admin" | undefined) ??
        "student";

      // Set a preliminary state so the UI has something while we load the DB profile
      setCurrentUser({
        id: user.id,
        name: fallbackName,
        email: user.email ?? "",
        role: fallbackRole,
      });
      setRole(fallbackRole);

      // ── Always await the DB profile before returning so that RequireAuth
      // only evaluates after the true role (e.g. "admin") is known.
      try {
        let profile = await getProfile(user.id);
        if (!profile) {
          profile = await upsertProfile({
            id: user.id,
            name: fallbackName,
            email: user.email ?? null,
            role: fallbackRole === "admin" ? "student" : fallbackRole,
            expertise:
              (user.user_metadata?.expertise as string | undefined) ?? null,
          });
        }
        if (profile) await applyProfile(profile);
      } catch (err) {
        console.warn("Profile load failed:", err);
      }
    },
    [applyProfile],
  );

  /* ── Auth listener ── */
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await loadUser(session.user);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Intentionally NOT async — Supabase v2 awaits the callback's returned
      // Promise inside setSession(), so an async callback blocks applySession()
      // on slow networks. Returning void makes setSession() resolve immediately
      // while loadUser() still runs in the background.
      if (session?.user) {
        // Re-arm the loading flag so RequireAuth shows a spinner instead of
        // bouncing — loading was already set false by the initial getSession()
        // call (which found no session), so we must raise it again here.
        setLoading(true);
        void loadUser(session.user).finally(() => setLoading(false));
      } else {
        setCurrentUser(null);
        setRole(null);
        setPurchased(new Set());
        setBookmarked(new Set());
        setUploads([]);
        setPendingScholars([]);
        setUsers([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUser]);

  /* ── Auth functions ── */

  const login = async (
    email: string,
    password: string,
    _loginRole: "student" | "scholar" | "admin",
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthLoading(true);
    try {
      // Route through API server — bypasses any browser → Supabase connectivity issues
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password: password.trim() }),
      });
      const json = (await res.json()) as {
        success: boolean;
        error?: string;
        session?: {
          access_token: string;
          refresh_token: string;
          expires_in: number;
          expires_at: number;
          token_type: string;
          user: { id: string; email?: string };
        };
      };
      if (!json.success || !json.session) {
        return { success: false, error: json.error ?? "Login failed." };
      }
      // Validate role from JWT metadata before accepting the session
      const sessionRole = (json.session.user as { user_metadata?: { role?: string } })?.user_metadata?.role;
      if (_loginRole !== "admin" && sessionRole && sessionRole !== _loginRole) {
        return {
          success: false,
          error: `This account is registered as a ${sessionRole}. Please go to the ${sessionRole} sign-in page, or create a new account here.`,
        };
      }
      await applySession(json.session);
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Check your connection." };
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: "student" | "scholar";
    expertise?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setAuthLoading(true);
    try {
      // Use server-side signup to bypass email confirmation requirement
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          password: data.password.trim(),
          role: data.role,
          expertise: data.expertise ?? null,
        }),
      });

      const json = (await res.json()) as { success: boolean; error?: string };

      if (!json.success) {
        // Fallback: try direct Supabase signup if server endpoint not configured
        if (json.error?.includes("SUPABASE_SERVICE_ROLE_KEY")) {
          const { error: sbError } = await supabase.auth.signUp({
            email: data.email.trim().toLowerCase(),
            password: data.password.trim(),
            options: {
              data: {
                name: data.name.trim(),
                role: data.role,
                expertise: data.expertise ?? null,
              },
            },
          });
          if (sbError) return { success: false, error: sbError.message };
          return { success: true };
        }
        return { success: false, error: json.error };
      }

      // Account created — caller will now show email OTP verification step
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please check your connection and try again." };
    } finally {
      setAuthLoading(false);
    }
  };

  /* ── Email OTP verify ── */
  const verifyEmailOtp = async (email: string, token: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), token: token.trim() }),
      });
      const json = (await res.json()) as {
        success: boolean; error?: string;
        session?: { access_token: string; refresh_token: string; expires_in: number; expires_at: number; token_type: string; user: { id: string; email?: string } };
      };
      if (!json.success || !json.session) return { success: false, error: json.error ?? "Verification failed." };
      await applySession(json.session);
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please check your connection." };
    }
  };

  /* ── Phone OTP: send ── */
  const sendPhoneOtp = async (phone: string, name?: string, role?: string, expertise?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/send-phone-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, role, expertise }),
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      return json;
    } catch {
      return { success: false, error: "Network error. Please check your connection." };
    }
  };

  /* ── Phone OTP: verify ── */
  const verifyPhoneOtp = async (phone: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/verify-phone-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const json = (await res.json()) as {
        success: boolean; error?: string;
        session?: { access_token: string; refresh_token: string; expires_in: number; expires_at: number; token_type: string; user: { id: string; email?: string } };
      };
      if (!json.success || !json.session) return { success: false, error: json.error ?? "Verification failed." };
      await applySession(json.session);
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please check your connection." };
    }
  };

  const signupWithPhone = async (_data: { name: string; phone: string; role: "student" | "scholar"; expertise?: string }): Promise<{ success: boolean; error?: string }> => {
    return { success: false, error: "Use the Mobile OTP tab to sign up with phone." };
  };
  const loginWithPhone = async (_phone: string, _loginRole: "student" | "scholar"): Promise<{ success: boolean; error?: string }> => {
    return { success: false, error: "Use the Mobile OTP tab to sign in with phone." };
  };
  const completePhoneLogin = async (_phone: string, _loginRole: "student" | "scholar"): Promise<{ success: boolean; error?: string }> => {
    return { success: false, error: "Use the Mobile OTP tab." };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  /* ── Purchases ── */

  const addPurchased = async (noteId: number, amount: string, method: string) => {
    if (!currentUser) return;
    setPurchased((prev) => new Set([...prev, noteId]));
    await addPurchase(currentUser.id, noteId, amount, method);
  };

  /* ── Bookmarks ── */

  const toggleBookmark = async (noteId: number) => {
    if (!currentUser) return;
    const wasBookmarked = bookmarked.has(noteId);
    setBookmarked((prev) => {
      const ns = new Set(prev);
      wasBookmarked ? ns.delete(noteId) : ns.add(noteId);
      return ns;
    });
    await toggleBookmarkDB(currentUser.id, noteId);
  };

  /* ── Uploads ── */

  const addUpload = async (
    item: UploadItem & { fileUrl?: string; thumbnailUrl?: string },
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: "Not logged in." };

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          description: item.description ?? null,
          scholar_id: currentUser.id,
          scholar_name: currentUser.name,
          price: item.price,
          original_price: item.original ?? null,
          exam: item.exam ?? null,
          category: item.category ?? null,
          board_type: item.boardType ?? null,
          subject: item.subject ?? null,
          pages: item.pages ?? 100,
          color: item.color ?? "bg-violet-500",
          tag: "New",
          rating: 0,
          reviews_count: 0,
          sales_count: 0,
          content_type: item.type ?? "PDF",
          status: "review",
          file_url: item.fileUrl ?? null,
          thumbnail_url: item.thumbnailUrl ?? null,
        }),
      });
      const json = await res.json() as { success: boolean; error?: string; note?: Note };
      if (!json.success || !json.note) return { success: false, error: json.error ?? "Upload failed." };
      const newItem = noteToUploadItem(json.note);
      setUploads((prev) => [newItem, ...prev]);
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please check your connection." };
    }
  };

  const approveContent = async (id: number) => {
    // Use server endpoint (service-role key) so RLS cannot block the update
    try {
      await fetch(`/api/notes/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "live", admin_id: currentUser?.id }),
      });
    } catch {
      // Fallback to direct DB call
      await updateNoteStatus(id, "live");
    }
    setUploads((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "live" as const } : u)),
    );
  };

  const rejectContent = async (id: number) => {
    // Use server endpoint (service-role key) so RLS cannot block the update
    try {
      await fetch(`/api/notes/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", admin_id: currentUser?.id }),
      });
    } catch {
      // Fallback to direct DB call
      await updateNoteStatus(id, "rejected");
    }
    setUploads((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "rejected" as const } : u)),
    );
  };

  const refreshUploads = async () => {
    if (!currentUser) return;
    if (role === "admin") {
      const allNotes = await getAllNotes();
      setUploads(allNotes.map(noteToUploadItem));
    } else if (role === "scholar") {
      const notes = await getNotes({ scholarId: currentUser.id });
      setUploads(notes.map(noteToUploadItem));
    }
  };

  /* ── Scholars ── */

  const removeScholar = async (id: number) => {
    await updateScholarApproval(id, "rejected");
    setPendingScholars((prev) => prev.filter((s) => s.id !== id));
  };

  const approveScholar = async (id: number) => {
    await updateScholarApproval(id, "approved");
    setPendingScholars((prev) => prev.filter((s) => s.id !== id));
  };

  /* ── Users ── */

  const banUser = async (id: number) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "banned" } : u)),
      );
    }
  };

  /* ── Profile update ── */

  const updateUserProfile = async (updates: {
    name?: string;
    expertise?: string;
    avatar_url?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: "Not logged in." };
    const result = await dbUpdateProfile(currentUser.id, updates);
    if (result.success && updates.name) {
      setCurrentUser((prev) =>
        prev ? { ...prev, name: updates.name! } : prev,
      );
    }
    return result;
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        loading,
        authLoading,
        login,
        signup,
        verifyEmailOtp,
        sendPhoneOtp,
        verifyPhoneOtp,
        signupWithPhone,
        loginWithPhone,
        completePhoneLogin,
        logout,
        purchased,
        addPurchased,
        bookmarked,
        toggleBookmark,
        uploads,
        addUpload,
        approveContent,
        rejectContent,
        pendingScholars,
        removeScholar,
        approveScholar,
        users,
        banUser,
        refreshUploads,
        updateUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
