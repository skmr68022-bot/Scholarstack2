
import { useState } from "react";
import { useLocation } from "wouter";
import { notes } from "../../data/constants";
import { useApp } from "../../context/AppContext";

export default function Library() {
  const [, setLocation] = useLocation();
  const { purchased, uploads } = useApp();
  const [downloading, setDownloading] = useState<number | null>(null);
  const [downloaded, setDownloaded] = useState<Set<number>>(new Set());

  const purchasedStaticNotes = notes.filter(n => purchased.has(n.id) || n.price === "Free");
  const purchasedUploads = uploads.filter(u => purchased.has(u.id) && u.status === "live");

  const allItems = [
    ...purchasedStaticNotes.map(n => ({
      id: n.id, title: n.title, scholar: n.scholar, price: n.price,
      pages: n.pages, exam: n.exam, color: n.color, type: "PDF" as const,
    })),
    ...purchasedUploads.map(u => ({
      id: u.id, title: u.title, scholar: u.scholar || "Scholar", price: u.price,
      pages: u.pages || 100, exam: u.exam || "", color: u.color || "bg-violet-500", type: u.type as "PDF" | "Video" | "Bundle",
    })),
  ];

  const handleDownload = (id: number) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      setDownloaded(prev => new Set([...prev, id]));
    }, 1800);
  };

  const totalPages = allItems.reduce((s, n) => s + (n.pages || 0), 0);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setLocation("/student")} className="text-gray-400 hover:text-white transition text-xs">← Home</button>
        <h1 className="font-black text-xl text-white flex-1">My Library</h1>
        <span className="text-xs text-gray-400">{allItems.length} items</span>
      </div>

      {allItems.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-7xl mb-5">📚</div>
          <div className="font-bold text-xl text-white mb-2">Your library is empty</div>
          <div className="text-gray-400 text-sm mb-8">Purchase notes to access them anytime, forever</div>
          <button onClick={() => setLocation("/student/notes")} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-bold text-white hover:opacity-90 transition">
            Browse Notes →
          </button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Notes Owned", value: allItems.length, color: "text-violet-400" },
              { label: "Total Pages", value: totalPages.toLocaleString(), color: "text-cyan-400" },
              { label: "Free Items", value: allItems.filter(n => n.price === "Free").length, color: "text-green-400" },
            ].map(s => (
              <div key={s.label} className="bg-[#13131a] border border-white/10 rounded-2xl p-4 text-center">
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {allItems.map(n => {
              const isDone = downloaded.has(n.id);
              const isLoading = downloading === n.id;
              return (
                <div key={n.id} className="bg-[#13131a] border border-green-500/20 rounded-2xl overflow-hidden hover:border-green-500/40 transition group">
                  <div className="h-24 flex items-center justify-center relative overflow-hidden cursor-pointer"
                    onClick={() => setLocation(`/student/notes/${n.id}`)}>
                    <div className={`absolute inset-0 ${n.color} opacity-30`} />
                    <span className="relative text-3xl">{n.type === "Video" ? "🎬" : "📄"}</span>
                    <div className="absolute top-2 right-2 bg-green-500/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">OWNED</div>
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-xs text-white mb-1 line-clamp-2 cursor-pointer hover:text-violet-300 transition"
                      onClick={() => setLocation(`/student/notes/${n.id}`)}>
                      {n.title}
                    </div>
                    <div className="text-[10px] text-gray-400 mb-0.5">{n.scholar}</div>
                    <div className="text-[10px] text-gray-500 mb-3">{n.pages} pages · {n.exam}</div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => setLocation(`/student/notes/${n.id}`)}
                        className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:bg-white/10 transition">
                        📖 Open Viewer
                      </button>
                      <button onClick={() => handleDownload(n.id)} disabled={isLoading}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition ${
                          isDone ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                          isLoading ? "bg-white/5 text-gray-400 border border-white/10" :
                          "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90"
                        }`}>
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-1.5">
                            <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                            Downloading…
                          </span>
                        ) : isDone ? "✓ Downloaded" : "📥 Download PDF"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
