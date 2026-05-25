
import { useState } from "react";
import { useLocation } from "wouter";
import { notes, universityTags } from "../../data/constants";
import { useApp } from "../../context/AppContext";

const subjects = ["All Subjects","Accounting","Biology","Chemistry","Computer Science","Economics","Engineering","English","History","Law","Mathematics","Physics"];

export default function UniversityNotes() {
  const [, setLocation] = useLocation();
  const { purchased } = useApp();
  const [search, setSearch] = useState("");
  const [activeUni, setActiveUni] = useState("All");
  const [activeSubject, setActiveSubject] = useState("All Subjects");
  const [activeFilter, setActiveFilter] = useState("All");

  const uniNotes = notes.filter(n => n.category === "university");

  const filtered = uniNotes.filter(n =>
    (activeUni === "All" || n.exam === activeUni) &&
    (activeSubject === "All Subjects" || n.subject === activeSubject) &&
    (search === "" || n.title.toLowerCase().includes(search.toLowerCase()) || n.scholar.toLowerCase().includes(search.toLowerCase())) &&
    (activeFilter === "All" || (activeFilter === "Free" && n.price === "Free") || (activeFilter === "Top Rated" && n.rating >= 4.7))
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => setLocation("/student")} className="text-gray-400 hover:text-white transition text-xs">← Home</button>
        <div className="flex-1">
          <h1 className="font-black text-xl text-white">University Exam Notes</h1>
          <p className="text-xs text-gray-400 mt-0.5">Semester notes, B.Com, B.Sc, B.Tech, LLB & more — curated by toppers</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-60">
          <span className="text-gray-400 text-xs">⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes or scholars..."
            className="flex-1 bg-transparent outline-none text-xs text-white placeholder-gray-500" />
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex gap-4 mb-5 mt-3">
        {[
          { label: "Universities covered", value: universityTags.length + "+" },
          { label: "Notes available", value: uniNotes.length.toString() },
          { label: "Free notes", value: uniNotes.filter(n => n.price === "Free").length.toString() },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-4 py-2">
            <span className="font-black text-violet-400 text-sm">{s.value}</span>
            <span className="text-xs text-gray-400">{s.label}</span>
          </div>
        ))}
      </div>

      {/* University filter */}
      <div className="mb-3">
        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">University</p>
        <div className="flex gap-2 flex-wrap">
          {["All", ...universityTags].map(u => (
            <button key={u} onClick={() => setActiveUni(u)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${activeUni === u ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent" : "border-white/10 text-gray-400 hover:border-violet-500/40 hover:text-white"}`}>
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Subject + Quick filters row */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {subjects.map(s => (
            <button key={s} onClick={() => setActiveSubject(s)}
              className={`px-3 py-1.5 rounded-lg text-xs transition border ${activeSubject === s ? "bg-white/10 text-white border-white/20" : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2 items-center">
          {["All","Free","Top Rated"].map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs transition border ${activeFilter === f ? "bg-white/10 text-white border-white/20" : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"}`}>
              {f}
            </button>
          ))}
          <span className="text-xs text-gray-500 ml-1">{filtered.length} results</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(n => {
          const owned = purchased.has(n.id);
          return (
            <div key={n.id} onClick={() => setLocation(`/student/notes/${n.id}`)}
              className="bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-violet-500/30 transition hover:scale-[1.01] group">
              <div className="h-24 flex items-center justify-center relative overflow-hidden">
                <div className={`absolute inset-0 ${n.color} opacity-40`} />
                <span className="relative text-3xl">🎓</span>
                <div className="absolute top-2 left-2 text-[10px] font-bold bg-white/15 text-white px-2 py-1 rounded-full backdrop-blur">{n.tag}</div>
                {owned && <div className="absolute top-2 right-2 text-[10px] font-bold bg-green-500/80 text-white px-2 py-1 rounded-full">Owned</div>}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] bg-violet-500/15 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full font-semibold">{n.exam}</span>
                  {n.subject && <span className="text-[10px] bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">{n.subject}</span>}
                </div>
                <div className="font-semibold text-sm text-white leading-tight mb-1">{n.title}</div>
                <div className="text-xs text-gray-400 mb-2">{n.scholar}</div>
                <div className="flex items-center gap-1 text-xs text-yellow-400 mb-3">
                  ⭐ {n.rating} <span className="text-gray-500">({(n.reviews / 1000).toFixed(1)}K reviews)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-violet-400">{n.price}</span>
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
            <div className="text-sm mt-1">Try a different university or subject</div>
            <button onClick={() => { setSearch(""); setActiveUni("All"); setActiveSubject("All Subjects"); setActiveFilter("All"); }}
              className="mt-4 px-4 py-2 rounded-xl bg-violet-600/20 text-violet-400 text-xs font-semibold border border-violet-500/20 hover:bg-violet-600/30 transition">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
