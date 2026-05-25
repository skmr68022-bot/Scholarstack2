
import { useState } from "react";

const navItems = [
  { icon:"🏠", label:"Home", active:true },
  { icon:"📚", label:"My Library" },
  { icon:"🎬", label:"Reels" },
  { icon:"📋", label:"Exams" },
  { icon:"🤖", label:"AI Tutor" },
  { icon:"💬", label:"Discuss" },
  { icon:"🛒", label:"Orders" },
  { icon:"⚙️", label:"Settings" },
];
const continueItems = [
  { title:"UPSC Polity Notes", scholar:"Dr. Rajiv Menon", pct:68, color:"from-violet-500 to-indigo-500", pages:"220/324" },
  { title:"NEET Biology Master", scholar:"Priya Sharma", pct:42, color:"from-pink-500 to-rose-500", pages:"88/210" },
  { title:"JEE Math Shortcuts", scholar:"Karan Mehta", pct:91, color:"from-blue-500 to-cyan-500", pages:"180/198" },
];
const recommended = [
  { title:"UPSC Current Affairs 2025", scholar:"IAS Academy", price:"₹299", original:"₹799", rating:4.8, reviews:2140, tag:"Bestseller", color:"bg-orange-500" },
  { title:"NEET Chemistry Formulas", scholar:"Dr. Priya S.", price:"₹199", original:"₹499", rating:4.9, reviews:3820, tag:"Top Rated", color:"bg-green-500" },
  { title:"SSC CGL Math Tricks", scholar:"Rahul Verma", price:"Free", original:"", rating:4.7, reviews:8900, tag:"Free", color:"bg-yellow-500" },
  { title:"CAT Verbal Ability", scholar:"MBA Guru", price:"₹399", original:"₹999", rating:4.6, reviews:1200, tag:"New", color:"bg-blue-500" },
];
const upcomingExams = [
  { name:"UPSC CSE Prelims", date:"June 1, 2025", days:7, color:"from-orange-500 to-red-500" },
  { name:"NEET UG", date:"May 30, 2025", days:5, color:"from-green-500 to-emerald-500" },
  { name:"SSC CGL Tier 1", date:"June 14, 2025", days:20, color:"from-blue-500 to-indigo-500" },
];
const suggestedScholars = [
  { name:"Amit Tiwari", tag:"UPSC", avatar:"AT", bg:"from-orange-400 to-red-400", rating:4.9 },
  { name:"Riya Nair", tag:"NEET", avatar:"RN", bg:"from-pink-400 to-rose-400", rating:4.8 },
  { name:"Saurabh K.", tag:"JEE", avatar:"SK", bg:"from-blue-400 to-indigo-400", rating:4.9 },
];

