
import { useLocation } from "wouter";
import { notes } from "../../data/constants";
import { useApp } from "../../context/AppContext";

export default function StudentHome() {
  const [, setLocation] = useLocation();
  const { purchased } = useApp();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Good morning, Arjun! 👋</h1>
          <p className="text-gray-400 text-xs mt-0.5">3 upcoming exams · 14-day streak 🔥</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-base hover:bg-white/10 transition text-white">🔔</button>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] flex items-center justify-center font-bold text-white">5</span>
          </div>
          <button onClick={() => setLocation("/student/notes")} className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-semibold text-white hover:opacity-90 transition">
            Browse Notes
          </button>
        </div>
      </div>

      {/* Exam countdowns */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { name: "UPSC Prelims", date: "June 1", days: 7, c: "from-orange-500 to-red-500" },
          { name: "NEET UG", date: "May 30", days: 5, c: "from-green-500 to-emerald-500" },
          { name: "SSC CGL", date: "June 14", days: 20, c: "from-blue-500 to-indigo-500" },
        ].map(e => (
          <div key={e.name} className="relative bg-[#13131a] border border-white/10 rounded-2xl p-4 overflow-hidden cursor-pointer hover:border-white/20 transition">
            <div className={`absolute inset-0 bg-gradient-to-br ${e.c} opacity-8`} />
            <div className="relative">
              <div className={`text-[10px] font-bold bg-gradient-to-r ${e.c} bg-clip-text text-transparent mb-1`}>UPCOMING</div>
              <div className="font-bold text-sm text-white leading-tight">{e.name}</div>
              <div className="text-[10px] text-gray-400 mt-1">{e.date}</div>
              <div className={`mt-2 text-xs font-black bg-gradient-to-r ${e.c} bg-clip-text text-transparent`}>⏰ {e.days} days left</div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue learning */}
      {purchased.size > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-white">Continue Learning</h2>
            <button onClick={() => setLocation("/student/library")} className="text-violet-400 text-xs">View all →</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {notes.filter(n => purchased.has(n.id)).slice(0, 3).map((n, i) => {
              const colors = ["from-violet-500 to-indigo-500", "from-pink-500 to-rose-500", "from-blue-500 to-cyan-500"];
              const pcts = [68, 42, 91];
              return (
                <div key={n.id} onClick={() => setLocation(`/student/notes/${n.id}`)} className="bg-[#13131a] border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-violet-500/30 transition group">
                  <div className={`h-1 rounded-full bg-gradient-to-r ${colors[i % 3]} mb-3`} style={{ width: `${pcts[i % 3]}%` }} />
                  <div className="font-semibold text-xs text-white leading-tight mb-1 line-clamp-2">{n.title}</div>
                  <div className="text-[10px] text-gray-400 mb-3">{n.scholar}</div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black bg-gradient-to-r ${colors[i % 3]} bg-clip-text text-transparent`}>{pcts[i % 3]}%</span>
                    <button className={`text-[10px] px-2.5 py-1 rounded-lg bg-gradient-to-r ${colors[i % 3]} text-white font-semibold`}>Continue →</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm text-white">Recommended for You</h2>
          <button onClick={() => setLocation("/student/notes")} className="text-violet-400 text-xs">Browse all →</button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {notes.slice(0, 4).map(n => (
            <div key={n.id} onClick={() => setLocation(`/student/notes/${n.id}`)} className="bg-[#13131a] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-violet-500/30 transition group">
              <div className={`h-20 flex items-center justify-center relative overflow-hidden`}>
                <div className={`absolute inset-0 ${n.color} opacity-40`} />
                <span className="relative text-3xl">📄</span>
              </div>
              <div className="p-3">
                <div className="font-semibold text-xs text-white leading-tight mb-1 line-clamp-2">{n.title}</div>
                <div className="text-[10px] text-gray-400 mb-1">{n.scholar}</div>
                <div className="text-[10px] text-yellow-400 mb-2">⭐ {n.rating}</div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xs text-violet-400">{n.price}</span>
                  {n.original && <span className="text-[10px] text-gray-500 line-through">{n.original}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scholar spotlight */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm text-white">Top Scholars</h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { name: "Dr. Rajiv Menon", tag: "UPSC · AIR 7", avatar: "RM", bg: "from-orange-400 to-red-500", students: "48K", rating: 4.9 },
            { name: "Priya Sharma", tag: "NEET · 720/720", avatar: "PS", bg: "from-pink-400 to-rose-500", students: "62K", rating: 4.8 },
            { name: "Karan Mehta", tag: "IIT · JEE", avatar: "KM", bg: "from-blue-400 to-indigo-500", students: "35K", rating: 4.9 },
            { name: "MBA Guru", tag: "CAT · 99.8%ile", avatar: "MG", bg: "from-purple-400 to-violet-500", students: "29K", rating: 4.7 },
          ].map(s => (
            <div key={s.name} className="bg-[#13131a] border border-white/10 rounded-2xl p-4 text-center cursor-pointer hover:border-violet-500/30 transition">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.bg} flex items-center justify-center font-black text-sm text-white mx-auto mb-3`}>{s.avatar}</div>
              <div className="font-bold text-xs text-white mb-0.5">{s.name}</div>
              <div className="text-[10px] text-gray-400 mb-2">{s.tag}</div>
              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-300">
                <span>👥 {s.students}</span>
                <span>⭐ {s.rating}</span>
              </div>
              <button className="mt-3 w-full py-1.5 rounded-lg bg-violet-500/15 text-violet-400 text-[10px] font-semibold border border-violet-500/20 hover:bg-violet-500/25 transition">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
