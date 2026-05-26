
import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "../context/AppContext";

type AdminTab = "overview" | "users" | "scholars" | "content";

export default function Admin() {
  const [, setLocation] = useLocation();
  const {
    currentUser, uploads, pendingScholars, users,
    approveContent, rejectContent, removeScholar, approveScholar, banUser, logout,
  } = useApp();

  const [tab, setTab] = useState<AdminTab>("overview");
  const [actioning, setActioning] = useState<number | null>(null);

  const pendingContent = uploads.filter(u => u.status === "review");
  const liveContent = uploads.filter(u => u.status === "live");

  const handleApprove = async (id: number) => {
    setActioning(id);
    await approveContent(id);
    setActioning(null);
  };

  const handleReject = async (id: number) => {
    setActioning(id);
    await rejectContent(id);
    setActioning(null);
  };

  const handleApproveScholar = async (id: number) => {
    setActioning(id);
    await approveScholar(id);
    setActioning(null);
  };

  const handleRejectScholar = async (id: number) => {
    setActioning(id);
    await removeScholar(id);
    setActioning(null);
  };

  const handleBan = async (id: number) => {
    setActioning(id);
    await banUser(id);
    setActioning(null);
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/role");
  };

  const tabs: { id: AdminTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "scholars", label: `Scholar Queue (${pendingScholars.length})` },
    { id: "content", label: `Content Queue (${pendingContent.length})` },
  ];

  return (
    <div className="min-h-screen bg-[#070709] flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-white/8 bg-[#0a0a0f]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-black text-sm">S</div>
          <span className="font-black text-base text-white">ScholarStack Admin</span>
        </div>
        <div className="flex gap-1 ml-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${tab === t.id ? "bg-gradient-to-r from-red-600 to-orange-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-gray-400">{currentUser?.name ?? "Admin"}</span>
          <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-300 hover:text-white border border-white/10 transition">
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6">

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div>
            <h1 className="font-black text-xl text-white mb-5">Platform Overview</h1>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Users", value: String(users.length), trend: "registered", color: "text-violet-400" },
                { label: "Content Pending", value: String(pendingContent.length), trend: pendingContent.length > 0 ? "needs review" : "all clear", color: pendingContent.length > 0 ? "text-red-400" : "text-green-400" },
                { label: "Live Notes", value: String(liveContent.length), trend: "published", color: "text-green-400" },
                { label: "Scholar Queue", value: String(pendingScholars.length), trend: "pending approval", color: "text-yellow-400" },
                { label: "Total Content", value: String(uploads.length), trend: "all time", color: "text-cyan-400" },
                { label: "Rejected", value: String(uploads.filter(u => u.status === "rejected").length), trend: "content items", color: "text-red-400" },
              ].map(s => (
                <div key={s.label} className="bg-[#13131a] border border-white/10 rounded-xl p-4">
                  <div className={`font-black text-2xl ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                  <div className="text-[10px] text-gray-500 mt-1">{s.trend}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-[#13131a] border border-white/8 rounded-2xl p-5">
                <p className="text-xs font-semibold text-gray-400 mb-3">Quick Actions</p>
                <div className="space-y-2">
                  <button onClick={() => setTab("content")}
                    className="w-full text-left px-4 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-300 hover:bg-yellow-500/20 transition">
                    Review {pendingContent.length} pending content items →
                  </button>
                  <button onClick={() => setTab("scholars")}
                    className="w-full text-left px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 hover:bg-blue-500/20 transition">
                    Review {pendingScholars.length} scholar applications →
                  </button>
                </div>
              </div>
              <div className="bg-[#13131a] border border-white/8 rounded-2xl p-5">
                <p className="text-xs font-semibold text-gray-400 mb-3">Admin Guide</p>
                <div className="space-y-1.5 text-xs text-gray-400">
                  <p>• Approving content makes it immediately live for students</p>
                  <p>• Rejecting removes it from public view</p>
                  <p>• Scholar approvals verify their accounts</p>
                  <p>• Set admin role via Supabase SQL editor</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Users ── */}
        {tab === "users" && (
          <div>
            <h1 className="font-black text-xl text-white mb-5">User Management
              <span className="ml-2 text-sm text-gray-400 font-normal">({users.length} registered)</span>
            </h1>
            {users.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p className="text-4xl mb-3">👤</p>
                <p className="font-semibold">No users yet</p>
                <p className="text-xs mt-1">Users will appear here once they sign up.</p>
              </div>
            ) : (
              <div className="bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-12 px-5 py-3 border-b border-white/10 text-[10px] font-bold text-gray-400 uppercase">
                  <div className="col-span-3">User</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2 text-center">Role</div>
                  <div className="col-span-2 text-center">Plan</div>
                  <div className="col-span-2 text-center">Actions</div>
                </div>
                {users.map(u => (
                  <div key={u.id} className="grid grid-cols-12 px-5 py-4 border-b border-white/5 last:border-0 items-center hover:bg-white/3 transition">
                    <div className="col-span-3 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {u.name[0]?.toUpperCase()}
                      </div>
                      <div className="font-semibold text-xs text-white truncate">{u.name}</div>
                    </div>
                    <div className="col-span-3 text-[10px] text-gray-400 truncate">{u.email}</div>
                    <div className="col-span-2 text-center">
                      <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10 capitalize">{u.role}</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-bold">{u.plan}</span>
                    </div>
                    <div className="col-span-2 flex gap-1.5 justify-center">
                      {u.role.toLowerCase() !== "admin" && (
                        <button
                          onClick={() => handleBan(u.id)}
                          disabled={actioning === u.id}
                          className="px-2 py-1 rounded-lg bg-red-500/10 text-[10px] text-red-400 border border-red-500/20 hover:bg-red-500/20 transition disabled:opacity-50">
                          {actioning === u.id ? "…" : "Ban"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Scholar Queue ── */}
        {tab === "scholars" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h1 className="font-black text-xl text-white">Scholar Approval Queue</h1>
              <span className="text-sm text-gray-400">{pendingScholars.length} pending</span>
            </div>
            {pendingScholars.length === 0 ? (
              <div className="text-center py-16 bg-[#13131a] border border-white/8 rounded-2xl">
                <div className="text-5xl mb-3">✅</div>
                <div className="font-bold text-white text-lg mb-1">All clear!</div>
                <div className="text-gray-400 text-sm">No scholars waiting for approval</div>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingScholars.map(s => (
                  <div key={s.id} className="bg-[#13131a] border border-yellow-500/20 rounded-2xl p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center font-black text-sm text-white shrink-0`}>
                      {s.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-white">{s.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{s.tag}</div>
                      <div className="text-[10px] text-yellow-400 mt-1">Pending verification</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveScholar(s.id)}
                        disabled={actioning === s.id}
                        className="px-4 py-2 rounded-xl bg-green-600/20 border border-green-500/30 text-green-400 text-xs font-semibold hover:bg-green-600/30 transition disabled:opacity-50">
                        {actioning === s.id ? "…" : "✓ Approve"}
                      </button>
                      <button
                        onClick={() => handleRejectScholar(s.id)}
                        disabled={actioning === s.id}
                        className="px-4 py-2 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-600/30 transition disabled:opacity-50">
                        {actioning === s.id ? "…" : "✗ Reject"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Content Queue ── */}
        {tab === "content" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-black text-xl text-white">Content Approval Queue</h1>
            </div>
            <p className="text-xs text-gray-400 mb-5">
              Approved items immediately appear in student browse pages. Rejected items are hidden.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Pending Review", value: pendingContent.length, color: "text-yellow-400", border: "border-yellow-500/20" },
                { label: "Live on Platform", value: liveContent.length, color: "text-green-400", border: "border-green-500/20" },
                { label: "Rejected", value: uploads.filter(u => u.status === "rejected").length, color: "text-red-400", border: "border-red-500/20" },
              ].map(s => (
                <div key={s.label} className={`bg-[#13131a] border ${s.border} rounded-2xl p-5 text-center`}>
                  <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {pendingContent.length === 0 ? (
              <div className="text-center py-16 bg-[#13131a] border border-white/10 rounded-2xl">
                <div className="text-5xl mb-3">✅</div>
                <div className="font-bold text-white text-lg mb-1">Queue is empty</div>
                <div className="text-gray-400 text-sm">All content has been reviewed</div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Awaiting Your Approval</div>
                {pendingContent.map(item => {
                  const ago = item.submittedAt ? Math.round((Date.now() - item.submittedAt) / 3600000) : 0;
                  return (
                    <div key={item.id} className="bg-[#13131a] border border-yellow-500/20 rounded-2xl p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${item.color ?? "bg-violet-500"} opacity-80 flex items-center justify-center text-2xl shrink-0`}>
                          {item.type === "PDF" ? "📄" : item.type === "Video" ? "🎬" : "📦"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-white mb-1">{item.title}</div>
                          <div className="text-xs text-gray-400 mb-1">by <span className="text-gray-200">{item.scholar}</span></div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</div>
                          )}
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">{item.type}</span>
                            {item.exam && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">{item.exam}</span>}
                            {item.pages && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">{item.pages} pages</span>}
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-bold">{item.price}</span>
                            {ago > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">{ago}h ago</span>}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          {item.fileUrl && (
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold hover:bg-blue-600/30 transition whitespace-nowrap text-center">
                              Preview File
                            </a>
                          )}
                          <button
                            onClick={() => handleApprove(item.id)}
                            disabled={actioning === item.id}
                            className="px-5 py-2.5 rounded-xl bg-green-600/20 border border-green-500/30 text-green-400 text-xs font-bold hover:bg-green-600/30 transition whitespace-nowrap disabled:opacity-50">
                            {actioning === item.id ? "…" : "✓ Approve & Publish"}
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            disabled={actioning === item.id}
                            className="px-5 py-2.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-600/30 transition disabled:opacity-50">
                            {actioning === item.id ? "…" : "✗ Reject"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {liveContent.length > 0 && (
              <div className="mt-6">
                <div className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">Live on Platform</div>
                <div className="bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden">
                  {liveContent.map((item, i) => (
                    <div key={item.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < liveContent.length - 1 ? "border-b border-white/5" : ""} hover:bg-white/2 transition`}>
                      <span className="text-lg">{item.type === "PDF" ? "📄" : "🎬"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{item.title}</div>
                        <div className="text-[10px] text-gray-400">{item.scholar} · {item.exam ?? item.category} · {item.price}</div>
                      </div>
                      <span className="text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-bold shrink-0">live</span>
                      <button
                        onClick={() => handleReject(item.id)}
                        disabled={actioning === item.id}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-[10px] border border-red-500/20 hover:bg-red-500/20 transition shrink-0 disabled:opacity-50">
                        {actioning === item.id ? "…" : "Unpublish"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
