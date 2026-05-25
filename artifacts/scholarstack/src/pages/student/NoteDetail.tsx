
import { useParams, useLocation } from "wouter";
import { notes } from "../../data/constants";
import { useApp } from "../../context/AppContext";

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { purchased, addPurchased, bookmarked, toggleBookmark } = useApp();
  const note = notes.find(n => n.id === Number(id)) ?? notes[0];
  const isPurchased = purchased.has(note.id);
  const isBookmarked = bookmarked.has(note.id);

  return (
    <div className="p-6 max-w-4xl">
      <button onClick={() => setLocation("/student/notes")} className="text-gray-400 hover:text-white transition text-xs mb-4 flex items-center gap-1">
        ← Browse Notes
      </button>

      <div className="grid grid-cols-3 gap-6">
        {/* Main content */}
        <div className="col-span-2 space-y-5">
          <div>
            <div className="flex gap-2 mb-3">
              <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 font-semibold">{note.exam}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-400 font-semibold">{note.tag}</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-2">{note.title}</h1>
            <p className="text-gray-400 text-sm">Comprehensive {note.pages}-page notes. Includes PYQs, mind maps & quick revision sheets for complete exam preparation.</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <span>⭐ {note.rating} ({note.reviews.toLocaleString()} reviews)</span>
              <span>📄 {note.pages} pages</span>
              <span>Language: Hindi + English</span>
            </div>
          </div>

          {/* Scholar */}
          <div className="flex items-center gap-4 bg-white/3 border border-white/10 rounded-2xl p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-black text-sm shrink-0 text-white">RM</div>
            <div className="flex-1">
              <div className="font-bold text-sm text-white">{note.scholar}</div>
              <div className="text-xs text-gray-400">IAS Officer · UPSC AIR 7 · JNU Graduate</div>
              <div className="flex gap-3 mt-1 text-xs text-gray-400">
                <span>👥 62K students</span>
                <span>⭐ 4.9</span>
                <span>28 notes</span>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-semibold text-white hover:opacity-90 transition">
              + Follow
            </button>
          </div>

          {/* What's included */}
          <div className="bg-white/3 border border-white/10 rounded-2xl p-5">
            <div className="font-bold text-sm text-white mb-3">What's Included</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                `Complete ${note.pages}-page PDF`,
                "Mind maps & diagrams",
                "PYQs 2011–2024",
                "Shortcut tricks",
                "Formula sheets",
                "Revision checklist",
                "Lifetime access",
                "Free future updates",
              ].map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-gray-300">
                  <span className="text-violet-400">✓</span>{f}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <div className="font-bold text-sm text-white mb-3">Student Reviews</div>
            <div className="space-y-3">
              {[
                { n: "Priya M.", r: 5, t: "Best structured notes for UPSC! Cleared my prelims with these.", time: "2 days ago" },
                { n: "Rahul K.", r: 5, t: "Mind maps are gold. The PYQ section is incredibly detailed.", time: "1 week ago" },
                { n: "Ananya S.", r: 4, t: "Very comprehensive. The revision sheets are super handy.", time: "2 weeks ago" },
              ].map(rev => (
                <div key={rev.n} className="bg-white/3 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center font-bold text-xs shrink-0 text-white">{rev.n[0]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-xs text-white">{rev.n}</span>
                        <span className="text-yellow-400 text-xs">{"★".repeat(rev.r)}</span>
                        <span className="text-[10px] text-gray-500 ml-auto">{rev.time}</span>
                      </div>
                      <p className="text-xs text-gray-300">{rev.t}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Purchase card */}
        <div className="col-span-1">
          <div className="sticky top-6 bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-5 text-center">
              <div className="text-4xl mb-2">📚</div>
              <div className="font-black text-2xl text-white">{note.price}</div>
              {note.original && <div className="text-sm text-white/60 line-through">{note.original}</div>}
              {note.original && (
                <div className="mt-1.5 text-xs bg-white/20 text-white px-3 py-1 rounded-full inline-block font-semibold">63% OFF</div>
              )}
            </div>
            <div className="p-5 space-y-3">
              <div className="space-y-1.5 text-xs text-gray-300">
                {["Lifetime PDF access", "Printable download", "Free updates", "7-day refund policy"].map(f => (
                  <div key={f} className="flex items-center gap-2"><span className="text-violet-400">✓</span>{f}</div>
                ))}
              </div>
              {isPurchased ? (
                <>
                  <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 text-center">
                    <div className="text-xl mb-1">🎉</div>
                    <div className="font-bold text-green-400 text-xs">Purchased!</div>
                  </div>
                  <button onClick={() => setLocation("/student/library")} className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-xs hover:opacity-90 transition">
                    📥 Go to Library
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => addPurchased(note.id)}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-sm hover:opacity-90 transition hover:scale-[1.01]"
                  >
                    {note.price === "Free" ? "Access Free →" : `Buy Now — ${note.price}`}
                  </button>
                  <button
                    onClick={() => toggleBookmark(note.id)}
                    className={`w-full py-2.5 rounded-xl border text-xs font-semibold transition ${isBookmarked ? "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" : "border-white/10 text-gray-300 hover:bg-white/5"}`}
                  >
                    {isBookmarked ? "🔖 Bookmarked" : "Add to Wishlist"}
                  </button>
                </>
              )}
              <div className="border-t border-white/10 pt-3">
                <div className="text-[10px] text-gray-500 mb-2 font-semibold">ACCEPTED PAYMENTS</div>
                <div className="flex flex-wrap gap-1.5">
                  {["Razorpay", "UPI", "NetBanking"].map(p => (
                    <span key={p} className="text-[10px] px-2 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/10">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
