import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useApp } from "../../context/AppContext";
import { getNoteById } from "../../lib/db";
import type { Note } from "../../lib/database.types";

interface NoteView {
  id: number; title: string; scholar: string; price: string; original: string;
  rating: number; reviews: number; tag: string; exam: string; pages: number;
  color: string; description: string; category: string; fileUrl?: string;
}

function noteToView(n: Note): NoteView {
  return {
    id: n.id, title: n.title, scholar: n.scholar_name, price: n.price,
    original: n.original_price ?? "", rating: Number(n.rating), reviews: n.reviews_count,
    tag: n.tag, exam: n.exam ?? "", pages: n.pages, color: n.color,
    description: n.description || `Comprehensive ${n.pages}-page notes covering all key topics for ${n.exam ?? "your exam"}. Prepared by ${n.scholar_name}.`,
    category: n.category ?? "competitive",
    fileUrl: n.file_url ?? undefined,
  };
}

function getPdfPages(note: NoteView): string[] {
  const base = note.title;
  return [
    `📖  ${base}\n\nTable of Contents\n\n1. Introduction & Overview\n2. Core Concepts & Theory\n3. Important Formulas & Shortcuts\n4. Previous Year Questions\n5. Mind Maps & Diagrams\n6. Quick Revision Checklist`,
    `Chapter 1: Introduction & Overview\n\nFoundational understanding of ${note.exam || "this subject"} concepts. Historical context, exam pattern, and the most efficient preparation strategy.\n\nKey Points:\n• Exam pattern analysis 2020–2024\n• High-weightage topics identified\n• Time allocation per topic\n• Recommended study schedule`,
    `Chapter 2: Core Concepts & Theory\n\nEssential theoretical framework with real examples.\n\n▸ Concept A: Detailed explanation with PYQ examples\n▸ Concept B: Step-by-step breakdown with diagrams\n▸ Concept C: Common mistakes to avoid\n▸ Concept D: Examiner's perspective and scoring tips`,
    `Chapter 3: Important Formulas & Shortcuts\n\nAll key formulas, tricks, and memory shortcuts.\n\n✦ Formula 1: [Key formula for topic 1]\n✦ Formula 2: [Key formula for topic 2]\n✦ Shortcut Trick: [Memory technique]\n✦ Mnemonic: [Easy to remember pattern]\n\nPractice Problems: 25 solved examples`,
    `Chapter 4: Previous Year Questions\n\nLast 10 years of exam questions with solutions.\n\n2024: [Sample PYQ with solution]\n2023: [Sample PYQ with solution]\n2022: [Sample PYQ with solution]\n\nPattern Analysis:\n• Topic A appears in 8/10 years\n• Topic B is high-frequency in recent exams`,
    `Chapter 5: Mind Maps & Quick Revision\n\n[Mind Map: Central topic → Sub-topics → Key points]\n\nQuick Revision Checklist:\n☐ Core theory revised\n☐ All formulas memorised\n☐ PYQs attempted\n☐ Weak areas identified\n☐ Mock test completed`,
  ];
}

