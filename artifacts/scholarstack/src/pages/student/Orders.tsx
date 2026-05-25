
import { useLocation } from "wouter";
import { notes } from "../../data/constants";
import { useApp } from "../../context/AppContext";

export default function Orders() {
  const [, setLocation] = useLocation();
  const { purchased } = useApp();
  const myOrders = notes.filter(n => purchased.has(n.id));

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setLocation("/student")} className="text-gray-400 hover:text-white transition text-xs">← Home</button>
        <h1 className="font-black text-xl text-white flex-1">My Orders</h1>
        <span className="text-xs text-gray-400">{myOrders.length} orders</span>
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-7xl mb-5">🛒</div>
          <div className="font-bold text-xl text-white mb-2">No orders yet</div>
          <div className="text-gray-400 text-sm mb-8">Your purchase history will appear here</div>
          <button onClick={() => setLocation("/student/notes")} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-bold text-white hover:opacity-90 transition">
            Browse Notes →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {myOrders.map((n, i) => (
            <div key={n.id} className="bg-[#13131a] border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:border-white/20 transition">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 relative overflow-hidden`}>
                <div className={`absolute inset-0 ${n.color} opacity-50`} />
                <span className="relative">📄</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-white truncate">{n.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{n.scholar} · {n.exam}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">Order #{String(1000 + i).padStart(6, "0")} · {n.pages} pages</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-black text-sm text-green-400">{n.price === "Free" ? "Free" : n.price}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">Purchased</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-xs font-bold text-white hover:opacity-90 transition">
                  📥 Download
                </button>
                <button onClick={() => setLocation(`/student/notes/${n.id}`)} className="px-3 py-2 rounded-lg bg-white/5 text-xs font-semibold text-gray-300 hover:bg-white/10 transition border border-white/10">
                  View
                </button>
              </div>
            </div>
          ))}

          <div className="mt-4 bg-[#13131a] border border-white/10 rounded-2xl p-5">
            <div className="font-bold text-sm text-white mb-3">Order Summary</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Total spent</span>
              <span className="font-black text-white">
                ₹{myOrders.filter(n => n.price !== "Free").reduce((s, n) => s + parseInt(n.price.replace("₹", "")), 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-400">Free items</span>
              <span className="font-bold text-green-400">{myOrders.filter(n => n.price === "Free").length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
