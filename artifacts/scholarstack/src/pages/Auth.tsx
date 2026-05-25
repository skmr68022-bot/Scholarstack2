
import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useApp } from "../context/AppContext";

type AuthMode = "login" | "signup";
type Tab = "email" | "phone" | "google";
type Step = "form" | "otp";
type OtpPurpose = "email-signup" | "phone-signup" | "phone-login";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function Auth() {
  const { role } = useParams<{ role: string }>();
  const [, setLocation] = useLocation();
  const { login, signup, signupWithPhone, loginWithPhone, completePhoneLogin } = useApp();

  const [mode, setMode] = useState<AuthMode>("signup");
  const [phoneMode, setPhoneMode] = useState<AuthMode>("signup");
  const [tab, setTab] = useState<Tab>("email");
  const [step, setStep] = useState<Step>("form");
  const [otpPurpose, setOtpPurpose] = useState<OtpPurpose>("email-signup");

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneName, setPhoneName] = useState("");
  const [phoneExpertise, setPhoneExpertise] = useState("");
  const [expertise, setExpertise] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [pendingSignupData, setPendingSignupData] = useState<{
    name: string; email: string; password: string; phone?: string;
    role: "student" | "scholar"; expertise?: string;
  } | null>(null);
  const [pendingPhone, setPendingPhone] = useState("");
  const [pendingPhoneSignupData, setPendingPhoneSignupData] = useState<{
    name: string; phone: string; role: "student" | "scholar"; expertise?: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");

  const isScholar = role === "scholar";
  const isAdmin = role === "admin";
  const accent = isAdmin ? "from-red-500 to-orange-600" : isScholar ? "from-cyan-500 to-blue-600" : "from-violet-500 to-indigo-600";
  const accentText = isAdmin ? "text-red-400" : isScholar ? "text-cyan-400" : "text-violet-400";
  const accentBorder = isAdmin ? "focus:border-red-500" : isScholar ? "focus:border-cyan-500" : "focus:border-violet-500";
  const icon = isAdmin ? "🛡️" : isScholar ? "✍️" : "🎓";
  const roleLabel = isAdmin ? "Admin" : isScholar ? "Scholar" : "Student";

  const redirectAfterAuth = () => {
    if (isAdmin) setLocation("/admin");
    else if (isScholar) setLocation("/scholar");
    else setLocation("/student");
  };

  const handleEmailSubmit = () => {
    setError("");
    const trimEmail = email.trim().toLowerCase();
    const trimPw = pw.trim();
    const trimName = name.trim();

    if (mode === "login" || isAdmin) {
      if (!trimEmail || !trimPw) { setError("Please fill in all fields."); return; }
      setLoading(true);
      setTimeout(() => {
        const result = login(trimEmail, trimPw, (isAdmin ? "admin" : isScholar ? "scholar" : "student") as "student" | "scholar" | "admin");
        setLoading(false);
        if (result.success) {
          redirectAfterAuth();
        } else {
          setError(result.error || "Login failed.");
        }
      }, 600);
    } else {
      if (!trimName || !trimEmail || !trimPw) { setError("Please fill in all fields."); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail)) { setError("Please enter a valid email address."); return; }
      if (trimPw.length < 8) { setError("Password must be at least 8 characters."); return; }
      if (!agreed) { setError("Please agree to the Terms & Privacy Policy."); return; }

      const otp = generateOTP();
      setGeneratedOtp(otp);
      setPendingSignupData({
        name: trimName,
        email: trimEmail,
        password: trimPw,
        role: isScholar ? "scholar" : "student",
        expertise: expertise || undefined,
      });
      setOtpPurpose("email-signup");
      setStep("otp");
    }
  };

  const handleOtpVerify = () => {
    setOtpError("");
    if (otpInput.trim() !== generatedOtp) {
      setOtpError("Incorrect OTP. Please try again.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (otpPurpose === "email-signup" && pendingSignupData) {
        const result = signup(pendingSignupData);
        setLoading(false);
        if (result.success) {
          redirectAfterAuth();
        } else {
          setStep("form");
          setError(result.error || "Signup failed.");
        }
      } else if (otpPurpose === "phone-signup" && pendingPhoneSignupData) {
        const result = signupWithPhone(pendingPhoneSignupData);
        setLoading(false);
        if (result.success) {
          redirectAfterAuth();
        } else {
          setStep("form");
          setError(result.error || "Signup failed.");
        }
      } else if (otpPurpose === "phone-login" && pendingPhone) {
        const loginRole = isScholar ? "scholar" : "student";
        const result = completePhoneLogin(pendingPhone, loginRole);
        setLoading(false);
        if (result.success) {
          redirectAfterAuth();
        } else {
          setStep("form");
          setError(result.error || "Login failed.");
        }
      }
    }, 700);
  };

  const handlePhoneSend = () => {
    setError("");
    const trimPhone = phone.trim().replace(/\s/g, "");
    const loginRole = isScholar ? "scholar" : "student";

    if (!/^\d{10}$/.test(trimPhone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (phoneMode === "signup") {
      if (!phoneName.trim()) {
        setError("Please enter your full name.");
        return;
      }
      const registeredUsers: { phone?: string; role: string }[] = JSON.parse(localStorage.getItem("ss_registered_users") || "[]");
      if (registeredUsers.find(u => u.phone === trimPhone && u.role === loginRole)) {
        setError("An account with this number already exists. Please sign in.");
        return;
      }
      const otp = generateOTP();
      setGeneratedOtp(otp);
      setPendingPhoneSignupData({ name: phoneName.trim(), phone: trimPhone, role: loginRole, expertise: phoneExpertise || undefined });
      setOtpPurpose("phone-signup");
      setStep("otp");
    } else {
      const check = loginWithPhone(trimPhone, loginRole);
      if (!check.success) {
        setError(check.error || "No account found. Please sign up first.");
        return;
      }
      const otp = generateOTP();
      setGeneratedOtp(otp);
      setPendingPhone(trimPhone);
      setOtpPurpose("phone-login");
      setStep("otp");
    }
  };

  const resetForm = () => {
    setStep("form");
    setOtpInput("");
    setGeneratedOtp("");
    setPendingSignupData(null);
    setPendingPhone("");
    setPendingPhoneSignupData(null);
    setError("");
    setOtpError("");
  };

  const switchMode = (m: AuthMode) => {
    setMode(m);
    setError("");
    setStep("form");
    setOtpInput("");
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

          {/* OTP Verification Step */}
          {step === "otp" && (
            <div>
              <button onClick={resetForm} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition mb-6">
                ← Back
              </button>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center text-2xl mb-5 shadow-xl`}>
                {pendingPhone ? "📱" : "📧"}
              </div>
              <h2 className="text-2xl font-black text-white mb-1">Verify OTP</h2>
              <p className="text-sm text-gray-400 mb-2">
                OTP sent to {pendingPhone ? `+91 ${pendingPhone}` : pendingSignupData?.email}
              </p>

              {/* OTP Display Box — shown since this is a demo without a real email/SMS service */}
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <p className="text-xs text-amber-400 font-semibold mb-1">Demo Mode — Your OTP</p>
                <p className="text-3xl font-black text-amber-300 tracking-[0.35em]">{generatedOtp}</p>
                <p className="text-xs text-amber-500/70 mt-1">In production this would be sent via SMS / email</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-2">Enter 6-digit OTP</label>
                  <input
                    value={otpInput}
                    onChange={e => { setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError(""); }}
                    placeholder="· · · · · ·"
                    maxLength={6}
                    className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl text-white tracking-[0.5em] placeholder-gray-600 outline-none ${accentBorder} transition`}
                  />
                  {otpError && <p className="text-xs text-red-400 mt-1.5">{otpError}</p>}
                </div>
                <button
                  onClick={handleOtpVerify}
                  disabled={loading || otpInput.length !== 6}
                  className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition shadow-lg disabled:opacity-50`}
                >
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying…</span>
                    : "Verify & Continue →"}
                </button>
                <button onClick={() => {
                  const newOtp = generateOTP();
                  setGeneratedOtp(newOtp);
                  setOtpInput("");
                  setOtpError("");
                }} className={`text-xs ${accentText} text-center w-full hover:underline`}>
                  Resend OTP
                </button>
              </div>
            </div>
          )}

          {/* Main Form Step */}
          {step === "form" && (
            <>
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
                      onClick={() => { setTab(t); setError(""); }}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${tab === t ? `bg-gradient-to-r ${accent} text-white` : "text-gray-400 hover:text-white"}`}
                    >
                      {t === "google" ? "Google" : t === "phone" ? "OTP" : "Email"}
                    </button>
                  ))}
                </div>
              )}

              {/* Google tab */}
              {tab === "google" && !isAdmin && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-xs text-gray-400">Google Sign-in requires a backend integration.</p>
                    <p className="text-xs text-gray-500 mt-1">Please use Email or OTP login instead.</p>
                  </div>
                  <button
                    onClick={() => setTab("email")}
                    className={`w-full py-3 rounded-2xl bg-gradient-to-r ${accent} text-white font-semibold text-sm hover:opacity-90 transition`}
                  >
                    Use Email Instead
                  </button>
                </div>
              )}

              {/* Phone OTP tab */}
              {tab === "phone" && !isAdmin && (
                <div className="space-y-4">
                  {/* Sign up / Sign in toggle for phone */}
                  <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                    {(["signup", "login"] as AuthMode[]).map(m => (
                      <button
                        key={m}
                        onClick={() => { setPhoneMode(m); setError(""); setPhone(""); setPhoneName(""); }}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${phoneMode === m ? `bg-gradient-to-r ${accent} text-white` : "text-gray-400 hover:text-white"}`}
                      >
                        {m === "signup" ? "New Account" : "Sign In"}
                      </button>
                    ))}
                  </div>

                  {phoneMode === "signup" && (
                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-2">Full Name</label>
                      <input
                        value={phoneName}
                        onChange={e => { setPhoneName(e.target.value); setError(""); }}
                        placeholder="Your full name"
                        className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ${accentBorder} transition`}
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-2">Mobile Number</label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 text-sm text-gray-300 shrink-0 py-3">+91</div>
                      <input
                        value={phone}
                        onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                        placeholder="10-digit number"
                        maxLength={10}
                        className={`flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ${accentBorder} transition`}
                      />
                    </div>
                  </div>

                  {phoneMode === "signup" && isScholar && (
                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-2">Expertise Area</label>
                      <select
                        value={phoneExpertise}
                        onChange={e => setPhoneExpertise(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-cyan-500 transition cursor-pointer"
                      >
                        <option value="" className="bg-gray-900">Select your expertise</option>
                        {["UPSC Civil Services","NEET Medical","JEE Engineering","CAT/MBA","SSC Exams","GATE","Banking","Other"].map(o => (
                          <option key={o} value={o} className="bg-gray-900">{o}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>}

                  <button
                    onClick={handlePhoneSend}
                    disabled={phone.length !== 10 || (phoneMode === "signup" && !phoneName.trim())}
                    className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-50`}
                  >
                    {phoneMode === "signup" ? "Send OTP to Sign Up" : "Send OTP to Sign In"}
                  </button>
                </div>
              )}

              {/* Email / Admin form */}
              {(tab === "email" || isAdmin) && (
                <div className="space-y-4">
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
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs text-gray-400 font-semibold">Password</label>
                      {mode === "login" && <span className={`text-xs ${accentText}`}>Min 8 characters</span>}
                    </div>
                    <div className="relative">
                      <input
                        value={pw}
                        onChange={e => { setPw(e.target.value); setError(""); }}
                        placeholder={mode === "signup" ? "Min 8 characters" : "Your password"}
                        type={showPw ? "text" : "password"}
                        className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-gray-500 outline-none ${accentBorder} transition`}
                      />
                      <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs">
                        {showPw ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                  {mode === "signup" && isScholar && (
                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-2">Expertise Area</label>
                      <select
                        value={expertise}
                        onChange={e => setExpertise(e.target.value)}
                        className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-cyan-500 transition cursor-pointer`}
                      >
                        <option value="" className="bg-gray-900">Select your expertise</option>
                        {["UPSC Civil Services","NEET Medical","JEE Engineering","CAT/MBA","SSC Exams","GATE","Banking","Other"].map(o => (
                          <option key={o} value={o} className="bg-gray-900">{o}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {mode === "signup" && !isAdmin && (
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={e => { setAgreed(e.target.checked); setError(""); }}
                        className="mt-0.5 accent-violet-500"
                      />
                      <span className="text-xs text-gray-400">I agree to the <span className={accentText}>Terms & Privacy Policy</span></span>
                    </label>
                  )}

                  {error && (
                    <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleEmailSubmit}
                    disabled={loading}
                    className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition shadow-lg ${loading ? "opacity-70" : "hover:scale-[1.01]"}`}
                  >
                    {loading
                      ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating…</span>
                      : mode === "login" ? "Sign In →" : `Create ${roleLabel} Account →`}
                  </button>

                  {!isAdmin && (
                    <>
                      <div className="flex items-center gap-3"><div className="flex-1 h-px bg-white/10" /><span className="text-xs text-gray-500">or</span><div className="flex-1 h-px bg-white/10" /></div>
                      <button onClick={() => { setTab("google"); setError(""); }} className="w-full py-3 rounded-2xl border border-white/10 text-sm text-gray-300 hover:bg-white/5 transition">
                        Continue with Google
                      </button>
                    </>
                  )}
                </div>
              )}

              {!isAdmin && (
                <p className="mt-5 text-center text-sm text-gray-400">
                  {mode === "login" ? "No account? " : "Have an account? "}
                  <button onClick={() => switchMode(mode === "login" ? "signup" : "login")} className={`${accentText} font-semibold hover:underline`}>
                    {mode === "login" ? "Sign up free" : "Sign in"}
                  </button>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
