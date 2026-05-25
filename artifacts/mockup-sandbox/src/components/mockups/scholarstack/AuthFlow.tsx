
import { useState, useEffect } from "react";

type Screen = "splash" | "role" | "login" | "signup" | "student-home" | "scholar-home";

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => { setFade(true); setTimeout(onDone, 500); }, 300);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0f] transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"}`}>
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-600/25 to-indigo-600/25 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-2xl" />
      </div>

      {/* Logo animation */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-violet-500/40">
            <span className="text-white font-black text-4xl">S</span>
          </div>
          {/* Orbiting dot */}
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50" />
          <div className="absolute -bottom-2 -left-2 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-violet-400 to-pink-500 shadow-lg shadow-violet-500/50" />
        </div>

        <h1 className="text-5xl font-black text-white tracking-tight mb-2">ScholarStack</h1>
        <p className="text-gray-400 text-base font-medium">India's Scholar Economy Platform</p>

        {/* Tagline chips */}
        <div className="flex items-center gap-3 mt-6">
          {["📚 Notes","🎬 Reels","🤖 AI Tutor"].map(t => (
            <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 font-medium">{t}</span>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-14 w-48">
          <div className="h-0.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-75" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-center text-xs text-gray-500 mt-2">Loading your experience…</div>
        </div>
      </div>

      {/* Bottom badge */}
      <div className="absolute bottom-8 text-xs text-gray-600 font-medium">Trusted by 12L+ students across India</div>
    </div>
  );
}

function RoleScreen({ onSelect }: { onSelect: (role: "student" | "scholar") => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0f] px-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Logo small */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg">S</div>
          <span className="font-black text-2xl text-white">ScholarStack</span>
        </div>

        <h2 className="text-3xl font-black text-white mb-3">Welcome! Who are you?</h2>
        <p className="text-gray-400 text-base mb-10">Choose your role to get a personalized experience</p>

        <div className="grid grid-cols-2 gap-5">
          {/* Student card */}
          <button
            onClick={() => onSelect("student")}
            onMouseEnter={() => setHovered("student")}
            onMouseLeave={() => setHovered(null)}
            className={`group relative overflow-hidden rounded-3xl border-2 p-8 text-left transition-all duration-300 ${hovered === "student" ? "border-violet-500 bg-violet-500/10 scale-[1.03] shadow-2xl shadow-violet-500/20" : "border-white/10 bg-white/3"}`}>
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-violet-500/20 to-indigo-500/10 rounded-full translate-x-10 -translate-y-10 blur-2xl" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-3xl mb-5 shadow-xl shadow-violet-500/30">🎓</div>
              <div className="font-black text-2xl text-white mb-2">Student</div>
              <div className="text-sm text-gray-400 leading-relaxed mb-5">Access premium notes, watch reels, track your progress & crack any exam</div>
              <ul className="space-y-2 text-xs text-gray-300">
                {["Buy & access notes","Watch video reels","AI-powered study plan","Track exam progress"].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="text-violet-400">✓</span>{f}</li>
                ))}
              </ul>
              <div className={`mt-6 flex items-center gap-2 text-sm font-bold transition-all ${hovered === "student" ? "text-violet-400 gap-3" : "text-gray-400"}`}>
                Continue as Student <span>→</span>
              </div>
            </div>
          </button>

          {/* Scholar card */}
          <button
            onClick={() => onSelect("scholar")}
            onMouseEnter={() => setHovered("scholar")}
            onMouseLeave={() => setHovered(null)}
            className={`group relative overflow-hidden rounded-3xl border-2 p-8 text-left transition-all duration-300 ${hovered === "scholar" ? "border-cyan-500 bg-cyan-500/10 scale-[1.03] shadow-2xl shadow-cyan-500/20" : "border-white/10 bg-white/3"}`}>
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 rounded-full translate-x-10 -translate-y-10 blur-2xl" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl mb-5 shadow-xl shadow-cyan-500/30">✍️</div>
              <div className="font-black text-2xl text-white mb-2">Scholar</div>
              <div className="text-sm text-gray-400 leading-relaxed mb-5">Upload & sell notes, videos & bundles. Earn money by sharing your knowledge</div>
              <ul className="space-y-2 text-xs text-gray-300">
                {["Upload PDFs & videos","Set your own prices","Earn from 12L+ students","Creator analytics dashboard"].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="text-cyan-400">✓</span>{f}</li>
                ))}
              </ul>
              <div className={`mt-6 flex items-center gap-2 text-sm font-bold transition-all ${hovered === "scholar" ? "text-cyan-400 gap-3" : "text-gray-400"}`}>
                Continue as Scholar <span>→</span>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">You can switch roles anytime from your profile settings</div>
      </div>
    </div>
  );
}

