
import { useState } from "react";
import { useLocation } from "wouter";
import { reels } from "../../data/constants";

export default function Reels() {
  const [, setLocation] = useLocation();
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const reel = reels[current];

  const toggleLike = (id: number) => setLiked(prev => {
    const ns = new Set(prev);
    ns.has(id) ? ns.delete(id) : ns.add(id);
    return ns;
  });
  const toggleSave = (id: number) => setSaved(prev => {
    const ns = new Set(prev);
    ns.has(id) ? ns.delete(id) : ns.add(id);
    return ns;
  });

  return (
    <div className="flex h-full bg-black">
      {/* Reel view */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {/* Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${reel.bg} opacity-20`} />
        <div className="absolute inset-0 bg-black/60" />

        {/* Locked overlay */}
        {reel.premium && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-20">
            <div className="text-5xl mb-3">🔒</div>
            <div className="font-black text-lg text-white mb-2">Premium Content</div>
            <div className="text-gray-400 text-sm mb-5">Unlock all reels with ScholarStack Pro</div>
            <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-sm text-white hover:opacity-90 transition">
              Unlock — ₹199/month
            </button>
          </div>
        )}

        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-8xl opacity-10 text-white">▶</div>
        </div>

        {/* Top bar */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
          <span className="text-xs bg-black/40 backdrop-blur px-3 py-1.5 rounded-full font-semibold text-white border border-white/10">{reel.exam}</span>
          <button onClick={() => setLocation("/student")} className="text-xs bg-black/40 backdrop-blur px-3 py-1.5 rounded-full font-semibold text-white border border-white/10">
            ← Back
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 inset-x-0 p-5 z-10 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${reel.bg} flex items-center justify-center font-black text-xs text-white shrink-0`}>{reel.avatar}</div>
                <div>
                  <div className="font-bold text-sm text-white">{reel.scholar}</div>
                  <div className="text-xs text-gray-300">{reel.exam} Expert</div>
                </div>
                <button className="ml-auto text-xs border border-violet-400 text-violet-400 px-3 py-1.5 rounded-lg hover:bg-violet-400/10 transition">
                  + Follow
                </button>
              </div>
              <div className="font-bold text-sm text-white mb-1">{reel.title}</div>
              <div className="flex gap-5 text-xs text-gray-300 mt-3">
                <button onClick={() => toggleLike(reel.id)} className="flex flex-col items-center gap-1 hover:text-white transition">
                  <span className={`text-xl ${liked.has(reel.id) ? "text-red-400" : ""}`}>{liked.has(reel.id) ? "❤️" : "♡"}</span>
                  <span>{liked.has(reel.id) ? parseInt(reel.likes) + 1 + "K" : reel.likes}</span>
                </button>
                <button className="flex flex-col items-center gap-1 hover:text-white transition">
                  <span className="text-xl">💬</span><span>{reel.comments}</span>
                </button>
                <button onClick={() => toggleSave(reel.id)} className="flex flex-col items-center gap-1 hover:text-white transition">
                  <span className={`text-xl ${saved.has(reel.id) ? "text-yellow-400" : ""}`}>{saved.has(reel.id) ? "🔖" : "⬡"}</span>
                  <span>{reel.saves}</span>
                </button>
                <button className="flex flex-col items-center gap-1 hover:text-white transition">
                  <span className="text-xl">↗</span><span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Nav dots */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
          {reels.map((_, j) => (
            <button key={j} onClick={() => setCurrent(j)}
              className={`rounded-full transition-all ${j === current ? "w-2 h-8 bg-white" : "w-2 h-2 bg-white/30 hover:bg-white/50"}`} />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-72 bg-[#0d0d14] border-l border-white/10 p-4 overflow-y-auto">
        <div className="font-bold text-sm text-white mb-4">More Reels</div>
        <div className="space-y-3">
          {reels.map((r, i) => (
            <button key={r.id} onClick={() => setCurrent(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition ${i === current ? "bg-white/10 border border-white/15" : "hover:bg-white/5"}`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.bg} flex items-center justify-center font-black text-xs text-white shrink-0`}>{r.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-xs text-white truncate">{r.title}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{r.scholar}</div>
                <div className="flex gap-2 mt-1 text-[10px] text-gray-500">
                  <span>❤️ {r.likes}</span>
                  {r.premium && <span className="text-yellow-500">PRO</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
