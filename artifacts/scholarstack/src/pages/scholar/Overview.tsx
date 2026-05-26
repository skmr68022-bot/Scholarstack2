
import { useLocation } from "wouter";
import { useApp } from "../../context/AppContext";

export default function ScholarOverview() {
  const [, setLocation] = useLocation();
  const { uploads, currentUser } = useApp();

  const myUploads = uploads.filter(u => u.scholarId === currentUser?.id);
  const liveUploads = myUploads.filter(u => u.status === "live");
  const pendingUploads = myUploads.filter(u => u.status === "review");
  const totalSales = myUploads.reduce((s, u) => s + u.sales, 0);

  const totalEarnings = myUploads.reduce((sum, u) => {
    if (u.price === "Free" || !u.price) return sum;
    const amt = parseInt(u.price.replace(/[^0-9]/g, "")) || 0;
    return sum + Math.round(amt * u.sales * 0.7);
  }, 0);

  const formatEarnings = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${Math.round(n / 1000)}K`;
    return `₹${n}`;
  };

  const avgRating = (() => {
    const rated = myUploads.filter(u => u.rating > 0);
    if (!rated.length) return 0;
    return rated.reduce((s, u) => s + u.rating, 0) / rated.length;
  })();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Creator Dashboard</h1>
          <p className="text-gray-400 text-xs mt-0.5">{currentUser?.name ?? "Scholar"} · Scholar Account</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLocation("/scholar/upload")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-xs font-semibold text-white hover:opacity-90 transition">
            + Upload Content
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Earnings", value: totalEarnings > 0 ? formatEarnings(totalEarnings) : "₹0", sub: "70% revenue share", color: "text-green-400" },
          { label: "Total Sales", value: String(totalSales), sub: "all time", color: "text-cyan-400" },
          { label: "Live Content", value: String(liveUploads.length), sub: `${pendingUploads.length} in review`, color: "text-violet-400" },
          { label: "Avg Rating", value: avgRating > 0 ? `${avgRating.toFixed(1)} ★` : "—", sub: "from students", color: "text-yellow-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#13131a] border border-white/8 rounded-2xl p-4">
            <div className={`font-black text-2xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            <div className="text-[10px] text-gray-600 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent content */}
      <div className="bg-[#13131a] border border-white/8 rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-white">Your Content</h3>
          <button onClick={() => setLocation("/scholar/content")} className="text-xs text-cyan-400 hover:underline">
            View All →
          </button>
        </div>
        {myUploads.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">📄</p>
            <p className="text-sm font-semibold text-white mb-1">No content yet</p>
            <p className="text-xs text-gray-400 mb-4">Upload your first note, video, or bundle to start earning.</p>
            <button onClick={() => setLocation("/scholar/upload")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-xs font-semibold text-white">
              Upload Now
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {myUploads.slice(0, 5).map(u => (
              <div key={u.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className={`w-9 h-9 rounded-xl ${u.color ?? "bg-violet-500"} flex items-center justify-center text-sm shrink-0`}>
                  {u.type === "PDF" ? "📄" : u.type === "Video" ? "🎬" : "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{u.title}</p>
                  <p className="text-[10px] text-gray-500">{u.exam ?? u.category} · {u.price}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-green-400">{u.earnings}</p>
                  <p className="text-[9px] text-gray-500">{u.sales} sales</p>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold capitalize shrink-0 ${
                  u.status === "live" ? "text-green-400 bg-green-400/10 border-green-400/20" :
                  u.status === "review" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
                  "text-red-400 bg-red-400/10 border-red-400/20"
                }`}>{u.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Upload Content", icon: "⬆", path: "/scholar/upload", desc: "Add PDFs, videos, bundles" },
          { label: "View Earnings", icon: "₹", path: "/scholar/earnings", desc: "Payout history & balance" },
          { label: "Analytics", icon: "📊", path: "/scholar/analytics", desc: "Views, sales, audience" },
        ].map(l => (
          <button key={l.label} onClick={() => setLocation(l.path)}
            className="bg-[#13131a] border border-white/8 rounded-2xl p-4 text-left hover:border-cyan-500/30 hover:bg-white/3 transition">
            <div className="text-2xl mb-2">{l.icon}</div>
            <div className="font-bold text-sm text-white mb-0.5">{l.label}</div>
            <div className="text-[10px] text-gray-500">{l.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
