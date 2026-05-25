
import { useState } from "react";

const reviews = [
  { name:"Priya M.", rating:5, date:"2 days ago", text:"Absolutely brilliant notes! Dr. Rajiv's polity notes are the most comprehensive I've found. Cleared my prelims with 92 marks in polity alone!", avatar:"PM", verified:true },
  { name:"Vikram S.", rating:5, date:"1 week ago", text:"Best structured notes for UPSC. Mind maps are gold. The PYQ section has every question from 2011-2024. Worth every rupee!", avatar:"VS", verified:true },
  { name:"Ananya R.", rating:4, date:"2 weeks ago", text:"Great content overall. Some sections could be more detailed but the shortcut tricks are a lifesaver for MCQs. Highly recommended.", avatar:"AR", verified:false },
];
const relatedNotes = [
  { title:"Indian Economy Notes", price:"₹249", rating:4.8, tag:"Bestseller" },
  { title:"Geography Master Notes", price:"₹199", rating:4.7, tag:"Trending" },
  { title:"History Short Notes", price:"₹149", rating:4.9, tag:"Top Rated" },
  { title:"Science & Tech Notes", price:"₹179", rating:4.6, tag:"New" },
];
const previewPages = [1,2,3,4,5];
const concepts = ["Preamble & Constitution","Fundamental Rights","Directive Principles","Parliamentary System","Federalism","Elections & Voting","Judiciary","Local Self Government","Constitutional Bodies","Emergency Provisions"];

