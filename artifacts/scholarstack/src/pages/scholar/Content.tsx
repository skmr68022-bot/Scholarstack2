
import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "../../context/AppContext";

export default function Content() {
  const [, setLocation] = useLocation();
  const { uploads, currentUser, refreshUploads } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const myUploads = uploads.filter(u => u.scholarId === currentUser?.id);

  const filtered = myUploads.filter(u =>
    (statusFilter === "all" || u.status === statusFilter) &&
    (search === "" || u.title.toLowerCase().includes(search.toLowerCase()))
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUploads();
    setRefreshing(false);
  };

  const statusColor = (s: string) =>
    s === "live" ? "text-green-400 bg-green-400/10 border-green-400/20" :
    s === "review" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
    "text-red-400 bg-red-400/10 border-red-400/20";

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-black text-xl text-white flex-1">My Content</h1>
        <button onClick={handleRefresh} disabled={refreshing}
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white transition disabled:opacity-50">
          {refreshing ? "…" : "Refresh"}
        </button>
        <button onClick={() => setLocation("/scholar/upload")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-xs font-bold text-white hover:opacity-90 transition">
          + Upload New
        </button>
      </div>

      <div className="flex gap-3 mb-5 items-center">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex-1">
          <span className="text-gray-400 text-xs">⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your content…"
            className="flex-1 bg-transparent outline-none text-xs text-white placeholder-gray-500" />
        </div>
        <div className="flex gap-1">
          {["all", "live", "review", "rejected"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition capitalize ${statusFilter === s ? "bg-cyan-600/30 border-cyan-500/40 text-cyan-300" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📁</p>
          <p className="font-semibold text-white mb-1">
            {myUploads.length === 0 ? "No content yet" : "No results"}
          </p>
          <p className="text-xs text-gray-400 mb-6">
            {myUploads.length === 0 ? "Upload your first note, video, or bundle." : "Try a different filter."}
          </p>
          {myUploads.length === 0 && (
            <button onClick={() => setLocation("/scholar/upload")}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold">
              Upload Content
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-auto rounded-2xl border border-white/8">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/3 border-b border-white/8">
              <tr>
                {["Title", "Type", "Price", "Sales", "Earnings", "Rating", "Status"].map(h => (
                  <th key={h} className="px-4 py-3 text-gray-400 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} className={`border-b border-white/5 hover:bg-white/3 transition ${i % 2 === 0 ? "" : "bg-white/1"}`}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white max-w-xs truncate">{u.title}</p>
                    <p className="text-gray-500 mt-0.5">{u.exam ?? u.category}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">{u.type}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-cyan-400">{u.price}</td>
                  <td className="px-4 py-3 text-gray-300">{u.sales.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 font-semibold text-green-400">{u.earnings}</td>
                  <td className="px-4 py-3">
                    {u.rating > 0 ? (
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-gray-300">{u.rating.toFixed(1)}</span>
                      </span>
                    ) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold capitalize ${statusColor(u.status)}`}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {myUploads.length > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: "Live", value: myUploads.filter(u => u.status === "live").length, color: "text-green-400" },
            { label: "In Review", value: myUploads.filter(u => u.status === "review").length, color: "text-yellow-400" },
            { label: "Rejected", value: myUploads.filter(u => u.status === "rejected").length, color: "text-red-400" },
          ].map(s => (
            <div key={s.label} className="bg-[#13131a] border border-white/8 rounded-xl p-4 text-center">
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
