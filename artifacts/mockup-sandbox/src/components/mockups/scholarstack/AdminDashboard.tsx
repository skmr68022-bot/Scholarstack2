
import { useState } from "react";

const navItems = [
  { icon:"📊", label:"Overview", active:true },
  { icon:"👤", label:"Users" },
  { icon:"🎓", label:"Scholars" },
  { icon:"📄", label:"Content" },
  { icon:"💳", label:"Payments" },
  { icon:"💸", label:"Withdrawals" },
  { icon:"🚩", label:"Reports" },
  { icon:"📢", label:"Banners" },
  { icon:"📬", label:"Notifications" },
  { icon:"🏷️", label:"Categories" },
  { icon:"⚙️", label:"Settings" },
];
const pendingApprovals = [
  { name:"Neha Gupta", type:"Scholar Verification", badge:"NEET Expert", time:"2h ago", avatar:"NG", bg:"from-pink-400 to-rose-400" },
  { name:"Vikram Rao", type:"Content Approval", badge:"UPSC Notes", time:"4h ago", avatar:"VR", bg:"from-orange-400 to-red-400" },
  { name:"Sonia K.", type:"Withdrawal Request", badge:"₹45,200", time:"5h ago", avatar:"SK", bg:"from-blue-400 to-indigo-400" },
  { name:"Amit J.", type:"Copyright Report", badge:"2 reports", time:"1d ago", avatar:"AJ", bg:"from-green-400 to-emerald-400" },
];
const recentUsers = [
  { name:"Priya Sharma", email:"priya@email.com", role:"Student", plan:"Pro", joined:"Today", status:"active" },
  { name:"Dr. Rajiv M.", email:"rajiv@email.com", role:"Scholar", plan:"Verified", joined:"Yesterday", status:"active" },
  { name:"Rahul Verma", email:"rahul@email.com", role:"Student", plan:"Free", joined:"2d ago", status:"active" },
  { name:"Unknown User", email:"spam@test.com", role:"Student", plan:"Free", joined:"3d ago", status:"flagged" },
  { name:"Ananya Singh", email:"ananya@email.com", role:"Student", plan:"Pro", joined:"3d ago", status:"active" },
];
const platformStats = [
  { label:"Total Revenue", val:"₹2.4Cr", sub:"↑ +18% this month", icon:"💰", color:"from-green-500 to-emerald-600" },
  { label:"Active Users", val:"1.2L", sub:"↑ +8,400 this week", icon:"👥", color:"from-blue-500 to-indigo-600" },
  { label:"Scholars", val:"8,420", sub:"↑ +240 this month", icon:"🎓", color:"from-violet-500 to-purple-600" },
  { label:"Content Items", val:"2.8L", sub:"↑ +14,200 this month", icon:"📄", color:"from-orange-500 to-red-500" },
  { label:"Transactions", val:"48,200", sub:"This month", icon:"💳", color:"from-cyan-500 to-blue-500" },
  { label:"Avg Rating", val:"4.8 ⭐", sub:"Platform wide", icon:"⭐", color:"from-yellow-500 to-orange-500" },
];

