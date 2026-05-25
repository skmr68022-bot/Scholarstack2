
import { useState } from "react";

const examCategories = ["UPSC","SSC","NEET","JEE","CDS","CUET","GATE","CAT","CLAT","CGL","CHSL","State PSC","Banking","Defence"];
const trendingExams = [
  { name:"UPSC CSE 2025", students:"2.4L", tag:"🔥 Trending", color:"from-orange-500 to-red-500" },
  { name:"NEET UG 2025", students:"3.1L", tag:"⚡ Hot", color:"from-green-500 to-emerald-600" },
  { name:"JEE Advanced", students:"1.8L", tag:"📈 Rising", color:"from-blue-500 to-indigo-600" },
  { name:"CAT 2025", students:"98K", tag:"⭐ Popular", color:"from-purple-500 to-violet-600" },
  { name:"SSC CGL 2025", students:"4.2L", tag:"🔥 Trending", color:"from-yellow-500 to-orange-500" },
  { name:"GATE 2025", students:"1.2L", tag:"📚 New", color:"from-cyan-500 to-blue-500" },
];
const featuredScholars = [
  { name:"Dr. Rajiv Menon", tag:"UPSC Topper AIR 7", rating:4.9, students:"48K", avatar:"RM", verified:true, bg:"from-orange-400 to-red-500" },
  { name:"Priya Sharma", tag:"NEET 720/720", rating:4.8, students:"62K", avatar:"PS", verified:true, bg:"from-pink-400 to-rose-500" },
  { name:"Karan Mehta", tag:"IIT Bombay | JEE", rating:4.9, students:"35K", avatar:"KM", verified:true, bg:"from-blue-400 to-indigo-500" },
  { name:"Ananya Singh", tag:"CAT 99.8 Percentile", rating:4.7, students:"29K", avatar:"AS", verified:true, bg:"from-purple-400 to-violet-500" },
];
const stats = [
  { val:"12L+", label:"Students" },
  { val:"8,400+", label:"Scholars" },
  { val:"2.8L+", label:"Notes & PDFs" },
  { val:"₹4.2Cr", label:"Earned by Scholars" },
];
const features = [
  { icon:"📚", title:"Notes Marketplace", desc:"Buy & sell premium study notes crafted by toppers and experts" },
  { icon:"🎬", title:"Reels Learning", desc:"Bite-size vertical video lessons. Learn on the go like Instagram Reels" },
  { icon:"🤖", title:"AI Study Assistant", desc:"Personalized recommendations, quizzes, and revision plans powered by AI" },
  { icon:"🎯", title:"Exam-Focused Bundles", desc:"Curated bundles for UPSC, NEET, JEE & more. Crack exams with toppers" },
  { icon:"💰", title:"Scholar Economy", desc:"Earn money by sharing your knowledge. Join India's creator economy" },
  { icon:"🔔", title:"Real-Time Progress", desc:"Track your learning streaks, goals, and purchase history in one place" },
];

