
import { useLocation } from "wouter";
import { useApp } from "../../context/AppContext";

export default function Earnings() {
  const [, setLocation] = useLocation();
  const { uploads, currentUser } = useApp();

  const myUploads = uploads.filter(u => u.scholarId === currentUser?.id);

  const totalEarningsRaw = myUploads.reduce((sum, u) => {
    if (u.price === "Free" || !u.price) return sum;
    const amt = parseInt(u.price.replace(/[^0-9]/g, "")) || 0;
    return sum + Math.round(amt * u.sales * 0.7);
  }, 0);

  const formatAmount = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
    if (n >= 1000) return `₹${n.toLocaleString("en-IN")}`;
    return `₹${n}`;
  };

  const totalEarned = formatAmount(totalEarningsRaw);
  const pending = formatAmount(Math.round(totalEarningsRaw * 0.15));
  const availableForPayout = formatAmount(Math.round(totalEarningsRaw * 0.85));

  const topContent = [...myUploads]
    .filter(u => u.status === "live")
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setLocation("/scholar")} className="text-gray-400 hover:text-white text-xs">← Dashboard</button>
        <h1 className="font-black text-xl text-white flex-1">Earnings & Payouts</h1>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Earned", value: totalEarned, sub: "All time · 70% revenue", color: "text-green-400", border: "border-green-500/20" },
          { label: "Available for Payout", value: availableForPayout, sub: "Ready to withdraw", color: "text-cyan-400", border: "border-cyan-500/20" },
          { label: "Processing", value: pending, sub: "T+7 settlement", color: "text-yellow-400", border: "border-yellow-500/20" },
        ].map(s => (
          <div key={s.label} className={`bg-[#13131a] border ${s.border} rounded-2xl p-5`}>
            <div className={`font-black text-2xl ${s.color} mb-1`}>{s.value}</div>
            <div className="text-xs text-gray-300">{s.label}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Payout button */}
      {totalEarningsRaw > 0 && (
        <div className="bg-[#13131a] border border-white/8 rounded-2xl p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm text-white">Request Payout</p>
            <p className="text-xs text-gray-400 mt-0.5">Minimum ₹500 · Processed within 3–5 business days via bank transfer</p>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-sm font-bold text-white hover:opacity-90 transition">
            Withdraw {availableForPayout}
          </button>
        </div>
      )}

      {/* Revenue breakdown */}
      <div className="bg-[#13131a] border border-white/8 rounded-2xl p-5 mb-4">
        <h3 className="font-bold text-sm text-white mb-4">Revenue Breakdown</h3>
        <div className="space-y-2">
          {[
            { label: "Gross Sales", value: formatAmount(Math.round(totalEarningsRaw / 0.7)), color: "text-white" },
            { label: "Platform Fee (30%)", value: `−${formatAmount(Math.round(totalEarningsRaw / 0.7 * 0.3))}`, color: "text-red-400" },
            { label: "Your Earnings (70%)", value: totalEarned, color: "text-green-400" },
            { label: "GST Deducted (18%)", value: `−${formatAmount(Math.round(totalEarningsRaw * 0.18))}`, color: "text-orange-400" },
            { label: "Net Payout", value: availableForPayout, color: "text-cyan-400" },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
              <span className="text-gray-400">{row.label}</span>
              <span className={`font-bold ${row.color}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top performing content */}
      {topContent.length > 0 && (
        <div className="bg-[#13131a] border border-white/8 rounded-2xl p-5">
          <h3 className="font-bold text-sm text-white mb-4">Top Performing Content</h3>
          <div className="space-y-3">
            {topContent.map((u, i) => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-400 shrink-0">
                  {i + 1}
                </div>
                <div className={`w-9 h-9 rounded-xl ${u.color ?? "bg-violet-500"} flex items-center justify-center text-sm shrink-0`}>
                  {u.type === "PDF" ? "📄" : "🎬"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{u.title}</p>
                  <p className="text-[10px] text-gray-500">{u.sales} sales · {u.price}</p>
                </div>
                <p className="text-xs font-bold text-green-400 shrink-0">{u.earnings}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {myUploads.length === 0 && (
        <div className="text-center py-16 bg-[#13131a] border border-white/8 rounded-2xl">
          <p className="text-4xl mb-3">💰</p>
          <p className="font-semibold text-white mb-1">No earnings yet</p>
          <p className="text-xs text-gray-400 mb-5">Upload content and get approved to start earning.</p>
          <button onClick={() => setLocation("/scholar/upload")}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-sm font-semibold text-white">
            Upload Content
          </button>
        </div>
      )}
    </div>
  );
}
