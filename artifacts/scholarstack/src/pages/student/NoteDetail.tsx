
import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { notes } from "../../data/constants";
import { useApp } from "../../context/AppContext";
import type { UploadItem } from "../../context/AppContext";
import type { Note } from "../../data/constants";

/* ─── unified shape ──────────────────────────────────────── */
interface NoteView {
  id: number;
  title: string;
  scholar: string;
  price: string;
  original: string;
  rating: number;
  reviews: number;
  tag: string;
  exam: string;
  pages: number;
  color: string;
  description: string;
  category: string;
}

function toView(n: Note): NoteView {
  return {
    id: n.id, title: n.title, scholar: n.scholar, price: n.price,
    original: n.original, rating: n.rating, reviews: n.reviews,
    tag: n.tag, exam: n.exam, pages: n.pages, color: n.color,
    description: `Comprehensive ${n.pages}-page notes covering all key topics for ${n.exam}. Includes PYQs, mind maps, formula sheets, and quick-revision checklists. Prepared by ${n.scholar}.`,
    category: n.category,
  };
}

function uploadToView(u: UploadItem): NoteView {
  return {
    id: u.id, title: u.title, scholar: u.scholar || "Scholar",
    price: u.price, original: u.original || "",
    rating: u.rating, reviews: u.reviews,
    tag: u.tag || "New", exam: u.exam || "",
    pages: u.pages || 100, color: u.color || "bg-violet-500",
    description: u.description || `${u.pages || 100}-page comprehensive notes by ${u.scholar}.`,
    category: u.category || "competitive",
  };
}

/* ─── mock PDF pages ─────────────────────────────────────── */
function getPages(note: NoteView): string[] {
  const base = note.title;
  return [
    `📖  ${base}\n\nTable of Contents\n\n1. Introduction & Overview\n2. Core Concepts & Theory\n3. Important Formulas & Shortcuts\n4. Previous Year Questions\n5. Mind Maps & Diagrams\n6. Quick Revision Checklist`,
    `Chapter 1: Introduction & Overview\n\nThis chapter provides a foundational understanding of ${note.exam} concepts. You will learn the historical context, exam pattern, and the most efficient preparation strategy.\n\nKey Points:\n• Exam pattern analysis 2020–2024\n• High-weightage topics identified\n• Time allocation per topic\n• Recommended study schedule`,
    `Chapter 2: Core Concepts & Theory\n\nThis section covers the essential theoretical framework. Each concept is explained with real examples and exam-oriented explanations.\n\n▸ Concept A: Detailed explanation with examples from PYQs\n▸ Concept B: Step-by-step breakdown with diagrams\n▸ Concept C: Common mistakes to avoid\n▸ Concept D: Examiner's perspective and scoring tips`,
    `Chapter 3: Important Formulas & Shortcuts\n\nAll key formulas, tricks, and memory shortcuts compiled in one place for quick revision.\n\n✦ Formula 1: [Key formula for topic 1]\n✦ Formula 2: [Key formula for topic 2]\n✦ Shortcut Trick: [Memory technique]\n✦ Mnemonic: [Easy to remember pattern]\n\nPractice Problems: 25 solved examples`,
    `Chapter 4: Previous Year Questions\n\nAnalysis of last 10 years of exam questions with detailed solutions and examiner comments.\n\n2024: [Sample PYQ with solution]\n2023: [Sample PYQ with solution]\n2022: [Sample PYQ with solution]\n\nPattern Analysis:\n• Topic A appears in 8/10 years\n• Topic B is high-frequency in recent exams\n• Expected questions for upcoming exam`,
    `Chapter 5: Mind Maps & Quick Revision\n\n[Mind Map: Central topic → Sub-topics → Key points]\n\nQuick Revision Checklist:\n☐ Core theory revised\n☐ All formulas memorised\n☐ PYQs attempted\n☐ Weak areas identified\n☐ Mock test completed\n\nFinal Tips:\n• Revise 3 times minimum\n• Focus on high-weightage topics\n• Stay consistent with schedule`,
  ];
}

/* ─── Payment Modal ──────────────────────────────────────── */
type PayMethod = "upi" | "card" | "netbanking" | "wallet";

