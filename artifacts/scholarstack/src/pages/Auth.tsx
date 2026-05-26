
import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useApp } from "../context/AppContext";
import { supabase } from "../lib/supabase";

type AuthMode = "login" | "signup";
type Tab      = "email" | "phone";
type Step     = "form" | "email_otp" | "phone_otp" | "forgot_email" | "forgot_reset";

export default function Auth() {
  const { role } = useParams<{ role: string }>();
  const [, setLocation] = useLocation();
  const { login, signup, verifyEmailOtp, sendPhoneOtp, verifyPhoneOtp } = useApp();

  const [mode, setMode]   = useState<AuthMode>("signup");
  const [tab, setTab]     = useState<Tab>("email");
  const [step, setStep]   = useState<Step>("form");

  /* Email form */
  const [email, setEmail]       = useState("");
  const [pw, setPw]             = useState("");
  const [name, setName]         = useState("");
  const [expertise, setExpertise] = useState("");
  const [agreed, setAgreed]     = useState(false);
  const [showPw, setShowPw]     = useState(false);

  /* Email OTP step */
  const [emailOtp, setEmailOtp]       = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  /* Phone OTP flow */
  const [phone, setPhone]         = useState("");
  const [phoneName, setPhoneName] = useState("");
  const [phoneOtp, setPhoneOtp]   = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  /* Forgot password flow */
  const [forgotEmail, setForgotEmail]   = useState("");
  const [forgotOtp, setForgotOtp]       = useState("");
  const [newPw, setNewPw]               = useState("");
  const [confirmPw, setConfirmPw]       = useState("");
  const [showNewPw, setShowNewPw]       = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [info, setInfo]       = useState("");

  const isScholar = role === "scholar";
  const isAdmin   = role === "admin";

  const accent      = isAdmin ? "from-red-500 to-orange-600" : isScholar ? "from-cyan-500 to-blue-600" : "from-violet-500 to-indigo-600";
  const accentText  = isAdmin ? "text-red-400" : isScholar ? "text-cyan-400" : "text-violet-400";
  const accentBorder = isAdmin ? "focus:border-red-500" : isScholar ? "focus:border-cyan-500" : "focus:border-violet-500";
  const icon        = isAdmin ? "🛡️" : isScholar ? "✍️" : "🎓";
  const roleLabel   = isAdmin ? "Admin" : isScholar ? "Scholar" : "Student";

  const redirectAfterAuth = () => {
    const path = isAdmin ? "/admin" : isScholar ? "/scholar" : "/student";
    setLocation(path);
  };

  const friendlyError = (msg: string): string => {
    if (msg.includes("Email not confirmed"))        return "Please verify your email first — check your inbox for the OTP code.";
    if (msg.includes("Invalid login credentials"))  return "Wrong email or password. Double-check and try again.";
    if (msg.includes("User already registered"))    return "An account with this email already exists. Switch to Sign In.";
    if (msg.includes("Password should be at least")) return "Password must be at least 6 characters.";
    if (msg.includes("Email rate limit"))           return "Too many attempts. Please wait a few minutes and try again.";
    if (msg.includes("Invalid or expired"))         return "That code is wrong or has expired. Check your email and try again.";
    return msg;
  };

  const withTimeout = <T,>(p: Promise<T>, ms: number, fallback: T) =>
    Promise.race([p, new Promise<T>(res => setTimeout(() => res(fallback), ms))]);

  /* ── Email signup / login ── */
  const handleEmailSubmit = async () => {
    setError(""); setInfo("");
    const trimEmail = email.trim().toLowerCase();
    const trimPw    = pw.trim();
    const trimName  = name.trim();

    if (mode === "login" || isAdmin) {
      if (!trimEmail || !trimPw) { setError("Please fill in all fields."); return; }
      setLoading(true);
      const result = await withTimeout(
        login(trimEmail, trimPw, (isAdmin ? "admin" : isScholar ? "scholar" : "student") as "student" | "scholar" | "admin"),
        60000,
        { success: false, error: "Request timed out. Check your connection." },
      );
      setLoading(false);
      if (result.success) { redirectAfterAuth(); }
      else { setError(friendlyError(result.error ?? "Login failed.")); }
      return;
    }

    /* Signup */
    if (!trimName || !trimEmail || !trimPw) { setError("Please fill in all fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail)) { setError("Please enter a valid email address."); return; }
    if (trimPw.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (!agreed) { setError("Please agree to the Terms & Privacy Policy."); return; }

    setLoading(true);
    const result = await withTimeout(
      signup({ name: trimName, email: trimEmail, password: trimPw, role: isScholar ? "scholar" : "student", expertise: expertise || undefined }),
      60000,
      { success: false, error: "Request timed out. Check your connection." },
    );
    setLoading(false);

    if (result.success) {
      setPendingEmail(trimEmail);
      setStep("email_otp");
      setInfo("A 6-digit verification code has been sent to your email.");
    } else {
      setError(friendlyError(result.error ?? "Signup failed. Please try again."));
    }
  };

  /* ── Email OTP verify ── */
  const handleEmailOtpVerify = async () => {
    setError(""); setInfo("");
    if (!emailOtp.trim()) { setError("Please enter the OTP code."); return; }
    setLoading(true);
    const result = await withTimeout(
      verifyEmailOtp(pendingEmail, emailOtp.trim()),
      60000,
      { success: false, error: "Request timed out." },
    );
    setLoading(false);
    if (result.success) { redirectAfterAuth(); }
    else { setError(friendlyError(result.error ?? "Verification failed.")); }
  };

  /* ── Phone: send OTP ── */
  const handleSendPhoneOtp = async () => {
    setError(""); setInfo("");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) { setError("Please enter a valid 10-digit mobile number."); return; }
    if (isNewUser && !phoneName.trim()) { setError("Please enter your name."); return; }

    setLoading(true);
    const result = await withTimeout(
      sendPhoneOtp(phone, phoneName.trim() || undefined, isScholar ? "scholar" : "student", undefined),
      60000,
      { success: false, error: "Request timed out." },
    );
    setLoading(false);
    if (result.success) {
      setStep("phone_otp");
      setInfo(`OTP sent to +91 ${digits.slice(-10)}`);
    } else {
      setError(result.error ?? "Failed to send OTP.");
    }
  };

  /* ── Phone OTP verify ── */
  const handlePhoneOtpVerify = async () => {
    setError(""); setInfo("");
    if (!phoneOtp.trim()) { setError("Please enter the OTP."); return; }
    setLoading(true);
    const result = await withTimeout(
      verifyPhoneOtp(phone, phoneOtp.trim()),
      60000,
      { success: false, error: "Request timed out." },
    );
    setLoading(false);
    if (result.success) { redirectAfterAuth(); }
    else { setError(friendlyError(result.error ?? "Verification failed.")); }
  };

  /* ── Forgot password: send OTP ── */
  const handleForgotSend = async () => {
    setError(""); setInfo("");
    const trimEmail = forgotEmail.trim().toLowerCase();
    if (!trimEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail)) {
      setError("Please enter a valid email address."); return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimEmail }),
      });
      const json = await res.json() as { success: boolean; error?: string };
      setLoading(false);
      if (json.success) {
        setStep("forgot_reset");
        setInfo("If an account exists with this email, a 6-digit reset code has been sent.");
      } else {
        setError(json.error ?? "Failed to send reset code. Please try again.");
      }
    } catch {
      setLoading(false);
      setError("Network error. Please check your connection.");
    }
  };

  /* ── Forgot password: verify OTP + set new password ── */
  const handleForgotReset = async () => {
    setError(""); setInfo("");
    if (forgotOtp.trim().length < 6) { setError("Please enter the 6-digit code from your email."); return; }
    if (!newPw.trim() || newPw.length < 6) { setError("New password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase(), token: forgotOtp.trim(), newPassword: newPw.trim() }),
      });
      const json = await res.json() as { success: boolean; error?: string; session?: Record<string, unknown> };
      setLoading(false);
      if (json.success && json.session) {
        window.localStorage.setItem("ss_auth_v2", JSON.stringify(json.session));
        await supabase.auth.setSession({ access_token: json.session.access_token as string, refresh_token: json.session.refresh_token as string }).catch(() => {});
        redirectAfterAuth();
      } else if (json.success) {
        setStep("form"); setMode("login");
        setError(""); setInfo("Password reset! Please sign in with your new password.");
        setForgotEmail(""); setForgotOtp(""); setNewPw(""); setConfirmPw("");
      } else {
        setError(friendlyError(json.error ?? "Reset failed. Please try again."));
      }
    } catch {
      setLoading(false);
      setError("Network error. Please check your connection.");
    }
  };

  const switchMode = (m: AuthMode) => {
    setMode(m); setError(""); setInfo("");
    setName(""); setEmail(""); setPw(""); setExpertise(""); setAgreed(false); setStep("form");
  };

  const switchTab = (t: Tab) => {
    setTab(t); setError(""); setInfo(""); setStep("form");
  };

  /* ── Shared input style ── */
  const inp = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ${accentBorder} transition`;

  return (
    <div className="min-h-screen flex bg-[#070709]">
      {/* Left panel */}
      <div className="w-5/12 hidden md:flex flex-col items-center justify-center px-10 relative overflow-hidden border-r border-white/5">
        <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-5`} />
        <div className="relative z-10 max-w-xs w-full">
          <button onClick={() => setLocation("/role")} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition mb-8">
            ← Back to role select
          </button>
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center text-3xl mx-auto mb-5 shadow-2xl`}>
            {icon}
          </div>
          <h3 className="text-2xl font-black text-white mb-3 text-center">{roleLabel} Account</h3>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed text-center">
            {isAdmin ? "Platform administration — manage users, content & analytics."
              : isScholar ? "Share your knowledge, earn from every sale. Join 8,400+ earning scholars."
              : "Access 2.8L+ notes, video reels & AI tools. Crack your dream exam."}
          </p>
          {!isAdmin && (
            <div className="space-y-2.5">
              {(isScholar
                ? ["Avg ₹22K/month earnings","8,400+ verified scholars","Upload PDFs, videos & bundles","Real-time creator analytics"]
                : ["12L+ students learning daily","2.8L+ notes & PDFs","AI-powered study assistant","Daily streak & progress tracking"]
              ).map(f => (
                <div key={f} className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-2.5">
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

          {/* ── EMAIL OTP STEP ── */}
          {step === "email_otp" && (
            <div>
              <h2 className="text-2xl font-black text-white mb-1">Verify your email</h2>
              <p className="text-sm text-gray-400 mb-6">
                Enter the 6-digit code sent to <span className="text-white font-semibold">{pendingEmail}</span>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-2">Verification Code</label>
                  <input
                    value={emailOtp}
                    onChange={e => { setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className={`${inp} text-center text-xl tracking-[0.4em] font-black`}
                  />
                </div>
                {error && <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 leading-relaxed">{error}</div>}
                {info  && <div className="text-xs text-green-300 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">{info}</div>}
                <button onClick={handleEmailOtpVerify} disabled={loading || emailOtp.length < 6}
                  className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition shadow-lg disabled:opacity-60`}>
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying…</span>
                    : "Verify & Continue →"}
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Didn't get it? Check your spam folder or{" "}
                  <button onClick={() => { setStep("form"); setEmailOtp(""); }} className={`${accentText} hover:underline`}>go back</button>
                  {" "}to resend.
                </p>
              </div>
            </div>
          )}

          {/* ── PHONE OTP STEP ── */}
          {step === "phone_otp" && (
            <div>
              <h2 className="text-2xl font-black text-white mb-1">Enter OTP</h2>
              <p className="text-sm text-gray-400 mb-6">
                Code sent to <span className="text-white font-semibold">+91 {phone.replace(/\D/g,"").slice(-10)}</span>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-2">6-digit OTP</label>
                  <input
                    value={phoneOtp}
                    onChange={e => { setPhoneOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className={`${inp} text-center text-xl tracking-[0.4em] font-black`}
                  />
                </div>
                {error && <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">{error}</div>}
                {info  && <div className="text-xs text-green-300 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">{info}</div>}
                <button onClick={handlePhoneOtpVerify} disabled={loading || phoneOtp.length < 6}
                  className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition shadow-lg disabled:opacity-60`}>
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying…</span>
                    : "Verify & Sign In →"}
                </button>
                <button onClick={() => { setStep("form"); setPhoneOtp(""); setError(""); }}
                  className="w-full text-xs text-gray-500 hover:text-gray-300 transition">
                  ← Back / Resend OTP
                </button>
              </div>
            </div>
          )}

          {/* ── FORGOT PASSWORD: enter email ── */}
          {step === "forgot_email" && (
            <div>
              <h2 className="text-2xl font-black text-white mb-1">Reset Password</h2>
              <p className="text-sm text-gray-400 mb-6">
                Enter your account email — we'll send a 6-digit reset code.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-2">Email</label>
                  <input
                    value={forgotEmail}
                    onChange={e => { setForgotEmail(e.target.value); setError(""); }}
                    placeholder="you@email.com"
                    type="email"
                    className={inp}
                  />
                </div>
                {error && <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 leading-relaxed">{error}</div>}
                {info  && <div className="text-xs text-green-300 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">{info}</div>}
                <button onClick={handleForgotSend} disabled={loading || !forgotEmail.trim()}
                  className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition shadow-lg disabled:opacity-60`}>
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</span>
                    : "Send Reset Code →"}
                </button>
                <button onClick={() => { setStep("form"); setError(""); setInfo(""); setForgotEmail(""); }}
                  className="w-full text-xs text-gray-500 hover:text-gray-300 transition">
                  ← Back to Sign In
                </button>
              </div>
            </div>
          )}

          {/* ── FORGOT PASSWORD: enter OTP + new password ── */}
          {step === "forgot_reset" && (
            <div>
              <h2 className="text-2xl font-black text-white mb-1">Set New Password</h2>
              <p className="text-sm text-gray-400 mb-6">
                Enter the code sent to <span className="text-white font-semibold">{forgotEmail}</span> and choose a new password.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-2">6-digit Reset Code</label>
                  <input
                    value={forgotOtp}
                    onChange={e => { setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className={`${inp} text-center text-xl tracking-[0.4em] font-black`}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-2">New Password</label>
                  <div className="relative">
                    <input
                      value={newPw}
                      onChange={e => { setNewPw(e.target.value); setError(""); }}
                      placeholder="Min 6 characters"
                      type={showNewPw ? "text" : "password"}
                      className={`${inp} pr-14`}
                    />
                    <button onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-semibold">
                      {showNewPw ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-2">Confirm Password</label>
                  <input
                    value={confirmPw}
                    onChange={e => { setConfirmPw(e.target.value); setError(""); }}
                    placeholder="Re-enter new password"
                    type={showNewPw ? "text" : "password"}
                    className={inp}
                  />
                </div>
                {error && <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 leading-relaxed">{error}</div>}
                {info  && <div className="text-xs text-green-300 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">{info}</div>}
                <button onClick={handleForgotReset} disabled={loading || forgotOtp.length < 6 || !newPw || !confirmPw}
                  className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition shadow-lg disabled:opacity-60`}>
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Resetting…</span>
                    : "Reset Password →"}
                </button>
                <button onClick={() => { setStep("forgot_email"); setForgotOtp(""); setNewPw(""); setConfirmPw(""); setError(""); setInfo(""); }}
                  className="w-full text-xs text-gray-500 hover:text-gray-300 transition">
                  ← Resend code
                </button>
              </div>
            </div>
          )}

          {/* ── MAIN FORM ── */}
          {step === "form" && (
            <>
              <h2 className="text-2xl font-black text-white mb-1">
                {isAdmin ? "Admin Login" : mode === "signup" ? `Join as ${roleLabel}` : "Welcome back!"}
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                {isAdmin ? "Enter your admin credentials"
                  : mode === "signup" ? "Create your free account — takes 10 seconds"
                  : "Sign in to continue"}
              </p>

              {/* Tab switcher */}
              <div className="flex gap-1 mb-5 bg-white/5 rounded-xl p-1 border border-white/10">
                {(["email", "phone"] as Tab[]).map(t => (
                  <button key={t} onClick={() => switchTab(t)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${tab === t ? `bg-gradient-to-r ${accent} text-white` : "text-gray-400 hover:text-white"}`}>
                    {t === "phone" ? "Mobile OTP" : "Email"}
                  </button>
                ))}
              </div>

              {/* ── Phone OTP tab ── */}
              {tab === "phone" && (
                <div className="space-y-4">
                  {/* Sign In / New Account toggle — hidden for admin (sign-in only) */}
                  {!isAdmin && (
                    <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                      <button onClick={() => setIsNewUser(false)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${!isNewUser ? `bg-gradient-to-r ${accent} text-white` : "text-gray-400 hover:text-white"}`}>
                        Sign In
                      </button>
                      <button onClick={() => setIsNewUser(true)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${isNewUser ? `bg-gradient-to-r ${accent} text-white` : "text-gray-400 hover:text-white"}`}>
                        New Account
                      </button>
                    </div>
                  )}

                  {isNewUser && !isAdmin && (
                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-2">Full Name</label>
                      <input value={phoneName} onChange={e => { setPhoneName(e.target.value); setError(""); }}
                        placeholder="Your full name" className={inp} />
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-2">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">+91</span>
                      <input value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g,"").slice(0,10)); setError(""); }}
                        placeholder="10-digit number" maxLength={10}
                        className={`${inp} pl-14`} />
                    </div>
                  </div>

                  {error && <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">{error}</div>}

                  <button onClick={handleSendPhoneOtp} disabled={loading || phone.length < 10}
                    className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition shadow-lg disabled:opacity-60`}>
                    {loading
                      ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending OTP…</span>
                      : "Send OTP →"}
                  </button>
                </div>
              )}

              {/* ── Email / Admin tab ── */}
              {(tab === "email" || isAdmin) && (
                <div className="space-y-4">
                  {/* Sign up / Sign in toggle */}
                  {!isAdmin && (
                    <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                      {(["signup", "login"] as AuthMode[]).map(m => (
                        <button key={m} onClick={() => switchMode(m)}
                          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${mode === m ? `bg-gradient-to-r ${accent} text-white` : "text-gray-400 hover:text-white"}`}>
                          {m === "signup" ? "New Account" : "Sign In"}
                        </button>
                      ))}
                    </div>
                  )}

                  {mode === "signup" && !isAdmin && (
                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-2">Full Name</label>
                      <input value={name} onChange={e => { setName(e.target.value); setError(""); }}
                        placeholder="Your full name" className={inp} />
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-2">Email</label>
                    <input value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                      placeholder="you@email.com" type="email" className={inp} />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-2">Password</label>
                    <div className="relative">
                      <input value={pw} onChange={e => { setPw(e.target.value); setError(""); }}
                        placeholder={mode === "signup" ? "Min 6 characters" : "Your password"}
                        type={showPw ? "text" : "password"}
                        className={`${inp} pr-14`} />
                      <button onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-semibold">
                        {showPw ? "Hide" : "Show"}
                      </button>
                    </div>
                    {/* Forgot password link — shown on Sign In tab and admin login */}
                    {(mode === "login" || isAdmin) && (
                      <button
                        onClick={() => { setStep("forgot_email"); setForgotEmail(email); setError(""); setInfo(""); }}
                        className={`mt-1.5 text-xs ${accentText} hover:underline float-right`}>
                        Forgot password?
                      </button>
                    )}
                  </div>

                  {mode === "signup" && isScholar && !isAdmin && (
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
                      <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setError(""); }} className="mt-0.5 accent-violet-500" />
                      <span className="text-xs text-gray-400">I agree to the <span className={accentText}>Terms & Privacy Policy</span></span>
                    </label>
                  )}

                  {error && <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 leading-relaxed">{error}</div>}
                  {info  && <div className="text-xs text-green-300 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">{info}</div>}

                  <button onClick={handleEmailSubmit} disabled={loading}
                    className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent} text-white font-bold text-sm hover:opacity-90 transition shadow-lg disabled:opacity-60`}>
                    {loading
                      ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{mode === "signup" ? "Creating account…" : "Signing in…"}</span>
                      : mode === "login" || isAdmin ? "Sign In →" : `Create ${roleLabel} Account →`}
                  </button>

                  {isAdmin && (
                    <p className="text-xs text-gray-500 text-center leading-relaxed">
                      First sign up via the Student/Scholar flow, then run
                      <br /><code className="text-gray-400 text-[10px]">UPDATE profiles SET role = 'admin' WHERE email = '...';</code>
                      <br />in Supabase SQL Editor to grant admin access.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