export function LandingPage() {
  const [activeCategory, setActiveCategory] = useState("UPSC");
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(true);

  const bg = dark ? "bg-[#0a0a0f]" : "bg-[#f8f8fc]";
  const text = dark ? "text-white" : "text-gray-900";
  const cardBg = dark ? "bg-[#13131a] border-white/10" : "bg-white border-gray-200";
  const subtext = dark ? "text-gray-400" : "text-gray-500";
  const navBg = dark ? "bg-[#0a0a0f]/80 border-white/10" : "bg-white/80 border-gray-200";

  return (
    <div className={`${bg} ${text} min-h-screen font-sans overflow-x-hidden`}>
      {/* Nav */}
      <nav className={`fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b ${navBg} px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">S</div>
          <span className="font-bold text-xl tracking-tight">ScholarStack</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {["Explore","Scholars","Bundles","Reels","Pricing"].map(l => (
            <a key={l} className={`${subtext} hover:text-violet-400 transition-colors cursor-pointer`}>{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setDark(!dark)} className={`text-xs px-3 py-1.5 rounded-full border ${dark ? "border-white/20 text-white/60" : "border-gray-300 text-gray-500"} hover:border-violet-500 transition-colors`}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button className="text-sm px-4 py-2 rounded-full border border-white/20 text-white/70 hover:border-violet-500 transition-all">Log in</button>
          <button className="text-sm px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-violet-500/25">Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${dark ? "border-violet-500/30 bg-violet-500/10" : "border-violet-300 bg-violet-50"} text-violet-400 text-sm font-medium mb-8`}>
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            India's #1 Scholar Economy Platform — Join 12L+ students
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Learn from<br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">India's Toppers</span>
          </h1>
          <p className={`text-xl ${subtext} max-w-2xl mx-auto mb-10 leading-relaxed`}>
            Buy premium notes, watch short learning reels, and crack UPSC, NEET, JEE & 50+ exams with AI-powered guidance from verified scholars.
          </p>

          {/* Search */}
          <div className={`relative max-w-2xl mx-auto mb-12 ${dark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} border rounded-2xl flex items-center gap-3 px-5 py-4 shadow-2xl shadow-black/20`}>
            <span className="text-xl">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notes, scholars, exams, topics..."
              className="flex-1 bg-transparent outline-none text-base placeholder-gray-500"
            />
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shrink-0">Search</button>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {examCategories.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${activeCategory === c ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-lg shadow-violet-500/30" : dark ? "border-white/10 text-gray-400 hover:border-violet-500/50" : "border-gray-200 text-gray-600 hover:border-violet-300"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.val} className={`${cardBg} border rounded-2xl p-6 text-center`}>
              <div className="text-3xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">{s.val}</div>
              <div className={`text-sm ${subtext} mt-1 font-medium`}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Exams */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black">🔥 Trending Exams</h2>
              <p className={`${subtext} mt-1`}>Join thousands of students preparing right now</p>
            </div>
            <button className="text-violet-400 text-sm font-semibold hover:underline">View all →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {trendingExams.map(e => (
              <div key={e.name} className={`group relative ${cardBg} border rounded-2xl p-5 cursor-pointer hover:border-violet-500/50 transition-all hover:scale-[1.02] overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${e.color} opacity-10 blur-2xl rounded-full translate-x-8 -translate-y-8`} />
                <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${e.color} text-white mb-3`}>{e.tag}</div>
                <div className="font-bold text-lg mb-1">{e.name}</div>
                <div className={`text-sm ${subtext}`}>{e.students} students enrolled</div>
                <div className="mt-4 flex items-center gap-2 text-violet-400 text-sm font-semibold group-hover:gap-3 transition-all">Explore notes <span>→</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`py-20 px-6 ${dark ? "bg-white/2" : "bg-gray-50"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">Everything you need to <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">crack any exam</span></h2>
            <p className={`${subtext} text-lg max-w-2xl mx-auto`}>ScholarStack is more than a notes marketplace — it's a full learning ecosystem.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map(f => (
              <div key={f.title} className={`${cardBg} border rounded-2xl p-7 hover:border-violet-500/40 transition-all hover:shadow-xl hover:shadow-violet-500/10`}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <div className="font-bold text-xl mb-2">{f.title}</div>
                <div className={`text-sm ${subtext} leading-relaxed`}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Scholars */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black">⭐ Top Scholars</h2>
              <p className={`${subtext} mt-1`}>Learn from IIT toppers, UPSC rankers, and NEET achievers</p>
            </div>
            <button className="text-violet-400 text-sm font-semibold hover:underline">View all →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredScholars.map(s => (
              <div key={s.name} className={`${cardBg} border rounded-2xl p-5 text-center hover:border-violet-500/50 transition-all cursor-pointer hover:scale-[1.02]`}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.bg} flex items-center justify-center text-white font-black text-xl mx-auto mb-3 relative`}>
                  {s.avatar}
                  {s.verified && <span className="absolute -bottom-1 -right-1 text-sm">✅</span>}
                </div>
                <div className="font-bold text-sm leading-tight mb-1">{s.name}</div>
                <div className={`text-xs ${subtext} mb-3`}>{s.tag}</div>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="text-yellow-400">⭐ {s.rating}</span>
                  <span className={subtext}>•</span>
                  <span className={subtext}>{s.students}</span>
                </div>
                <button className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold hover:opacity-90 transition">Follow</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-600 opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent)]" />
            <div className="relative p-14">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-4xl font-black text-white mb-4">Start Learning Today</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Join 12L+ students using ScholarStack to prepare smarter, learn faster, and score higher.</p>
              <div className="flex items-center justify-center gap-4">
                <button className="px-8 py-4 rounded-2xl bg-white text-violet-700 font-black text-lg hover:scale-105 transition-all shadow-2xl">Get Started Free</button>
                <button className="px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-bold text-lg hover:bg-white/10 transition-all">Become a Scholar</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${dark ? "border-white/10" : "border-gray-200"} py-12 px-6`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">S</div>
            <span className="font-bold text-xl">ScholarStack</span>
          </div>
          <div className={`text-sm ${subtext}`}>© 2025 ScholarStack. India's Scholar Economy Platform.</div>
          <div className="flex gap-4 text-sm">
            {["Privacy","Terms","Support","Blog"].map(l => (
              <a key={l} className={`${subtext} hover:text-violet-400 cursor-pointer transition-colors`}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
