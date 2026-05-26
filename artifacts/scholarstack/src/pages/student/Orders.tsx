
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useApp } from "../../context/AppContext";
import { getPurchases } from "../../lib/db";

interface OrderWithNote {
  id: number;
  note_id: number;
  amount: string;
  payment_method: string;
  created_at: string;
  notes: {
    id: number;
    title: string;
    scholar_name: string;
    color: string;
    pages: number;
  } | null;
}

export default function Orders() {
  const [, setLocation] = useLocation();
  const { currentUser } = useApp();
  const [orders, setOrders] = useState<OrderWithNote[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!currentUser) { setFetching(false); return; }
    setFetching(true);
    getPurchases(currentUser.id)
      .then(data => { setOrders(data as OrderWithNote[]); setFetching(false); })
      .catch(() => setFetching(false));
  }, [currentUser]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setLocation("/student")} className="text-gray-400 hover:text-white text-xs">← Home</button>
        <h1 className="font-black text-xl text-white">Purchase History</h1>
      </div>

      {fetching ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🛒</p>
          <p className="font-semibold text-white mb-1">No orders yet</p>
          <p className="text-xs text-gray-400 mb-6">Purchase notes to see them here.</p>
          <button onClick={() => setLocation("/student/notes")}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold">
            Browse Notes
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => (
            <div key={order.id} className="bg-[#13131a] border border-white/8 rounded-2xl p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${order.notes?.color ?? "bg-violet-500"} flex items-center justify-center shrink-0 text-white font-black text-sm`}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-white truncate">{order.notes?.title ?? "Unknown Note"}</p>
                <p className="text-xs text-gray-400">{order.notes?.scholar_name ?? ""} · {order.notes?.pages ?? "—"} pages</p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  {" · "}{order.payment_method.toUpperCase()}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-black text-violet-400">{order.amount}</p>
                <span className="text-[9px] text-green-400 font-semibold bg-green-400/10 px-2 py-0.5 rounded-full">Paid</span>
              </div>
              <button onClick={() => setLocation(`/student/notes/${order.note_id}`)}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/10 transition">
                Open
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
