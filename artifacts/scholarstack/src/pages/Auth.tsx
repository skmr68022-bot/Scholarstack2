
import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useApp } from "../context/AppContext";

type AuthMode = "login" | "signup";
type Tab = "email" | "phone" | "google";

export default function Auth() {
  const { role } = useParams<{ role: string }>();
  const [, setLocation] = useLocation();
  const { setRole } = useApp();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [tab, setTab] = useState<Tab>("email");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [expertise, setExpertise] = useState("");

  const isScholar = role === "scholar";
  const isAdmin = role === "admin";
  const accent = isAdmin ? "from-red-500 to-orange-600" : isScholar ? "from-cyan-500 to-blue-600" : "from-violet-500 to-indigo-600";
  const accentText = isAdmin ? "text-red-400" : isScholar ? "text-cyan-400" : "text-violet-400";
  const icon = isAdmin ? "🛡️" : isScholar ? "✍️" : "🎓";
  const roleLabel = isAdmin ? "Admin" : isScholar ? "Scholar" : "Student";

  const submit = () => {
    setLoading(true);
    setRole(role as "student" | "scholar" | "admin");
    setTimeout(() => {
      setLoading(false);
      if (isAdmin) setLocation("/admin");
      else if (isScholar) setLocation("/scholar");
      else setLocation("/student");
    }, 900);
  };

  return (
    <div className="min-h-screen flex bg-[#070709]">
      {/* Left panel */}
      <div className="w-5/12 hidden md:flex flex-col items-center justify-center px-10 relative overflow-hidden border-r border-white/5">
        <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-5`} />
        <div className="relative z-10 max-w-xs w-full">
          <button onClick={() => setLocation("/role")} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition mb-8">
            ← Back to role select
          </button>
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center text-3xl mx-auto mb-5 shadow-2xl`}>{icon}</div>
          <h3 className="text-2xl font-black text-white mb-3 text-center">{roleLabel} Account</h3>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed text-center">
            {isAdmin ? "Platform administration — manage users, content, payments & analytics." :
             isScholar ? "Share your knowledge, earn from every sale. Join 8,400+ earning scholars." :
             "Access 2.8L+ notes, video reels & AI tools. Crack your dream exam."}
          </p>
          {!isAdmin && (
            <div className="space-y-2.5">
              {(isScholar
                ? ["Avg ₹22K/month earnings", "8,400+ verified scholars", "Upload PDFs, videos & bundles", "Real-time creator analytics"]
                : ["12L+ students learning daily", "2.8L+ notes & PDFs", "AI-powered study assistant", "Daily streak & progress tracking"]
              ).map(f => (
                <div key={f} className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-left">
                  <span className="text-xs text-gray-200">{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 overflow-y-auto py-10">
        <div className="w-full max-w-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5">
            <span>{icon}</span>
            <span className={`text-xs font-semibold ${accentText}`}>{roleLabel}</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-1">{mode === "login" ? "Welcome back!" : `Join as ${roleLabel}`}</h2>
          <p className="text-sm text-gray-400 mb-6">{mode === "login" ? "Sign in to your account" : "Create your free account"}</p>

          {/* Tabs */}
          {!isAdmin && (
            <div className="flex gap-1 mb-5 bg-white/5 rounded-xl p-1 border border-white/10">
              {(["email", "phone", "google"] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${tab === t ? `bg-gradient-to-r ${accent} text-white` : "text-gray-400 hover:text-white"}`}
                >
                  {t === "google" ? "Google" : t === "phone" ? "OTP" : "Email"}
                </button>
              ))}
            </div>
          )}

          {/* Google */}
          {tab === "google" && !isAdmin && (
            <div className="space-y-4">
              <button onClick={submit} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition text-white font-semibold text-sm">
                Continue with Google
              </button>
              <p className={`text-xs text-center ${accentText}`}>No password needed · Instant setup</p>
            </div>
          )}

          {/* Phone OTP */}
          {tab === "phone" && !isAdmin && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-2">Mobile Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 text-sm text-gray-300 shrink-0 py-3">+91</div>
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
                    <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="· · · · · ·" maxLength={6}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl text-white tracking-[0.5em] placeholder-gray-600 outline-none focus:border-violet-500 transition" />
                    <p className="text-xs text-gray-500 text-center mt-1.5">
                      OTP sent to +91 {phone} · <button className={accentText} onClick={() => setOtpSent(false)}>Resend</button>
                    </p>
                  </div>
                  <button onClick={submit} className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition`}>
                    {loading ? "Verifying…" : "Verify & Continue"}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Email */}
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
                  <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs">
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {mode === "signup" && isScholar && (
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-2">Expertise Area</label>
                  <select value={expertise} onChange={e => setExpertise(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-cyan-500 transition cursor-pointer">
                    <option value="" className="bg-gray-900">Select your expertise</option>
                    {["UPSC Civil Services","NEET Medical","JEE Engineering","CAT/MBA","SSC Exams","GATE","Banking","Other"].map(o => (
                      <option key={o} value={o} className="bg-gray-900">{o}</option>
                    ))}
                  </select>
                </div>
              )}
              {mode === "signup" && !isAdmin && (
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 accent-violet-500" />
                  <span className="text-xs text-gray-400">I agree to the <span className={accentText}>Terms & Privacy Policy</span></span>
                </label>
              )}
              <button onClick={submit} disabled={loading}
                className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition shadow-lg ${loading ? "opacity-70" : "hover:scale-[1.01]"}`}>
                {loading
                  ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating…</span>
                  : mode === "login" ? "Sign In →" : `Create ${roleLabel} Account →`}
              </button>
              {!isAdmin && (
                <>
                  <div className="flex items-center gap-3"><div className="flex-1 h-px bg-white/10" /><span className="text-xs text-gray-500">or</span><div className="flex-1 h-px bg-white/10" /></div>
                  <button onClick={() => setTab("google")} className="w-full py-3 rounded-2xl border border-white/10 text-sm text-gray-300 hover:bg-white/5 transition">
                    Continue with Google
                  </button>
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
