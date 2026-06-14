import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import {
  getProfile,
  upsertProfile,
  updateProfile as dbUpdateProfile,
  getPurchasedNoteIds,
  getBookmarkedNoteIds,
  addPurchase,
  toggleBookmarkDB,
  getAllNotes,
  getAllProfiles,
  getPendingScholars,
  updateScholarApproval,
  updateNoteStatus,
  insertNote,
  getNotes,
} from "../lib/db";
import type { Note, Profile, ScholarApproval } from "../lib/database.types";
import type { User } from "@supabase/supabase-js";

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
  const initials = (a.scholar_name ?? "S").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const bgs = ["from-pink-400 to-rose-400", "from-orange-400 to-red-400", "from-blue-400 to-indigo-400", "from-green-400 to-teal-400", "from-purple-400 to-violet-400"];
  return { id: a.id, name: a.scholar_name ?? "Scholar", tag: a.expertise ?? "Education", avatar: initials, bg: bgs[idx % bgs.length] };
}

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

  const loadRoleData = useCallback(async (profile: Profile) => {
    if (profile.role === "student") {
      const [pIds, bIds] = await Promise.all([getPurchasedNoteIds(profile.id), getBookmarkedNoteIds(profile.id)]);
      setPurchased(new Set(pIds));
      setBookmarked(new Set(bIds));
    }
    if (profile.role === "scholar") {
      const notes = await getNotes({ scholarId: profile.id });
      setUploads(notes.map(noteToUploadItem));
    }
    if (profile.role === "admin") {
      const [notes, allProfiles, approvals] = await Promise.all([getAllNotes(), getAllProfiles(), getPendingScholars()]);
      setUploads(notes.map(noteToUploadItem));
      setUsers(allProfiles.map(profileToAdminUser));
      setPendingScholars((approvals as ScholarApproval[]).map(approvalToPendingScholar));
    }
  }, []);

  const applyProfile = useCallback(async (profile: Profile) => {
    setCurrentUser({ id: profile.id, name: profile.name, email: profile.email ?? "", role: profile.role });
    setRole(profile.role);
    await loadRoleData(profile);
  }, [loadRoleData]);

  const loadUser = useCallback(async (user: User) => {
    const fallbackName = (user.user_metadata?.name as string | undefined) ?? user.email?.split("@")[0] ?? "User";
    const fallbackRole = (user.user_metadata?.role as "student" | "scholar" | "admin" | undefined) ?? "student";
    const profile = await upsertProfile({
      id: user.id,
      name: fallbackName,
      email: user.email ?? null,
      role: fallbackRole === "admin" ? "student" : fallbackRole,
      expertise: (user.user_metadata?.expertise as string | undefined) ?? null,
    });
    if (profile) await applyProfile(profile);
  }, [applyProfile]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) await loadUser(session.user);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) void loadUser(session.user).finally(() => setLoading(false));
      else {
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

  const login = async (email: string, password: string, _loginRole: "student" | "scholar" | "admin") => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: password.trim() });
      if (error) return { success: false, error: error.message };
      if (data.user) await loadUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Login failed." };
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (data: { name: string; email: string; password: string; phone?: string; role: "student" | "scholar"; expertise?: string }) => {
    setAuthLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: data.password.trim(),
        options: { data: { name: data.name.trim(), role: data.role, expertise: data.expertise ?? null } },
      });
      if (error) return { success: false, error: error.message };
      if (authData.user) {
        await upsertProfile({ id: authData.user.id, name: data.name.trim(), email: data.email.trim().toLowerCase(), role: data.role, expertise: data.expertise ?? null });
        if (authData.session) await loadUser(authData.user);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Signup failed." };
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyEmailOtp = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: token.trim(), type: "signup" });
    if (error) return { success: false, error: error.message };
    if (data.user) await loadUser(data.user);
    return { success: true };
  };

  const sendPhoneOtp = async () => ({ success: false, error: "Phone OTP is temporarily disabled." });
  const verifyPhoneOtp = async () => ({ success: false, error: "Phone OTP is temporarily disabled." });
  const signupWithPhone = async () => ({ success: false, error: "Phone signup is temporarily disabled." });
  const loginWithPhone = async () => ({ success: false, error: "Phone login is temporarily disabled." });
  const completePhoneLogin = async () => ({ success: false, error: "Phone login is temporarily disabled." });

  const logout = async () => { await supabase.auth.signOut(); };

  const addPurchased = async (noteId: number, amount: string, method: string) => {
    if (!currentUser) return;
    setPurchased((prev) => new Set([...prev, noteId]));
    await addPurchase(currentUser.id, noteId, amount, method);
  };

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

  const addUpload = async (item: UploadItem & { fileUrl?: string; thumbnailUrl?: string }) => {
    if (!currentUser) return { success: false, error: "Not logged in." };
    const note = await insertNote({
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
    });
    if (!note) return { success: false, error: "Upload failed." };
    setUploads((prev) => [noteToUploadItem(note), ...prev]);
    return { success: true };
  };

  const approveContent = async (id: number) => {
    await updateNoteStatus(id, "live");
    setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, status: "live" as const } : u)));
  };

  const rejectContent = async (id: number) => {
    await updateNoteStatus(id, "rejected");
    setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, status: "rejected" as const } : u)));
  };

  const refreshUploads = async () => {
    if (!currentUser) return;
    if (role === "admin") setUploads((await getAllNotes()).map(noteToUploadItem));
    else if (role === "scholar") setUploads((await getNotes({ scholarId: currentUser.id })).map(noteToUploadItem));
  };

  const removeScholar = async (id: number) => {
    await updateScholarApproval(id, "rejected");
    setPendingScholars((prev) => prev.filter((s) => s.id !== id));
  };

  const approveScholar = async (id: number) => {
    await updateScholarApproval(id, "approved");
    setPendingScholars((prev) => prev.filter((s) => s.id !== id));
  };

  const banUser = async (id: number) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "banned" } : u)));
  };

  const updateUserProfile = async (updates: { name?: string; expertise?: string; avatar_url?: string }) => {
    if (!currentUser) return { success: false, error: "Not logged in." };
    const result = await dbUpdateProfile(currentUser.id, updates);
    if (result.success && updates.name) setCurrentUser((prev) => (prev ? { ...prev, name: updates.name! } : prev));
    return result;
  };

  return (
    <AppContext.Provider value={{ role, setRole, currentUser, loading, authLoading, login, signup, verifyEmailOtp, sendPhoneOtp, verifyPhoneOtp, signupWithPhone, loginWithPhone, completePhoneLogin, logout, purchased, addPurchased, bookmarked, toggleBookmark, uploads, addUpload, approveContent, rejectContent, pendingScholars, removeScholar, approveScholar, users, banUser, refreshUploads, updateUserProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
