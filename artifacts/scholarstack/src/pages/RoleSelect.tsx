
import { useLocation } from "wouter";
import { useApp } from "../context/AppContext";

export default function RoleSelect() {
  const [, setLocation] = useLocation();
  const { setRole, currentUser } = useApp();

  const choose = (r: "student" | "scholar" | "admin") => {
    setRole(r);
    setLocation(`/auth/${r}`);
  };

  const continueAsCurrentUser = () => {
    if (!currentUser) return;
    if (currentUser.role === "admin") setLocation("/admin");
    else if (currentUser.role === "scholar") setLocation("/scholar");
    else setLocation("/student");
  };

  return (
    <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center px-6 py-10">
      <div className="absolute top-0 left-0 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full text-center">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black">S</div>
          <span className="font-black text-2xl text-white">ScholarStack</span>
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Welcome! Who are you?</h2>
        <p className="text-gray-400 mb-8 text-sm">Select your role to get a personalized experience</p>

        {currentUser && (
          <button
            onClick={continueAsCurrentUser}
            className="w-full mb-6 flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-violet-600/20 to-indigo-600/10 border border-violet-500/30 hover:border-violet-400/50 hover:bg-violet-600/25 transition-all group"
          >
            <div className="text-left">
              <div className="text-xs text-violet-400 font-semibold mb-0.5">Already signed in</div>
              <div className="text-sm font-bold text-white">Continue as {currentUser.name}</div>
              <div className="text-xs text-gray-400 capitalize">{currentUser.role} account</div>
            </div>
            <span className="text-violet-400 text-lg group-hover:translate-x-1 transition-transform">→</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            {
              role: "student" as const,
              icon: "🎓",
              label: "Student",
              desc: "Access premium notes, watch learning reels, use AI study tools & crack any exam",
              border: "hover:border-violet-500/40",
              gradient: "from-violet-500 to-indigo-600",
              features: ["Buy & download notes", "Watch video reels", "AI-powered study plan", "Exam progress tracker"],
            },
            {
              role: "scholar" as const,
              icon: "✍️",
              label: "Scholar / Expert",
              desc: "Upload & sell notes, videos & bundles. Earn money from 12L+ students",
              border: "hover:border-cyan-500/40",
              gradient: "from-cyan-500 to-blue-600",
              features: ["Upload PDFs & videos", "Set your own prices", "Earn from every sale", "Creator analytics"],
            },
          ].map(c => (
            <button
              key={c.label}
              onClick={() => choose(c.role)}
              className={`group relative overflow-hidden rounded-3xl border-2 border-white/8 p-7 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:bg-white/5 ${c.border} bg-white/3`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-3xl mb-4 shadow-xl`}>{c.icon}</div>
              <div className="font-black text-xl text-white mb-2">{c.label}</div>
              <div className="text-sm text-gray-400 mb-4 leading-relaxed">{c.desc}</div>
              <ul className="space-y-1.5">
                {c.features.map(f => (
                  <li key={f} className="text-xs text-gray-300 flex items-center gap-2">
                    <span className="text-violet-400">✓</span>{f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-gray-400 group-hover:text-white transition-all group-hover:gap-3">
                Continue <span>→</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => choose("admin")}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors py-1">
          Admin Sign In
        </button>
      </div>
    </div>
  );
}