function PaymentModal({ note, onClose, onSuccess }: {
  note: NoteView;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [method, setMethod] = useState<PayMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bank, setBank] = useState("SBI");
  const [wallet, setWallet] = useState("Paytm");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const pay = () => {
    setProcessing(true);
    setTimeout(() => { setDone(true); }, 1800);
    setTimeout(() => { onSuccess(); onClose(); }, 3200);
  };

  const canPay = method === "upi" ? upiId.includes("@")
    : method === "card" ? cardNo.replace(/\s/g, "").length === 16 && expiry.length === 5 && cvv.length === 3
    : true;

  const discount = note.original
    ? Math.round((1 - parseInt(note.price.replace("₹", "")) / parseInt(note.original.replace("₹", ""))) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#12121a] border border-white/15 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-white/70 font-medium mb-0.5">Secure Checkout</div>
              <div className="font-black text-xl text-white">{note.price}</div>
              {note.original && (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-white/50 line-through">{note.original}</span>
                  <span className="text-[10px] bg-green-400/20 text-green-300 px-2 py-0.5 rounded-full font-bold">{discount}% OFF</span>
                </div>
              )}
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition text-sm">✕</button>
          </div>
          <div className="text-[10px] text-white/60 mt-2 truncate">{note.title}</div>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <div className="font-black text-lg text-white mb-1">Payment Successful!</div>
            <div className="text-xs text-gray-400">Adding to your library…</div>
            <div className="mt-4 flex justify-center">
              <div className="w-6 h-6 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
            </div>
          </div>
        ) : processing ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-violet-500/20 border-2 border-violet-500/40 flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
            </div>
            <div className="font-black text-lg text-white mb-1">Processing Payment…</div>
            <div className="text-xs text-gray-400">Please do not close this window</div>
          </div>
        ) : (
          <div className="p-6">
            {/* Method tabs */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              {([
                { key: "upi", icon: "⚡", label: "UPI" },
                { key: "card", icon: "💳", label: "Card" },
                { key: "netbanking", icon: "🏦", label: "Net Banking" },
                { key: "wallet", icon: "👛", label: "Wallet" },
              ] as { key: PayMethod; icon: string; label: string }[]).map(m => (
                <button key={m.key} onClick={() => setMethod(m.key)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-[10px] font-semibold transition ${method === m.key ? "bg-violet-600/20 border-violet-500/40 text-violet-400" : "border-white/10 text-gray-400 hover:border-white/20 bg-white/3"}`}>
                  <span className="text-lg">{m.icon}</span>{m.label}
                </button>
              ))}
            </div>

            {method === "upi" && (
              <div>
                <label className="text-[10px] text-gray-400 font-semibold block mb-2">UPI ID</label>
                <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition" />
                <div className="mt-3 flex gap-2 flex-wrap">
                  {["GPay", "PhonePe", "Paytm", "BHIM"].map(a => (
                    <button key={a} onClick={() => setUpiId(`${a.toLowerCase()}@upi`)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 transition">{a}</button>
                  ))}
                </div>
              </div>
            )}
            {method === "card" && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-gray-400 font-semibold block mb-1.5">Card Number</label>
                  <input value={cardNo} onChange={e => setCardNo(e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19))}
                    placeholder="1234 5678 9012 3456" maxLength={19}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-400 font-semibold block mb-1.5">Expiry</label>
                    <input value={expiry} onChange={e => {
                      let v = e.target.value.replace(/\D/g, "");
                      if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                      setExpiry(v);
                    }} placeholder="MM/YY" maxLength={5}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-semibold block mb-1.5">CVV</label>
                    <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      placeholder="•••" maxLength={3} type="password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition" />
                  </div>
                </div>
              </div>
            )}
            {method === "netbanking" && (
              <div>
                <label className="text-[10px] text-gray-400 font-semibold block mb-2">Select Bank</label>
                <div className="grid grid-cols-3 gap-2">
                  {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB"].map(b => (
                    <button key={b} onClick={() => setBank(b)}
                      className={`py-2.5 rounded-xl border text-xs font-semibold transition ${bank === b ? "bg-violet-600/20 border-violet-500/40 text-violet-400" : "border-white/10 text-gray-400 bg-white/3 hover:border-white/20"}`}>{b}</button>
                  ))}
                </div>
              </div>
            )}
            {method === "wallet" && (
              <div>
                <label className="text-[10px] text-gray-400 font-semibold block mb-2">Select Wallet</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Paytm", "PhonePe", "Amazon Pay", "Mobikwik", "Freecharge", "JioMoney"].map(w => (
                    <button key={w} onClick={() => setWallet(w)}
                      className={`py-2.5 rounded-xl border text-xs font-semibold transition ${wallet === w ? "bg-violet-600/20 border-violet-500/40 text-violet-400" : "border-white/10 text-gray-400 bg-white/3 hover:border-white/20"}`}>{w}</button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={pay} disabled={!canPay}
              className="w-full mt-5 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-sm hover:opacity-90 transition hover:scale-[1.01] disabled:opacity-40 disabled:scale-100">
              Pay {note.price} Securely →
            </button>
            <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-gray-500">
              <span>🔒 256-bit SSL</span>
              <span>•</span>
              <span>Secured by Razorpay</span>
              <span>•</span>
              <span>7-day refund</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── PDF Viewer Modal ───────────────────────────────────── */
function PDFViewer({ note, onClose, onDownload }: {
  note: NoteView;
  onClose: () => void;
  onDownload: () => void;
}) {
  const pages = getPages(note);
  const [page, setPage] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => { setDownloading(false); setDownloaded(true); onDownload(); }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#12121a] border border-white/15 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col" style={{ maxHeight: "90vh" }}>
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-white truncate">{note.title}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{note.pages} pages · {note.scholar}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDownload} disabled={downloading}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${downloaded ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/5 border border-white/15 text-gray-300 hover:bg-white/10"}`}>
              {downloading ? (
                <><span className="w-3 h-3 border border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />Downloading…</>
              ) : downloaded ? (
                <>✓ Downloaded</>
              ) : (
                <>📥 Download PDF</>
              )}
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-gray-300 transition text-sm">✕</button>
          </div>
        </div>

        {/* Page display */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg min-h-96">
            <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line font-mono">
              {pages[page]}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-white/10 shrink-0">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/10 transition disabled:opacity-30">
            ← Previous
          </button>
          <div className="text-xs text-gray-400">
            Page <span className="text-white font-bold">{page + 1}</span> of <span className="text-white font-bold">{pages.length}</span>
            <span className="text-gray-600 ml-2">(showing {pages.length} of {note.pages} pages)</span>
          </div>
          <button onClick={() => setPage(p => Math.min(pages.length - 1, p + 1))} disabled={page === pages.length - 1}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/10 transition disabled:opacity-30">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main NoteDetail page ───────────────────────────────── */
export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { purchased, addPurchased, bookmarked, toggleBookmark, uploads } = useApp();

  const numId = Number(id);
  const staticNote = notes.find(n => n.id === numId);
  const uploadedNote = uploads.find(u => u.id === numId && u.status === "live");
  const note: NoteView = staticNote ? toView(staticNote) : uploadedNote ? uploadToView(uploadedNote) : toView(notes[0]);

  const isFree = note.price === "Free";
  const isPurchased = purchased.has(note.id) || isFree;
  const isBookmarked = bookmarked.has(note.id);

  const [showPayment, setShowPayment] = useState(false);
  const [showPDF, setShowPDF] = useState(false);

  const discount = note.original && note.price !== "Free"
    ? Math.round((1 - parseInt(note.price.replace("₹", "")) / parseInt(note.original.replace("₹", ""))) * 100)
    : 0;

  const avatarInitials = note.scholar.split(" ").map(w => w[0]).slice(0, 2).join("");

  const demoReviews = [
    { n: "Priya M.", r: 5, t: "Absolutely comprehensive! Cleared my exam with these notes. The mind maps are incredible.", time: "2 days ago" },
    { n: "Rahul K.", r: 5, t: "Best structured notes I've used. PYQ analysis is spot on.", time: "1 week ago" },
    { n: "Ananya S.", r: 4, t: "Very detailed and well-organized. Worth every rupee.", time: "2 weeks ago" },
  ];

  return (
    <>
      {showPayment && (
        <PaymentModal
          note={note}
          onClose={() => setShowPayment(false)}
          onSuccess={() => { addPurchased(note.id); setShowPayment(false); }}
        />
      )}
      {showPDF && (
        <PDFViewer
          note={note}
          onClose={() => setShowPDF(false)}
          onDownload={() => {}}
        />
      )}

      <div className="p-6 max-w-4xl">
        <button onClick={() => window.history.back()} className="text-gray-400 hover:text-white transition text-xs mb-4 flex items-center gap-1">
          ← Back
        </button>

        <div className="grid grid-cols-3 gap-6">
          {/* ── Left: Info ── */}
          <div className="col-span-2 space-y-5">
            <div>
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 font-semibold">{note.exam}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-400 font-semibold">{note.tag}</span>
                {isFree && <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 font-semibold">FREE</span>}
              </div>
              <h1 className="text-2xl font-black text-white mb-2">{note.title}</h1>
              <p className="text-gray-400 text-sm leading-relaxed">{note.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 flex-wrap">
                <span>⭐ {note.rating} ({note.reviews.toLocaleString()} reviews)</span>
                <span>📄 {note.pages} pages</span>
                <span>🌐 Hindi + English</span>
                <span>♾️ Lifetime access</span>
              </div>
            </div>

            {/* Scholar */}
            <div className="flex items-center gap-4 bg-white/3 border border-white/10 rounded-2xl p-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-black text-sm shrink-0 text-white">{avatarInitials}</div>
              <div className="flex-1">
                <div className="font-bold text-sm text-white">{note.scholar}</div>
                <div className="text-xs text-gray-400">Verified Scholar · {note.exam} Expert</div>
                <div className="flex gap-3 mt-1 text-xs text-gray-400">
                  <span>⭐ {note.rating}</span>
                  <span>📚 {note.pages} pages</span>
                  <span>✓ Verified</span>
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
                  "Shortcut tricks & formulas",
                  "Quick revision sheets",
                  "Chapter-wise summaries",
                  "Lifetime PDF access",
                  "Free future updates",
                ].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="text-violet-400 shrink-0">✓</span>{f}
                  </div>
                ))}
              </div>
            </div>

            {/* PDF Preview (if purchased) */}
            {isPurchased && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <div className="font-bold text-sm text-white">Your PDF is ready</div>
                    <div className="text-xs text-gray-400">Open the viewer or download to your device</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowPDF(true)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs hover:opacity-90 transition">
                    📖 Open PDF Viewer
                  </button>
                  <button onClick={() => setShowPDF(true)}
                    className="px-4 py-3 rounded-xl bg-green-600/20 border border-green-500/30 text-green-400 font-bold text-xs hover:bg-green-600/30 transition">
                    📥 Download
                  </button>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-sm text-white">Student Reviews</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-400 text-sm">{"★".repeat(5)}</span>
                  <span className="text-sm font-bold text-white">{note.rating}</span>
                  <span className="text-xs text-gray-400">({note.reviews.toLocaleString()})</span>
                </div>
              </div>
              <div className="space-y-3">
                {demoReviews.map(rev => (
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

          {/* ── Right: Purchase card ── */}
          <div className="col-span-1">
            <div className="sticky top-6 bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden">
              <div className={`p-5 text-center ${isPurchased ? "bg-gradient-to-br from-green-600 to-emerald-700" : "bg-gradient-to-br from-violet-600 to-indigo-700"}`}>
                <div className="text-4xl mb-2">{isPurchased ? "✅" : "📚"}</div>
                <div className="font-black text-2xl text-white">{isFree ? "Free" : note.price}</div>
                {note.original && !isFree && <div className="text-sm text-white/60 line-through">{note.original}</div>}
                {discount > 0 && (
                  <div className="mt-1.5 text-xs bg-white/20 text-white px-3 py-1 rounded-full inline-block font-semibold">{discount}% OFF</div>
                )}
                {isPurchased && <div className="mt-1.5 text-xs text-green-200 font-semibold">You own this</div>}
              </div>
              <div className="p-5 space-y-3">
                <div className="space-y-1.5 text-xs text-gray-300">
                  {["Lifetime PDF access", "Printable download", "Free updates", "7-day refund policy"].map(f => (
                    <div key={f} className="flex items-center gap-2"><span className="text-violet-400">✓</span>{f}</div>
                  ))}
                </div>

                {isPurchased ? (
                  <div className="space-y-2">
                    <button onClick={() => setShowPDF(true)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs hover:opacity-90 transition">
                      📖 Open PDF Viewer
                    </button>
                    <button onClick={() => setShowPDF(true)}
                      className="w-full py-2.5 rounded-xl bg-green-600/20 border border-green-500/30 text-green-400 font-bold text-xs hover:bg-green-600/30 transition">
                      📥 Download PDF
                    </button>
                    <button onClick={() => setLocation("/student/library")}
                      className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold text-xs hover:bg-white/10 transition">
                      Go to Library →
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => isFree ? addPurchased(note.id) : setShowPayment(true)}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-sm hover:opacity-90 transition hover:scale-[1.01]">
                      {isFree ? "Access Free →" : `Buy Now — ${note.price}`}
                    </button>
                    <button
                      onClick={() => toggleBookmark(note.id)}
                      className={`w-full py-2.5 rounded-xl border text-xs font-semibold transition ${isBookmarked ? "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
                      {isBookmarked ? "🔖 Bookmarked" : "Add to Wishlist"}
                    </button>
                  </>
                )}

                <div className="border-t border-white/10 pt-3">
                  <div className="text-[10px] text-gray-500 mb-2 font-semibold">ACCEPTED PAYMENTS</div>
                  <div className="flex flex-wrap gap-1.5">
                    {["UPI", "Cards", "Net Banking", "Wallets"].map(p => (
                      <span key={p} className="text-[10px] px-2 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/10">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
