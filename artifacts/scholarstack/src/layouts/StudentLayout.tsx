
import { useLocation } from "wouter";

const navItems = [
  { icon: "⌂", label: "Home", path: "/student" },
  { icon: "◉", label: "Browse Notes", path: "/student/notes" },
  { icon: "▶", label: "Reels", path: "/student/reels" },
  { icon: "▣", label: "My Library", path: "/student/library" },
  { icon: "✦", label: "AI Tutor", path: "/student/ai" },
  { icon: "◈", label: "Orders", path: "/student/orders" },
  { icon: "◎", label: "Profile", path: "/student/profile" },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();

  return (
    <div className="flex h-screen bg-[#070709] text-white overflow-hidden">
      <aside className="w-56 border-r border-white/8 flex flex-col py-5 px-3 bg-[#0b0b10] shrink-0">
        <div className="flex items-center gap-2 px-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-black text-xs text-white">S</div>
          <span className="font-black text-lg text-white">ScholarStack</span>
        </div>

        <div className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl bg-white/5 border border-white/8 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center font-black text-xs shrink-0 text-white">AS</div>
          <div className="min-w-0">
            <div className="font-semibold text-xs text-white truncate">Arjun Singh</div>
            <div className="text-[10px] text-gray-400">UPSC Aspirant</div>
          </div>
          <div className="ml-auto">
            <span className="text-[10px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded font-bold">PRO</span>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5">
          {navItems.map(n => {
            const active = n.path === "/student" ? location === "/student" : location.startsWith(n.path);
            return (
              <button
                key={n.label}
                onClick={() => setLocation(n.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-violet-600/25 to-indigo-600/15 text-white border border-violet-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-sm">{n.icon}</span>{n.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🔥</span>
            <span className="font-black text-xl text-white">14</span>
          </div>
          <div className="text-[10px] text-gray-400">Day streak! Keep going!</div>
          <div className="mt-2 flex gap-1">
            {[...Array(7)].map((_, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i < 5 ? "bg-orange-400" : "bg-white/10"}`} />
            ))}
          </div>
        </div>

        <button onClick={() => setLocation("/role")} className="mt-3 text-[10px] text-gray-500 hover:text-gray-300 transition text-center">
          ← Switch Role
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
