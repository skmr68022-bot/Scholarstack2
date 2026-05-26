import { supabase } from "./supabase";
import type { Profile, Note, Purchase, ScholarApproval } from "./database.types";

/* ─── Profiles ────────────────────────────────────────────── */

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return (data as Profile) ?? null;
}

export async function upsertProfile(profile: {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role?: "student" | "scholar" | "admin";
  expertise?: string | null;
  avatar_url?: string | null;
}): Promise<Profile | null> {
  const { data } = await supabase.from("profiles").upsert(profile).select().single();
  return (data as Profile) ?? null;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId);
  return error ? { success: false, error: error.message } : { success: true };
}

/* ─── Notes ───────────────────────────────────────────────── */

export async function getNotes(filters?: {
  category?: string;
  status?: string;
  scholarId?: string;
  boardType?: string;
  exam?: string;
  contentType?: string;
}): Promise<Note[]> {
  let q = supabase.from("notes").select("*");
  if (filters?.category) q = q.eq("category", filters.category);
  if (filters?.status) q = q.eq("status", filters.status);
  if (filters?.scholarId) q = q.eq("scholar_id", filters.scholarId);
  if (filters?.boardType) q = q.eq("board_type", filters.boardType);
  if (filters?.exam) q = q.eq("exam", filters.exam);
  if (filters?.contentType) q = q.eq("content_type", filters.contentType);
  const { data } = await q.order("sales_count", { ascending: false });
  return ((data as Note[]) ?? []);
}

export async function getRecentNotes(limit = 8): Promise<Note[]> {
  const { data } = await supabase
    .from("notes")
    .select("*")
    .eq("status", "live")
    .order("created_at", { ascending: false })
    .limit(limit);
  return ((data as Note[]) ?? []);
}

export async function getScholarProfiles(limit = 6): Promise<Profile[]> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "scholar")
    .limit(limit);
  return ((data as Profile[]) ?? []);
}

export async function getNoteById(id: number): Promise<Note | null> {
  const { data } = await supabase.from("notes").select("*").eq("id", id).single();
  return (data as Note) ?? null;
}

export async function insertNote(note: {
  title: string;
  description?: string | null;
  scholar_id?: string | null;
  scholar_name?: string;
  price?: string;
  original_price?: string | null;
  exam?: string | null;
  category?: string | null;
  board_type?: string | null;
  subject?: string | null;
  pages?: number;
  color?: string;
  tag?: string;
  rating?: number;
  reviews_count?: number;
  sales_count?: number;
  content_type?: string;
  status?: string;
  file_url?: string | null;
  thumbnail_url?: string | null;
}): Promise<{ data: Note | null; error?: string }> {
  const { data, error } = await supabase.from("notes").insert(note).select().single();
  return { data: (data as Note) ?? null, error: error?.message };
}

export async function updateNoteStatus(
  noteId: number,
  status: "review" | "live" | "rejected",
): Promise<boolean> {
  const { error } = await supabase
    .from("notes")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", noteId);
  return !error;
}

export async function getAllNotes(): Promise<Note[]> {
  const { data } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });
  return ((data as Note[]) ?? []);
}

/* ─── Purchases ───────────────────────────────────────────── */

export async function getPurchasedNoteIds(studentId: string): Promise<number[]> {
  const { data } = await supabase
    .from("purchases")
    .select("note_id")
    .eq("student_id", studentId);
  return ((data as { note_id: number }[]) ?? []).map((p) => p.note_id);
}

export async function getPurchases(studentId: string): Promise<(Purchase & { notes: Note | null })[]> {
  const { data } = await supabase
    .from("purchases")
    .select("*, notes(*)")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });
  return ((data as (Purchase & { notes: Note | null })[]) ?? []);
}

export async function addPurchase(
  studentId: string,
  noteId: number,
  amount: string,
  method: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("purchases").insert({
    student_id: studentId,
    note_id: noteId,
    amount,
    payment_method: method,
  });
  if (error) return { success: false, error: error.message };

  // Increment the note's sales_count so scholar earnings/analytics stay accurate
  const { data: note } = await supabase
    .from("notes")
    .select("sales_count")
    .eq("id", noteId)
    .single();
  if (note) {
    await supabase
      .from("notes")
      .update({ sales_count: ((note as { sales_count: number }).sales_count ?? 0) + 1 })
      .eq("id", noteId);
  }

  return { success: true };
}

/* ─── Bookmarks ───────────────────────────────────────────── */

export async function getBookmarkedNoteIds(studentId: string): Promise<number[]> {
  const { data } = await supabase
    .from("bookmarks")
    .select("note_id")
    .eq("student_id", studentId);
  return ((data as { note_id: number }[]) ?? []).map((b) => b.note_id);
}

export async function toggleBookmarkDB(
  studentId: string,
  noteId: number,
): Promise<{ bookmarked: boolean; error?: string }> {
  const { data: existing } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("student_id", studentId)
    .eq("note_id", noteId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("bookmarks").delete().eq("id", (existing as { id: number }).id);
    return { bookmarked: false, error: error?.message };
  } else {
    const { error } = await supabase
      .from("bookmarks")
      .insert({ student_id: studentId, note_id: noteId });
    return { bookmarked: true, error: error?.message };
  }
}

/* ─── Admin ───────────────────────────────────────────────── */

export async function getAllProfiles(): Promise<Profile[]> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  return ((data as Profile[]) ?? []);
}

export async function getPendingScholars(): Promise<ScholarApproval[]> {
  const { data } = await supabase
    .from("scholar_approvals")
    .select("*")
    .eq("status", "pending")
    .order("submitted_at", { ascending: false });
  return ((data as ScholarApproval[]) ?? []);
}

export async function updateScholarApproval(
  id: number,
  status: "approved" | "rejected",
): Promise<boolean> {
  const { error } = await supabase
    .from("scholar_approvals")
    .update({ status })
    .eq("id", id);
  return !error;
}

export async function submitScholarApplication(
  scholarId: string,
  scholarName: string,
  expertise: string,
): Promise<boolean> {
  const { error } = await supabase.from("scholar_approvals").insert({
    scholar_id: scholarId,
    scholar_name: scholarName,
    expertise,
  });
  return !error;
}
