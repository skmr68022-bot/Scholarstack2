
import { useLocation } from "wouter";

const navItems = [
  { icon: "◈", label: "Overview", path: "/scholar" },
  { icon: "▲", label: "Upload Content", path: "/scholar/upload" },
  { icon: "▣", label: "My Content", path: "/scholar/content" },
  { icon: "◎", label: "Earnings", path: "/scholar/earnings" },
  { icon: "↗", label: "Analytics", path: "/scholar/analytics" },
];

export default function ScholarLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();

  return (
    <div className="flex h-screen bg-[#070709] text-white overflow-hidden">
      <aside className="w-56 border-r border-white/8 flex flex-col py-5 px-3 bg-[#0b0b10] shrink-0">
        <div className="flex items-center gap-2 px-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-xs text-white">S</div>
          <span className="font-black text-lg text-white">Scholar Hub</span>
        </div>

        <div className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600/15 to-blue-600/10 border border-cyan-500/20 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-black text-xs shrink-0 text-white">RM</div>
          <div className="min-w-0">
            <div className="font-semibold text-xs text-white truncate">Dr. Rajiv Menon</div>
            <div className="text-[10px] text-cyan-400">Verified Scholar</div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5">
          {navItems.map(n => {
            const active = n.path === "/scholar" ? location === "/scholar" : location.startsWith(n.path);
            return (
              <button
                key={n.label}
                onClick={() => setLocation(n.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-cyan-600/25 to-blue-600/15 text-white border border-cyan-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-sm">{n.icon}</span>{n.label}
              </button>
            );
          })}
        </nav>

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
