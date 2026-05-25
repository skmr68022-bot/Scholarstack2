
import { useState } from "react";
import { useLocation } from "wouter";
import { notes, boardTags } from "../../data/constants";
import { useApp } from "../../context/AppContext";
import type { Note } from "../../data/constants";
import type { UploadItem } from "../../context/AppContext";

type BoardTab = "CBSE" | "CISCE" | "State Board";

interface Card {
  id: number; title: string; scholar: string; price: string; original: string;
  rating: number; reviews: number; tag: string; exam: string; pages: number; color: string;
  boardType?: string; subject?: string;
}

function toCard(n: Note): Card {
  return { id: n.id, title: n.title, scholar: n.scholar, price: n.price, original: n.original, rating: n.rating, reviews: n.reviews, tag: n.tag, exam: n.exam, pages: n.pages, color: n.color, boardType: n.boardType, subject: n.subject };
}
function uploadToCard(u: UploadItem): Card {
  return { id: u.id, title: u.title, scholar: u.scholar || "Scholar", price: u.price, original: u.original || "", rating: u.rating, reviews: u.reviews, tag: u.tag || "New", exam: u.exam || "", pages: u.pages || 100, color: u.color || "bg-violet-500", boardType: u.boardType, subject: u.subject };
}

export default function BoardNotes() {
  const [, setLocation] = useLocation();
  const { purchased, uploads } = useApp();
  const [boardTab, setBoardTab] = useState<BoardTab>("CBSE");
  const [activeClass, setActiveClass] = useState("All");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const liveUploads = uploads.filter(u => u.status === "live" && u.category === "board").map(uploadToCard);
  const staticBoard = notes.filter(n => n.category === "board").map(toCard);
  const all = [...staticBoard, ...liveUploads];

  const classTags = boardTab === "CBSE" ? ["All", ...boardTags.cbse]
    : boardTab === "CISCE" ? ["All", ...boardTags.cisce]
    : ["All", ...boardTags.state];

  const filtered = all.filter(n =>
    n.boardType === boardTab &&
    (activeClass === "All" || n.exam === activeClass) &&
    (search === "" || n.title.toLowerCase().includes(search.toLowerCase()) || n.scholar.toLowerCase().includes(search.toLowerCase())) &&
    (activeFilter === "All" || (activeFilter === "Free" && n.price === "Free") || (activeFilter === "Top Rated" && n.rating >= 4.7))
  );

  const tabAccent: Record<BoardTab, string> = {
    "CBSE": "from-blue-600 to-indigo-600",
    "CISCE": "from-orange-500 to-red-600",
    "State Board": "from-emerald-600 to-teal-600",
  };
  const tabBadge: Record<BoardTab, string> = {
    "CBSE": "text-blue-400", "CISCE": "text-orange-400", "State Board": "text-emerald-400",
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => setLocation("/student")} className="text-gray-400 hover:text-white transition text-xs">← Home</button>
        <div className="flex-1">
          <h1 className="font-black text-xl text-white">Board Exam Notes</h1>
          <p className="text-xs text-gray-400 mt-0.5">CBSE, CISCE & State Board notes — Class 9–12 across all subjects</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-60">
          <span className="text-gray-400 text-xs">⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes or scholars..."
            className="flex-1 bg-transparent outline-none text-xs text-white placeholder-gray-500" />
        </div>
      </div>

      <div className="flex gap-3 my-5">
        {(["CBSE","CISCE","State Board"] as BoardTab[]).map(b => (
          <button key={b} onClick={() => { setBoardTab(b); setActiveClass("All"); }}
            className={`flex-1 py-4 rounded-2xl border transition font-bold text-sm ${boardTab === b ? `bg-gradient-to-r ${tabAccent[b]} text-white border-transparent shadow-lg` : "bg-white/3 border-white/10 text-gray-400 hover:border-white/20 hover:text-white"}`}>
            <div className="text-xl mb-1">{b === "CBSE" ? "📘" : b === "CISCE" ? "📙" : "📗"}</div>
            <div>{b}</div>
            <div className={`text-[10px] font-normal mt-0.5 ${boardTab === b ? "text-white/70" : "text-gray-500"}`}>
              {b === "CBSE" ? "Central Board" : b === "CISCE" ? "ICSE / ISC" : "All State Boards"}
            </div>
          </button>
        ))}
      </div>

      <div className="mb-4">
        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">{boardTab === "State Board" ? "Board" : "Class"}</p>
        <div className="flex gap-2 flex-wrap">
          {classTags.map(c => (
            <button key={c} onClick={() => setActiveClass(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${activeClass === c ? `bg-gradient-to-r ${tabAccent[boardTab]} text-white border-transparent` : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-5 items-center">
        {["All","Free","Top Rated"].map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs transition border ${activeFilter === f ? "bg-white/10 text-white border-white/20" : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"}`}>
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-500">{filtered.length} results for <span className={`font-semibold ${tabBadge[boardTab]}`}>{boardTab}</span></span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map(n => {
          const owned = purchased.has(n.id) || n.price === "Free";
          return (
            <div key={n.id} onClick={() => setLocation(`/student/notes/${n.id}`)}
              className="bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-violet-500/30 transition hover:scale-[1.01] group">
              <div className="h-24 flex items-center justify-center relative overflow-hidden">
                <div className={`absolute inset-0 ${n.color} opacity-35`} />
                <span className="relative text-3xl">{boardTab === "CBSE" ? "📘" : boardTab === "CISCE" ? "📙" : "📗"}</span>
                <div className="absolute top-2 left-2 text-[10px] font-bold bg-white/15 text-white px-2 py-1 rounded-full backdrop-blur">{n.tag}</div>
                {owned && <div className="absolute top-2 right-2 text-[10px] font-bold bg-green-500/80 text-white px-2 py-1 rounded-full">Owned</div>}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${boardTab === "CBSE" ? "bg-blue-500/15 text-blue-400 border-blue-500/20" : boardTab === "CISCE" ? "bg-orange-500/15 text-orange-400 border-orange-500/20" : "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"}`}>
                    {n.boardType}
                  </span>
                  <span className="text-[10px] bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">{n.exam}</span>
                  {n.subject && <span className="text-[10px] bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">{n.subject}</span>}
                </div>
                <div className="font-semibold text-sm text-white leading-tight mb-1">{n.title}</div>
                <div className="text-xs text-gray-400 mb-2">{n.scholar}</div>
                <div className="flex items-center gap-1 text-xs text-yellow-400 mb-3">
                  ⭐ {n.rating || "–"} <span className="text-gray-500">{n.reviews > 0 ? `(${(n.reviews / 1000).toFixed(1)}K)` : "(New)"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`font-black text-sm ${n.price === "Free" ? "text-green-400" : "text-violet-400"}`}>{n.price}</span>
                    {n.original && <span className="text-xs text-gray-500 line-through">{n.original}</span>}
                  </div>
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold opacity-0 group-hover:opacity-100 transition">View →</button>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">{n.pages} pages</div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <div className="font-semibold text-white">No notes found for {boardTab}</div>
            <button onClick={() => { setSearch(""); setActiveClass("All"); setActiveFilter("All"); }}
              className="mt-4 px-4 py-2 rounded-xl bg-violet-600/20 text-violet-400 text-xs font-semibold border border-violet-500/20 hover:bg-violet-600/30 transition">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
