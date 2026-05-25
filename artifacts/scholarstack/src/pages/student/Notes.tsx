
import { useState } from "react";
import { useLocation } from "wouter";
import { notes, examTags } from "../../data/constants";
import { useApp } from "../../context/AppContext";
import type { Note } from "../../data/constants";
import type { UploadItem } from "../../context/AppContext";

interface NoteCard {
  id: number; title: string; scholar: string; price: string; original: string;
  rating: number; reviews: number; tag: string; exam: string; pages: number; color: string;
}

function toCard(n: Note): NoteCard {
  return { id: n.id, title: n.title, scholar: n.scholar, price: n.price, original: n.original, rating: n.rating, reviews: n.reviews, tag: n.tag, exam: n.exam, pages: n.pages, color: n.color };
}
function uploadToCard(u: UploadItem): NoteCard {
  return { id: u.id, title: u.title, scholar: u.scholar || "Scholar", price: u.price, original: u.original || "", rating: u.rating, reviews: u.reviews, tag: u.tag || "New", exam: u.exam || "", pages: u.pages || 100, color: u.color || "bg-violet-500" };
}

export default function Notes() {
  const [, setLocation] = useLocation();
  const { uploads, purchased } = useApp();
  const [search, setSearch] = useState("");
  const [activeExam, setActiveExam] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");

  const liveUploads = uploads
    .filter(u => u.status === "live" && u.category === "competitive")
    .map(uploadToCard);
  const competitiveNotes = notes.filter(n => n.category === "competitive").map(toCard);
  const all = [...competitiveNotes, ...liveUploads];

  const filtered = all.filter(n =>
    (activeExam === "All" || n.exam === activeExam) &&
    (search === "" || n.title.toLowerCase().includes(search.toLowerCase()) || n.scholar.toLowerCase().includes(search.toLowerCase())) &&
    (activeFilter === "All" || (activeFilter === "Free" && n.price === "Free") || (activeFilter === "Bestseller" && n.tag === "Bestseller") || (activeFilter === "Top Rated" && n.rating >= 4.8))
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setLocation("/student")} className="text-gray-400 hover:text-white transition text-xs">← Home</button>
        <h1 className="font-black text-xl text-white flex-1">Competitive Exam Notes</h1>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-64">
          <span className="text-gray-400 text-xs">⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes, scholars..."
            className="flex-1 bg-transparent outline-none text-xs text-white placeholder-gray-500" />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {["All", ...examTags].map(e => (
          <button key={e} onClick={() => setActiveExam(e)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${activeExam === e ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent" : "border-white/10 text-gray-400 hover:border-violet-500/40 hover:text-white"}`}>
            {e}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-5 items-center">
        {["All", "Free", "Bestseller", "Top Rated"].map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs transition border ${activeFilter === f ? "bg-white/10 text-white border-white/20" : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"}`}>
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-500">{filtered.length} results</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map(n => {
          const owned = purchased.has(n.id) || n.price === "Free";
          return (
            <div key={n.id} onClick={() => setLocation(`/student/notes/${n.id}`)}
              className="bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-violet-500/30 transition hover:scale-[1.01] group">
              <div className="h-28 flex items-center justify-center relative overflow-hidden">
                <div className={`absolute inset-0 ${n.color} opacity-40`} />
                <span className="relative text-4xl">📄</span>
                <div className="absolute top-2 left-2 text-[10px] font-bold bg-white/15 text-white px-2 py-1 rounded-full backdrop-blur">{n.tag}</div>
                <div className="absolute top-2 right-2 text-[10px] font-bold bg-black/30 text-white px-2 py-1 rounded-full">{n.exam}</div>
                {owned && <div className="absolute bottom-2 right-2 text-[10px] font-bold bg-green-500/80 text-white px-2 py-0.5 rounded-full">Owned</div>}
              </div>
              <div className="p-4">
                <div className="font-semibold text-sm text-white leading-tight mb-1">{n.title}</div>
                <div className="text-xs text-gray-400 mb-2">{n.scholar}</div>
                <div className="flex items-center gap-1 text-xs text-yellow-400 mb-3">
                  ⭐ {n.rating} <span className="text-gray-500">({(n.reviews / 1000).toFixed(1)}K)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`font-black text-sm ${n.price === "Free" ? "text-green-400" : "text-violet-400"}`}>{n.price}</span>
                    {n.original && <span className="text-xs text-gray-500 line-through">{n.original}</span>}
                  </div>
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold opacity-0 group-hover:opacity-100 transition">
                    View →
                  </button>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">{n.pages} pages</div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <div className="font-semibold text-white">No notes found</div>
            <div className="text-sm mt-1">Try a different exam or search term</div>
            <button onClick={() => { setSearch(""); setActiveExam("All"); setActiveFilter("All"); }}
              className="mt-4 px-4 py-2 rounded-xl bg-violet-600/20 text-violet-400 text-xs font-semibold border border-violet-500/20 hover:bg-violet-600/30 transition">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
