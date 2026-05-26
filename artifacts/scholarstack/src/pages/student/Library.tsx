
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useApp } from "../../context/AppContext";
import { getNotes } from "../../lib/db";
import type { Note } from "../../lib/database.types";

export default function Library() {
  const [, setLocation] = useLocation();
  const { purchased, bookmarked } = useApp();
  const [tab, setTab] = useState<"purchased" | "bookmarked">("purchased");
  const [notes, setNotes] = useState<Note[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    setFetching(true);
    getNotes({ status: "live" })
      .then(data => { setNotes(data); setFetching(false); })
      .catch(() => setFetching(false));
  }, []);

  const purchasedNotes = notes.filter(n => purchased.has(n.id));
  const bookmarkedNotes = notes.filter(n => bookmarked.has(n.id));
  const display = tab === "purchased" ? purchasedNotes : bookmarkedNotes;

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-black text-xl text-white">My Library</h1>
        <div className="flex gap-1 ml-auto bg-white/5 rounded-xl p-1 border border-white/10">
          {(["purchased", "bookmarked"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${tab === t ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}>
              {t === "purchased" ? `Purchased (${purchasedNotes.length})` : `Saved (${bookmarkedNotes.length})`}
            </button>
          ))}
        </div>
      </div>

      {fetching ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : display.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">{tab === "purchased" ? "📚" : "★"}</p>
          <p className="font-semibold text-white mb-1">{tab === "purchased" ? "No purchases yet" : "No bookmarks yet"}</p>
          <p className="text-xs text-gray-400 mb-6">{tab === "purchased" ? "Browse and buy notes to access them here." : "Star notes you want to save for later."}</p>
          <button onClick={() => setLocation("/student/notes")}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold">
            Browse Notes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {display.map(n => (
            <button key={n.id} onClick={() => setLocation(`/student/notes/${n.id}`)}
              className="bg-[#13131a] border border-white/8 rounded-2xl overflow-hidden hover:border-violet-500/30 hover:scale-[1.02] transition-all text-left">
              <div className={`h-24 ${n.color} relative flex items-end p-3`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10">
                  {tab === "purchased" && (
                    <span className="inline-block bg-green-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Purchased</span>
                  )}
                  {tab === "bookmarked" && (
                    <span className="inline-block bg-amber-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Saved</span>
                  )}
                </div>
              </div>
              <div className="p-3">
                <p className="font-bold text-xs text-white line-clamp-2 mb-1">{n.title}</p>
                <p className="text-[10px] text-gray-400 mb-2">{n.scholar_name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-violet-400">{n.price}</span>
                  <span className="text-[9px] text-gray-500">{n.pages}p</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
