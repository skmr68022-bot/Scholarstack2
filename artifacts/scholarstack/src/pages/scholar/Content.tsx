
import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "../../context/AppContext";

export default function Content() {
  const [, setLocation] = useLocation();
  const { uploads, currentUser } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const myUploads = uploads.filter(u =>
    (!u.scholarId || u.scholarId === currentUser?.id || u.scholarId?.startsWith("scholar-demo"))
  );

  const filtered = myUploads.filter(u =>
    u.title.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "all" || u.status === statusFilter)
  );

  const live = myUploads.filter(u => u.status === "live").length;
  const review = myUploads.filter(u => u.status === "review").length;
  const rejected = myUploads.filter(u => u.status === "rejected").length;

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setLocation("/scholar")} className="text-gray-400 hover:text-white transition text-xs">← Dashboard</button>
        <h1 className="font-black text-xl text-white flex-1">My Content</h1>
        <button onClick={() => setLocation("/scholar/upload")} className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-xs font-semibold text-white hover:opacity-90 transition">
          + Upload New
        </button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Items", value: myUploads.length, color: "text-cyan-400" },
          { label: "Live", value: live, color: "text-green-400" },
          { label: "In Review", value: review, color: "text-yellow-400" },
          { label: "Total Sales", value: myUploads.reduce((s, u) => s + u.sales, 0).toLocaleString(), color: "text-violet-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#13131a] border border-white/10 rounded-2xl p-4 text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Admin pipeline notice */}
      {review > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
          <span className="text-yellow-400">⏳</span>
          <p className="text-xs text-yellow-200">
            <span className="font-bold">{review} item{review > 1 ? "s" : ""}</span> pending admin review. Once approved, {review > 1 ? "they" : "it"} will appear in student browse pages automatically.
          </p>
        </div>
      )}
      {rejected > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
          <span className="text-red-400">✗</span>
          <p className="text-xs text-red-200">
            <span className="font-bold">{rejected} item{rejected > 1 ? "s" : ""}</span> rejected by admin. Please review and re-upload with improvements.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 flex-1 max-w-sm">
          <span className="text-gray-400 text-xs">⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search content..."
            className="flex-1 bg-transparent outline-none text-xs text-white placeholder-gray-500" />
        </div>
        <div className="flex gap-2">
          {[
            { key: "all", label: "All" },
            { key: "live", label: "Live" },
            { key: "review", label: "In Review" },
            { key: "rejected", label: "Rejected" },
          ].map(f => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${statusFilter === f.key ? "bg-white/10 text-white border-white/20" : "border-white/10 text-gray-400 hover:border-white/20"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          <div className="col-span-4">Content</div>
          <div className="col-span-2 text-center">Type</div>
          <div className="col-span-2 text-center">Sales</div>
          <div className="col-span-2 text-center">Earnings</div>
          <div className="col-span-1 text-center">Rating</div>
          <div className="col-span-1 text-center">Status</div>
        </div>
        {filtered.map(u => (
          <div key={u.id} className="grid grid-cols-12 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition items-center">
            <div className="col-span-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${u.color || "bg-gradient-to-br from-cyan-400 to-blue-500"} flex items-center justify-center text-sm shrink-0`}>
                  {u.type === "PDF" ? "📄" : u.type === "Video" ? "🎬" : "📦"}
                </div>
                <div>
                  <div className="font-semibold text-xs text-white leading-tight">{u.title}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{u.price} {u.exam ? `· ${u.exam}` : ""}</div>
                </div>
              </div>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">{u.type}</span>
            </div>
            <div className="col-span-2 text-center font-bold text-sm text-white">{u.sales.toLocaleString()}</div>
            <div className="col-span-2 text-center font-bold text-sm text-green-400">{u.earnings}</div>
            <div className="col-span-1 text-center text-xs text-yellow-400">{u.rating > 0 ? `⭐ ${u.rating}` : "–"}</div>
            <div className="col-span-1 text-center">
              <span className={`text-[10px] px-2 py-1 rounded-full font-bold border ${
                u.status === "live" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                u.status === "review" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                "bg-red-500/10 text-red-400 border-red-500/20"
              }`}>
                {u.status === "review" ? "⏳ review" : u.status === "live" ? "✓ live" : "✗ rejected"}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            {myUploads.length === 0 ? (
              <div>
                <div className="text-4xl mb-3">📤</div>
                <div className="font-semibold text-white mb-1">No content yet</div>
                <button onClick={() => setLocation("/scholar/upload")} className="mt-3 px-4 py-2 rounded-xl bg-cyan-600/20 text-cyan-400 text-xs font-semibold border border-cyan-500/20 hover:bg-cyan-600/30 transition">
                  Upload your first content →
                </button>
              </div>
            ) : "No content matches your search"}
          </div>
        )}
      </div>
    </div>
  );
}
