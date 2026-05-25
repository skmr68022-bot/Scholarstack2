
import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "../context/AppContext";

type Tab = "overview" | "users" | "scholars" | "content";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { pendingScholars, removeScholar, users, banUser } = useApp();
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="flex h-screen bg-[#070709] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/8 flex flex-col py-5 px-3 bg-[#0b0b10] shrink-0">
        <div className="flex items-center gap-2 px-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center font-black text-xs text-white">A</div>
          <span className="font-black text-lg text-white">Admin Panel</span>
        </div>
        <div className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center font-black text-xs text-white">AD</div>
          <div>
            <div className="font-semibold text-xs text-white">Admin User</div>
            <div className="text-[10px] text-red-400">Super Admin</div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5">
          {([
            { icon: "◈", label: "Overview", tab: "overview" },
            { icon: "👥", label: "Users", tab: "users" },
            { icon: "✍️", label: "Scholar Queue", tab: "scholars", badge: pendingScholars.length },
            { icon: "▣", label: "Content", tab: "content" },
          ] as { icon: string; label: string; tab: Tab; badge?: number }[]).map(n => (
            <button
              key={n.label}
              onClick={() => setTab(n.tab)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                tab === n.tab
                  ? "bg-gradient-to-r from-red-600/25 to-orange-600/15 text-white border border-red-500/25"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{n.icon}</span>
              <span className="flex-1 text-left">{n.label}</span>
              {n.badge != null && n.badge > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{n.badge}</span>
              )}
            </button>
          ))}
        </nav>
        <button onClick={() => setLocation("/role")} className="mt-3 text-[10px] text-gray-500 hover:text-gray-300 transition text-center">
          ← Switch Role
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6">
        {tab === "overview" && (
          <div>
            <h1 className="font-black text-xl text-white mb-5">Platform Overview</h1>
            <div className="grid grid-cols-4 gap-4 mb-5">
              {[
                { label: "Total Users", value: "12,40,284", icon: "👥", color: "text-blue-400" },
                { label: "Active Scholars", value: "8,412", icon: "✍️", color: "text-cyan-400" },
                { label: "Notes Published", value: "2,81,940", icon: "📄", color: "text-violet-400" },
                { label: "GMV (May)", value: "₹4.2Cr", icon: "💰", color: "text-green-400" },
              ].map(s => (
                <div key={s.label} className="bg-[#13131a] border border-white/10 rounded-2xl p-5 text-center">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "New Signups Today", value: "1,284", trend: "+18%" },
                { label: "Active Sessions", value: "24,891", trend: "live" },
                { label: "Pending Reports", value: "12", trend: "action needed" },
                { label: "Revenue Today", value: "₹3.8L", trend: "+22%" },
                { label: "Scholar Approvals", value: String(pendingScholars.length), trend: "queued" },
                { label: "Support Tickets", value: "48", trend: "open" },
              ].map(s => (
                <div key={s.label} className="bg-[#13131a] border border-white/10 rounded-xl p-4">
                  <div className="font-black text-xl text-white">{s.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                  <div className="text-[10px] text-orange-400 mt-1">{s.trend}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "users" && (
          <div>
            <h1 className="font-black text-xl text-white mb-5">User Management</h1>
            <div className="bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-12 px-5 py-3 border-b border-white/10 text-[10px] font-bold text-gray-400 uppercase">
                <div className="col-span-3">User</div>
                <div className="col-span-2">Email</div>
                <div className="col-span-2 text-center">Role</div>
                <div className="col-span-2 text-center">Plan</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-2 text-center">Actions</div>
              </div>
              {users.map(u => (
                <div key={u.id} className={`grid grid-cols-12 px-5 py-4 border-b border-white/5 last:border-0 items-center ${u.status === "banned" ? "opacity-50" : "hover:bg-white/3"} transition`}>
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {u.name[0]}
                      </div>
                      <div className="font-semibold text-xs text-white">{u.name}</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-[10px] text-gray-400 truncate">{u.email}</div>
                  <div className="col-span-2 text-center">
                    <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">{u.role}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-bold">{u.plan}</span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${
                      u.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      u.status === "banned" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    }`}>{u.status}</span>
                  </div>
                  <div className="col-span-2 flex gap-1.5 justify-center">
                    <button className="px-2 py-1 rounded-lg bg-white/5 text-[10px] text-gray-300 border border-white/10 hover:bg-white/10 transition">View</button>
                    {u.status !== "banned" && (
                      <button onClick={() => banUser(u.id)} className="px-2 py-1 rounded-lg bg-red-500/10 text-[10px] text-red-400 border border-red-500/20 hover:bg-red-500/20 transition">Ban</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "scholars" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h1 className="font-black text-xl text-white">Scholar Approval Queue</h1>
              <span className="text-sm text-gray-400">{pendingScholars.length} pending</span>
            </div>
            {pendingScholars.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">✅</div>
                <div className="font-bold text-white text-lg mb-1">All clear!</div>
                <div className="text-gray-400 text-sm">No scholars waiting for approval</div>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingScholars.map(s => (
                  <div key={s.id} className="bg-[#13131a] border border-yellow-500/20 rounded-2xl p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center font-black text-sm text-white shrink-0`}>{s.avatar}</div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-white">{s.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{s.tag}</div>
                      <div className="text-[10px] text-yellow-400 mt-1">Pending verification</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => removeScholar(s.id)} className="px-4 py-2 rounded-xl bg-green-600/20 border border-green-500/30 text-green-400 text-xs font-semibold hover:bg-green-600/30 transition">
                        ✓ Approve
                      </button>
                      <button onClick={() => removeScholar(s.id)} className="px-4 py-2 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-600/30 transition">
                        ✗ Reject
                      </button>
                      <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold hover:bg-white/10 transition">
                        Review Docs
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "content" && (
          <div>
            <h1 className="font-black text-xl text-white mb-5">Content Moderation</h1>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { label: "Pending Review", value: "124", color: "text-yellow-400", icon: "⏳" },
                { label: "Published Today", value: "892", color: "text-green-400", icon: "✓" },
                { label: "Flagged", value: "8", color: "text-red-400", icon: "⚠️" },
              ].map(s => (
                <div key={s.label} className="bg-[#13131a] border border-white/10 rounded-2xl p-5 text-center">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#13131a] border border-white/10 rounded-2xl p-5">
              <div className="font-bold text-sm text-white mb-3">Flagged Content</div>
              <div className="space-y-3">
                {[
                  { title: "Copied NCERT Material", scholar: "Anonymous", reason: "Copyright", time: "2h ago" },
                  { title: "Misleading JEE Tips", scholar: "NewUser", reason: "Misinformation", time: "5h ago" },
                ].map(c => (
                  <div key={c.title} className="flex items-center gap-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                    <div className="text-xl">⚠️</div>
                    <div className="flex-1">
                      <div className="font-semibold text-xs text-white">{c.title}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">by {c.scholar} · {c.reason}</div>
                    </div>
                    <div className="text-[10px] text-gray-500">{c.time}</div>
                    <div className="flex gap-1.5">
                      <button className="px-2 py-1 rounded-lg bg-green-500/10 text-green-400 text-[10px] border border-green-500/20 hover:bg-green-500/20 transition">Keep</button>
                      <button className="px-2 py-1 rounded-lg bg-red-500/10 text-red-400 text-[10px] border border-red-500/20 hover:bg-red-500/20 transition">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
