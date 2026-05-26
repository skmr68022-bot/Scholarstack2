
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { examTags, universityTags, boardTags } from "../../data/constants";
import { useApp } from "../../context/AppContext";
import { getNotes } from "../../lib/db";
import type { Note } from "../../lib/database.types";

type Category = "competitive" | "university" | "board";
type Step = "category" | "group" | "content";

interface Card {
  id: number; title: string; scholar: string; price: string; original: string;
  rating: number; reviews: number; tag: string; exam: string; pages: number;
  color: string; subject?: string; boardType?: string;
}

function toCard(n: Note): Card {
  return {
    id: n.id, title: n.title, scholar: n.scholar_name, price: n.price,
    original: n.original_price ?? "", rating: Number(n.rating), reviews: n.reviews_count,
    tag: n.tag, exam: n.exam ?? "", pages: n.pages, color: n.color,
    subject: n.subject ?? undefined, boardType: n.board_type ?? undefined,
  };
}

const CATEGORY_META = {
  competitive: {
    label: "Government & Competitive Exams",
    icon: "🏆",
    gradient: "from-violet-600 to-indigo-600",
    accent: "violet",
    desc: "UPSC, NEET, JEE, SSC, GATE, CAT & more",
    subLabel: "exam",
  },
  university: {
    label: "University Exams",
    icon: "🎓",
    gradient: "from-blue-600 to-cyan-600",
    accent: "blue",
    desc: "Delhi University, Mumbai, Anna, VTU & more",
    subLabel: "university",
  },
  board: {
    label: "Board Exams",
    icon: "📚",
    gradient: "from-green-600 to-teal-600",
    accent: "green",
    desc: "CBSE, CISCE, State Boards — Class 9 to 12",
    subLabel: "board",
  },
};

const BOARD_CLASSES: Record<string, string[]> = {
  "CBSE": boardTags.cbse,
  "CISCE": boardTags.cisce,
  "State Board": boardTags.state,
};

const EXAM_ICONS: Record<string, string> = {
  UPSC: "⚖️", NEET: "🔬", JEE: "⚙️", CAT: "📊", SSC: "📋",
  GATE: "💡", CUET: "🎯", Banking: "🏦", "State PSC": "🏛️", Defence: "🛡️",
};

const UNI_SHORT: Record<string, string> = {
  "Delhi University": "DU", "Mumbai University": "MU", "Anna University": "AU",
  "VTU": "VTU", "Pune University": "PU", "Osmania University": "OU",
  "Calcutta University": "CU", "BHU": "BHU", "JNU": "JNU", "IGNOU": "IGNOU",
  "Madras University": "MAD", "Rajasthan University": "RU",
};

