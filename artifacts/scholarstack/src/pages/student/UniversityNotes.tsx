
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { universityTags } from "../../data/constants";
import { useApp } from "../../context/AppContext";
import { getNotes } from "../../lib/db";
import type { Note } from "../../lib/database.types";

const subjects = ["All Subjects","Accounting","Biology","Chemistry","Computer Science","Economics","Engineering","English","History","Law","Mathematics","Physics"];

interface Card {
  id: number; title: string; scholar: string; price: string; original: string;
  rating: number; reviews: number; tag: string; exam: string; pages: number;
  color: string; subject?: string;
}

function toCard(n: Note): Card {
  return {
    id: n.id, title: n.title, scholar: n.scholar_name, price: n.price,
    original: n.original_price ?? "", rating: Number(n.rating), reviews: n.reviews_count,
    tag: n.tag, exam: n.exam ?? "", pages: n.pages, color: n.color,
    subject: n.subject ?? undefined,
  };
}

export default function UniversityNotes() {
  const [, setLocation] = useLocation();
  const { purchased } = useApp();
  const [notes, setNotes] = useState<Card[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [activeUni, setActiveUni] = useState("All");
  const [activeSubject, setActiveSubject] = useState("All Subjects");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    setFetching(true);
    getNotes({ category: "university", status: "live" })
      .then(data => { setNotes(data.map(toCard)); setFetching(false); })
      .catch(() => setFetching(false));
  }, []);

  const filtered = notes.filter(n =>
    (activeUni === "All" || n.exam === activeUni) &&
    (activeSubject === "All Subjects" || n.subject === activeSubject) &&
    (search === "" || n.title.toLowerCase().includes(search.toLowerCase()) || n.scholar.toLowerCase().includes(search.toLowerCase())) &&
    (activeFilter === "All" ||
     (activeFilter === "Free" && n.price === "Free") ||
     (activeFilter === "Bestseller" && n.tag === "Bestseller") ||
     (activeFilter === "Top Rated" && n.rating >= 4.8))
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setLocation("/student")} className="text-gray-400 hover:text-white transition text-xs">← Home</button>
        <h1 className="font-black text-xl text-white flex-1">University Notes</h1>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-64">
          <span className="text-gray-400 text-xs">⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes, scholars..."
            className="flex-1 bg-transparent outline-none text-xs text-white placeholder-gray-500" />
        </div>
      </div>

      {/* University filter */}
      <div className="flex gap-2 flex-wrap mb-3">
        {["All", ...universityTags].map(u => (
          <button key={u} onClick={() => setActiveUni(u)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${activeUni === u ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent" : "border-white/10 text-gray-400 hover:border-blue-500/40 hover:text-white"}`}>
            {u}
          </button>
        ))}
      </div>

      {/* Subject + filter row */}
      <div className="flex gap-2 flex-wrap mb-6">
        <select value={activeSubject} onChange={e => setActiveSubject(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 outline-none focus:border-blue-500 transition cursor-pointer">
          {subjects.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
        </select>
        {["All", "Free", "Bestseller", "Top Rated"].map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${activeFilter === f ? "bg-blue-600/30 text-blue-300 border-blue-500/40" : "border-white/8 text-gray-500 hover:text-gray-300"}`}>
            {f}
          </button>
        ))}
      </div>

      {fetching ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading notes…</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">🎓</p>
          <p className="font-semibold">No notes found</p>
          <p className="text-xs mt-1">Try a different university or subject filter</p>
          <p className="text-xs mt-3 text-gray-600">University notes can be uploaded by scholars in the Upload section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(n => {
            const isPurchased = purchased.has(n.id);
            return (
              <button key={n.id} onClick={() => setLocation(`/student/notes/${n.id}`)}
                className="bg-[#13131a] border border-white/8 rounded-2xl overflow-hidden hover:border-blue-500/30 hover:scale-[1.02] transition-all duration-200 text-left group">
                <div className={`h-28 ${n.color} relative flex items-end p-3`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10">
                    {isPurchased && <span className="inline-block bg-green-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full mb-1">Purchased</span>}
                    <span className="inline-block bg-black/40 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{n.tag}</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-bold text-xs text-white line-clamp-2 mb-1 leading-snug">{n.title}</p>
                  <p className="text-[10px] text-gray-400 mb-1">{n.scholar}</p>
                  {n.subject && <p className="text-[9px] text-blue-400 mb-1">{n.subject}</p>}
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-400 text-[10px]">★</span>
                    <span className="text-[10px] text-gray-300">{n.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-blue-400">{n.price}</span>
                    {n.original && <span className="text-[10px] text-gray-500 line-through">{n.original}</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
