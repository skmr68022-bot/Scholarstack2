
import { useLocation } from "wouter";
import { notes } from "../../data/constants";
import { useApp } from "../../context/AppContext";

export default function Library() {
  const [, setLocation] = useLocation();
  const { purchased } = useApp();
  const myNotes = notes.filter(n => purchased.has(n.id));

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setLocation("/student")} className="text-gray-400 hover:text-white transition text-xs">← Home</button>
        <h1 className="font-black text-xl text-white flex-1">My Library</h1>
        <span className="text-xs text-gray-400">{myNotes.length} items</span>
      </div>

      {myNotes.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-7xl mb-5">📚</div>
          <div className="font-bold text-xl text-white mb-2">Your library is empty</div>
          <div className="text-gray-400 text-sm mb-8">Purchase notes to access them anytime, forever</div>
          <button onClick={() => setLocation("/student/notes")} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-bold text-white hover:opacity-90 transition">
            Browse Notes →
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            {myNotes.map(n => (
              <div key={n.id} className="bg-[#13131a] border border-green-500/20 rounded-2xl overflow-hidden cursor-pointer hover:border-green-500/40 transition group"
                onClick={() => setLocation(`/student/notes/${n.id}`)}>
                <div className="h-24 flex items-center justify-center relative overflow-hidden">
                  <div className={`absolute inset-0 ${n.color} opacity-30`} />
                  <span className="relative text-4xl">📄</span>
                  <div className="absolute top-2 right-2 bg-green-500/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">OWNED</div>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-xs text-white mb-1 line-clamp-2">{n.title}</div>
                  <div className="text-[10px] text-gray-400 mb-1">{n.scholar}</div>
                  <div className="text-[10px] text-gray-500 mb-3">{n.pages} pages · {n.exam}</div>
                  <button className="w-full py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-xs font-bold text-white hover:opacity-90 transition">
                    📥 Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[#13131a] border border-white/10 rounded-2xl p-5">
            <div className="font-bold text-sm text-white mb-3">Storage Summary</div>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="text-center"><div className="font-black text-2xl text-violet-400">{myNotes.length}</div><div className="text-xs text-gray-500">Notes</div></div>
              <div className="text-center"><div className="font-black text-2xl text-cyan-400">{myNotes.reduce((s, n) => s + n.pages, 0)}</div><div className="text-xs text-gray-500">Total Pages</div></div>
              <div className="text-center"><div className="font-black text-2xl text-green-400">{myNotes.filter(n => n.price === "Free").length}</div><div className="text-xs text-gray-500">Free Items</div></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
