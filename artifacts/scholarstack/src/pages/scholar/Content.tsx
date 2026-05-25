
import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "../../context/AppContext";

export default function Content() {
  const [, setLocation] = useLocation();
  const { uploads } = useApp();
  const [search, setSearch] = useState("");

  const filtered = uploads.filter(u => u.title.toLowerCase().includes(search.toLowerCase()));

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
          { label: "Total Items", value: uploads.length, color: "text-cyan-400" },
          { label: "Total Sales", value: uploads.reduce((s, u) => s + u.sales, 0).toLocaleString(), color: "text-green-400" },
          { label: "Avg Rating", value: uploads.filter(u => u.rating > 0).length > 0 ? (uploads.filter(u => u.rating > 0).reduce((s, u) => s + u.rating, 0) / uploads.filter(u => u.rating > 0).length).toFixed(1) : "–", color: "text-yellow-400" },
          { label: "Active", value: uploads.filter(u => u.status === "active").length, color: "text-violet-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#13131a] border border-white/10 rounded-2xl p-4 text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mb-4 max-w-sm">
        <span className="text-gray-400 text-xs">⌕</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search content..."
          className="flex-1 bg-transparent outline-none text-xs text-white placeholder-gray-500" />
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
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm shrink-0">
                  {u.type === "PDF" ? "📄" : "🎬"}
                </div>
                <div>
                  <div className="font-semibold text-xs text-white leading-tight">{u.title}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{u.price}</div>
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
                u.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                u.status === "review" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                "bg-red-500/10 text-red-400 border-red-500/20"
              }`}>{u.status}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">No content found</div>
        )}
      </div>
    </div>
  );
}