export function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("Overview");

  return (
    <div className="flex h-screen bg-[#060608] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/10 flex flex-col py-5 px-3 bg-[#0a0a10] shrink-0">
        <div className="flex items-center gap-2.5 px-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-black text-sm">A</div>
          <div>
            <div className="font-black text-base">Admin Panel</div>
            <div className="text-[10px] text-gray-500">ScholarStack</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center font-black text-xs">SA</div>
          <div>
            <div className="font-semibold text-xs">Super Admin</div>
            <div className="text-[10px] text-red-400">Full Access</div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5">
          {navItems.map(n => (
            <button key={n.label} onClick={() => setActiveNav(n.label)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${activeNav === n.label ? "bg-gradient-to-r from-red-600/20 to-orange-600/20 text-white border border-red-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <span className="text-sm">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 mt-4">
          <div className="text-xs text-red-400 font-semibold mb-1.5">⚠️ Pending Actions</div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-300"><span>Scholar approvals</span><span className="text-orange-400 font-bold">14</span></div>
            <div className="flex justify-between text-xs text-gray-300"><span>Content reviews</span><span className="text-orange-400 font-bold">38</span></div>
            <div className="flex justify-between text-xs text-gray-300"><span>Withdrawal reqs</span><span className="text-orange-400 font-bold">7</span></div>
            <div className="flex justify-between text-xs text-gray-300"><span>Copyright reports</span><span className="text-red-400 font-bold">3</span></div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black">Platform Overview</h1>
            <p className="text-gray-400 text-xs mt-0.5">Last updated: May 25, 2025 — 09:42 AM</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="px-3 py-2 rounded-xl border border-white/10 text-xs font-medium hover:bg-white/5 transition flex items-center gap-1.5">📊 Export Report</button>
            <button className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-xs font-semibold hover:opacity-90 transition shadow-lg shadow-red-500/20">🚨 Send Notification</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {platformStats.map(s => (
            <div key={s.label} className="bg-[#0d0d14] border border-white/10 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-base`}>{s.icon}</div>
                <div className="text-xs text-green-400 font-medium">{s.sub.split(" ")[0]}</div>
              </div>
              <div className="text-2xl font-black">{s.val}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-2 bg-[#0d0d14] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-bold text-sm">Revenue & Transactions</div>
                <div className="text-xs text-gray-400">May 2025</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs"><span className="w-2.5 h-2.5 rounded-full bg-violet-500" />Revenue</div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />Transactions</div>
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-28">
              {[60,75,55,88,70,92,80,68,85,78,95,82,74,97,88,76,84,90,65,79,93,71,86,98,75,83,91,67,80,88].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                  <div className="w-full rounded-t-sm" style={{height:`${h * 0.7}%`, background:"linear-gradient(to top, #7c3aed, #4f46e5)", opacity:0.8}} />
                </div>
              ))}
            </div>
          </div>

          {/* Commission & Payouts */}
          <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-5">
            <div className="font-bold text-sm mb-4">Commission Summary</div>
            <div className="space-y-3">
              {[
                { label:"Gross Revenue", val:"₹2.4Cr", color:"text-white" },
                { label:"Scholar Payouts", val:"₹1.68Cr", color:"text-green-400" },
                { label:"Platform Fee (30%)", val:"₹72L", color:"text-violet-400" },
                { label:"Payment Gateway", val:"₹4.8L", color:"text-red-400" },
                { label:"Net Profit", val:"₹67.2L", color:"text-yellow-400" },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{r.label}</span>
                  <span className={`text-sm font-bold ${r.color}`}>{r.val}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 mt-2 flex justify-between items-center">
                <span className="text-xs font-semibold text-white">Platform Commission</span>
                <span className="text-sm font-black text-green-400">30%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals & Users */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-sm flex items-center gap-2">
                ⚠️ Pending Approvals
                <span className="w-5 h-5 rounded-full bg-orange-500 text-[10px] flex items-center justify-center font-black">62</span>
              </div>
              <button className="text-xs text-violet-400 font-semibold">View all</button>
            </div>
            <div className="space-y-2.5">
              {pendingApprovals.map(p => (
                <div key={p.name} className="flex items-center gap-3 bg-white/3 rounded-xl p-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${p.bg} flex items-center justify-center font-black text-xs shrink-0`}>{p.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold">{p.name}</div>
                    <div className="text-[10px] text-gray-400">{p.type} • {p.badge}</div>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="px-2.5 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-[10px] font-semibold hover:bg-green-500/30 transition">✓</button>
                    <button className="px-2.5 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-[10px] font-semibold hover:bg-red-500/30 transition">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-sm">👤 Recent Users</div>
              <button className="text-xs text-violet-400 font-semibold">Manage all</button>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-gray-500 border-b border-white/5">
                  <th className="pb-2 font-semibold">User</th>
                  <th className="pb-2 font-semibold">Role</th>
                  <th className="pb-2 font-semibold">Plan</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentUsers.map(u => (
                  <tr key={u.email} className="hover:bg-white/2">
                    <td className="py-2.5 pr-2">
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-gray-500">{u.joined}</div>
                    </td>
                    <td className="py-2.5 pr-2">
                      <span className={`px-2 py-1 rounded-full font-semibold ${u.role === "Scholar" ? "bg-violet-500/20 text-violet-400" : "bg-blue-500/20 text-blue-400"}`}>{u.role}</span>
                    </td>
                    <td className="py-2.5 pr-2 text-gray-300">{u.plan}</td>
                    <td className="py-2.5 pr-2">
                      <span className={`px-2 py-1 rounded-full font-semibold ${u.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>● {u.status}</span>
                    </td>
                    <td className="py-2.5">
                      <button className="text-gray-500 hover:text-white transition">⋯</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
