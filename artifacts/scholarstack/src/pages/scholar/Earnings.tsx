
import { useLocation } from "wouter";
import { useApp } from "../../context/AppContext";

const history = [
  { month: "May 2025", amount: "₹22,480", sales: 74, status: "Processing" },
  { month: "Apr 2025", amount: "₹19,850", sales: 66, status: "Paid" },
  { month: "Mar 2025", amount: "₹24,100", sales: 82, status: "Paid" },
  { month: "Feb 2025", amount: "₹18,320", sales: 61, status: "Paid" },
  { month: "Jan 2025", amount: "₹15,680", sales: 53, status: "Paid" },
];

export default function Earnings() {
  const [, setLocation] = useLocation();
  const { uploads } = useApp();
  const totalEarned = "₹2,84,237";
  const pending = "₹18,420";

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setLocation("/scholar")} className="text-gray-400 hover:text-white transition text-xs">← Dashboard</button>
        <h1 className="font-black text-xl text-white flex-1">Earnings & Payouts</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="col-span-2 bg-gradient-to-r from-cyan-900/40 to-blue-900/30 border border-cyan-500/20 rounded-2xl p-6">
          <div className="text-gray-400 text-xs mb-1">Total Lifetime Earnings</div>
          <div className="text-4xl font-black text-cyan-400 mb-1">{totalEarned}</div>
          <div className="text-xs text-gray-400">From {uploads.reduce((s, u) => s + u.sales, 0).toLocaleString()} total sales</div>
          <div className="mt-4 flex items-center gap-4">
            <div>
              <div className="text-xs text-gray-400">Platform Fee (15%)</div>
              <div className="font-bold text-sm text-red-400">-₹42,636</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">GST (18%)</div>
              <div className="font-bold text-sm text-orange-400">-₹36,480</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Net Earned</div>
              <div className="font-bold text-sm text-green-400">₹2,05,121</div>
            </div>
          </div>
        </div>
        <div className="bg-[#13131a] border border-white/10 rounded-2xl p-6 flex flex-col">
          <div className="text-gray-400 text-xs mb-1">Pending Payout</div>
          <div className="text-3xl font-black text-white mb-1">{pending}</div>
          <div className="text-xs text-gray-400 mb-4">Scheduled Friday, May 30</div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-gray-300 mb-4">
            <div>Bank: HDFC ····4821</div>
            <div className="text-gray-500 mt-0.5">IFSC: HDFC0001234</div>
          </div>
          <button className="mt-auto py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs hover:opacity-90 transition">
            Request Early Payout
          </button>
        </div>
      </div>

      {/* Revenue by content */}
      <div className="mb-5">
        <h2 className="font-bold text-sm text-white mb-3">Revenue by Content</h2>
        <div className="bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden">
          {uploads.filter(u => u.status === "active").map((u, i) => {
            const pct = u.sales > 0 ? Math.min(100, (u.sales / 2000) * 100) : 0;
            const colors = ["from-cyan-500 to-blue-500", "from-violet-500 to-indigo-500", "from-green-500 to-emerald-500"];
            return (
              <div key={u.id} className="px-5 py-4 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="font-semibold text-xs text-white flex-1">{u.title}</div>
                  <div className="font-black text-sm text-green-400">{u.earnings}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${colors[i % 3]}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{u.sales} sales</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payout history */}
      <div>
        <h2 className="font-bold text-sm text-white mb-3">Payout History</h2>
        <div className="bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden">
          {history.map(h => (
            <div key={h.month} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">💳</div>
              <div className="flex-1">
                <div className="font-semibold text-xs text-white">{h.month}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{h.sales} sales</div>
              </div>
              <div className="font-black text-sm text-white">{h.amount}</div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${h.status === "Paid" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                {h.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