/* ── Razorpay script loader ── */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if ((window as unknown as Record<string, unknown>)["Razorpay"]) { resolve(true); return; }
    const existing = document.getElementById("rzp-script");
    if (existing) { existing.addEventListener("load", () => resolve(true)); return; }
    const s = document.createElement("script");
    s.id  = "rzp-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { purchased, addPurchased, bookmarked, toggleBookmark, currentUser } = useApp();

  const [note,       setNote]       = useState<NoteView | null>(null);
  const [fetching,   setFetching]   = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showPdf,    setShowPdf]    = useState(false);
  const [pdfPage,    setPdfPage]    = useState(0);
  const [paying,     setPaying]     = useState(false);
  const [paidDone,   setPaidDone]   = useState(false);
  const [payError,   setPayError]   = useState("");

  const noteId     = parseInt(id ?? "0");
  const isPurchased = purchased.has(noteId);
  const isBookmarked = bookmarked.has(noteId);

  useEffect(() => {
    if (!noteId) return;
    setFetching(true);
    getNoteById(noteId)
      .then(data => { if (data) setNote(noteToView(data)); setFetching(false); })
      .catch(() => setFetching(false));
  }, [noteId]);

  /* ── Razorpay checkout ── */
  const handlePurchase = async () => {
    if (!currentUser) { setLocation("/auth/student"); return; }
    if (!note) return;
    setPayError("");
    setPaying(true);

    // 1. Load Razorpay script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setPayError("Could not load payment gateway. Check your internet and try again.");
      setPaying(false);
      return;
    }

    // 2. Create order on server
    let orderId = "";
    try {
      const res  = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId: note.id, amount: note.price }),
      });
      const data = await res.json() as { success: boolean; orderId?: string; error?: string };
      if (!data.success || !data.orderId) {
        setPayError(data.error ?? "Could not create payment order.");
        setPaying(false);
        return;
      }
      orderId = data.orderId;
    } catch {
      setPayError("Network error. Please check your connection.");
      setPaying(false);
      return;
    }

    // 3. Open Razorpay checkout
    const RazorpayClass = (window as unknown as Record<string, unknown>)["Razorpay"] as new (opts: unknown) => { open(): void };
    const options = {
      key: import.meta.env["VITE_RAZORPAY_KEY_ID"] as string,
      order_id: orderId,
      name: "ScholarStack",
      description: note.title,
      image: "https://scholar-stackzip-kshubhamkumar02.replit.app/scholarstack/favicon.ico",
      prefill: {
        name:  currentUser.name  ?? "",
        email: currentUser.email ?? "",
      },
      theme: { color: "#7c3aed" },
      handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        // 4. Verify on server
        try {
          const vRes  = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id:  response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const vData = await vRes.json() as { success: boolean; error?: string };
          if (!vData.success) {
            setPayError(vData.error ?? "Payment verification failed.");
            setPaying(false);
            return;
          }
        } catch {
          setPayError("Could not verify payment. Contact support with your payment ID.");
          setPaying(false);
          return;
        }

        // 5. Record purchase and update state
        await addPurchased(note.id, note.price, "razorpay");
        setPaying(false);
        setPaidDone(true);
        setTimeout(() => { setShowPayModal(false); setPaidDone(false); }, 2000);
      },
      modal: {
        ondismiss: () => { setPaying(false); },
      },
    };

    const rzp = new RazorpayClass(options);
    rzp.open();
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#070709]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading note…</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#070709] text-center p-8">
        <p className="text-5xl mb-4">📄</p>
        <h2 className="text-xl font-bold text-white mb-2">Note Not Found</h2>
        <p className="text-gray-400 text-sm mb-6">This note may have been removed or is under review.</p>
        <button onClick={() => setLocation("/student/notes")} className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold">
          Browse Notes
        </button>
      </div>
    );
  }

  const pdfPages = getPdfPages(note);
  const isFree   = note.price === "Free";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => history.back()} className="text-xs text-gray-400 hover:text-white transition mb-6 flex items-center gap-1">
        ← Back
      </button>

      {/* Hero */}
      <div className="flex gap-6 mb-8">
        <div className={`w-40 h-52 ${note.color} rounded-2xl shrink-0 flex items-center justify-center relative overflow-hidden shadow-2xl`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-center p-4">
            <div className="text-white font-black text-xs leading-tight opacity-90">{note.title.split(" ").slice(0, 4).join(" ")}</div>
            <div className="mt-2 text-white/60 text-[10px]">{note.pages} pages</div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex gap-2 mb-3">
            <span className="text-[10px] font-bold bg-violet-500/20 text-violet-400 px-2 py-1 rounded-full border border-violet-500/30">{note.tag}</span>
            <span className="text-[10px] font-bold bg-white/5 text-gray-400 px-2 py-1 rounded-full border border-white/10">{note.exam}</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-2 leading-tight">{note.title}</h1>
          <p className="text-sm text-gray-400 mb-3">by {note.scholar}</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-bold text-white">{note.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({note.reviews.toLocaleString("en-IN")} reviews)</span>
            </div>
            <span className="text-gray-600">·</span>
            <span className="text-xs text-gray-400">{note.pages} pages PDF</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-5">{note.description}</p>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-3xl font-black text-violet-400">{note.price}</span>
              {note.original && <span className="text-sm text-gray-500 line-through ml-2">{note.original}</span>}
              {note.original && (
                <span className="text-xs text-green-400 ml-2">
                  {Math.round((1 - parseInt(note.price.replace(/\D/g, "")) / parseInt(note.original.replace(/\D/g, ""))) * 100)}% off
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-8">
        {isPurchased || isFree ? (
          <div className="flex flex-1 gap-2">
            <button onClick={() => setShowPdf(true)}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-sm hover:opacity-90 transition shadow-lg">
              {isFree ? "Read Free →" : "Read Now →"}
            </button>
            {note.fileUrl && (
              <a href={note.fileUrl} target="_blank" rel="noopener noreferrer"
                className="px-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/15 transition flex items-center gap-1.5">
                Download PDF
              </a>
            )}
          </div>
        ) : (
          <button onClick={() => setShowPayModal(true)}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm hover:opacity-90 transition shadow-lg hover:scale-[1.01]">
            Buy Now — {note.price}
          </button>
        )}
        <button onClick={() => toggleBookmark(note.id)}
          className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-lg transition ${isBookmarked ? "bg-amber-500/20 border-amber-500/40 text-amber-400" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"}`}>
          {isBookmarked ? "★" : "☆"}
        </button>
      </div>

      {/* What's included */}
      <div className="bg-[#13131a] border border-white/8 rounded-2xl p-5 mb-6">
        <h3 className="font-bold text-white text-sm mb-4">What's Included</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            `${note.pages} pages comprehensive notes`,
            "Previous year questions (PYQs)",
            "Mind maps & diagrams",
            "Formula sheets & shortcuts",
            "Quick revision checklists",
            "Instant PDF download",
          ].map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-gray-300">
              <span className="text-green-400">✓</span> {f}
            </div>
          ))}
        </div>
      </div>

      {/* Scholar info */}
      <div className="bg-[#13131a] border border-white/8 rounded-2xl p-5">
        <h3 className="font-bold text-white text-sm mb-3">About the Scholar</h3>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${note.color} flex items-center justify-center font-bold text-sm text-white`}>
            {note.scholar.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-sm text-white">{note.scholar}</p>
            <p className="text-xs text-gray-400">Verified Scholar · {note.exam} Expert</p>
          </div>
        </div>
      </div>

      {/* ── Payment Confirmation Modal ── */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => !paying && setShowPayModal(false)}>
          <div className="bg-[#13131a] border border-white/10 rounded-3xl p-6 w-full max-w-sm"
            onClick={e => e.stopPropagation()}>

            {paidDone ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-xl font-black text-white mb-1">Payment Successful!</h3>
                <p className="text-sm text-gray-400">You now have full access to this note.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-black text-white text-lg">Confirm Purchase</h3>
                  <button onClick={() => setShowPayModal(false)} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
                </div>

                {/* Note summary */}
                <div className="bg-white/5 border border-white/8 rounded-2xl p-4 mb-5">
                  <p className="text-xs text-gray-400 mb-1 font-medium">{note.tag} · {note.exam}</p>
                  <p className="text-sm font-bold text-white mb-3 leading-snug">{note.title}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-violet-400">{note.price}</span>
                      {note.original && <span className="text-xs text-gray-500 line-through ml-2">{note.original}</span>}
                    </div>
                    <span className="text-xs text-gray-400">{note.pages} pages PDF</span>
                  </div>
                </div>

                {/* What you get */}
                <div className="space-y-2 mb-5">
                  {["Instant access after payment", "UPI, Cards, Net Banking accepted", "Secure checkout via Razorpay"].map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs text-gray-300">
                      <span className="text-green-400 text-[10px]">✓</span>
                      {item}
                    </div>
                  ))}
                </div>

                {payError && (
                  <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 mb-4 leading-relaxed">
                    {payError}
                  </div>
                )}

                <button onClick={handlePurchase} disabled={paying}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2">
                  {paying
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Opening checkout…</>
                    : `Pay ${note.price} →`}
                </button>

                {/* Razorpay badge */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-40">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="#6b7280"/>
                  </svg>
                  <p className="text-[10px] text-gray-500">Secured by Razorpay · 256-bit SSL</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── PDF Viewer Modal ── */}
      {showPdf && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0d12] shrink-0">
            <div>
              <p className="font-bold text-sm text-white">{note.title}</p>
              <p className="text-[10px] text-gray-400">{note.scholar}</p>
            </div>
            <div className="flex items-center gap-3">
              {note.fileUrl && (
                <a href={note.fileUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-lg px-3 py-1.5 transition">
                  Open in new tab
                </a>
              )}
              <button onClick={() => setShowPdf(false)} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>
          </div>

          {note.fileUrl ? (
            /* Real PDF — render in iframe */
            <iframe
              src={note.fileUrl}
              className="flex-1 w-full border-0 bg-white"
              title={note.title}
            />
          ) : (
            /* No file uploaded — show placeholder text pages */
            <>
              <div className="flex-1 overflow-auto p-8">
                <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-2xl">
                  <pre className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-mono">{pdfPages[pdfPage]}</pre>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 py-4 border-t border-white/10 bg-[#0d0d12] shrink-0">
                <button onClick={() => setPdfPage(p => Math.max(0, p - 1))} disabled={pdfPage === 0}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm disabled:opacity-40">← Prev</button>
                <div className="flex gap-1.5">
                  {pdfPages.map((_, i) => (
                    <button key={i} onClick={() => setPdfPage(i)}
                      className={`w-2 h-2 rounded-full transition ${i === pdfPage ? "bg-violet-400" : "bg-white/20"}`} />
                  ))}
                </div>
                <button onClick={() => setPdfPage(p => Math.min(pdfPages.length - 1, p + 1))} disabled={pdfPage === pdfPages.length - 1}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm disabled:opacity-40">Next →</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
