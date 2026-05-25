
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen =
  | "splash" | "role" | "auth"
  | "landing"
  | "s-home" | "s-notes" | "s-note-detail" | "s-reels" | "s-library" | "s-ai" | "s-profile" | "s-orders"
  | "sc-home" | "sc-upload" | "sc-content" | "sc-earnings" | "sc-analytics"
  | "admin";

type Role = "student" | "scholar" | "admin" | null;
type AuthMode = "login" | "signup";

// ─── Shared helpers ───────────────────────────────────────────────────────────
const examTags = ["UPSC","NEET","JEE","CAT","SSC","GATE","CUET","Banking","State PSC","Defence"];
const notes = [
  { id:1, title:"UPSC Polity Complete Notes 2025", scholar:"Dr. Rajiv Menon", price:"₹299", original:"₹799", rating:4.9, reviews:12400, tag:"Bestseller", exam:"UPSC", pages:324, color:"bg-orange-500" },
  { id:2, title:"NEET Biology Master Notes", scholar:"Priya Sharma", price:"₹249", original:"₹599", rating:4.9, reviews:8200, tag:"Top Rated", exam:"NEET", pages:210, color:"bg-green-500" },
  { id:3, title:"JEE Math Shortcut Tricks", scholar:"Karan Mehta", price:"₹199", original:"₹499", rating:4.8, reviews:6100, tag:"Trending", exam:"JEE", pages:180, color:"bg-blue-500" },
  { id:4, title:"SSC CGL Math Tricks", scholar:"Rahul Verma", price:"Free", original:"", rating:4.7, reviews:19400, tag:"Free", exam:"SSC", pages:90, color:"bg-yellow-500" },
  { id:5, title:"CAT Verbal Ability Notes", scholar:"MBA Guru", price:"₹399", original:"₹999", rating:4.6, reviews:3200, tag:"New", exam:"CAT", pages:150, color:"bg-purple-500" },
  { id:6, title:"GATE ECE Full Syllabus", scholar:"Rohit Singh", price:"₹349", original:"₹899", rating:4.8, reviews:4100, tag:"Complete", exam:"GATE", pages:280, color:"bg-cyan-500" },
];
const scholars = [
  { name:"Dr. Rajiv Menon", tag:"IAS AIR 7 • UPSC", avatar:"RM", bg:"from-orange-400 to-red-500", rating:4.9, students:"48K", verified:true },
  { name:"Priya Sharma", tag:"NEET 720/720", avatar:"PS", bg:"from-pink-400 to-rose-500", rating:4.8, students:"62K", verified:true },
  { name:"Karan Mehta", tag:"IIT Bombay • JEE", avatar:"KM", bg:"from-blue-400 to-indigo-500", rating:4.9, students:"35K", verified:true },
  { name:"MBA Guru", tag:"CAT 99.8 %ile", avatar:"MG", bg:"from-purple-400 to-violet-500", rating:4.7, students:"29K", verified:true },
];
const reels = [
  { id:1, title:"Preamble in 60 Seconds 🇮🇳", scholar:"Dr. Rajiv Menon", avatar:"RM", bg:"from-orange-400 to-red-500", exam:"UPSC", likes:"24.8K", comments:"1.2K", saves:"8.9K", premium:false },
  { id:2, title:"Mitosis vs Meiosis 🧬", scholar:"Priya Sharma", avatar:"PS", bg:"from-pink-400 to-rose-500", exam:"NEET", likes:"41.2K", comments:"3.4K", saves:"18.2K", premium:false },
  { id:3, title:"Integration by Parts 📐", scholar:"Karan Mehta", avatar:"KM", bg:"from-blue-400 to-indigo-500", exam:"JEE", likes:"18.6K", comments:"940", saves:"12.4K", premium:true },
];

// ─── Splash ───────────────────────────────────────────────────────────────────
function Splash({ onNext }: { onNext: () => void }) {
  const [opacity, setOpacity] = useState(1);
  const [pct, setPct] = useState(0);
  useState(() => {
    let v = 0;
    const id = setInterval(() => {
      v += 2; setPct(v);
      if (v >= 100) { clearInterval(id); setTimeout(() => { setOpacity(0); setTimeout(onNext, 400); }, 300); }
    }, 30);
    return () => clearInterval(id);
  });
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0f] transition-opacity duration-500" style={{ opacity }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 text-center">
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-violet-500/40 mx-auto">
            <span className="text-white font-black text-4xl">S</span>
          </div>
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
          <div className="absolute -bottom-2 -left-2 w-3.5 h-3.5 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50" />
        </div>
        <h1 className="text-5xl font-black text-white tracking-tight mb-2">ScholarStack</h1>
        <p className="text-gray-400 text-base font-medium mb-8">India's Scholar Economy Platform</p>
        <div className="flex gap-3 justify-center mb-12">
          {["📚 2.8L+ Notes","🎬 Video Reels","🤖 AI Tutor"].map(t => (
            <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300">{t}</span>
          ))}
        </div>
        <div className="w-48 mx-auto">
          <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-75" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">Loading your experience…</div>
        </div>
      </div>
      <div className="absolute bottom-6 text-xs text-gray-600">Trusted by 12L+ students · Join the scholar economy</div>
    </div>
  );
}

