
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useApp } from "../../context/AppContext";
import { getScholarProfiles, getRecentNotes } from "../../lib/db";
import type { Profile, Note } from "../../lib/database.types";

const EXAM_DATES: { name: string; iso: string; c: string }[] = [
  { name: "UPSC Prelims", iso: "2026-06-01", c: "from-orange-500 to-red-500" },
  { name: "NEET UG",      iso: "2026-05-30", c: "from-green-500 to-emerald-500" },
  { name: "SSC CGL",      iso: "2026-06-14", c: "from-blue-500 to-indigo-500" },
];

const SCHOLAR_BG = [
  "from-orange-400 to-red-400",
  "from-green-400 to-teal-400",
  "from-blue-400 to-indigo-400",
  "from-pink-400 to-rose-400",
  "from-purple-400 to-violet-400",
  "from-cyan-400 to-blue-400",
];

function daysUntil(iso: string): number {
  const now  = new Date();
  const then = new Date(iso);
  return Math.max(0, Math.ceil((then.getTime() - now.setHours(0,0,0,0)) / 86_400_000));
}

function initials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function StudentHome() {
  const [, setLocation] = useLocation();
  const { currentUser, purchased } = useApp();
  const [scholars, setScholars] = useState<Profile[]>([]);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);

  const fetchRecent = useCallback(() => {
    getRecentNotes(8).then(setRecentNotes).catch(() => {});
  }, []);

  useEffect(() => {
    getScholarProfiles(4).then(setScholars).catch(() => {});
    fetchRecent();
    const onVisible = () => { if (document.visibilityState === "visible") fetchRecent(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [fetchRecent]);

  const firstName = currentUser?.name?.split(" ")[0] ?? "there";

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Hi, {firstName}!</h1>
          <p className="text-gray-400 text-xs mt-0.5">
            {purchased.size > 0 ? `${purchased.size} notes purchased` : "Find notes for your exam"} · Keep it up!
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLocation("/student/notes")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-semibold text-white hover:opacity-90 transition">
            Browse Notes
          </button>
        </div>
      </div>

      {/* Exam countdowns */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {EXAM_DATES.map(e => {
          const days = daysUntil(e.iso);
          return (
            <div key={e.name} className="relative bg-[#13131a] border border-white/10 rounded-2xl p-4 overflow-hidden cursor-pointer hover:border-white/20 transition">
              <div className={`absolute inset-0 bg-gradient-to-br ${e.c} opacity-[0.08]`} />
              <div className="relative">
                <div className={`text-[10px] font-bold bg-gradient-to-r ${e.c} bg-clip-text text-transparent mb-1`}>UPCOMING</div>
                <div className="font-bold text-sm text-white leading-tight">{e.name}</div>
                <div className="text-[10px] text-gray-400 mt-1">{formatDate(e.iso)}</div>
                <div className={`text-2xl font-black bg-gradient-to-r ${e.c} bg-clip-text text-transparent mt-2`}>{days}d</div>
                <div className="text-[9px] text-gray-500">{days === 0 ? "today!" : "days left"}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Browse sections */}
      <h2 className="font-bold text-sm text-white mb-3">Browse by Category</h2>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Govt & Competitive", icon: "🏆", desc: "UPSC, NEET, JEE, SSC", gradient: "from-violet-600 to-indigo-600", path: "/student/notes" },
          { label: "University",          icon: "🎓", desc: "DU, Mumbai, Anna & more", gradient: "from-blue-600 to-cyan-600", path: "/student/university" },
          { label: "Board Exams",          icon: "📚", desc: "CBSE, CISCE, State Boards", gradient: "from-green-600 to-teal-600", path: "/student/board" },
        ].map(s => (
          <button key={s.label} onClick={() => setLocation(s.path)}
            className="bg-[#13131a] border border-white/8 rounded-2xl p-4 text-left hover:border-violet-500/30 hover:bg-white/3 transition group">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
            <div className="font-bold text-xs text-white mb-0.5">{s.label}</div>
            <div className="text-[10px] text-gray-500">{s.desc}</div>
          </button>
        ))}
      </div>

      {/* Quick access */}
      <h2 className="font-bold text-sm text-white mb-3">Quick Access</h2>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Video Reels", icon: "🎬", path: "/student/reels", color: "text-pink-400" },
          { label: "AI Tutor",    icon: "🤖", path: "/student/ai",    color: "text-cyan-400" },
          { label: "My Library", icon: "📖", path: "/student/library", color: "text-violet-400" },
          { label: "My Orders",  icon: "🛒", path: "/student/orders", color: "text-green-400" },
        ].map(q => (
          <button key={q.label} onClick={() => setLocation(q.path)}
            className="bg-[#13131a] border border-white/8 rounded-xl p-3 text-center hover:border-white/20 hover:bg-white/3 transition">
            <div className="text-xl mb-1">{q.icon}</div>
            <div className={`text-[10px] font-semibold ${q.color}`}>{q.label}</div>
          </button>
        ))}
      </div>

      {/* Recently Added */}
      {recentNotes.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-white">Recently Added</h2>
            <span className="text-[10px] text-gray-500">{recentNotes.length} new</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {recentNotes.map(n => (
              <button
                key={n.id}
                onClick={() => setLocation(`/student/notes/${n.id}`)}
                className="shrink-0 w-44 bg-[#13131a] border border-white/8 rounded-2xl overflow-hidden hover:border-violet-500/30 hover:scale-[1.02] transition-all duration-200 text-left"
              >
                <div className={`h-20 ${n.color} relative flex items-end p-2.5`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 flex gap-1 flex-wrap">
                    <span className="inline-block bg-green-500/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">New</span>
                    {n.category && (
                      <span className="inline-block bg-black/50 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full capitalize">{n.category}</span>
                    )}
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="font-bold text-[10px] text-white line-clamp-2 mb-1 leading-snug">{n.title}</p>
                  <p className="text-[9px] text-gray-400 truncate mb-1.5">{n.scholar_name}</p>
                  <p className="text-xs font-black text-violet-400">{n.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Top scholars */}
      <h2 className="font-bold text-sm text-white mb-3">Top Scholars</h2>
      {scholars.length === 0 ? (
        <div className="bg-[#13131a] border border-white/8 rounded-2xl p-6 text-center text-gray-500 text-xs">
          No scholars have joined yet. Be the first to upload notes!
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {scholars.map((s, i) => (
            <div key={s.id} className="bg-[#13131a] border border-white/8 rounded-2xl p-4 flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${SCHOLAR_BG[i % SCHOLAR_BG.length]} flex items-center justify-center font-black text-sm text-white shrink-0`}>
                {initials(s.name)}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-white truncate">{s.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{s.expertise ?? "Scholar"}</p>
                {s.is_verified && (
                  <p className="text-[10px] text-cyan-400 font-semibold">Verified</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