function AuthScreen({
  role, mode, onModeChange, onSuccess
}: {
  role: "student" | "scholar";
  mode: "login" | "signup";
  onModeChange: (m: "login" | "signup") => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authTab, setAuthTab] = useState<"email" | "phone" | "google">("email");
  const [showPass, setShowPass] = useState(false);
  const [expertise, setExpertise] = useState("");

  const isScholar = role === "scholar";
  const accent = isScholar ? "from-cyan-500 to-blue-600" : "from-violet-500 to-indigo-600";
  const accentText = isScholar ? "text-cyan-400" : "text-violet-400";
  const accentBorder = isScholar ? "border-cyan-500" : "border-violet-500";
  const accentBg = isScholar ? "bg-cyan-500/10" : "bg-violet-500/10";

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(); }, 1200);
  };

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  return (
    <div className="absolute inset-0 flex bg-[#0a0a0f]">
      {/* Left decorative panel */}
      <div className={`hidden md:flex w-2/5 relative overflow-hidden flex-col items-center justify-center p-10`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-10`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.15),transparent)]" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black">S</div>
            <span className="font-black text-2xl text-white">ScholarStack</span>
          </div>

          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${accent} flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl`}>
            {isScholar ? "✍️" : "🎓"}
          </div>

          <h3 className="text-3xl font-black text-white mb-4 leading-tight">
            {isScholar ? "Start Earning\nfrom Your\nKnowledge" : "Learn from\nIndia's Best\nScholars"}
          </h3>
          <p className={`text-sm ${isScholar ? "text-cyan-300/70" : "text-violet-300/70"} leading-relaxed max-w-xs mx-auto`}>
            {isScholar
              ? "Join 8,400+ verified scholars earning from their expertise. Upload once, earn forever."
              : "Access 2.8L+ notes, videos and AI study tools. Crack UPSC, NEET, JEE & 50+ exams."}
          </p>

          {/* Social proof */}
          <div className="mt-10 space-y-3 max-w-xs mx-auto">
            {(isScholar ? [
              { emoji:"💰", text:"Avg scholar earns ₹22,000/month" },
              { emoji:"🎓", text:"8,400+ verified scholars" },
              { emoji:"⭐", text:"4.9 avg platform rating" },
            ] : [
              { emoji:"🎓", text:"12L+ students learning daily" },
              { emoji:"📚", text:"2.8L+ notes & PDFs available" },
              { emoji:"🤖", text:"AI-powered personalized feed" },
            ]).map(s => (
              <div key={s.text} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left">
                <span className="text-xl">{s.emoji}</span>
                <span className="text-sm text-gray-300">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Role badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${accentBorder} ${accentBg} mb-6`}>
            <span className="text-base">{isScholar ? "✍️" : "🎓"}</span>
            <span className={`text-xs font-semibold ${accentText}`}>{isScholar ? "Scholar Account" : "Student Account"}</span>
          </div>

          <h2 className="text-2xl font-black text-white mb-1">
            {mode === "login" ? "Welcome back!" : isScholar ? "Join as Scholar" : "Start Learning"}
          </h2>
          <p className="text-sm text-gray-400 mb-7">
            {mode === "login" ? "Sign in to access your account" : "Create your free account today"}
          </p>

          {/* Auth method tabs */}
          <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 border border-white/10">
            {(["email","phone","google"] as const).map(t => (
              <button key={t} onClick={() => setAuthTab(t)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${authTab === t ? `bg-gradient-to-r ${accent} text-white shadow-lg` : "text-gray-400 hover:text-white"}`}>
                {t === "google" ? "🇬 Google" : t === "phone" ? "📱 OTP" : "✉️ Email"}
              </button>
            ))}
          </div>

          {/* Google */}
          {authTab === "google" && (
            <div className="space-y-4">
              <button onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition text-white font-semibold text-sm hover:border-white/30">
                <span className="text-xl">🇬</span> Continue with Google
              </button>
              <div className={`text-xs text-center ${accentText}`}>✓ Instant setup — no password needed</div>
            </div>
          )}

          {/* Phone OTP */}
          {authTab === "phone" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-2">Mobile Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 text-sm text-gray-300 shrink-0">🇮🇳 +91</div>
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="Enter 10-digit number"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition" />
                </div>
              </div>
              {!otpSent ? (
                <button onClick={handleSendOtp}
                  className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition shadow-lg`}>
                  Send OTP
                </button>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 block mb-2">Enter OTP</label>
                    <input value={otp} onChange={e => setOtp(e.target.value)}
                      placeholder="6-digit OTP"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition tracking-widest text-center text-lg" />
                    <div className="text-xs text-gray-500 mt-1.5 text-center">OTP sent to +91 {phone} · <button className={`${accentText} font-medium`}>Resend</button></div>
                  </div>
                  <button onClick={handleSubmit}
                    className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition shadow-lg`}>
                    {loading ? "Verifying…" : "Verify & Continue"}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Email */}
          {authTab === "email" && (
            <div className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-2">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition" />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-2">Email Address</label>
                <input value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com" type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-400">Password</label>
                  {mode === "login" && <button className={`text-xs ${accentText} font-medium`}>Forgot password?</button>}
                </div>
                <div className="relative">
                  <input value={password} onChange={e => setPassword(e.target.value)}
                    placeholder={mode === "signup" ? "Min 8 characters" : "Your password"}
                    type={showPass ? "text" : "password"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition" />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition text-xs">
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {mode === "signup" && isScholar && (
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-2">Area of Expertise</label>
                  <select value={expertise} onChange={e => setExpertise(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-cyan-500 transition cursor-pointer">
                    <option value="" className="bg-gray-900">Select your expertise</option>
                    {["UPSC Civil Services","NEET Medical","JEE Engineering","CAT / MBA","SSC Exams","Banking & Finance","GATE","Other"].map(o => (
                      <option key={o} value={o} className="bg-gray-900">{o}</option>
                    ))}
                  </select>
                </div>
              )}

              {mode === "signup" && (
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 accent-violet-500" />
                  <span className="text-xs text-gray-400">I agree to ScholarStack's <span className={`${accentText} font-medium`}>Terms of Service</span> and <span className={`${accentText} font-medium`}>Privacy Policy</span></span>
                </label>
              )}

              <button onClick={handleSubmit} disabled={loading}
                className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition shadow-lg ${loading ? "opacity-70" : "hover:scale-[1.01]"}`}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> {mode === "login" ? "Signing in…" : "Creating account…"}</span>
                ) : (
                  mode === "login" ? "Sign In" : isScholar ? "Create Scholar Account" : "Create Student Account"
                )}
              </button>
            </div>
          )}

          {/* Divider */}
          {authTab === "email" && (
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          )}

          {authTab === "email" && (
            <button onClick={() => { setAuthTab("google"); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/10 text-sm font-medium text-gray-300 hover:bg-white/5 transition">
              <span>🇬</span> Continue with Google
            </button>
          )}

          {/* Switch mode */}
          <div className="mt-6 text-center text-sm text-gray-400">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => onModeChange(mode === "login" ? "signup" : "login")}
              className={`${accentText} font-semibold hover:underline`}>
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentHome({ onBack }: { onBack: () => void }) {
  return (
    <div className="absolute inset-0 bg-[#0a0a0f] text-white flex flex-col overflow-hidden">
      {/* Topbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0d14]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-black text-sm">S</div>
          <span className="font-black text-lg">ScholarStack</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full font-semibold border border-green-500/20">✓ Student Account Active</span>
          <button onClick={onBack} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white transition">← Back to auth</button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-10">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-5xl mx-auto mb-6 shadow-2xl shadow-violet-500/30">🎓</div>
          <h2 className="text-4xl font-black mb-3">Welcome, Student!</h2>
          <p className="text-gray-400 text-lg mb-8">Your personalized learning dashboard is ready.</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon:"📚", label:"Browse Notes", desc:"2.8L+ PDFs" },
              { icon:"🎬", label:"Watch Reels", desc:"Learn on the go" },
              { icon:"🤖", label:"AI Tutor", desc:"Personalized help" },
            ].map(c => (
              <div key={c.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-violet-500/40 transition cursor-pointer">
                <div className="text-3xl mb-3">{c.icon}</div>
                <div className="font-bold text-sm mb-1">{c.label}</div>
                <div className="text-xs text-gray-400">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScholarHome({ onBack }: { onBack: () => void }) {
  return (
    <div className="absolute inset-0 bg-[#0a0a0f] text-white flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0d14]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-sm">S</div>
          <span className="font-black text-lg">ScholarStack</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-full font-semibold border border-cyan-500/20">✍️ Scholar Account Active</span>
          <button onClick={onBack} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white transition">← Back to auth</button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-10">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-5xl mx-auto mb-6 shadow-2xl shadow-cyan-500/30">✍️</div>
          <h2 className="text-4xl font-black mb-3">Welcome, Scholar!</h2>
          <p className="text-gray-400 text-lg mb-8">Your creator dashboard is ready. Start earning today.</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon:"📤", label:"Upload Content", desc:"PDFs, videos, notes" },
              { icon:"📊", label:"View Analytics", desc:"Sales & engagement" },
              { icon:"💰", label:"Manage Earnings", desc:"Withdraw anytime" },
            ].map(c => (
              <div key={c.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-cyan-500/40 transition cursor-pointer">
                <div className="text-3xl mb-3">{c.icon}</div>
                <div className="font-bold text-sm mb-1">{c.label}</div>
                <div className="text-xs text-gray-400">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthFlow() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [role, setRole] = useState<"student" | "scholar">("student");
  const [mode, setMode] = useState<"login" | "signup">("signup");

  const handleRoleSelect = (r: "student" | "scholar") => {
    setRole(r);
    setScreen("login");
    setMode("signup");
  };

  const handleAuthSuccess = () => {
    setScreen(role === "scholar" ? "scholar-home" : "student-home");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0f] font-sans">
      {/* Screen transitions */}
      {screen === "splash" && (
        <SplashScreen onDone={() => setScreen("role")} />
      )}

      {screen === "role" && (
        <RoleScreen onSelect={handleRoleSelect} />
      )}

      {(screen === "login" || screen === "signup") && (
        <AuthScreen
          role={role}
          mode={mode}
          onModeChange={m => { setMode(m); }}
          onSuccess={handleAuthSuccess}
        />
      )}

      {screen === "student-home" && (
        <StudentHome onBack={() => setScreen("role")} />
      )}

      {screen === "scholar-home" && (
        <ScholarHome onBack={() => setScreen("role")} />
      )}

      {/* Screen indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-50">
        {(["splash","role","login","student-home","scholar-home"] as Screen[]).map((s, i) => (
          <div key={s} className={`rounded-full transition-all ${screen === s ? "w-6 h-1.5 bg-violet-400" : "w-1.5 h-1.5 bg-white/20"}`} />
        ))}
      </div>
    </div>
  );
}
