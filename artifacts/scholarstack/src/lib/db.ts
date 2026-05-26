import { supabase } from "./supabase";
import type { Database, Profile, Note } from "./database.types";

/* ─── Profiles ────────────────────────────────────────────── */

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return data;
}

export async function upsertProfile(
  profile: Database["public"]["Tables"]["profiles"]["Insert"],
): Promise<Profile | null> {
  const { data } = await supabase.from("profiles").upsert(profile).select().single();
  return data;
}

export async function updateProfile(
  userId: string,
  updates: Database["public"]["Tables"]["profiles"]["Update"],
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
}): Promise<Note[]> {
  let q = supabase.from("notes").select("*");
  if (filters?.category) q = q.eq("category", filters.category);
  if (filters?.status) q = q.eq("status", filters.status);
  if (filters?.scholarId) q = q.eq("scholar_id", filters.scholarId);
  if (filters?.boardType) q = q.eq("board_type", filters.boardType);
  if (filters?.exam) q = q.eq("exam", filters.exam);
  const { data } = await q.order("sales_count", { ascending: false });
  return data ?? [];
}

export async function getNoteById(id: number): Promise<Note | null> {
  const { data } = await supabase.from("notes").select("*").eq("id", id).single();
  return data;
}

export async function insertNote(
  note: Database["public"]["Tables"]["notes"]["Insert"],
): Promise<{ data: Note | null; error?: string }> {
  const { data, error } = await supabase.from("notes").insert(note).select().single();
  return { data, error: error?.message };
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
  const { data } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

/* ─── Purchases ───────────────────────────────────────────── */

export async function getPurchasedNoteIds(studentId: string): Promise<number[]> {
  const { data } = await supabase.from("purchases").select("note_id").eq("student_id", studentId);
  return (data ?? []).map((p) => p.note_id);
}

export async function getPurchases(studentId: string) {
  const { data } = await supabase
    .from("purchases")
    .select("*, notes(*)")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });
  return data ?? [];
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
  return error ? { success: false, error: error.message } : { success: true };
}

/* ─── Bookmarks ───────────────────────────────────────────── */

export async function getBookmarkedNoteIds(studentId: string): Promise<number[]> {
  const { data } = await supabase.from("bookmarks").select("note_id").eq("student_id", studentId);
  return (data ?? []).map((b) => b.note_id);
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
    const { error } = await supabase.from("bookmarks").delete().eq("id", existing.id);
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
  return data ?? [];
}

export async function banProfile(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from("profiles")
    .update({ role: "student" })
    .eq("id", userId);
  return !error;
}

export async function getPendingScholars() {
  const { data } = await supabase
    .from("scholar_approvals")
    .select("*")
    .eq("status", "pending")
    .order("submitted_at", { ascending: false });
  return data ?? [];
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
