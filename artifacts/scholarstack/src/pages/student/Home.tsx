
import { useLocation } from "wouter";
import { useApp } from "../../context/AppContext";

const examCountdowns = [
  { name: "UPSC Prelims", date: "June 1, 2026", days: 6, c: "from-orange-500 to-red-500" },
  { name: "NEET UG", date: "May 30, 2026", days: 4, c: "from-green-500 to-emerald-500" },
  { name: "SSC CGL", date: "June 14, 2026", days: 19, c: "from-blue-500 to-indigo-500" },
];

const featuredScholars = [
  { name: "Dr. Rajiv Menon", tag: "UPSC · IAS 2019", sales: "₹4.2L earned", avatar: "RM", color: "from-orange-400 to-red-400" },
  { name: "Priya Sharma", tag: "NEET · AIR 47", sales: "₹2.8L earned", avatar: "PS", color: "from-green-400 to-teal-400" },
  { name: "Arjun Kulkarni", tag: "JEE · IIT Bombay", sales: "₹3.1L earned", avatar: "AK", color: "from-blue-400 to-indigo-400" },
  { name: "Kavya Reddy", tag: "CA Final · AIR 3", sales: "₹1.9L earned", avatar: "KR", color: "from-pink-400 to-rose-400" },
];

export default function StudentHome() {
  const [, setLocation] = useLocation();
  const { currentUser, purchased } = useApp();

  const firstName = currentUser?.name?.split(" ")[0] ?? "there";

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Hi, {firstName}! 👋</h1>
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
        {examCountdowns.map(e => (
          <div key={e.name} className="relative bg-[#13131a] border border-white/10 rounded-2xl p-4 overflow-hidden cursor-pointer hover:border-white/20 transition">
            <div className={`absolute inset-0 bg-gradient-to-br ${e.c} opacity-[0.08]`} />
            <div className="relative">
              <div className={`text-[10px] font-bold bg-gradient-to-r ${e.c} bg-clip-text text-transparent mb-1`}>UPCOMING</div>
              <div className="font-bold text-sm text-white leading-tight">{e.name}</div>
              <div className="text-[10px] text-gray-400 mt-1">{e.date}</div>
              <div className={`text-2xl font-black bg-gradient-to-r ${e.c} bg-clip-text text-transparent mt-2`}>{e.days}d</div>
              <div className="text-[9px] text-gray-500">days left</div>
            </div>
          </div>
        ))}
      </div>

      {/* Browse sections */}
      <h2 className="font-bold text-sm text-white mb-3">Browse by Category</h2>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Govt & Competitive", icon: "🏆", desc: "UPSC, NEET, JEE, SSC", gradient: "from-violet-600 to-indigo-600" },
          { label: "University", icon: "🎓", desc: "DU, Mumbai, Anna & more", gradient: "from-blue-600 to-cyan-600" },
          { label: "Board Exams", icon: "📚", desc: "CBSE, CISCE, State Boards", gradient: "from-green-600 to-teal-600" },
        ].map(s => (
          <button key={s.label} onClick={() => setLocation("/student/browse")}
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
          { label: "AI Tutor", icon: "🤖", path: "/student/ai", color: "text-cyan-400" },
          { label: "My Library", icon: "📖", path: "/student/library", color: "text-violet-400" },
          { label: "My Orders", icon: "🛒", path: "/student/orders", color: "text-green-400" },
        ].map(q => (
          <button key={q.label} onClick={() => setLocation(q.path)}
            className="bg-[#13131a] border border-white/8 rounded-xl p-3 text-center hover:border-white/20 hover:bg-white/3 transition">
            <div className="text-xl mb-1">{q.icon}</div>
            <div className={`text-[10px] font-semibold ${q.color}`}>{q.label}</div>
          </button>
        ))}
      </div>

      {/* Top scholars */}
      <h2 className="font-bold text-sm text-white mb-3">Top Scholars</h2>
      <div className="grid grid-cols-2 gap-3">
        {featuredScholars.map(s => (
          <div key={s.name} className="bg-[#13131a] border border-white/8 rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center font-black text-sm text-white shrink-0`}>
              {s.avatar}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs text-white truncate">{s.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{s.tag}</p>
              <p className="text-[10px] text-green-400 font-semibold">{s.sales}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