export function NotesPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [purchased, setPurchased] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(1);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/10 px-6 py-3.5 flex items-center gap-4">
        <button className="text-gray-400 hover:text-white transition text-sm">← Browse</button>
        <div className="flex-1 text-sm text-gray-500 truncate">ScholarStack / UPSC / Polity / UPSC Polity Complete Notes 2025</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setBookmarked(!bookmarked)} className={`p-2 rounded-lg border transition text-sm ${bookmarked ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400" : "border-white/10 text-gray-400 hover:text-white"}`}>
            {bookmarked ? "🔖" : "🏷️"}
          </button>
          <button className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white transition text-sm">📤</button>
          <button className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition text-xs">Report</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-3 gap-8">
        {/* LEFT: Main Content */}
        <div className="col-span-2 space-y-7">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/20">UPSC CSE</span>
              <span className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 font-semibold border border-violet-500/20">Polity</span>
              <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 font-semibold border border-yellow-500/20">⭐ Premium Scholar Notes</span>
            </div>
            <h1 className="text-3xl font-black mb-2">UPSC Polity Complete Notes 2025</h1>
            <p className="text-gray-400 text-base">324-page comprehensive coverage of Indian Polity & Constitution. Includes PYQs 2011-2024, mind maps, quick revision sheets & 200+ MCQs.</p>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400">★</span>)}
                </div>
                <span className="font-bold">4.9</span>
                <span className="text-gray-400 text-sm">(12,400 reviews)</span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400 text-sm">🎓 48,240 students</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400 text-sm">📄 324 pages</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400 text-sm">🌐 Hindi + English</span>
            </div>
          </div>

          {/* Scholar Info */}
          <div className="flex items-center gap-4 bg-white/3 border border-white/10 rounded-2xl p-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-black text-2xl shrink-0">RM</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg">Dr. Rajiv Menon</span>
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-semibold">✅ Verified</span>
                <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-1 rounded-full font-semibold">🏅 Gold Scholar</span>
              </div>
              <div className="text-sm text-gray-400 mt-1">IAS Officer (Retd.) • UPSC AIR 7 (2018) • MA Political Science, JNU • Former District Collector, Rajasthan</div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span>👥 62K followers</span>
                <span>⭐ 4.9 avg rating</span>
                <span>🎓 1.2L students</span>
                <span>📚 28 content items</span>
              </div>
            </div>
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold hover:opacity-90 transition shrink-0">+ Follow</button>
          </div>

          {/* Tabs */}
          <div className="border-b border-white/10 flex gap-1">
            {["overview","preview","concepts","reviews","related"].map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-4 py-2.5 text-sm font-semibold capitalize transition border-b-2 -mb-px ${activeTab === t ? "border-violet-500 text-white" : "border-transparent text-gray-400 hover:text-white"}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                {[
                  { title:"📚 Key Concepts", items:["All 22+ Parts of Constitution", "Fundamental Rights (Art 12-35)", "DPSP & Fundamental Duties", "Parliamentary System in depth", "Federalism & Centre-State"] },
                  { title:"🗺️ Mind Maps", items:["Constitutional Amendments map", "Rights vs Duties visual", "Emergency Provisions flow", "Electoral Process diagram", "Judiciary hierarchy chart"] },
                  { title:"⚡ Shortcut Tricks", items:["Article number mnemonics", "Amendment year memory tricks", "Case law shortcuts", "MCQ elimination tactics", "High-frequency topics list"] },
                  { title:"📝 PYQs 2011-2024", items:["200+ solved MCQs", "Essay question approaches", "Topic-wise segregation", "Answer key with explanation", "Difficulty rating per question"] },
                ].map(s => (
                  <div key={s.title} className="bg-white/3 border border-white/10 rounded-2xl p-5">
                    <div className="font-bold text-base mb-3">{s.title}</div>
                    <ul className="space-y-2">
                      {s.items.map(item => (
                        <li key={item} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-violet-400 mt-0.5">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/20 rounded-2xl p-5">
                <div className="font-bold text-base mb-3">🎯 Scholar's Strategy</div>
                <p className="text-sm text-gray-300 leading-relaxed">Polity is the backbone of UPSC GS-2. This note set covers 100% of the static portion with dynamic additions for current constitutional debates. Focus on Part III (Fundamental Rights) and Part IV (DPSP) first — they account for 30-40% of prelims questions. Use the mind maps for last-minute revision and the PYQ section to understand Examiner's pattern...</p>
              </div>
            </div>
          )}

          {activeTab === "preview" && (
            <div>
              <p className="text-sm text-gray-400 mb-4">Preview pages 1-5 (blurred after page 3)</p>
              <div className="flex gap-3 mb-5">
                {previewPages.map(p => (
                  <button key={p} onClick={() => setSelectedPreview(p)}
                    className={`w-10 h-10 rounded-lg border text-sm font-bold transition ${selectedPreview === p ? "border-violet-500 bg-violet-500/20 text-white" : "border-white/10 text-gray-400 hover:border-violet-500/40"}`}>
                    {p}
                  </button>
                ))}
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/3 h-96 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f]" />
                {selectedPreview > 3 && <div className="absolute inset-0 backdrop-blur-xl bg-black/40 flex flex-col items-center justify-center z-10">
                  <div className="text-4xl mb-3">🔒</div>
                  <div className="font-bold text-lg mb-2">Purchase to unlock all 324 pages</div>
                  <div className="text-sm text-gray-400">Get lifetime access for just ₹299</div>
                </div>}
                <div className="p-8 text-center relative z-0 opacity-50">
                  <div className="text-5xl mb-3">📄</div>
                  <div className="font-bold">Page {selectedPreview}</div>
                  <div className="text-sm text-gray-400 mt-1">{selectedPreview === 1 ? "Table of Contents" : selectedPreview === 2 ? "Introduction & Constitution History" : selectedPreview === 3 ? "Preamble Deep Dive" : "Fundamental Rights"}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "concepts" && (
            <div className="grid grid-cols-2 gap-3">
              {concepts.map((c, i) => (
                <div key={c} className="flex items-center gap-3 bg-white/3 border border-white/10 rounded-xl p-4 hover:border-violet-500/30 transition cursor-pointer">
                  <span className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center shrink-0">{i+1}</span>
                  <span className="text-sm font-medium">{c}</span>
                  {purchased ? <span className="ml-auto text-green-400 text-xs">✓</span> : <span className="ml-auto text-gray-500 text-xs">🔒</span>}
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="flex items-center gap-6 bg-white/3 border border-white/10 rounded-2xl p-6">
                <div className="text-center">
                  <div className="text-6xl font-black text-white">4.9</div>
                  <div className="flex justify-center my-2">{[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-xl">★</span>)}</div>
                  <div className="text-xs text-gray-400">12,400 reviews</div>
                </div>
                <div className="flex-1 space-y-2">
                  {[[5,84],[4,12],[3,3],[2,0.5],[1,0.5]].map(([s,p]) => (
                    <div key={s} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-4">{s}★</span>
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{width:`${p}%`}} />
                      </div>
                      <span className="text-xs text-gray-400 w-6">{p}%</span>
                    </div>
                  ))}
                </div>
              </div>
              {reviews.map(r => (
                <div key={r.name} className="bg-white/3 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center font-bold text-sm shrink-0">{r.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{r.name}</span>
                        {r.verified && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-semibold">✓ Verified Purchase</span>}
                        <span className="text-xs text-gray-500 ml-auto">{r.date}</span>
                      </div>
                      <div className="flex mb-2">{[...Array(r.rating)].map((_,i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}</div>
                      <p className="text-sm text-gray-300 leading-relaxed">{r.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "related" && (
            <div className="grid grid-cols-2 gap-4">
              {relatedNotes.map(n => (
                <div key={n.title} className="bg-white/3 border border-white/10 rounded-2xl p-5 hover:border-violet-500/30 transition cursor-pointer flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-xl shrink-0">📄</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{n.title}</div>
                    <div className="text-xs text-yellow-400">⭐ {n.rating}</div>
                    <div className="text-xs text-violet-400 font-bold mt-1">{n.price}</div>
                  </div>
                  <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-1 rounded-full font-semibold">{n.tag}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Purchase Card */}
        <div className="col-span-1 space-y-4">
          <div className="sticky top-24 bg-[#13131a] border border-white/10 rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-center">
              <div className="text-5xl mb-2">📚</div>
              <div className="font-black text-2xl">₹299</div>
              <div className="text-sm text-white/70 line-through">₹799</div>
              <div className="mt-2 text-xs bg-white/20 text-white px-3 py-1.5 rounded-full inline-block font-semibold">🔥 63% OFF — Ends in 05:42:18</div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2 text-sm text-gray-300">
                {["✓ Lifetime access to 324 pages","✓ Printable PDF download","✓ Mind maps & formula sheets","✓ PYQ 2011-2024 with answers","✓ Free updates included","✓ 7-day refund policy"].map(f => <div key={f}>{f}</div>)}
              </div>

              <div className="space-y-3">
                {!purchased ? (
                  <>
                    <button onClick={() => setPurchased(true)} className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-base hover:opacity-90 transition shadow-xl shadow-violet-500/30 hover:scale-[1.02]">
                      🛒 Buy Now — ₹299
                    </button>
                    <button className="w-full py-3 rounded-2xl border border-white/10 text-sm font-semibold hover:bg-white/5 transition">
                      Add to Cart
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 text-center">
                      <div className="text-2xl mb-1">🎉</div>
                      <div className="font-bold text-green-400">Purchased!</div>
                      <div className="text-xs text-gray-400 mt-1">Access unlocked forever</div>
                    </div>
                    <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-sm hover:opacity-90 transition">
                      📥 Download PDF
                    </button>
                  </>
                )}
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="text-xs text-gray-500 mb-3 font-semibold">ACCEPTED PAYMENTS</div>
                <div className="flex flex-wrap gap-2">
                  {["💳 Razorpay","📱 UPI","🏦 Net Banking","💰 Wallet"].map(p => (
                    <span key={p} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/10">{p}</span>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <span>🔒</span> Secure payment via Razorpay
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>↩️</span> 7-day money back guarantee
                </div>
              </div>
            </div>
          </div>

          {/* Scholar mini card */}
          <div className="bg-[#13131a] border border-white/10 rounded-2xl p-5">
            <div className="text-xs text-gray-500 font-semibold mb-3">ABOUT THE SCHOLAR</div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-black text-sm">RM</div>
              <div>
                <div className="font-semibold text-sm">Dr. Rajiv Menon</div>
                <div className="text-xs text-gray-400">IAS AIR 7 • JNU Graduate</div>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl border border-violet-500/30 text-violet-400 text-sm font-semibold hover:bg-violet-500/10 transition">
              View All Notes →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
