
import { useLocation } from "wouter";
import { useApp } from "../../context/AppContext";

export default function ScholarOverview() {
  const [, setLocation] = useLocation();
  const { uploads } = useApp();
  const totalSales = uploads.reduce((s, u) => s + u.sales, 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Creator Dashboard</h1>
          <p className="text-gray-400 text-xs mt-0.5">Dr. Rajiv Menon · Verified Scholar</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLocation("/scholar/upload")} className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-xs font-semibold text-white hover:opacity-90 transition">
            + Upload Content
          </button>
        </div>
      </div>

      {/* Revenue banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-900/40 to-blue-900/30 border border-cyan-500/20 p-6 mb-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="relative grid grid-cols-4 gap-6">
          {[
            { label: "Total Earnings", value: "₹2,84,237", sub: "+₹22K this month", color: "text-cyan-400" },
            { label: "Total Sales", value: totalSales.toLocaleString(), sub: "+148 this week", color: "text-blue-400" },
            { label: "Content Items", value: String(uploads.length), sub: "PDFs & Videos", color: "text-indigo-400" },
            { label: "Avg Rating", value: "4.9", sub: "12,400 reviews", color: "text-violet-400" },
          ].map(s => (
            <div key={s.label}>
              <div className={`text-2xl font-black ${s.color} mb-0.5`}>{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
              <div className="text-[10px] text-gray-500 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Profile Views", value: "1.2K", change: "+18%", icon: "👁" },
          { label: "Followers", value: "48K", change: "+324", icon: "👥" },
          { label: "Payout Due", value: "₹18,420", change: "Friday", icon: "💳" },
          { label: "Active Bundles", value: "2", change: "running", icon: "📦" },
        ].map(s => (
          <div key={s.label} className="bg-[#13131a] border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-black text-lg text-white">{s.value}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{s.label}</div>
            <div className="text-[10px] text-cyan-400 mt-1">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Recent content */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm text-white">Recent Content</h2>
          <button onClick={() => setLocation("/scholar/content")} className="text-cyan-400 text-xs">View all →</button>
        </div>
        <div className="space-y-2">
          {uploads.slice(0, 3).map(u => (
            <div key={u.id} className="bg-[#13131a] border border-white/10 rounded-xl p-3.5 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {u.type === "PDF" ? "📄" : "🎬"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-xs text-white truncate">{u.title}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{u.type} · {u.price}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-black text-sm text-green-400">{u.earnings}</div>
                <div className="text-[10px] text-gray-500">{u.sales} sales</div>
              </div>
              <div className="text-[10px] px-2 py-1 rounded-full bg-green-500/15 text-green-400 font-bold border border-green-500/20">
                {u.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div>
        <div className="font-bold text-sm text-white mb-3">Recent Activity</div>
        <div className="space-y-2">
          {[
            { icon: "💰", msg: "New sale — UPSC Polity Notes · ₹299", time: "5 min ago" },
            { icon: "⭐", msg: 'New 5★ review: "Best notes ever!"', time: "1 hr ago" },
            { icon: "👥", msg: "120 new followers this week", time: "2 hr ago" },
            { icon: "💳", msg: "Payout of ₹18,420 scheduled for Friday", time: "Today" },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 bg-[#13131a] border border-white/10 rounded-xl px-4 py-3">
              <span className="text-lg">{a.icon}</span>
              <div className="flex-1 text-xs text-gray-200">{a.msg}</div>
              <div className="text-[10px] text-gray-500 shrink-0">{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
