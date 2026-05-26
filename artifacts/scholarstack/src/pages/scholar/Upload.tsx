
import { useState } from "react";
import { useLocation } from "wouter";
import { examTags, universityTags, boardTags } from "../../data/constants";
import { useApp } from "../../context/AppContext";
import { uploadPDF, uploadVideo, uploadThumbnail } from "../../lib/storage";

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
  const [uploadProgress, setUploadProgress] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumb, setSelectedThumb] = useState<File | null>(null);

  const boardClassOptions = boardType === "CBSE" ? boardTags.cbse : boardType === "CISCE" ? boardTags.cisce : boardTags.state;

  const submit = async () => {
    if (!title.trim()) { setError("Please enter a title."); return; }
    if (!currentUser) { setError("You must be logged in."); return; }
    setError("");
    setUploading(true);

    let fileUrl: string | undefined;
    let thumbnailUrl: string | undefined;

    try {
      if (selectedFile) {
        setUploadProgress(type === "PDF" || type === "Bundle" ? "Uploading PDF…" : "Uploading video…");
        if (type === "PDF" || type === "Bundle") {
          fileUrl = await uploadPDF(selectedFile, currentUser.id);
        } else {
          fileUrl = await uploadVideo(selectedFile, currentUser.id);
        }
      }
      if (selectedThumb) {
        setUploadProgress("Uploading thumbnail…");
        thumbnailUrl = await uploadThumbnail(selectedThumb, currentUser.id);
      }
      setUploadProgress("Saving to database…");

      const result = await addUpload({
        thumbnailUrl,
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
        scholar: currentUser.name,
        scholarId: currentUser.id,
        description: desc,
        pages: parseInt(pages) || 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        tag: "New",
        subject: subject || undefined,
        boardType: category === "board" ? boardType : undefined,
        submittedAt: Date.now(),
        fileUrl,
      });

      if (!result.success) {
        setError(result.error ?? "Upload failed. Please try again.");
        setUploading(false);
        return;
      }

      setUploading(false);
      setUploadProgress("");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setUploading(false);
      setUploadProgress("");
    }
  };

  if (done) return (
    <div className="p-6 flex flex-col items-center justify-center min-h-80 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-3xl mb-4 shadow-xl">✓</div>
      <h2 className="font-black text-2xl text-white mb-2">Content Submitted!</h2>
      <p className="text-gray-400 text-sm mb-2">Your content is now in the admin review queue.</p>
      <p className="text-xs text-yellow-400 mb-6">It will appear in student browse pages only after admin approval.</p>
      <div className="flex gap-3">
        <button onClick={() => { setDone(false); setTitle(""); setDesc(""); setPages("100"); setSelectedFile(null); setSelectedThumb(null); }}
          className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-gray-300 hover:bg-white/10 transition">
          Upload More
        </button>
        <button onClick={() => setLocation("/scholar/content")}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-sm font-semibold text-white hover:opacity-90 transition">
          View Content →
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="font-black text-xl text-white mb-6">Upload Content</h1>

      {/* Category */}
      <section className="bg-[#13131a] border border-white/8 rounded-2xl p-5 mb-4">
        <p className="text-xs text-gray-400 font-semibold mb-3">Content Category</p>
        <div className="flex gap-2">
          {(["competitive","university","board"] as ContentCategory[]).map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition capitalize ${category === c ? "bg-cyan-600/30 border-cyan-500/50 text-cyan-300" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"}`}>
              {c === "competitive" ? "Competitive" : c === "university" ? "University" : "Board"}
            </button>
          ))}
        </div>
      </section>

      {/* Content Type */}
      <section className="bg-[#13131a] border border-white/8 rounded-2xl p-5 mb-4">
        <p className="text-xs text-gray-400 font-semibold mb-3">Content Type</p>
        <div className="flex gap-2">
          {["PDF", "Bundle"].map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${type === t ? "bg-cyan-600/30 border-cyan-500/50 text-cyan-300" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-gray-500 mt-2">To upload a video reel, use <span className="text-cyan-400 font-semibold">Upload Video</span> in the sidebar.</p>
      </section>

      {/* Details */}
      <section className="bg-[#13131a] border border-white/8 rounded-2xl p-5 mb-4 space-y-4">
        <p className="text-xs text-gray-400 font-semibold">Content Details</p>

        <div>
          <label className="text-xs text-gray-400 block mb-1.5">Title <span className="text-red-400">*</span></label>
          <input value={title} onChange={e => { setTitle(e.target.value); setError(""); }}
            placeholder={`E.g. "${category === "competitive" ? "UPSC Polity Notes 2025" : category === "university" ? "DU BCom Semester 1" : "CBSE Class 12 Physics"}"`}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 transition" />
        </div>

        {category === "competitive" && (
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Exam</label>
            <select value={exam} onChange={e => setExam(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-cyan-500 transition cursor-pointer">
              {examTags.map(e => <option key={e} value={e} className="bg-gray-900">{e}</option>)}
            </select>
          </div>
        )}

        {category === "university" && (
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">University</label>
            <select value={university} onChange={e => setUniversity(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-cyan-500 transition cursor-pointer">
              {universityTags.map(u => <option key={u} value={u} className="bg-gray-900">{u}</option>)}
            </select>
          </div>
        )}

        {category === "board" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Board</label>
              <select value={boardType} onChange={e => { setBoardType(e.target.value as BoardType); setBoardClass(""); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-cyan-500 transition cursor-pointer">
                {["CBSE","CISCE","State Board"].map(b => <option key={b} value={b} className="bg-gray-900">{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Class</label>
              <select value={boardClass} onChange={e => setBoardClass(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-cyan-500 transition cursor-pointer">
                {boardClassOptions.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
              </select>
            </div>
          </div>
        )}

        {(category === "university" || category === "board") && (
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="E.g. Mathematics, Physics…"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 transition" />
          </div>
        )}

        {type === "PDF" && (
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Pages</label>
            <input value={pages} onChange={e => setPages(e.target.value.replace(/\D/g, ""))} placeholder="Number of pages"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 transition" />
          </div>
        )}

        <div>
          <label className="text-xs text-gray-400 block mb-1.5">Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
            placeholder="What's covered in this content? What will students learn?"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 transition resize-none" />
        </div>
      </section>

      {/* File Upload */}
      <section className="bg-[#13131a] border border-white/8 rounded-2xl p-5 mb-4">
        <p className="text-xs text-gray-400 font-semibold mb-3">Upload Files <span className="text-gray-600">(optional)</span></p>
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-gray-500 mb-1.5">{type} file</p>
            <input
              type="file"
              accept={type === "PDF" || type === "Bundle" ? "application/pdf,.pdf" : "video/*"}
              onChange={e => setSelectedFile(e.target.files?.[0] ?? null)}
              className="block w-full text-xs text-gray-400 cursor-pointer
                file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0
                file:text-xs file:font-semibold file:cursor-pointer
                file:bg-cyan-600/30 file:text-cyan-300
                hover:file:bg-cyan-600/50"
            />
            {selectedFile && <p className="text-[10px] text-cyan-400 mt-1 truncate">{selectedFile.name}</p>}
          </div>
          <div>
            <p className="text-[10px] text-gray-500 mb-1.5">Thumbnail image (optional)</p>
            <input
              type="file"
              accept="image/*"
              onChange={e => setSelectedThumb(e.target.files?.[0] ?? null)}
              className="block w-full text-xs text-gray-400 cursor-pointer
                file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0
                file:text-xs file:font-semibold file:cursor-pointer
                file:bg-white/10 file:text-gray-300
                hover:file:bg-white/20"
            />
            {selectedThumb && <p className="text-[10px] text-gray-400 mt-1 truncate">{selectedThumb.name}</p>}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-[#13131a] border border-white/8 rounded-2xl p-5 mb-6">
        <p className="text-xs text-gray-400 font-semibold mb-3">Pricing</p>
        <div className="flex gap-2 mb-3">
          {["Free", "Paid"].map(p => (
            <button key={p} onClick={() => setPrice(p)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${price === p ? "bg-cyan-600/30 border-cyan-500/50 text-cyan-300" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"}`}>
              {p}
            </button>
          ))}
        </div>
        {price === "Paid" && (
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
            <input value={amount} onChange={e => setAmount(e.target.value.replace(/\D/g,""))}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white outline-none focus:border-cyan-500 transition" />
          </div>
        )}
      </section>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>
      )}

      <button onClick={submit} disabled={uploading || !title.trim()}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-50 shadow-lg">
        {uploading
          ? <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {uploadProgress || "Uploading…"}
            </span>
          : "Submit for Review →"}
      </button>
    </div>
  );
}
