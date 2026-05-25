
import { useState } from "react";
import { useLocation } from "wouter";
import { examTags, universityTags, boardTags } from "../../data/constants";
import { useApp } from "../../context/AppContext";
import type { UploadItem } from "../../context/AppContext";

type ContentCategory = "competitive" | "university" | "board";
type BoardType = "CBSE" | "CISCE" | "State Board";

const colors = ["bg-orange-500","bg-blue-500","bg-green-500","bg-purple-500","bg-pink-500","bg-cyan-500","bg-indigo-500","bg-red-500","bg-amber-500","bg-teal-500"];

export default function Upload() {
  const [, setLocation] = useLocation();
  const { addUpload, currentUser } = useApp();

  const [category, setCategory] = useState<ContentCategory>("competitive");
  const [type, setType] = useState("PDF");
  const [title, setTitle] = useState("");
  const [exam, setExam] = useState("UPSC");
  const [university, setUniversity] = useState("Delhi University");
  const [boardType, setBoardType] = useState<BoardType>("CBSE");
  const [boardClass, setBoardClass] = useState("Class 12");
  const [subject, setSubject] = useState("");
  const [pages, setPages] = useState("100");
  const [price, setPrice] = useState("Paid");
  const [amount, setAmount] = useState("299");
  const [desc, setDesc] = useState("");
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const boardClassOptions = boardType === "CBSE" ? boardTags.cbse : boardType === "CISCE" ? boardTags.cisce : boardTags.state;

  const submit = () => {
    if (!title.trim()) return;
    setUploading(true);
    setTimeout(() => {
      const item: UploadItem = {
        id: Date.now(),
        title,
        type,
        price: price === "Free" ? "Free" : `₹${amount}`,
        original: price === "Paid" ? `₹${Math.round(parseInt(amount) * 1.7)}` : "",
        sales: 0,
        earnings: "₹0",
        rating: 0,
        reviews: 0,
        status: "review",
        category,
        exam: category === "competitive" ? exam : category === "university" ? university : boardClass,
        scholar: currentUser?.name || "Scholar",
        scholarId: currentUser?.id || "unknown",
        description: desc,
        pages: parseInt(pages) || 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        tag: "New",
        subject: subject || undefined,
        boardType: category === "board" ? boardType : undefined,
        submittedAt: Date.now(),
      };
      addUpload(item);
      setUploading(false);
      setDone(true);
    }, 1500);
  };

  if (done) return (
    <div className="p-6 flex flex-col items-center justify-center min-h-80 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="font-black text-2xl text-white mb-2">Content Submitted!</h2>
      <p className="text-gray-400 text-sm mb-2">Your content is now in the admin review queue.</p>
      <p className="text-xs text-yellow-400 mb-6">It will appear in student browse pages only after admin approval.</p>
      <div className="flex gap-3">
        <button onClick={() => { setDone(false); setTitle(""); setDesc(""); setPages("100"); }} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-gray-300 hover:bg-white/10 transition">
          Upload More
        </button>
        <button onClick={() => setLocation("/scholar/content")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-sm font-semibold text-white hover:opacity-90 transition">
          View Content →
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setLocation("/scholar")} className="text-gray-400 hover:text-white transition text-xs">← Dashboard</button>
        <h1 className="font-black text-xl text-white flex-1">Upload Content</h1>
      </div>

      {/* Info banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
        <span className="text-yellow-400 text-sm mt-0.5">ℹ</span>
        <p className="text-xs text-yellow-200">After uploading, your content goes to the admin queue for review. Once approved, it will be visible to all students on ScholarStack.</p>
      </div>

      {/* Category */}
      <div className="mb-5">
        <label className="text-xs text-gray-400 font-semibold block mb-2">Content Category</label>
        <div className="flex gap-3">
          {([
            { key: "competitive", icon: "🏆", label: "Competitive Exams", sub: "UPSC, NEET, JEE, CAT…" },
            { key: "university",  icon: "🎓", label: "University Exams",  sub: "Semester, B.Com, B.Tech…" },
            { key: "board",       icon: "📚", label: "Board Exams",       sub: "CBSE, CISCE, State Boards" },
          ] as { key: ContentCategory; icon: string; label: string; sub: string }[]).map(c => (
            <button key={c.key} onClick={() => setCategory(c.key)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl border transition ${category === c.key ? "bg-cyan-600/15 border-cyan-500/40 text-cyan-400" : "bg-white/3 border-white/10 text-gray-400 hover:border-white/20 hover:text-white"}`}>
              <span className="text-2xl">{c.icon}</span>
              <span className="font-bold text-xs">{c.label}</span>
              <span className="text-[10px] text-center opacity-60">{c.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content type */}
      <div className="flex gap-3 mb-5">
        {["PDF", "Video", "Bundle"].map(t => (
          <button key={t} onClick={() => setType(t)}
            className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border transition ${type === t ? "bg-cyan-600/15 border-cyan-500/40 text-cyan-400" : "bg-white/3 border-white/10 text-gray-400 hover:border-white/20 hover:text-white"}`}>
            <span className="text-2xl">{t === "PDF" ? "📄" : t === "Video" ? "🎬" : "📦"}</span>
            <span className="font-bold text-sm">{t}</span>
            <span className="text-[10px] opacity-60">{t === "PDF" ? "Notes, cheatsheets" : t === "Video" ? "Lectures, reels" : "Notes + Videos"}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 font-semibold block mb-2">Content Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder={`e.g., Complete ${category === "competitive" ? exam : category === "university" ? university : boardClass} Notes 2025`}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 transition" />
        </div>

        <div>
          <label className="text-xs text-gray-400 font-semibold block mb-2">Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="What topics are covered? Who is it for? What makes it unique?"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 transition resize-none" />
        </div>

        {/* Category-specific selectors */}
        {category === "competitive" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 font-semibold block mb-2">Target Exam</label>
              <select value={exam} onChange={e => setExam(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-cyan-500 transition cursor-pointer">
                {examTags.map(e => <option key={e} className="bg-gray-900">{e}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 font-semibold block mb-2">Language</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-cyan-500 transition cursor-pointer">
                {["Hindi + English","English Only","Hindi Only","Regional"].map(l => <option key={l} className="bg-gray-900">{l}</option>)}
              </select>
            </div>
          </div>
        )}

        {category === "university" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 font-semibold block mb-2">University</label>
              <select value={university} onChange={e => setUniversity(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-cyan-500 transition cursor-pointer">
                {universityTags.map(u => <option key={u} className="bg-gray-900">{u}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 font-semibold block mb-2">Subject / Course</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Financial Accounting"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 transition" />
            </div>
          </div>
        )}

        {category === "board" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 font-semibold block mb-2">Board</label>
              <div className="flex gap-2">
                {(["CBSE","CISCE","State Board"] as BoardType[]).map(b => (
                  <button key={b} onClick={() => { setBoardType(b); setBoardClass(b === "CBSE" ? boardTags.cbse[0] : b === "CISCE" ? boardTags.cisce[0] : boardTags.state[0]); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${boardType === b ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-transparent" : "border-white/10 text-gray-400 hover:border-white/20"}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-2">{boardType === "State Board" ? "State Board" : "Class"}</label>
                <select value={boardClass} onChange={e => setBoardClass(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-cyan-500 transition cursor-pointer">
                  {boardClassOptions.map(c => <option key={c} className="bg-gray-900">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-2">Subject</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Physics"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 transition" />
              </div>
            </div>
          </div>
        )}

        {/* Pages */}
        {type === "PDF" && (
          <div>
            <label className="text-xs text-gray-400 font-semibold block mb-2">Number of Pages</label>
            <input type="number" value={pages} onChange={e => setPages(e.target.value)} placeholder="e.g., 150" min="1"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 transition" />
          </div>
        )}

        {/* Pricing */}
        <div>
          <label className="text-xs text-gray-400 font-semibold block mb-2">Pricing</label>
          <div className="flex gap-2 mb-3">
            {["Free","Paid"].map(p => (
              <button key={p} onClick={() => setPrice(p)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition border ${price === p ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-transparent" : "border-white/10 text-gray-400 hover:border-white/20"}`}>
                {p}
              </button>
            ))}
          </div>
          {price === "Paid" && (
            <>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-4 py-3 text-sm text-white outline-none focus:border-cyan-500 transition" />
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                <span>You earn:</span>
                <span className="font-bold text-cyan-400">₹{Math.round(parseInt(amount || "0") * 0.85)}</span>
                <span className="text-gray-500">(85% revenue share)</span>
              </div>
            </>
          )}
        </div>

        {/* Upload zone */}
        <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-cyan-500/30 transition cursor-pointer">
          <div className="text-4xl mb-2">{type === "PDF" ? "📄" : type === "Video" ? "🎬" : "📦"}</div>
          <div className="font-semibold text-sm text-white mb-1">Drop your {type} here</div>
          <div className="text-xs text-gray-400 mb-4">{type === "PDF" ? "PDF, max 100MB" : type === "Video" ? "MP4, max 2GB" : "ZIP bundle"}</div>
          <button className="px-5 py-2.5 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold hover:bg-cyan-600/30 transition">
            Choose File
          </button>
        </div>

        <button onClick={submit} disabled={uploading || !title.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-sm hover:opacity-90 transition disabled:opacity-50 hover:scale-[1.01]">
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing for Review…
            </span>
          ) : `Submit ${type} for Admin Review →`}
        </button>
      </div>
    </div>
  );
}
