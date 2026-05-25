
import { useState } from "react";

const navItems = [
  { icon:"📊", label:"Analytics", active:true },
  { icon:"📤", label:"Upload Content" },
  { icon:"📦", label:"My Content" },
  { icon:"💰", label:"Earnings" },
  { icon:"📣", label:"Promotions" },
  { icon:"💬", label:"Reviews" },
  { icon:"👥", label:"Followers" },
  { icon:"⚙️", label:"Settings" },
];
const contentItems = [
  { title:"UPSC Polity Complete Notes", type:"PDF", price:"₹299", sales:1240, earnings:"₹37,076", rating:4.9, status:"active" },
  { title:"Modern History Short Notes", type:"PDF", price:"₹149", sales:890, earnings:"₹13,261", rating:4.8, status:"active" },
  { title:"Polity Shorts #1", type:"Video", price:"Free", sales:14200, earnings:"₹0", rating:4.7, status:"active" },
  { title:"Geography MCQ Bundle", type:"Bundle", price:"₹599", sales:320, earnings:"₹19,168", rating:4.8, status:"active" },
  { title:"Ethics & Integrity Notes", type:"PDF", price:"₹199", sales:680, earnings:"₹13,532", rating:4.9, status:"active" },
];
const recentActivity = [
  { action:"New purchase", user:"Priya M.", item:"Polity Notes", time:"2m ago", amount:"₹299" },
  { action:"New review", user:"Rahul K.", item:"History Notes", time:"15m ago", amount:"★ 5.0" },
  { action:"New follower", user:"Ananya S.", item:"", time:"1h ago", amount:"" },
  { action:"New purchase", user:"Vivek R.", item:"Geography Bundle", time:"2h ago", amount:"₹599" },
  { action:"New comment", user:"Shreya P.", item:"Polity Shorts", time:"3h ago", amount:"" },
];

export function ScholarDashboard() {
  const [activeNav, setActiveNav] = useState("Analytics");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 border-r border-white/10 flex flex-col py-6 px-3 bg-[#0d0d14] shrink-0">
        <div className="flex items-center gap-2.5 px-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">S</div>
          <span className="font-black text-lg">Scholar Hub</span>
        </div>

        {/* Scholar info */}
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/20 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-black text-sm shrink-0">RM</div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">Dr. Rajiv Menon</div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full font-semibold">✅ Verified</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5">
          {navItems.map(n => (
            <button key={n.label} onClick={() => setActiveNav(n.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeNav === n.label ? "bg-gradient-to-r from-violet-600/30 to-indigo-600/20 text-white border border-violet-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <span className="text-base">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20">
          <div className="text-xs text-violet-400 font-semibold mb-1">🏅 Scholar Level</div>
          <div className="font-black text-xl text-white">Gold</div>
          <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400" />
          </div>
          <div className="text-xs text-gray-400 mt-1">7,400 / 10,000 XP</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black">Creator Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back, Dr. Rajiv 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium hover:bg-white/5 transition flex items-center gap-2">
              <span>📤</span> Upload Content
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-violet-500/25">
              Withdraw ₹83,037
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label:"Total Earnings", val:"₹83,037", sub:"↑ +₹12,400 this month", icon:"💰", color:"from-green-500 to-emerald-600" },
            { label:"Total Students", val:"48,240", sub:"↑ +1,200 this month", icon:"🎓", color:"from-blue-500 to-indigo-600" },
            { label:"Followers", val:"62,400", sub:"↑ +3,800 this month", icon:"👥", color:"from-violet-500 to-purple-600" },
            { label:"Avg Rating", val:"4.9 ⭐", sub:"Based on 12,400 reviews", icon:"⭐", color:"from-yellow-500 to-orange-500" },
          ].map(s => (
            <div key={s.label} className="bg-[#13131a] border border-white/10 rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
              <div className="text-2xl font-black mb-1">{s.val}</div>
              <div className="text-xs text-gray-400 font-medium">{s.label}</div>
              <div className="text-xs text-green-400 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Revenue Chart placeholder + Tabs */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          <div className="col-span-2 bg-[#13131a] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="font-bold text-base">Revenue Overview</div>
                <div className="text-xs text-gray-400 mt-0.5">Last 30 days</div>
              </div>
              <div className="flex gap-2">
                {["7d","30d","90d"].map(t => (
                  <button key={t} className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${activeTab === t ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}`} onClick={() => setActiveTab(t)}>{t}</button>
                ))}
              </div>
            </div>
            {/* Fake bar chart */}
            <div className="flex items-end gap-2 h-36">
              {[40,65,50,80,70,90,75,95,85,60,78,88,72,96,82,74,68,91,77,84,93,67,79,86,98,72,81,89,64,76].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm transition-all" style={{height:`${h}%`, background:`linear-gradient(to top, #7c3aed, #4f46e5)`, opacity: 0.6 + (h/100)*0.4}} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>May 1</span><span>May 10</span><span>May 20</span><span>May 30</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#13131a] border border-white/10 rounded-2xl p-5">
            <div className="font-bold text-base mb-4">Recent Activity</div>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-sm shrink-0">
                    {a.action.includes("purchase") ? "💸" : a.action.includes("review") ? "⭐" : a.action.includes("follower") ? "👤" : "💬"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold">{a.user}</div>
                    <div className="text-xs text-gray-400 truncate">{a.action}{a.item ? ` • ${a.item}` : ""}</div>
                  </div>
                  <div className="text-right shrink-0">
                    {a.amount && <div className="text-xs font-semibold text-green-400">{a.amount}</div>}
                    <div className="text-[10px] text-gray-500">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-[#13131a] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="font-bold text-base">My Content</div>
            <button className="text-xs px-3 py-1.5 rounded-lg bg-violet-600/20 text-violet-400 font-semibold hover:bg-violet-600/30 transition">+ Upload New</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-white/5">
                <th className="pb-3 font-semibold">Content</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold">Sales</th>
                <th className="pb-3 font-semibold">Earnings</th>
                <th className="pb-3 font-semibold">Rating</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {contentItems.map(c => (
                <tr key={c.title} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-sm">{c.title}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${c.type === "PDF" ? "bg-blue-500/20 text-blue-400" : c.type === "Video" ? "bg-red-500/20 text-red-400" : "bg-purple-500/20 text-purple-400"}`}>{c.type}</span>
                  </td>
                  <td className="py-3 pr-4 font-semibold">{c.price}</td>
                  <td className="py-3 pr-4 text-gray-300">{c.sales.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-green-400 font-semibold">{c.earnings}</td>
                  <td className="py-3 pr-4 text-yellow-400">⭐ {c.rating}</td>
                  <td className="py-3 pr-4">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 font-semibold">● {c.status}</span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-xs text-gray-400 hover:text-white transition">⋯</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