export function StudentDashboard() {
  const [activeNav, setActiveNav] = useState("Home");
  const [streak] = useState(14);

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col py-6 px-4 bg-[#0d0d14] shrink-0">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">S</div>
          <span className="font-black text-xl">ScholarStack</span>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/5 border border-white/10 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center font-black text-sm">AS</div>
          <div>
            <div className="font-semibold text-sm">Arjun Singh</div>
            <div className="text-xs text-gray-400">UPSC Aspirant</div>
          </div>
          <div className="ml-auto text-xs bg-violet-500/20 text-violet-400 px-2 py-1 rounded-full font-semibold">Pro</div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(n => (
            <button key={n.label} onClick={() => setActiveNav(n.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeNav === n.label ? "bg-gradient-to-r from-violet-600/30 to-indigo-600/20 text-white border border-violet-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <span className="text-base">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        {/* Streak */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20 p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🔥</span>
            <span className="font-black text-2xl">{streak}</span>
          </div>
          <div className="text-xs text-gray-400">Day streak! Keep going!</div>
          <div className="mt-2 flex gap-1">
            {[...Array(7)].map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full ${i < 5 ? "bg-orange-400" : "bg-white/10"}`} />
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black">Good morning, Arjun! 👋</h1>
            <p className="text-gray-400 text-sm mt-1">You have <span className="text-violet-400 font-semibold">3 upcoming exams</span> — stay focused!</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg hover:bg-white/10 transition">🔔</button>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center font-bold">5</span>
            </div>
            <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-violet-500/25">+ Add Notes</button>
          </div>
        </div>

        {/* Upcoming Exams Banner */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {upcomingExams.map(e => (
            <div key={e.name} className={`relative rounded-2xl overflow-hidden p-5`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${e.color} opacity-15`} />
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${e.color} opacity-20 blur-2xl`} />
              <div className="relative">
                <div className={`text-xs font-bold bg-gradient-to-r ${e.color} bg-clip-text text-transparent mb-2`}>UPCOMING EXAM</div>
                <div className="font-bold text-base mb-1 leading-tight">{e.name}</div>
                <div className="text-gray-400 text-xs">{e.date}</div>
                <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-black bg-gradient-to-r ${e.color} bg-clip-text text-transparent`}>
                  <span>⏰</span> {e.days} days left
                </div>
              </div>
              <div className="absolute bottom-3 right-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${e.color} flex items-center justify-center text-white font-black text-sm opacity-80`}>{e.days}d</div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Learning */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-lg">📖 Continue Learning</h2>
            <button className="text-violet-400 text-xs font-semibold">View all →</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {continueItems.map(c => (
              <div key={c.title} className="bg-[#13131a] border border-white/10 rounded-2xl p-5 hover:border-violet-500/30 transition-all cursor-pointer group">
                <div className={`h-1.5 rounded-full bg-gradient-to-r ${c.color} mb-4`} style={{width:`${c.pct}%`}} />
                <div className="text-xs text-gray-500 mb-1">{c.pages} pages</div>
                <div className="font-bold text-sm leading-tight mb-1">{c.title}</div>
                <div className="text-xs text-gray-400">{c.scholar}</div>
                <div className="flex items-center justify-between mt-4">
                  <span className={`text-xs font-black bg-gradient-to-r ${c.color} bg-clip-text text-transparent`}>{c.pct}% done</span>
                  <button className={`text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r ${c.color} text-white font-semibold group-hover:scale-105 transition-transform`}>Continue →</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Notes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-lg">✨ Recommended for You</h2>
            <button className="text-violet-400 text-xs font-semibold">Browse all →</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {recommended.map(r => (
              <div key={r.title} className="bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all cursor-pointer group">
                <div className={`h-32 ${r.color} opacity-20 relative flex items-center justify-center`}>
                  <div className={`absolute inset-0 ${r.color} opacity-60`} />
                  <span className="relative text-4xl">📄</span>
                  <div className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full bg-white/20 text-white`}>{r.tag}</div>
                </div>
                <div className="p-4">
                  <div className="font-bold text-sm leading-tight mb-1 line-clamp-2">{r.title}</div>
                  <div className="text-xs text-gray-400 mb-2">{r.scholar}</div>
                  <div className="flex items-center gap-1 text-xs text-yellow-400 mb-3">
                    ⭐ {r.rating} <span className="text-gray-500">({r.reviews.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-violet-400">{r.price}</span>
                    {r.original && <span className="text-xs text-gray-500 line-through">{r.original}</span>}
                  </div>
                  <button className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold group-hover:scale-[1.02] transition-transform">
                    {r.price === "Free" ? "Access Free" : "Buy Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Scholars */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-lg">👨‍🏫 Suggested Scholars</h2>
            <button className="text-violet-400 text-xs font-semibold">See more →</button>
          </div>
          <div className="flex gap-4">
            {suggestedScholars.map(s => (
              <div key={s.name} className="bg-[#13131a] border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-violet-500/30 transition-all cursor-pointer flex-1">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center font-black text-sm shrink-0`}>{s.avatar}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{s.name}</div>
                  <div className="text-xs text-gray-400">{s.tag} Expert</div>
                  <div className="text-xs text-yellow-400 mt-0.5">⭐ {s.rating}</div>
                </div>
                <button className="px-4 py-2 rounded-xl border border-violet-500/40 text-violet-400 text-xs font-semibold hover:bg-violet-500/10 transition">Follow</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