// ─── Role Selection ───────────────────────────────────────────────────────────
function RoleSelect({ onRole }: { onRole: (r: Role) => void }) {
  return (
    <div className="absolute inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center px-8">
      <div className="absolute top-0 left-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl" />
      <div className="relative z-10 max-w-2xl w-full text-center">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black">S</div>
          <span className="font-black text-2xl text-white">ScholarStack</span>
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Welcome! Who are you?</h2>
        <p className="text-gray-400 mb-8">Select your role to get a personalized experience</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            { role:"student" as Role, icon:"🎓", label:"Student", desc:"Access premium notes, watch learning reels, use AI study tools & crack any exam", color:"from-violet-500 to-indigo-600", border:"border-violet-500/40", features:["Buy & download notes","Watch video reels","AI-powered study plan","Exam progress tracker"] },
            { role:"scholar" as Role, icon:"✍️", label:"Scholar / Expert", desc:"Upload & sell notes, videos & bundles. Earn money from 12L+ students", color:"from-cyan-500 to-blue-600", border:"border-cyan-500/40", features:["Upload PDFs & videos","Set your own prices","Earn from every sale","Creator analytics"] },
          ].map(c => (
            <button key={c.label} onClick={() => onRole(c.role)}
              className={`group relative overflow-hidden rounded-3xl border-2 p-7 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border-white/10 hover:${c.border} bg-white/3 hover:bg-white/5`}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-3xl mb-4 shadow-xl`}>{c.icon}</div>
              <div className="font-black text-xl text-white mb-2">{c.label}</div>
              <div className="text-sm text-gray-400 mb-4 leading-relaxed">{c.desc}</div>
              <ul className="space-y-1.5">
                {c.features.map(f => <li key={f} className="text-xs text-gray-300 flex items-center gap-2"><span className="text-violet-400">✓</span>{f}</li>)}
              </ul>
              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-gray-400 group-hover:text-white transition-all group-hover:gap-3">
                Continue <span>→</span>
              </div>
            </button>
          ))}
        </div>
        <button onClick={() => onRole("admin")} className="text-xs text-gray-500 hover:text-gray-300 transition underline">Admin access →</button>
      </div>
    </div>
  );
}

// ─── Auth Screen ─────────────────────────────────────────────────────────────
function Auth({ role, onBack, onSuccess }: { role: Role; onBack: () => void; onSuccess: () => void }) {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [tab, setTab] = useState<"email"|"phone"|"google">("email");
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); const [otp, setOtp] = useState(""); const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false); const [showPw, setShowPw] = useState(false); const [expertise, setExpertise] = useState("");
  const isScholar = role === "scholar"; const isAdmin = role === "admin";
  const accent = isAdmin ? "from-red-500 to-orange-600" : isScholar ? "from-cyan-500 to-blue-600" : "from-violet-500 to-indigo-600";
  const accentText = isAdmin ? "text-red-400" : isScholar ? "text-cyan-400" : "text-violet-400";
  const icon = isAdmin ? "🛡️" : isScholar ? "✍️" : "🎓";
  const roleLabel = isAdmin ? "Admin" : isScholar ? "Scholar" : "Student";

  const submit = () => { setLoading(true); setTimeout(() => { setLoading(false); onSuccess(); }, 1000); };

  return (
    <div className="absolute inset-0 flex bg-[#0a0a0f]">
      {/* Left panel */}
      <div className="w-5/12 hidden md:flex flex-col items-center justify-center px-10 relative overflow-hidden border-r border-white/5">
        <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-8`} />
        <div className="relative z-10 text-center max-w-xs">
          <button onClick={onBack} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition mb-8">← Back to role select</button>
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center text-3xl mx-auto mb-5 shadow-2xl`}>{icon}</div>
          <h3 className="text-2xl font-black text-white mb-3">{roleLabel} Account</h3>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            {isAdmin ? "Platform administration — manage users, content, payments & analytics." :
             isScholar ? "Share your knowledge, earn from every sale. Join 8,400+ earning scholars." :
             "Access 2.8L+ notes, video reels & AI tools. Crack your dream exam."}
          </p>
          {!isAdmin && (
            <div className="space-y-2.5">
              {(isScholar ? ["💰 Avg ₹22K/month earnings","🎓 8,400+ verified scholars","📤 Upload PDFs, videos & bundles","📊 Real-time creator analytics"] :
                            ["🎓 12L+ students learning daily","📚 2.8L+ notes & PDFs","🤖 AI-powered study assistant","🔥 Daily streak & progress tracking"]).map(f => (
                <div key={f} className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-left">
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 overflow-y-auto">
        <div className="w-full max-w-sm">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5`}>
            <span>{icon}</span><span className={`text-xs font-semibold ${accentText}`}>{roleLabel}</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-1">{mode === "login" ? "Welcome back!" : `Join as ${roleLabel}`}</h2>
          <p className="text-sm text-gray-400 mb-6">{mode === "login" ? "Sign in to your account" : "Create your free account"}</p>

          {/* Tabs */}
          {!isAdmin && (
            <div className="flex gap-1 mb-5 bg-white/5 rounded-xl p-1 border border-white/10">
              {(["email","phone","google"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${tab === t ? `bg-gradient-to-r ${accent} text-white` : "text-gray-400 hover:text-white"}`}>
                  {t === "google" ? "🇬 Google" : t === "phone" ? "📱 OTP" : "✉️ Email"}
                </button>
              ))}
            </div>
          )}

          {tab === "google" && !isAdmin && (
            <div className="space-y-4">
              <button onClick={submit} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition text-white font-semibold text-sm">
                🇬 Continue with Google
              </button>
              <p className={`text-xs text-center ${accentText}`}>✓ No password needed · Instant setup</p>
            </div>
          )}

          {tab === "phone" && !isAdmin && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-2">Mobile Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 text-sm text-gray-300 shrink-0 py-3">🇮🇳 +91</div>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit number"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition" />
                </div>
              </div>
              {!otpSent ? (
                <button onClick={() => setOtpSent(true)} className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition`}>Send OTP</button>
              ) : (
                <>
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-2">Enter OTP</label>
                    <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="• • • • • •" maxLength={6}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl text-white tracking-[0.5em] placeholder-gray-600 outline-none focus:border-violet-500 transition" />
                    <p className="text-xs text-gray-500 text-center mt-1.5">OTP sent to +91 {phone} · <button className={`${accentText}`}>Resend</button></p>
                  </div>
                  <button onClick={submit} className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition`}>
                    {loading ? "Verifying…" : "Verify & Continue"}
                  </button>
                </>
              )}
            </div>
          )}

          {(tab === "email" || isAdmin) && (
            <div className="space-y-4">
              {mode === "signup" && !isAdmin && (
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-2">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition" />
                </div>
              )}
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-2">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-gray-400 font-semibold">Password</label>
                  {mode === "login" && <button className={`text-xs ${accentText}`}>Forgot password?</button>}
                </div>
                <div className="relative">
                  <input value={pw} onChange={e => setPw(e.target.value)} placeholder={mode === "signup" ? "Min 8 characters" : "Your password"}
                    type={showPw ? "text" : "password"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition" />
                  <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs">{showPw ? "🙈" : "👁"}</button>
                </div>
              </div>
              {mode === "signup" && isScholar && (
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-2">Expertise Area</label>
                  <select value={expertise} onChange={e => setExpertise(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-cyan-500 transition cursor-pointer">
                    <option value="" className="bg-gray-900">Select your expertise</option>
                    {["UPSC Civil Services","NEET Medical","JEE Engineering","CAT/MBA","SSC Exams","GATE","Banking","Other"].map(o => <option key={o} value={o} className="bg-gray-900">{o}</option>)}
                  </select>
                </div>
              )}
              {mode === "signup" && !isAdmin && (
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="mt-0.5" /><span className="text-xs text-gray-400">I agree to the <span className={`${accentText}`}>Terms & Privacy Policy</span></span>
                </label>
              )}
              <button onClick={submit} disabled={loading}
                className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition shadow-lg ${loading ? "opacity-70" : "hover:scale-[1.01]"}`}>
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating…</span> :
                  mode === "login" ? "Sign In →" : `Create ${roleLabel} Account →`}
              </button>
              {!isAdmin && (
                <>
                  <div className="flex items-center gap-3"><div className="flex-1 h-px bg-white/10" /><span className="text-xs text-gray-500">or</span><div className="flex-1 h-px bg-white/10" /></div>
                  <button onClick={() => setTab("google")} className="w-full py-3 rounded-2xl border border-white/10 text-sm text-gray-300 hover:bg-white/5 transition flex items-center justify-center gap-2">🇬 Continue with Google</button>
                </>
              )}
            </div>
          )}

          {!isAdmin && (
            <p className="mt-5 text-center text-sm text-gray-400">
              {mode === "login" ? "No account? " : "Have an account? "}
              <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className={`${accentText} font-semibold hover:underline`}>
                {mode === "login" ? "Sign up free" : "Sign in"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Student App ──────────────────────────────────────────────────────────────
const studentNav = [
  { icon:"🏠", label:"Home", screen:"s-home" as Screen },
  { icon:"📚", label:"Browse Notes", screen:"s-notes" as Screen },
  { icon:"🎬", label:"Reels", screen:"s-reels" as Screen },
  { icon:"📂", label:"My Library", screen:"s-library" as Screen },
  { icon:"🤖", label:"AI Tutor", screen:"s-ai" as Screen },
  { icon:"🛒", label:"Orders", screen:"s-orders" as Screen },
  { icon:"👤", label:"Profile", screen:"s-profile" as Screen },
];

function StudentApp({ initialScreen, navigate }: { initialScreen: Screen; navigate: (s: Screen, extra?: any) => void }) {
  const [active, setActive] = useState(initialScreen);
  const [selectedNote, setSelectedNote] = useState(notes[0]);
  const [search, setSearch] = useState(""); const [activeExam, setActiveExam] = useState("All");
  const [purchased, setPurchased] = useState<Set<number>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [likedReels, setLikedReels] = useState<Set<number>>(new Set());

  const go = (s: Screen, extra?: any) => {
    if (extra?.note) setSelectedNote(extra.note);
    setActive(s);
  };

  const filteredNotes = notes.filter(n =>
    (activeExam === "All" || n.exam === activeExam) &&
    (search === "" || n.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/10 flex flex-col py-5 px-3 bg-[#0d0d14] shrink-0">
        <div className="flex items-center gap-2 px-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-black text-xs">S</div>
          <span className="font-black text-lg">ScholarStack</span>
        </div>
        <div className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl bg-white/5 border border-white/8 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center font-black text-xs shrink-0">AS</div>
          <div className="min-w-0">
            <div className="font-semibold text-xs truncate">Arjun Singh</div>
            <div className="text-[10px] text-gray-400">UPSC Aspirant · Pro</div>
          </div>
          <div className="ml-auto">
            <div className="text-[10px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded font-bold">PRO</div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5">
          {studentNav.map(n => (
            <button key={n.label} onClick={() => go(n.screen)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${active === n.screen ? "bg-gradient-to-r from-violet-600/25 to-indigo-600/15 text-white border border-violet-500/25" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div className="mt-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-1"><span className="text-xl">🔥</span><span className="font-black text-xl text-white">14</span></div>
          <div className="text-[10px] text-gray-400">Day streak! Keep going!</div>
          <div className="mt-2 flex gap-1">{[...Array(7)].map((_,i) => <div key={i} className={`flex-1 h-1 rounded-full ${i<5?"bg-orange-400":"bg-white/10"}`}/>)}</div>
        </div>
        <button onClick={() => navigate("role")} className="mt-3 text-[10px] text-gray-500 hover:text-gray-300 transition text-center">← Switch Role</button>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {/* HOME */}
        {active === "s-home" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div><h1 className="text-xl font-black">Good morning, Arjun! 👋</h1><p className="text-gray-400 text-xs mt-0.5">3 upcoming exams · 14-day streak 🔥</p></div>
              <div className="flex gap-2">
                <div className="relative"><button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-base hover:bg-white/10 transition">🔔</button><span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] flex items-center justify-center font-bold">5</span></div>
                <button onClick={() => go("s-notes")} className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-semibold hover:opacity-90 transition">Browse Notes</button>
              </div>
            </div>
            {/* Exam countdown */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[{name:"UPSC Prelims",date:"June 1",days:7,c:"from-orange-500 to-red-500"},{name:"NEET UG",date:"May 30",days:5,c:"from-green-500 to-emerald-500"},{name:"SSC CGL",date:"June 14",days:20,c:"from-blue-500 to-indigo-500"}].map(e => (
                <div key={e.name} className="relative bg-[#13131a] border border-white/10 rounded-2xl p-4 overflow-hidden cursor-pointer hover:border-white/20 transition">
                  <div className={`absolute inset-0 bg-gradient-to-br ${e.c} opacity-8`}/>
                  <div className="relative"><div className={`text-[10px] font-bold bg-gradient-to-r ${e.c} bg-clip-text text-transparent mb-1`}>UPCOMING</div><div className="font-bold text-sm leading-tight">{e.name}</div><div className="text-[10px] text-gray-400 mt-1">{e.date}</div><div className={`mt-2 text-xs font-black bg-gradient-to-r ${e.c} bg-clip-text text-transparent`}>⏰ {e.days} days left</div></div>
                </div>
              ))}
            </div>
            {/* Continue learning */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3"><h2 className="font-bold text-sm">📖 Continue Learning</h2><button onClick={() => go("s-library")} className="text-violet-400 text-xs">View all →</button></div>
              <div className="grid grid-cols-3 gap-3">
                {[{t:"UPSC Polity Notes",s:"Dr. Rajiv",p:68,c:"from-violet-500 to-indigo-500",pages:"220/324"},{t:"NEET Biology",s:"Priya Sharma",p:42,c:"from-pink-500 to-rose-500",pages:"88/210"},{t:"JEE Math Tricks",s:"Karan Mehta",p:91,c:"from-blue-500 to-cyan-500",pages:"180/198"}].map(c => (
                  <div key={c.t} onClick={() => go("s-note-detail", { note: notes[0] })} className="bg-[#13131a] border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-violet-500/30 transition group">
                    <div className={`h-1 rounded-full bg-gradient-to-r ${c.c} mb-3`} style={{width:`${c.p}%`}}/>
                    <div className="text-[10px] text-gray-500 mb-1">{c.pages} pages</div>
                    <div className="font-semibold text-xs leading-tight mb-1">{c.t}</div>
                    <div className="text-[10px] text-gray-400 mb-3">{c.s}</div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black bg-gradient-to-r ${c.c} bg-clip-text text-transparent`}>{c.p}%</span>
                      <button className={`text-[10px] px-2.5 py-1 rounded-lg bg-gradient-to-r ${c.c} text-white font-semibold group-hover:scale-105 transition`}>Continue →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Recommended */}
            <div>
              <div className="flex items-center justify-between mb-3"><h2 className="font-bold text-sm">✨ Recommended for You</h2><button onClick={() => go("s-notes")} className="text-violet-400 text-xs">Browse all →</button></div>
              <div className="grid grid-cols-4 gap-3">
                {notes.slice(0,4).map(n => (
                  <div key={n.id} onClick={() => go("s-note-detail", { note:n })} className="bg-[#13131a] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-violet-500/30 transition group">
                    <div className={`h-20 ${n.color} opacity-30 flex items-center justify-center relative`}><div className={`absolute inset-0 ${n.color} opacity-50`}/><span className="relative text-3xl">📄</span></div>
                    <div className="p-3">
                      <div className="font-semibold text-xs leading-tight mb-1 line-clamp-2">{n.title}</div>
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
          </div>
        )}

        {/* NOTES BROWSER */}
        {active === "s-notes" && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => go("s-home")} className="text-gray-400 hover:text-white transition text-xs">← Home</button>
              <h1 className="font-black text-xl flex-1">Browse Notes</h1>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-64">
                <span className="text-gray-400">🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes..." className="flex-1 bg-transparent outline-none text-xs placeholder-gray-500" />
              </div>
            </div>
            {/* Exam filter */}
            <div className="flex gap-2 flex-wrap mb-5">
              {["All",...examTags].map(e => (
                <button key={e} onClick={() => setActiveExam(e)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${activeExam === e ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent" : "border-white/10 text-gray-400 hover:border-violet-500/40"}`}>{e}</button>
              ))}
            </div>
            {/* Filters row */}
            <div className="flex gap-2 mb-5">
              {["All Levels","Free","Bestseller","Top Rated","Recent"].map(f => (
                <button key={f} className="px-3 py-1.5 rounded-lg text-xs text-gray-400 border border-white/10 hover:border-white/20 hover:text-white transition">{f}</button>
              ))}
            </div>
            {/* Notes grid */}
            <div className="grid grid-cols-3 gap-4">
              {filteredNotes.map(n => (
                <div key={n.id} onClick={() => go("s-note-detail", { note:n })} className="bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-violet-500/30 transition hover:scale-[1.01] group">
                  <div className={`h-28 ${n.color} opacity-20 flex items-center justify-center relative`}>
                    <div className={`absolute inset-0 ${n.color} opacity-60`}/>
                    <span className="relative text-4xl">📄</span>
                    <div className="absolute top-2 left-2 text-[10px] font-bold bg-white/20 text-white px-2 py-1 rounded-full">{n.tag}</div>
                    <div className="absolute top-2 right-2 text-[10px] font-bold bg-black/30 text-white px-2 py-1 rounded-full">{n.exam}</div>
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-sm leading-tight mb-1">{n.title}</div>
                    <div className="text-xs text-gray-400 mb-2">{n.scholar}</div>
                    <div className="flex items-center gap-1 text-xs text-yellow-400 mb-3">⭐ {n.rating} <span className="text-gray-500">({(n.reviews/1000).toFixed(1)}K)</span></div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><span className="font-black text-sm text-violet-400">{n.price}</span>{n.original && <span className="text-xs text-gray-500 line-through">{n.original}</span>}</div>
                      <button className={`text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold opacity-0 group-hover:opacity-100 transition`}>View →</button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredNotes.length === 0 && <div className="col-span-3 text-center py-16 text-gray-400"><div className="text-5xl mb-3">📭</div><div className="font-semibold">No notes found</div><div className="text-sm mt-1">Try a different exam or search term</div></div>}
            </div>
          </div>
        )}

        {/* NOTE DETAIL */}
        {active === "s-note-detail" && (
          <div className="p-6 max-w-4xl">
            <button onClick={() => go("s-notes")} className="text-gray-400 hover:text-white transition text-xs mb-4 flex items-center gap-1">← Browse Notes</button>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-5">
                <div>
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 font-semibold">{selectedNote.exam}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-400 font-semibold">{selectedNote.tag}</span>
                  </div>
                  <h1 className="text-2xl font-black mb-2">{selectedNote.title}</h1>
                  <p className="text-gray-400 text-sm">Comprehensive {selectedNote.pages}-page notes. Includes PYQs, mind maps & quick revision sheets.</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span>⭐ {selectedNote.rating} ({selectedNote.reviews.toLocaleString()} reviews)</span>
                    <span>📄 {selectedNote.pages} pages</span>
                    <span>🌐 Hindi + English</span>
                  </div>
                </div>
                {/* Scholar */}
                <div className="flex items-center gap-4 bg-white/3 border border-white/10 rounded-2xl p-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-black text-sm shrink-0">RM</div>
                  <div className="flex-1"><div className="font-bold text-sm">{selectedNote.scholar}</div><div className="text-xs text-gray-400">IAS Officer · UPSC AIR 7 · JNU Graduate</div><div className="flex gap-3 mt-1 text-xs text-gray-400"><span>👥 62K</span><span>⭐ 4.9</span><span>📚 28 notes</span></div></div>
                  <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-semibold">+ Follow</button>
                </div>
                {/* What you get */}
                <div className="bg-white/3 border border-white/10 rounded-2xl p-5">
                  <div className="font-bold text-sm mb-3">📚 What's Included</div>
                  <div className="grid grid-cols-2 gap-2">
                    {["Complete {selectedNote.pages}-page PDF","Mind maps & diagrams","PYQs 2011-2024","Shortcut tricks","Formula sheets","Revision checklist"].map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-gray-300"><span className="text-violet-400">✓</span>{f}</div>
                    ))}
                  </div>
                </div>
                {/* Reviews */}
                <div>
                  <div className="font-bold text-sm mb-3">⭐ Student Reviews</div>
                  <div className="space-y-3">
                    {[{n:"Priya M.",r:5,t:"Best structured notes for UPSC! Cleared my prelims with these.",time:"2 days ago"},{n:"Rahul K.",r:5,t:"Mind maps are gold. The PYQ section is incredibly detailed.",time:"1 week ago"}].map(r => (
                      <div key={r.n} className="bg-white/3 border border-white/10 rounded-xl p-4">
                        <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center font-bold text-xs shrink-0">{r.n[0]}</div><div><div className="flex items-center gap-2 mb-1"><span className="font-semibold text-xs">{r.n}</span><span className="text-yellow-400 text-xs">{"★".repeat(r.r)}</span><span className="text-[10px] text-gray-500 ml-auto">{r.time}</span></div><p className="text-xs text-gray-300">{r.t}</p></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Purchase card */}
              <div className="col-span-1">
                <div className="sticky top-6 bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-5 text-center">
                    <div className="text-4xl mb-2">📚</div>
                    <div className="font-black text-2xl">{selectedNote.price}</div>
                    {selectedNote.original && <div className="text-sm text-white/60 line-through">{selectedNote.original}</div>}
                    {selectedNote.original && <div className="mt-1.5 text-xs bg-white/20 text-white px-3 py-1 rounded-full inline-block font-semibold">🔥 63% OFF</div>}
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="space-y-1.5 text-xs text-gray-300">
                      {["✓ Lifetime PDF access","✓ Printable download","✓ Free updates","✓ 7-day refund policy"].map(f => <div key={f}>{f}</div>)}
                    </div>
                    {purchased.has(selectedNote.id) ? (
                      <><div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 text-center"><div className="text-xl mb-1">🎉</div><div className="font-bold text-green-400 text-xs">Purchased!</div></div>
                      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-xs hover:opacity-90 transition">📥 Download PDF</button></>
                    ) : (
                      <><button onClick={() => { const ns = new Set(purchased); ns.add(selectedNote.id); setPurchased(ns); }}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-sm hover:opacity-90 transition hover:scale-[1.01]">
                        {selectedNote.price === "Free" ? "Access Free →" : `Buy Now — ${selectedNote.price}`}
                      </button>
                      <button onClick={() => { const ns = new Set(bookmarked); ns.has(selectedNote.id) ? ns.delete(selectedNote.id) : ns.add(selectedNote.id); setBookmarked(ns); }}
                        className={`w-full py-2.5 rounded-xl border text-xs font-semibold transition ${bookmarked.has(selectedNote.id) ? "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
                        {bookmarked.has(selectedNote.id) ? "🔖 Bookmarked" : "Add to Wishlist"}
                      </button></>
                    )}
                    <div className="border-t border-white/10 pt-3">
                      <div className="text-[10px] text-gray-500 mb-2 font-semibold">ACCEPTED PAYMENTS</div>
                      <div className="flex flex-wrap gap-1.5">{["💳 Razorpay","📱 UPI","🏦 NetBanking"].map(p => <span key={p} className="text-[10px] px-2 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/10">{p}</span>)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REELS */}
        {active === "s-reels" && (
          <div className="flex h-full">
            <div className="flex-1 relative bg-black overflow-hidden">
              {reels.map((r, i) => i === 0 && (
                <div key={r.id} className="absolute inset-0">
                  <div className={`absolute inset-0 bg-gradient-to-br ${r.bg.replace("from-","from-").replace("to-","to-")}/30`}/>
                  {r.premium && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20"><div className="text-5xl mb-3">🔒</div><div className="font-black text-lg mb-2">Premium Content</div><button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-sm">Unlock — ₹199/month</button></div>}
                  <div className="absolute inset-0 flex items-center justify-center"><div className="text-8xl opacity-10">🎬</div></div>
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                    <span className="text-xs bg-black/40 backdrop-blur px-3 py-1.5 rounded-full font-semibold border border-white/10">{r.exam}</span>
                    <button onClick={() => go("s-home")} className="text-xs bg-black/40 backdrop-blur px-3 py-1.5 rounded-full font-semibold border border-white/10">← Back</button>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-5 z-10">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2"><div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${r.bg} flex items-center justify-center font-black text-xs`}>{r.avatar}</div><div><div className="font-bold text-sm">{r.scholar}</div><div className="text-xs text-gray-300">{r.exam} Expert</div></div><button className="ml-auto text-xs border border-violet-400 text-violet-400 px-3 py-1.5 rounded-lg hover:bg-violet-400/10 transition">+ Follow</button></div>
                        <div className="font-bold text-sm mb-1">{r.title}</div>
                        <div className="flex gap-4 text-xs text-gray-300 mt-3">
                          {[["❤️",r.likes],["💬",r.comments],["🔖",r.saves],["📤","Share"]].map(([ic,v]) => (
                            <button key={String(ic)} onClick={() => { if(ic==="❤️"){ const ns=new Set(likedReels); ns.has(r.id)?ns.delete(r.id):ns.add(r.id); setLikedReels(ns); }}} className="flex flex-col items-center gap-1 hover:text-white transition">
                              <span className="text-xl">{ic==="❤️" && likedReels.has(r.id) ? "❤️" : ic}</span><span>{v}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Nav dots */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
                    {reels.map((_, j) => <div key={j} className={`rounded-full transition-all ${j===0?"w-2 h-8 bg-white":"w-2 h-2 bg-white/30"}`}/>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIBRARY */}
        {active === "s-library" && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5"><button onClick={() => go("s-home")} className="text-gray-400 hover:text-white text-xs">← Home</button><h1 className="font-black text-xl">My Library</h1></div>
            {purchased.size === 0 ? (
              <div className="text-center py-20"><div className="text-6xl mb-4">📚</div><div className="font-bold text-lg mb-2">Your library is empty</div><div className="text-gray-400 text-sm mb-6">Purchase notes to access them forever</div><button onClick={() => go("s-notes")} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-bold hover:opacity-90 transition">Browse Notes →</button></div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {notes.filter(n => purchased.has(n.id)).map(n => (
                  <div key={n.id} className="bg-[#13131a] border border-green-500/20 rounded-2xl overflow-hidden cursor-pointer hover:border-green-500/40 transition" onClick={() => go("s-note-detail", {note:n})}>
                    <div className={`h-24 ${n.color} opacity-30 flex items-center justify-center relative`}><div className={`absolute inset-0 ${n.color} opacity-50`}/><span className="relative text-3xl">📄</span></div>
                    <div className="p-4"><div className="font-semibold text-xs mb-1">{n.title}</div><div className="text-[10px] text-gray-400 mb-3">{n.scholar}</div><button className="w-full py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-xs font-bold text-white">📥 Download PDF</button></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI TUTOR */}
        {active === "s-ai" && (
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-5"><button onClick={() => go("s-home")} className="text-gray-400 hover:text-white text-xs">← Home</button><h1 className="font-black text-xl">🤖 AI Study Tutor</h1></div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[{icon:"📝",label:"AI Quiz Generator",desc:"Generate practice MCQs from any topic"},{icon:"✂️",label:"Note Summarizer",desc:"Get quick summaries of long notes"},{icon:"📅",label:"Revision Planner",desc:"AI-powered smart study schedule"}].map(f => (
                <div key={f.label} className="bg-[#13131a] border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-violet-500/30 transition text-center"><div className="text-3xl mb-3">{f.icon}</div><div className="font-bold text-sm mb-1">{f.label}</div><div className="text-xs text-gray-400">{f.desc}</div></div>
              ))}
            </div>
            <div className="flex-1 bg-[#13131a] border border-white/10 rounded-2xl p-5 flex flex-col">
              <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
                {[{role:"ai",msg:"Hi Arjun! I'm your AI Study Tutor powered by ScholarStack. Ask me anything about UPSC, NEET, JEE or any other exam topic. I can explain concepts, create quizzes, summarize notes, and plan your revision schedule! 🤖📚"},{role:"user",msg:"Explain the Preamble of India in simple points"},{role:"ai",msg:"Great question! Here's the Preamble simplified:\n\n📜 The Preamble declares India to be:\n• Sovereign — Independent nation, not under any foreign power\n• Socialist — Mixed economy; reducing inequality\n• Secular — No state religion; all religions treated equally\n• Democratic — Government by elected representatives\n• Republic — Elected Head of State (President)\n\nKey Goals: Justice, Liberty, Equality, Fraternity\n\nAdded by 42nd Amendment (1976): 'Socialist' and 'Secular' were added. The Preamble is NOT enforceable in court but reflects the Constitution's spirit. 💡"}].map((m,i) => (
                  <div key={i} className={`flex gap-3 ${m.role==="user"?"flex-row-reverse":""}`}>
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-sm ${m.role==="ai"?"bg-gradient-to-br from-violet-500 to-indigo-600":"bg-gradient-to-br from-orange-400 to-red-500"}`}>{m.role==="ai"?"🤖":"AS"}</div>
                    <div className={`max-w-xs rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${m.role==="ai"?"bg-white/5 border border-white/10 text-gray-200":"bg-gradient-to-br from-violet-600 to-indigo-600 text-white"}`}>{m.msg}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2"><input placeholder="Ask anything about your exams…" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-violet-500 transition"/><button className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-semibold hover:opacity-90 transition">Ask →</button></div>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {active === "s-orders" && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5"><button onClick={() => go("s-home")} className="text-gray-400 hover:text-white text-xs">← Home</button><h1 className="font-black text-xl">📦 My Orders</h1></div>
            {purchased.size === 0 ? (
              <div className="text-center py-20"><div className="text-6xl mb-4">🛒</div><div className="font-bold text-lg mb-2">No orders yet</div><div className="text-gray-400 text-sm mb-6">Your purchase history will appear here</div><button onClick={() => go("s-notes")} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-bold">Browse Notes</button></div>
            ) : (
              <div className="space-y-3">
                {notes.filter(n => purchased.has(n.id)).map(n => (
                  <div key={n.id} className="bg-[#13131a] border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${n.color} opacity-60 flex items-center justify-center text-xl shrink-0`}>📄</div>
                    <div className="flex-1"><div className="font-semibold text-sm">{n.title}</div><div className="text-xs text-gray-400">{n.scholar}</div></div>
                    <div className="text-right"><div className="font-black text-sm text-green-400">{n.price}</div><div className="text-[10px] text-gray-400">Purchased</div></div>
                    <button className="px-3 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-xs font-bold text-white">📥 Download</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {active === "s-profile" && (
          <div className="p-6 max-w-xl">
            <div className="flex items-center gap-3 mb-5"><button onClick={() => go("s-home")} className="text-gray-400 hover:text-white text-xs">← Home</button><h1 className="font-black text-xl">👤 My Profile</h1></div>
            <div className="bg-[#13131a] border border-white/10 rounded-2xl p-6 mb-5 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center font-black text-2xl mx-auto mb-4">AS</div>
              <div className="font-black text-xl mb-1">Arjun Singh</div>
              <div className="text-gray-400 text-sm mb-4">UPSC Aspirant · Pro Member</div>
              <div className="flex justify-center gap-6 text-sm"><div className="text-center"><div className="font-black text-xl text-violet-400">{purchased.size}</div><div className="text-gray-400 text-xs">Purchased</div></div><div className="text-center"><div className="font-black text-xl text-orange-400">14</div><div className="text-gray-400 text-xs">Day Streak</div></div><div className="text-center"><div className="font-black text-xl text-green-400">{bookmarked.size}</div><div className="text-gray-400 text-xs">Bookmarks</div></div></div>
            </div>
            <div className="bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden">
              {[["📧","Email","arjun.singh@email.com"],["📱","Phone","+91 98765 43210"],["🎯","Exam Goal","UPSC CSE 2025"],["📅","Joined","January 2025"]].map(([ic,l,v]) => (
                <div key={String(l)} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0"><span className="text-xl">{ic}</span><div className="flex-1"><div className="text-xs text-gray-400">{l}</div><div className="text-sm font-medium">{v}</div></div><button className="text-xs text-violet-400 hover:underline">Edit</button></div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Scholar App ──────────────────────────────────────────────────────────────
const scholarNav = [
  { icon:"📊", label:"Overview", screen:"sc-home" as Screen },
  { icon:"📤", label:"Upload Content", screen:"sc-upload" as Screen },
  { icon:"📦", label:"My Content", screen:"sc-content" as Screen },
  { icon:"💰", label:"Earnings", screen:"sc-earnings" as Screen },
  { icon:"📈", label:"Analytics", screen:"sc-analytics" as Screen },
];

function ScholarApp({ navigate }: { navigate: (s: Screen) => void }) {
  const [active, setActive] = useState<Screen>("sc-home");
  const [uploadForm, setUploadForm] = useState({ title:"", exam:"", price:"", type:"pdf" });
  const [uploads, setUploads] = useState([
    { id:1, title:"UPSC Polity Complete Notes 2025", type:"PDF", price:"₹299", sales:1240, earnings:"₹37,076", rating:4.9, status:"active" },
    { id:2, title:"Modern History Short Notes", type:"PDF", price:"₹149", sales:890, earnings:"₹13,261", rating:4.8, status:"active" },
    { id:3, title:"Polity Shorts Series", type:"Video", price:"Free", sales:14200, earnings:"₹0", rating:4.7, status:"active" },
  ]);

  const handleUpload = () => {
    if (!uploadForm.title) return;
    setUploads(prev => [...prev, { id: Date.now(), title: uploadForm.title, type: uploadForm.type.toUpperCase(), price: uploadForm.price || "Free", sales: 0, earnings: "₹0", rating: 0, status: "pending" }]);
    setUploadForm({ title:"", exam:"", price:"", type:"pdf" });
    setActive("sc-content");
  };

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white font-sans overflow-hidden">
      <aside className="w-56 border-r border-white/10 flex flex-col py-5 px-3 bg-[#0d0d14] shrink-0">
        <div className="flex items-center gap-2 px-2 mb-5"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-xs">S</div><span className="font-black text-lg">Scholar Hub</span></div>
        <div className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/10 border border-cyan-500/20 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-black text-xs shrink-0">RM</div>
          <div className="min-w-0"><div className="font-semibold text-xs truncate">Dr. Rajiv Menon</div><div className="text-[10px] text-cyan-400">✅ Verified Scholar</div></div>
        </div>
        <nav className="flex-1 space-y-0.5">
          {scholarNav.map(n => (
            <button key={n.label} onClick={() => setActive(n.screen)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${active === n.screen ? "bg-gradient-to-r from-cyan-600/25 to-blue-600/15 text-white border border-cyan-500/25" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <button onClick={() => navigate("role")} className="mt-3 text-[10px] text-gray-500 hover:text-gray-300 transition text-center">← Switch Role</button>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">
        {/* OVERVIEW */}
        {active === "sc-home" && (
          <div>
            <div className="flex items-center justify-between mb-6"><div><h1 className="text-xl font-black">Creator Dashboard 📊</h1><p className="text-gray-400 text-xs mt-0.5">Welcome back, Dr. Rajiv 👋</p></div>
              <div className="flex gap-2">
                <button onClick={() => setActive("sc-upload")} className="px-4 py-2 rounded-xl border border-white/10 text-xs font-medium hover:bg-white/5 transition flex items-center gap-1.5">📤 Upload</button>
                <button onClick={() => setActive("sc-earnings")} className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-xs font-semibold hover:opacity-90 transition">Withdraw ₹83,037</button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[{l:"Total Earnings",v:"₹83,037",sub:"↑ +₹12,400",c:"from-green-500 to-emerald-600",ic:"💰"},{l:"Total Students",v:"48,240",sub:"↑ +1,200",c:"from-blue-500 to-indigo-600",ic:"🎓"},{l:"Followers",v:"62,400",sub:"↑ +3,800",c:"from-cyan-500 to-blue-500",ic:"👥"},{l:"Avg Rating",v:"4.9 ⭐",sub:"12,400 reviews",c:"from-yellow-500 to-orange-500",ic:"⭐"}].map(s => (
                <div key={s.l} className="bg-[#13131a] border border-white/10 rounded-2xl p-4"><div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.c} flex items-center justify-center text-base mb-3`}>{s.ic}</div><div className="text-xl font-black">{s.v}</div><div className="text-[10px] text-gray-400 mt-0.5">{s.l}</div><div className="text-[10px] text-green-400 mt-1">{s.sub} this month</div></div>
              ))}
            </div>
            {/* Mini chart */}
            <div className="bg-[#13131a] border border-white/10 rounded-2xl p-5 mb-5">
              <div className="flex items-center justify-between mb-4"><div><div className="font-bold text-sm">Revenue (May 2025)</div><div className="text-xs text-gray-400">₹12,400 earned this month</div></div></div>
              <div className="flex items-end gap-1.5 h-20">
                {[40,65,50,88,70,92,80,68,85,78,95,82,74,97,88,76,84,90,65,79,93,71,86,98,75,83,91,67,80,88].map((h,i) => (
                  <div key={i} className="flex-1 rounded-t-sm" style={{height:`${h}%`,background:"linear-gradient(to top,#06b6d4,#3b82f6)",opacity:0.6+(h/100)*0.4}}/>
                ))}
              </div>
            </div>
            {/* Recent sales */}
            <div className="bg-[#13131a] border border-white/10 rounded-2xl p-5">
              <div className="font-bold text-sm mb-4">Recent Activity</div>
              <div className="space-y-3">
                {[{a:"💸 New purchase",u:"Priya M.",v:"₹299",t:"2m ago"},{a:"⭐ New review",u:"Rahul K.",v:"★ 5.0",t:"15m ago"},{a:"👤 New follower",u:"Ananya S.",v:"",t:"1h ago"},{a:"💸 New purchase",u:"Vivek R.",v:"₹599",t:"2h ago"}].map((a,i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"><div className="text-base w-7">{a.a.split(" ")[0]}</div><div className="flex-1"><div className="text-xs font-semibold">{a.u}</div><div className="text-[10px] text-gray-400">{a.a.slice(2)}</div></div><div className="text-right"><div className="text-xs font-bold text-green-400">{a.v}</div><div className="text-[10px] text-gray-500">{a.t}</div></div></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD */}
        {active === "sc-upload" && (
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-6"><button onClick={() => setActive("sc-home")} className="text-gray-400 hover:text-white text-xs">← Dashboard</button><h1 className="font-black text-xl">📤 Upload Content</h1></div>
            <div className="bg-[#13131a] border border-white/10 rounded-2xl p-6 space-y-5">
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-2">Content Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{v:"pdf",l:"📄 PDF Notes"},{v:"video",l:"🎬 Video"},{v:"bundle",l:"📦 Bundle"}].map(t => (
                    <button key={t.v} onClick={() => setUploadForm(p => ({...p,type:t.v}))}
                      className={`py-2.5 rounded-xl border text-xs font-semibold transition ${uploadForm.type===t.v?"bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-transparent":"border-white/10 text-gray-300 hover:border-cyan-500/40"}`}>{t.l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-2">Title *</label>
                <input value={uploadForm.title} onChange={e => setUploadForm(p => ({...p,title:e.target.value}))} placeholder="e.g. UPSC Polity Complete Notes 2025"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 transition"/>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-2">Exam Category</label>
                <select value={uploadForm.exam} onChange={e => setUploadForm(p => ({...p,exam:e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-cyan-500 transition cursor-pointer">
                  <option value="" className="bg-gray-900">Select exam</option>
                  {examTags.map(e => <option key={e} value={e} className="bg-gray-900">{e}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-2">Price</label>
                <div className="flex gap-2">
                  <button onClick={() => setUploadForm(p => ({...p,price:"0"}))} className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition ${uploadForm.price==="0"?"bg-green-500/20 border-green-500/40 text-green-400":"border-white/10 text-gray-400 hover:border-white/20"}`}>Free</button>
                  <div className="flex-1 relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span><input value={uploadForm.price} onChange={e => setUploadForm(p => ({...p,price:e.target.value}))} placeholder="Enter price" type="number" min="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 transition"/></div>
                </div>
              </div>
              {/* Upload area */}
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-2">{uploadForm.type === "video" ? "Video File" : "PDF File"}</label>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-cyan-500/40 transition cursor-pointer">
                  <div className="text-4xl mb-2">{uploadForm.type==="video"?"🎬":"📄"}</div>
                  <div className="text-sm font-semibold text-white mb-1">Drag & drop your file here</div>
                  <div className="text-xs text-gray-400 mb-4">{uploadForm.type==="video"?"MP4, MOV up to 2GB":"PDF up to 500MB"}</div>
                  <button className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold hover:bg-white/20 transition">Choose File</button>
                </div>
              </div>
              <button onClick={handleUpload} disabled={!uploadForm.title}
                className={`w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-sm hover:opacity-90 transition ${!uploadForm.title?"opacity-40 cursor-not-allowed":"hover:scale-[1.01]"}`}>
                📤 Publish Content
              </button>
            </div>
          </div>
        )}

        {/* MY CONTENT */}
        {active === "sc-content" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3"><button onClick={() => setActive("sc-home")} className="text-gray-400 hover:text-white text-xs">← Dashboard</button><h1 className="font-black text-xl">📦 My Content</h1></div>
              <button onClick={() => setActive("sc-upload")} className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-xs font-semibold hover:opacity-90 transition">+ Upload New</button>
            </div>
            <div className="bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-[10px] text-gray-500 border-b border-white/5 bg-white/2"><th className="px-5 py-3 font-semibold">Content</th><th className="py-3 font-semibold">Type</th><th className="py-3 font-semibold">Price</th><th className="py-3 font-semibold">Sales</th><th className="py-3 font-semibold">Earnings</th><th className="py-3 font-semibold">Rating</th><th className="py-3 font-semibold">Status</th></tr></thead>
                <tbody className="divide-y divide-white/5">
                  {uploads.map(c => (
                    <tr key={c.id} className="hover:bg-white/2 transition">
                      <td className="px-5 py-3.5 font-medium text-xs">{c.title}</td>
                      <td className="py-3.5 pr-4"><span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${c.type==="PDF"?"bg-blue-500/20 text-blue-400":c.type==="Video"?"bg-red-500/20 text-red-400":"bg-purple-500/20 text-purple-400"}`}>{c.type}</span></td>
                      <td className="py-3.5 pr-4 font-semibold text-xs">{c.price}</td>
                      <td className="py-3.5 pr-4 text-gray-300 text-xs">{c.sales.toLocaleString()}</td>
                      <td className="py-3.5 pr-4 text-green-400 font-semibold text-xs">{c.earnings}</td>
                      <td className="py-3.5 pr-4 text-yellow-400 text-xs">{c.rating > 0 ? `⭐ ${c.rating}` : "—"}</td>
                      <td className="py-3.5 pr-4"><span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${c.status==="active"?"bg-green-500/20 text-green-400":"bg-yellow-500/20 text-yellow-400"}`}>● {c.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EARNINGS */}
        {active === "sc-earnings" && (
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5"><button onClick={() => setActive("sc-home")} className="text-gray-400 hover:text-white text-xs">← Dashboard</button><h1 className="font-black text-xl">💰 Earnings & Payouts</h1></div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[{l:"Total Earned",v:"₹83,037",c:"text-green-400"},{l:"Available",v:"₹61,240",c:"text-cyan-400"},{l:"Paid Out",v:"₹21,797",c:"text-gray-300"}].map(s => (
                <div key={s.l} className="bg-[#13131a] border border-white/10 rounded-2xl p-4 text-center"><div className={`text-2xl font-black ${s.c}`}>{s.v}</div><div className="text-xs text-gray-400 mt-1">{s.l}</div></div>
              ))}
            </div>
            <div className="bg-[#13131a] border border-white/10 rounded-2xl p-5 mb-4">
              <div className="font-bold text-sm mb-4">Withdraw Funds</div>
              <div className="space-y-3">
                <div><label className="text-xs text-gray-400 mb-2 block">Amount</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span><input placeholder="Enter amount" className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 transition"/></div></div>
                <div><label className="text-xs text-gray-400 mb-2 block">Bank Account</label><div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3"><span className="text-xl">🏦</span><div className="text-xs"><div className="font-semibold">HDFC Bank ••••4521</div><div className="text-gray-400">Savings Account</div></div><span className="ml-auto text-xs text-green-400 font-semibold">Default</span></div></div>
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-sm hover:opacity-90 transition">Withdraw Funds</button>
              </div>
            </div>
            <div className="bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 font-bold text-sm">Transaction History</div>
              <div className="divide-y divide-white/5">
                {[{d:"May 24",desc:"Polity Notes sale","v":"+₹239","t":"Sale"},{d:"May 23",desc:"History Notes sale","v":"+₹119","t":"Sale"},{d:"May 20",desc:"Payout to bank","v":"-₹10,000","t":"Payout"},{d:"May 19",desc:"Geography Bundle","v":"+₹479","t":"Sale"}].map((t,i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3"><div className="text-xs text-gray-500 w-12 shrink-0">{t.d}</div><div className="flex-1 text-xs">{t.desc}</div><span className={`text-xs font-bold px-2 py-1 rounded-lg ${t.t==="Sale"?"bg-green-500/20 text-green-400":"bg-red-500/20 text-red-400"}`}>{t.t}</span><div className={`text-xs font-bold w-16 text-right ${t.v.startsWith("+")?"text-green-400":"text-red-400"}`}>{t.v}</div></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {active === "sc-analytics" && (
          <div>
            <div className="flex items-center gap-3 mb-6"><button onClick={() => setActive("sc-home")} className="text-gray-400 hover:text-white text-xs">← Dashboard</button><h1 className="font-black text-xl">📈 Analytics</h1></div>
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div className="bg-[#13131a] border border-white/10 rounded-2xl p-5">
                <div className="font-bold text-sm mb-4">Revenue (30 days)</div>
                <div className="flex items-end gap-1.5 h-28">
                  {[40,65,50,88,70,92,80,68,85,78,95,82,74,97,88,76,84,90,65,79,93,71,86,98,75,83,91,67,80,88].map((h,i) => <div key={i} className="flex-1 rounded-t-sm" style={{height:`${h}%`,background:"linear-gradient(to top,#06b6d4,#3b82f6)",opacity:0.7}}/>)}
                </div>
              </div>
              <div className="bg-[#13131a] border border-white/10 rounded-2xl p-5">
                <div className="font-bold text-sm mb-4">Sales by Content</div>
                <div className="space-y-3">
                  {uploads.slice(0,3).map(u => (
                    <div key={u.id}><div className="flex justify-between text-xs mb-1"><span className="text-gray-300 truncate max-w-[160px]">{u.title}</span><span className="text-cyan-400 font-bold">{u.sales.toLocaleString()}</span></div><div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{width:`${Math.min(u.sales/150,100)}%`}}/></div></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[{l:"Total Views",v:"2.8M",sub:"↑ +340K this month",ic:"👁"},{l:"Click Rate",v:"18.4%",sub:"↑ +2.1%",ic:"🖱"},{l:"Conversion",v:"3.2%",sub:"Industry avg 1.8%",ic:"💰"}].map(s => (
                <div key={s.l} className="bg-[#13131a] border border-white/10 rounded-2xl p-5"><div className="text-2xl mb-2">{s.ic}</div><div className="text-2xl font-black mb-0.5">{s.v}</div><div className="text-xs text-gray-400">{s.l}</div><div className="text-xs text-green-400 mt-1">{s.sub}</div></div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Admin App ────────────────────────────────────────────────────────────────
function AdminApp({ navigate }: { navigate: (s: Screen) => void }) {
  const [active, setActive] = useState("overview");
  const [users, setUsers] = useState([
    { id:1, name:"Priya Sharma", email:"priya@email.com", role:"Student", plan:"Pro", status:"active" },
    { id:2, name:"Dr. Rajiv M.", email:"rajiv@email.com", role:"Scholar", plan:"Verified", status:"active" },
    { id:3, name:"Rahul Verma", email:"rahul@email.com", role:"Student", plan:"Free", status:"active" },
    { id:4, name:"Spam User", email:"spam@test.com", role:"Student", plan:"Free", status:"flagged" },
  ]);
  const [pendingScholars, setPendingScholars] = useState([
    { id:1, name:"Neha Gupta", tag:"NEET Expert", avatar:"NG", bg:"from-pink-400 to-rose-400" },
    { id:2, name:"Vikram Rao", tag:"UPSC Notes", avatar:"VR", bg:"from-orange-400 to-red-400" },
    { id:3, name:"Sonia K.", tag:"CAT Mentor", avatar:"SK", bg:"from-blue-400 to-indigo-400" },
  ]);

  const approveScholar = (id: number) => setPendingScholars(prev => prev.filter(s => s.id !== id));
  const banUser = (id: number) => setUsers(prev => prev.map(u => u.id === id ? {...u, status:"banned"} : u));

  const adminNav = [
    {ic:"📊",l:"Overview"},{ic:"👤",l:"Users"},{ic:"🎓",l:"Scholars"},{ic:"📄",l:"Content"},{ic:"💳",l:"Payments"},{ic:"🚩",l:"Reports"},{ic:"📢",l:"Banners"},{ic:"🏷️",l:"Categories"},
  ];

  return (
    <div className="flex h-screen bg-[#060608] text-white font-sans overflow-hidden">
      <aside className="w-52 border-r border-white/10 flex flex-col py-5 px-3 bg-[#0a0a10] shrink-0">
        <div className="flex items-center gap-2 px-2 mb-4"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center font-black text-xs">A</div><div><div className="font-black text-base">Admin Panel</div><div className="text-[10px] text-gray-500">ScholarStack</div></div></div>
        <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center font-black text-xs shrink-0">SA</div>
          <div><div className="font-semibold text-xs">Super Admin</div><div className="text-[10px] text-red-400">Full Access</div></div>
        </div>
        <nav className="flex-1 space-y-0.5">
          {adminNav.map(n => (
            <button key={n.l} onClick={() => setActive(n.l.toLowerCase())}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition ${active===n.l.toLowerCase()?"bg-gradient-to-r from-red-600/20 to-orange-600/15 text-white border border-red-500/20":"text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <span>{n.ic}</span>{n.l}
            </button>
          ))}
        </nav>
        <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="text-[10px] text-red-400 font-semibold mb-2">⚠️ Pending</div>
          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between text-gray-300"><span>Scholar approvals</span><span className="text-orange-400 font-bold">{pendingScholars.length}</span></div>
            <div className="flex justify-between text-gray-300"><span>Content reviews</span><span className="text-orange-400 font-bold">38</span></div>
            <div className="flex justify-between text-gray-300"><span>Reports</span><span className="text-red-400 font-bold">3</span></div>
          </div>
        </div>
        <button onClick={() => navigate("role")} className="mt-3 text-[10px] text-gray-500 hover:text-gray-300 transition text-center">← Exit Admin</button>
      </aside>

      <main className="flex-1 overflow-y-auto p-5">
        {active === "overview" && (
          <div>
            <div className="flex items-center justify-between mb-5"><h1 className="text-lg font-black">Platform Overview</h1><span className="text-xs text-gray-400">May 25, 2025</span></div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[{l:"Total Revenue",v:"₹2.4Cr",ic:"💰",c:"from-green-500 to-emerald-600"},{l:"Active Users",v:"1.2L",ic:"👥",c:"from-blue-500 to-indigo-600"},{l:"Scholars",v:"8,420",ic:"🎓",c:"from-violet-500 to-purple-600"},{l:"Content Items",v:"2.8L",ic:"📄",c:"from-orange-500 to-red-500"},{l:"Transactions",v:"48,200",ic:"💳",c:"from-cyan-500 to-blue-500"},{l:"Avg Rating",v:"4.8 ⭐",ic:"⭐",c:"from-yellow-500 to-orange-500"}].map(s => (
                <div key={s.l} className="bg-[#0d0d14] border border-white/10 rounded-xl p-4"><div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.c} flex items-center justify-center text-sm mb-2`}>{s.ic}</div><div className="text-xl font-black">{s.v}</div><div className="text-[10px] text-gray-400">{s.l}</div></div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3"><div className="font-bold text-sm">⚠️ Scholar Approvals</div><span className="w-5 h-5 rounded-full bg-orange-500 text-[9px] flex items-center justify-center font-black">{pendingScholars.length}</span></div>
                <div className="space-y-2">
                  {pendingScholars.map(s => (
                    <div key={s.id} className="flex items-center gap-2.5 bg-white/3 rounded-xl p-2.5">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.bg} flex items-center justify-center font-black text-xs shrink-0`}>{s.avatar}</div>
                      <div className="flex-1 min-w-0"><div className="text-xs font-semibold">{s.name}</div><div className="text-[10px] text-gray-400">{s.tag}</div></div>
                      <div className="flex gap-1"><button onClick={() => approveScholar(s.id)} className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-[10px] font-semibold hover:bg-green-500/30 transition">✓ Approve</button><button onClick={() => approveScholar(s.id)} className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-[10px] font-semibold hover:bg-red-500/30 transition">✕</button></div>
                    </div>
                  ))}
                  {pendingScholars.length === 0 && <div className="text-center py-4 text-xs text-gray-400">✅ All approvals cleared!</div>}
                </div>
              </div>
              <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-4">
                <div className="font-bold text-sm mb-3">👤 User Management</div>
                <div className="space-y-2">
                  {users.map(u => (
                    <div key={u.id} className="flex items-center gap-2.5 py-2 border-b border-white/5 last:border-0">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center font-bold text-[10px] shrink-0">{u.name[0]}</div>
                      <div className="flex-1 min-w-0"><div className="text-xs font-semibold truncate">{u.name}</div><div className="text-[10px] text-gray-400">{u.role} · {u.plan}</div></div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${u.status==="active"?"bg-green-500/20 text-green-400":u.status==="banned"?"bg-red-500/20 text-red-400":"bg-yellow-500/20 text-yellow-400"}`}>● {u.status}</span>
                      {u.status !== "banned" && <button onClick={() => banUser(u.id)} className="text-[10px] text-red-400 hover:text-red-300 transition">Ban</button>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {active === "users" && (
          <div>
            <div className="flex items-center justify-between mb-5"><h1 className="text-lg font-black">👤 User Management</h1><button className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-xs font-semibold">Export CSV</button></div>
            <div className="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-xs">
                <thead><tr className="text-left text-[10px] text-gray-500 border-b border-white/5 bg-white/2"><th className="px-5 py-3 font-semibold">User</th><th className="py-3 font-semibold">Role</th><th className="py-3 font-semibold">Plan</th><th className="py-3 font-semibold">Status</th><th className="py-3 font-semibold">Actions</th></tr></thead>
                <tbody className="divide-y divide-white/5">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-white/2">
                      <td className="px-5 py-3.5"><div className="font-semibold">{u.name}</div><div className="text-[10px] text-gray-500">{u.email}</div></td>
                      <td className="py-3.5 pr-4"><span className={`px-2 py-1 rounded-full font-semibold ${u.role==="Scholar"?"bg-violet-500/20 text-violet-400":"bg-blue-500/20 text-blue-400"}`}>{u.role}</span></td>
                      <td className="py-3.5 pr-4 text-gray-300">{u.plan}</td>
                      <td className="py-3.5 pr-4"><span className={`px-2 py-1 rounded-full font-semibold ${u.status==="active"?"bg-green-500/20 text-green-400":u.status==="banned"?"bg-red-500/20 text-red-400":"bg-yellow-500/20 text-yellow-400"}`}>● {u.status}</span></td>
                      <td className="py-3.5 pr-4 flex gap-2">{u.status!=="banned" && <button onClick={() => banUser(u.id)} className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition">Ban</button>}<button className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 font-semibold hover:bg-white/10 transition">View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {(active === "scholars" || active === "content" || active === "payments" || active === "reports" || active === "banners" || active === "categories") && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-5xl mb-4">{adminNav.find(n => n.l.toLowerCase() === active)?.ic || "📊"}</div>
            <div className="font-bold text-lg mb-2">{adminNav.find(n => n.l.toLowerCase() === active)?.l}</div>
            <div className="text-gray-400 text-sm">Full management interface for this section</div>
            <button onClick={() => setActive("overview")} className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-xs font-semibold">← Back to Overview</button>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────
export function ScholarStackApp() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [role, setRole] = useState<Role>(null);

  const navigate = (s: Screen, extra?: any) => setScreen(s);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0f] font-sans select-none">
      {screen === "splash" && <Splash onNext={() => setScreen("role")} />}
      {screen === "role" && <RoleSelect onRole={r => { setRole(r); setScreen("auth"); }} />}
      {screen === "auth" && <Auth role={role} onBack={() => setScreen("role")} onSuccess={() => setScreen(role === "scholar" ? "sc-home" : role === "admin" ? "admin" : "s-home")} />}

      {/* Student screens */}
      {(screen.startsWith("s-") && !screen.startsWith("sc-")) && <StudentApp initialScreen={screen} navigate={(s) => { if(s==="role") setScreen("role"); else setScreen(s); }} />}

      {/* Scholar screens */}
      {screen.startsWith("sc-") && <ScholarApp navigate={(s) => { if(s==="role") setScreen("role"); else setScreen(s); }} />}

      {/* Admin */}
      {screen === "admin" && <AdminApp navigate={(s) => { if(s==="role") setScreen("role"); else setScreen(s); }} />}

      {/* Progress dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-50 pointer-events-none">
        {(["splash","role","auth","s-home","sc-home","admin"] as Screen[]).map(s => (
          <div key={s} className={`rounded-full transition-all ${screen===s||( s==="s-home"&&screen.startsWith("s-")&&!screen.startsWith("sc-"))||(s==="sc-home"&&screen.startsWith("sc-"))?"w-5 h-1.5 bg-white":"w-1.5 h-1.5 bg-white/20"}`}/>
        ))}
      </div>
    </div>
  );
}
