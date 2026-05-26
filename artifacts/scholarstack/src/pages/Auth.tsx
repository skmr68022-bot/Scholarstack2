
import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useApp } from "../context/AppContext";

type AuthMode = "login" | "signup";
type Tab = "email" | "phone";

export default function Auth() {
  const { role } = useParams<{ role: string }>();
  const [, setLocation] = useLocation();
  const { login, signup } = useApp();

  const [mode, setMode] = useState<AuthMode>("signup");
  const [tab, setTab] = useState<Tab>("email");

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [expertise, setExpertise] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isScholar = role === "scholar";
  const isAdmin = role === "admin";

  const accent = isAdmin
    ? "from-red-500 to-orange-600"
    : isScholar
    ? "from-cyan-500 to-blue-600"
    : "from-violet-500 to-indigo-600";
  const accentText = isAdmin ? "text-red-400" : isScholar ? "text-cyan-400" : "text-violet-400";
  const accentBorder = isAdmin
    ? "focus:border-red-500"
    : isScholar
    ? "focus:border-cyan-500"
    : "focus:border-violet-500";
  const icon = isAdmin ? "🛡️" : isScholar ? "✍️" : "🎓";
  const roleLabel = isAdmin ? "Admin" : isScholar ? "Scholar" : "Student";

  const redirectAfterAuth = () => {
    if (isAdmin) setLocation("/admin");
    else if (isScholar) setLocation("/scholar");
    else setLocation("/student");
  };

  const friendlyError = (msg: string): string => {
    if (msg.includes("Email not confirmed"))
      return "Email confirmation is required. Go to Supabase → Authentication → Providers → Email → disable \"Confirm email\", then try again.";
    if (msg.includes("Invalid login credentials"))
      return "Wrong email or password. Double-check and try again.";
    if (msg.includes("User already registered"))
      return "An account with this email already exists. Switch to Sign In.";
    if (msg.includes("Password should be at least"))
      return "Password must be at least 6 characters.";
    if (msg.includes("Unable to validate email address"))
      return "Please enter a valid email address.";
    if (msg.includes("Email rate limit"))
      return "Too many attempts. Please wait a few minutes and try again.";
    return msg;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    const trimEmail = email.trim().toLowerCase();
    const trimPw = pw.trim();
    const trimName = name.trim();

    if (mode === "login" || isAdmin) {
      if (!trimEmail || !trimPw) { setError("Please fill in all fields."); return; }
      setLoading(true);
      const result = await login(
        trimEmail,
        trimPw,
        (isAdmin ? "admin" : isScholar ? "scholar" : "student") as "student" | "scholar" | "admin",
      );
      setLoading(false);
      if (result.success) {
        redirectAfterAuth();
      } else {
        setError(friendlyError(result.error ?? "Login failed. Check your credentials."));
      }
    } else {
      // Signup
      if (!trimName || !trimEmail || !trimPw) { setError("Please fill in all fields."); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail)) { setError("Please enter a valid email address."); return; }
      if (trimPw.length < 6) { setError("Password must be at least 6 characters."); return; }
      if (!agreed) { setError("Please agree to the Terms & Privacy Policy."); return; }

      setLoading(true);
      const result = await signup({
        name: trimName,
        email: trimEmail,
        password: trimPw,
        role: isScholar ? "scholar" : "student",
        expertise: expertise || undefined,
      });
      setLoading(false);

      if (result.success) {
        redirectAfterAuth();
      } else {
        setError(friendlyError(result.error ?? "Signup failed. Please try again."));
      }
    }
  };

  const switchMode = (m: AuthMode) => {
    setMode(m);
    setError("");
    setSuccess("");
    setName("");
    setEmail("");
    setPw("");
    setExpertise("");
    setAgreed(false);
  };

  return (
    <div className="min-h-screen flex bg-[#070709]">
      {/* Left panel */}
      <div className="w-5/12 hidden md:flex flex-col items-center justify-center px-10 relative overflow-hidden border-r border-white/5">
        <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-5`} />
        <div className="relative z-10 max-w-xs w-full">
          <button
            onClick={() => setLocation("/role")}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition mb-8"
          >
            ← Back to role select
          </button>
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center text-3xl mx-auto mb-5 shadow-2xl`}
          >
            {icon}
          </div>
          <h3 className="text-2xl font-black text-white mb-3 text-center">{roleLabel} Account</h3>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed text-center">
            {isAdmin
              ? "Platform administration — manage users, content & analytics."
              : isScholar
              ? "Share your knowledge, earn from every sale. Join 8,400+ earning scholars."
              : "Access 2.8L+ notes, video reels & AI tools. Crack your dream exam."}
          </p>
          {!isAdmin && (
            <div className="space-y-2.5">
              {(isScholar
                ? ["Avg ₹22K/month earnings", "8,400+ verified scholars", "Upload PDFs, videos & bundles", "Real-time creator analytics"]
                : ["12L+ students learning daily", "2.8L+ notes & PDFs", "AI-powered study assistant", "Daily streak & progress tracking"]
              ).map(f => (
                <div
                  key={f}
                  className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-2.5"
                >
                  <span className="text-green-400 text-xs">✓</span>
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

          <h2 className="text-2xl font-black text-white mb-1">
            {isAdmin ? "Admin Login" : mode === "signup" ? `Join as ${roleLabel}` : "Welcome back!"}
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            {isAdmin
              ? "Enter your admin credentials"
              : mode === "signup"
              ? "Create your free account — takes 10 seconds"
              : "Sign in to continue"}
          </p>

          {/* Tab switcher (email / phone) — not for admin */}
          {!isAdmin && (
            <div className="flex gap-1 mb-5 bg-white/5 rounded-xl p-1 border border-white/10">
              {(["email", "phone"] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                    tab === t ? `bg-gradient-to-r ${accent} text-white` : "text-gray-400 hover:text-white"
                  }`}
                >
                  {t === "phone" ? "Mobile OTP" : "Email"}
                </button>
              ))}
            </div>
          )}

          {/* ── Phone tab — coming soon ── */}
          {tab === "phone" && !isAdmin && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#13131a] border border-white/10 text-center">
                <div className="text-4xl mb-3">📱</div>
                <p className="text-sm font-bold text-white mb-2">Mobile OTP — Coming Soon</p>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Phone login requires an SMS provider (Twilio or MSG91) linked to Supabase.
                  For now, please use Email to sign in.
                </p>
                <button
                  onClick={() => { setTab("email"); setError(""); }}
                  className={`w-full py-3 rounded-xl bg-gradient-to-r ${accent} text-xs font-bold text-white`}
                >
                  Use Email Instead
                </button>
              </div>
            </div>
          )}

          {/* ── Email / Admin form ── */}
          {(tab === "email" || isAdmin) && (
            <div className="space-y-4">
              {/* Signup / Login toggle */}
              {!isAdmin && (
                <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                  {(["signup", "login"] as AuthMode[]).map(m => (
                    <button
                      key={m}
                      onClick={() => switchMode(m)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                        mode === m
                          ? `bg-gradient-to-r ${accent} text-white`
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {m === "signup" ? "New Account" : "Sign In"}
                    </button>
                  ))}
                </div>
              )}

              {/* Full name — signup only */}
              {mode === "signup" && !isAdmin && (
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-2">Full Name</label>
                  <input
                    value={name}
                    onChange={e => { setName(e.target.value); setError(""); }}
                    placeholder="Your full name"
                    className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ${accentBorder} transition`}
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-2">Email</label>
                <input
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@email.com"
                  type="email"
                  className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ${accentBorder} transition`}
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-2">Password</label>
                <div className="relative">
                  <input
                    value={pw}
                    onChange={e => { setPw(e.target.value); setError(""); }}
                    placeholder={mode === "signup" ? "Min 6 characters" : "Your password"}
                    type={showPw ? "text" : "password"}
                    className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-14 text-sm text-white placeholder-gray-500 outline-none ${accentBorder} transition`}
                  />
                  <button
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-semibold"
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Expertise — scholar signup */}
              {mode === "signup" && isScholar && !isAdmin && (
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-2">Expertise Area</label>
                  <select
                    value={expertise}
                    onChange={e => setExpertise(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-cyan-500 transition cursor-pointer"
                  >
                    <option value="" className="bg-gray-900">Select your expertise</option>
                    {["UPSC Civil Services","NEET Medical","JEE Engineering","CAT/MBA","SSC Exams","GATE","Banking","Other"].map(o => (
                      <option key={o} value={o} className="bg-gray-900">{o}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Terms — signup only */}
              {mode === "signup" && !isAdmin && (
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => { setAgreed(e.target.checked); setError(""); }}
                    className="mt-0.5 accent-violet-500"
                  />
                  <span className="text-xs text-gray-400">
                    I agree to the{" "}
                    <span className={accentText}>Terms & Privacy Policy</span>
                  </span>
                </label>
              )}

              {/* Error */}
              {error && (
                <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 leading-relaxed">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="text-xs text-green-300 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">
                  {success}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition shadow-lg disabled:opacity-60`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {mode === "signup" ? "Creating account…" : "Signing in…"}
                  </span>
                ) : mode === "login" || isAdmin ? (
                  "Sign In →"
                ) : (
                  `Create ${roleLabel} Account →`
                )}
              </button>

              {/* Admin hint */}
              {isAdmin && (
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  First sign up via the Student/Scholar flow, then run
                  <br />
                  <code className="text-gray-400 text-[10px]">UPDATE profiles SET role = 'admin' WHERE email = '...';</code>
                  <br />
                  in Supabase SQL Editor to grant admin access.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
