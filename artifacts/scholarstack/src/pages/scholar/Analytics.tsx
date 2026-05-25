
import { useLocation } from "wouter";
import { useApp } from "../../context/AppContext";

const weekData = [
  { d: "Mon", v: 18, s: 12 },
  { d: "Tue", v: 31, s: 22 },
  { d: "Wed", v: 25, s: 18 },
  { d: "Thu", v: 42, s: 31 },
  { d: "Fri", v: 38, s: 27 },
  { d: "Sat", v: 54, s: 41 },
  { d: "Sun", v: 48, s: 35 },
];
const maxV = Math.max(...weekData.map(d => d.v));

export default function Analytics() {
  const [, setLocation] = useLocation();
  const { uploads } = useApp();

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setLocation("/scholar")} className="text-gray-400 hover:text-white transition text-xs">← Dashboard</button>
        <h1 className="font-black text-xl text-white flex-1">Analytics</h1>
        <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 outline-none cursor-pointer">
          <option className="bg-gray-900">Last 7 Days</option>
          <option className="bg-gray-900">Last 30 Days</option>
          <option className="bg-gray-900">Last 3 Months</option>
        </select>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Views", value: "24.8K", change: "+12%", icon: "👁", color: "text-cyan-400" },
          { label: "New Followers", value: "324", change: "+8%", icon: "👥", color: "text-blue-400" },
          { label: "Revenue", value: "₹22,480", change: "+14%", icon: "💰", color: "text-green-400" },
          { label: "Conversion", value: "3.8%", change: "+0.5%", icon: "↗", color: "text-violet-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#13131a] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-base">{s.icon}</span>
              <span className="text-[10px] text-green-400 font-semibold">{s.change}</span>
            </div>
            <div className={`text-xl font-black ${s.color} mb-0.5`}>{s.value}</div>
            <div className="text-[10px] text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[#13131a] border border-white/10 rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-sm text-white">Views & Sales (7 Days)</h2>
          <div className="flex gap-3 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> Views</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Sales</span>
          </div>
        </div>
        <div className="h-40 flex items-end gap-4">
          {weekData.map(d => (
            <div key={d.d} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center gap-1">
                <div className="w-full rounded-t-md bg-cyan-500/30 border-t-2 border-cyan-400"
                  style={{ height: `${(d.v / maxV) * 120}px` }} />
              </div>
              <div className="text-[9px] text-gray-500">{d.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top performing */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#13131a] border border-white/10 rounded-2xl p-4">
          <h2 className="font-bold text-sm text-white mb-3">Top Performing</h2>
          <div className="space-y-3">
            {uploads.filter(u => u.status === "live").map((u, i) => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400">#{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white font-medium truncate">{u.title}</div>
                  <div className="text-[10px] text-gray-400">{u.sales} sales</div>
                </div>
                <div className="font-bold text-xs text-green-400">{u.earnings}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#13131a] border border-white/10 rounded-2xl p-4">
          <h2 className="font-bold text-sm text-white mb-3">Audience Insights</h2>
          <div className="space-y-3">
            {[
              { label: "UPSC Students", pct: 48, color: "bg-orange-400" },
              { label: "NEET Students", pct: 22, color: "bg-green-400" },
              { label: "JEE Students", pct: 18, color: "bg-blue-400" },
              { label: "Others", pct: 12, color: "bg-purple-400" },
            ].map(a => (
              <div key={a.label} className="flex items-center gap-3">
                <div className="text-[10px] text-gray-400 w-28 shrink-0">{a.label}</div>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${a.color}`} style={{ width: `${a.pct}%` }} />
                </div>
                <div className="text-[10px] font-bold text-white w-8 text-right">{a.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