export default function Browse() {
  const [, setLocation] = useLocation();
  const { purchased } = useApp();

  const [step, setStep] = useState<Step>("category");
  const [category, setCategory] = useState<Category | null>(null);
  const [group, setGroup] = useState<string | null>(null);
  const [subGroup, setSubGroup] = useState<string | null>(null);
  const [activeSubject, setActiveSubject] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Card[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!category) return;
    setFetching(true);
    getNotes({ category, status: "live" })
      .then(data => { setNotes(data.map(toCard)); setFetching(false); })
      .catch(() => setFetching(false));
  }, [category]);

  const selectCategory = (cat: Category) => {
    setCategory(cat);
    setGroup(null);
    setSubGroup(null);
    setActiveSubject("All");
    setActiveFilter("All");
    setSearch("");
    setStep("group");
  };

  const selectGroup = (g: string) => {
    setGroup(g);
    setSubGroup(null);
    setActiveSubject("All");
    setActiveFilter("All");
    setSearch("");
    setStep("content");
  };

  const goBack = () => {
    if (step === "content") {
      setStep("group");
      setGroup(null);
      setSubGroup(null);
      setActiveSubject("All");
    } else if (step === "group") {
      setStep("category");
      setCategory(null);
    }
  };

  const getGroups = (): string[] => {
    if (category === "competitive") return examTags;
    if (category === "university") return universityTags;
    if (category === "board") return ["CBSE", "CISCE", "State Board"];
    return [];
  };

  const filteredNotes = notes.filter(n => {
    if (category === "competitive" && group && n.exam !== group) return false;
    if (category === "university" && group && n.exam !== group) return false;
    if (category === "board") {
      if (group && n.boardType !== group) return false;
      if (subGroup && n.exam !== subGroup) return false;
    }
    if (activeSubject !== "All" && n.subject !== activeSubject) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) &&
        !n.scholar.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeFilter === "Free" && n.price !== "Free") return false;
    if (activeFilter === "Bestseller" && n.tag !== "Bestseller") return false;
    if (activeFilter === "Top Rated" && n.rating < 4.8) return false;
    return true;
  });

  const notesForSubjects = notes.filter(n => {
    if (category === "competitive" && group && n.exam !== group) return false;
    if (category === "university" && group && n.exam !== group) return false;
    if (category === "board") {
      if (group && n.boardType !== group) return false;
      if (subGroup && n.exam !== subGroup) return false;
    }
    return true;
  });

  const availableSubjects = [
    "All",
    ...Array.from(new Set(notesForSubjects.map(n => n.subject).filter(Boolean) as string[])),
  ];

  const meta = category ? CATEGORY_META[category] : null;
  const boardClassOptions = group && category === "board"
    ? BOARD_CLASSES[group] ?? []
    : [];

  return (
    <div className="p-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-6 text-xs flex-wrap">
        <button onClick={() => setLocation("/student")} className="text-gray-500 hover:text-white transition">Home</button>
        <span className="text-gray-700">/</span>
        <button
          onClick={() => { setStep("category"); setCategory(null); setGroup(null); }}
          className={step === "category" ? "text-white font-semibold" : "text-gray-400 hover:text-white transition"}
        >
          Browse
        </button>
        {category && (
          <>
            <span className="text-gray-700">/</span>
            <button
              onClick={() => { setStep("group"); setGroup(null); setSubGroup(null); setActiveSubject("All"); }}
              className={step === "group" ? "text-white font-semibold" : "text-gray-400 hover:text-white transition"}
            >
              {CATEGORY_META[category].label}
            </button>
          </>
        )}
        {group && (
          <>
            <span className="text-gray-700">/</span>
            <span className="text-white font-semibold">{group}</span>
          </>
        )}
      </div>

      {/* ── LEVEL 1: Category selection ── */}
      {step === "category" && (
        <div>
          <h1 className="font-black text-2xl text-white mb-1">Browse Content</h1>
          <p className="text-gray-400 text-sm mb-8">Choose a category to start exploring</p>
          <div className="space-y-3">
            {(["competitive", "university", "board"] as Category[]).map(cat => {
              const m = CATEGORY_META[cat];
              return (
                <button
                  key={cat}
                  onClick={() => selectCategory(cat)}
                  className="group w-full relative overflow-hidden bg-[#13131a] border border-white/8 rounded-2xl p-6 text-left hover:border-white/20 hover:bg-white/3 transition-all hover:scale-[1.005]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-[0.05] group-hover:opacity-[0.09] transition`} />
                  <div className="relative flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-3xl shrink-0 shadow-xl`}>
                      {m.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-lg text-white mb-1">{m.label}</div>
                      <div className="text-sm text-gray-400">{m.desc}</div>
                    </div>
                    <span className="text-gray-500 group-hover:text-white transition text-xl shrink-0">→</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LEVEL 2: Group selection ── */}
      {step === "group" && category && meta && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={goBack} className="text-gray-400 hover:text-white transition text-xs">← Back</button>
            <div>
              <h1 className="font-black text-xl text-white">{meta.label}</h1>
              <p className="text-gray-400 text-xs mt-0.5">
                Select a {meta.subLabel} to browse notes
              </p>
            </div>
          </div>

          {fetching ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {getGroups().map(g => {
                const count = notes.filter(n =>
                  category === "board" ? n.boardType === g : n.exam === g
                ).length;
                const icon = category === "competitive" ? (EXAM_ICONS[g] ?? "📝")
                  : category === "university" ? UNI_SHORT[g] ?? g.slice(0, 2).toUpperCase()
                  : g === "CBSE" ? "🔵" : g === "CISCE" ? "🟢" : "🟠";
                const isInitials = category === "university";

                return (
                  <button
                    key={g}
                    onClick={() => selectGroup(g)}
                    className={`group relative overflow-hidden bg-[#13131a] border border-white/8 rounded-2xl p-4 text-left hover:border-white/20 hover:scale-[1.02] transition-all ${count === 0 ? "opacity-60" : ""}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-0 group-hover:opacity-[0.07] transition`} />
                    <div className="relative flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shrink-0 shadow-md ${isInitials ? "text-[11px] font-black text-white" : "text-xl"}`}>
                        {icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-white mb-0.5 leading-snug">{g}</div>
                        <div className="text-[10px] text-gray-500">
                          {count > 0 ? `${count} note${count !== 1 ? "s" : ""} available` : "No notes yet"}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── LEVEL 3: Content (subjects + notes grid) ── */}
      {step === "content" && category && group && meta && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <button onClick={goBack} className="text-gray-400 hover:text-white transition text-xs">← Back</button>
            <div className="flex-1">
              <h1 className="font-black text-xl text-white">{group}</h1>
              <p className="text-gray-400 text-xs mt-0.5">{meta.label}</p>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-52">
              <span className="text-gray-400 text-xs">⌕</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search notes, scholars..."
                className="flex-1 bg-transparent outline-none text-xs text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Board: class sub-filter */}
          {category === "board" && boardClassOptions.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Class</p>
              <div className="flex gap-2 flex-wrap">
                {["All", ...boardClassOptions].map(c => (
                  <button
                    key={c}
                    onClick={() => setSubGroup(c === "All" ? null : c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                      (c === "All" && !subGroup) || subGroup === c
                        ? `bg-gradient-to-r ${meta.gradient} text-white border-transparent`
                        : "border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subject filter */}
          {availableSubjects.length > 1 && (
            <div className="mb-4">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Subject</p>
              <div className="flex gap-2 flex-wrap">
                {availableSubjects.map(s => (
                  <button
                    key={s}
                    onClick={() => setActiveSubject(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                      activeSubject === s
                        ? `bg-gradient-to-r ${meta.gradient} text-white border-transparent`
                        : "border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick filters */}
          <div className="flex gap-2 mb-6">
            {["All", "Free", "Bestseller", "Top Rated"].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                  activeFilter === f
                    ? "bg-white/10 text-white border-white/20"
                    : "border-white/8 text-gray-500 hover:text-gray-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Notes grid */}
          {fetching ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-semibold text-white">No notes found</p>
              <p className="text-xs mt-1">Try a different subject or filter, or check back after scholars upload content</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-3">{filteredNotes.length} result{filteredNotes.length !== 1 ? "s" : ""}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredNotes.map(n => {
                  const isPurchased = purchased.has(n.id);
                  return (
                    <button
                      key={n.id}
                      onClick={() => setLocation(`/student/notes/${n.id}`)}
                      className="bg-[#13131a] border border-white/8 rounded-2xl overflow-hidden hover:border-violet-500/30 hover:scale-[1.02] transition-all duration-200 text-left group"
                    >
                      <div className={`h-28 ${n.color} relative flex items-end p-3`}>
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="relative z-10">
                          {isPurchased && (
                            <span className="inline-block bg-green-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full mb-1">Purchased</span>
                          )}
                          <span className="inline-block bg-black/40 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{n.tag}</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-xs text-white line-clamp-2 mb-1 leading-snug">{n.title}</p>
                        <p className="text-[10px] text-gray-400 mb-1">{n.scholar}</p>
                        {n.subject && (
                          <p className="text-[9px] text-cyan-400 mb-1">{n.subject}</p>
                        )}
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-yellow-400 text-[10px]">★</span>
                          <span className="text-[10px] text-gray-300">{n.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-gray-500">({(n.reviews / 1000).toFixed(1)}K)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-violet-400">{n.price}</span>
                          {n.original && <span className="text-[10px] text-gray-500 line-through">{n.original}</span>}
                        </div>
                        <p className="text-[9px] text-gray-500 mt-1">{n.pages} pages</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
