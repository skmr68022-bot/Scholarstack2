
import { useState } from "react";
import { useLocation } from "wouter";
import { examTags, universityTags, boardTags } from "../../data/constants";
import { useApp } from "../../context/AppContext";
import { uploadVideo, uploadThumbnail } from "../../lib/storage";

type ContentCategory = "competitive" | "university" | "board";
type BoardType = "CBSE" | "CISCE" | "State Board";

const colors = ["bg-orange-500","bg-blue-500","bg-green-500","bg-purple-500","bg-pink-500","bg-cyan-500","bg-indigo-500","bg-red-500","bg-amber-500","bg-teal-500"];

export default function VideoUpload() {
  const [, setLocation] = useLocation();
  const { addUpload, currentUser } = useApp();

  const [category, setCategory] = useState<ContentCategory>("competitive");
  const [title, setTitle] = useState("");
  const [exam, setExam] = useState("UPSC");
  const [university, setUniversity] = useState("Delhi University");
  const [boardType, setBoardType] = useState<BoardType>("CBSE");
  const [boardClass, setBoardClass] = useState("Class 12");
  const [subject, setSubject] = useState("");
  const [desc, setDesc] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedThumb, setSelectedThumb] = useState<File | null>(null);

  const boardClassOptions = boardType === "CBSE" ? boardTags.cbse : boardType === "CISCE" ? boardTags.cisce : boardTags.state;

  const formatSize = (bytes: number) => {
    if (bytes > 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const submit = async () => {
    if (!title.trim()) { setError("Please enter a title."); return; }
    if (!currentUser) { setError("You must be logged in."); return; }
    setError("");
    setUploading(true);

    let fileUrl: string | undefined;
    let thumbnailUrl: string | undefined;

    try {
      if (selectedVideo) {
        setUploadProgress("Uploading video…");
        fileUrl = await uploadVideo(selectedVideo, currentUser.id);
      }
      if (selectedThumb) {
        setUploadProgress("Uploading thumbnail…");
        thumbnailUrl = await uploadThumbnail(selectedThumb, currentUser.id);
      }
      setUploadProgress("Saving to database…");

      const result = await addUpload({
        id: Date.now(),
        title,
        type: "Video",
        price: "Free",
        original: "",
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
        pages: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        tag: "Video",
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
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-3xl mb-4 shadow-xl">▶</div>
      <h2 className="font-black text-2xl text-white mb-2">Video Submitted!</h2>
      <p className="text-gray-400 text-sm mb-2">Your video reel is in the admin review queue.</p>
      <p className="text-xs text-yellow-400 mb-6">It will appear in the Reels feed only after admin approval.</p>
      <div className="flex gap-3">
        <button onClick={() => { setDone(false); setTitle(""); setDesc(""); setSelectedVideo(null); setSelectedThumb(null); }}
          className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-gray-300 hover:bg-white/10 transition">
          Upload More
        </button>
        <button onClick={() => setLocation("/scholar/content")}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-semibold text-white hover:opacity-90 transition">
          View Content →
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-base">▶</div>
        <div>
          <h1 className="font-black text-xl text-white">Upload Video Reel</h1>
          <p className="text-xs text-gray-400">Short learning videos shown in the Reels feed</p>
        </div>
      </div>

      {/* Category */}
      <section className="bg-[#13131a] border border-white/8 rounded-2xl p-5 mb-4">
        <p className="text-xs text-gray-400 font-semibold mb-3">Content Category</p>
        <div className="flex gap-2">
          {(["competitive","university","board"] as ContentCategory[]).map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition capitalize ${category === c ? "bg-purple-600/30 border-purple-500/50 text-purple-300" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"}`}>
              {c === "competitive" ? "Competitive" : c === "university" ? "University" : "Board"}
            </button>
          ))}
        </div>
      </section>

      {/* Details */}
      <section className="bg-[#13131a] border border-white/8 rounded-2xl p-5 mb-4 space-y-4">
        <p className="text-xs text-gray-400 font-semibold">Video Details</p>

        <div>
          <label className="text-xs text-gray-400 block mb-1.5">Title <span className="text-red-400">*</span></label>
          <input value={title} onChange={e => { setTitle(e.target.value); setError(""); }}
            placeholder={`E.g. "${category === "competitive" ? "UPSC Polity Quick Revision" : category === "university" ? "DU BCom Accounting Basics" : "CBSE Class 12 Physics Laws"}"`}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500 transition" />
        </div>

        {category === "competitive" && (
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Exam</label>
            <select value={exam} onChange={e => setExam(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-purple-500 transition cursor-pointer">
              {examTags.map(e => <option key={e} value={e} className="bg-gray-900">{e}</option>)}
            </select>
          </div>
        )}

        {category === "university" && (
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">University</label>
            <select value={university} onChange={e => setUniversity(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-purple-500 transition cursor-pointer">
              {universityTags.map(u => <option key={u} value={u} className="bg-gray-900">{u}</option>)}
            </select>
          </div>
        )}

        {category === "board" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Board</label>
              <select value={boardType} onChange={e => { setBoardType(e.target.value as BoardType); setBoardClass(""); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-purple-500 transition cursor-pointer">
                {["CBSE","CISCE","State Board"].map(b => <option key={b} value={b} className="bg-gray-900">{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Class</label>
              <select value={boardClass} onChange={e => setBoardClass(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-purple-500 transition cursor-pointer">
                {boardClassOptions.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
              </select>
            </div>
          </div>
        )}

        {(category === "university" || category === "board") && (
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="E.g. Mathematics, Physics…"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500 transition" />
          </div>
        )}

        <div>
          <label className="text-xs text-gray-400 block mb-1.5">Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
            placeholder="What will students learn from this video?"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500 transition resize-none" />
        </div>
      </section>

      {/* File Upload */}
      <section className="bg-[#13131a] border border-white/8 rounded-2xl p-5 mb-6 space-y-3">
        <p className="text-xs text-gray-400 font-semibold">Upload Files</p>

        {/* Video file */}
        <div>
          <input
            id="video-file-input"
            type="file"
            accept="video/*"
            onChange={e => setSelectedVideo(e.target.files?.[0] ?? null)}
            className="sr-only"
          />
          <label
            htmlFor="video-file-input"
            className={`w-full py-5 rounded-xl border-2 border-dashed transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
              selectedVideo ? "border-purple-500/50 bg-purple-600/10" : "border-white/15 hover:border-purple-500/40 hover:bg-purple-600/5"
            }`}
          >
            <span className="text-2xl">{selectedVideo ? "▶" : "+"}</span>
            <div className="text-center">
              {selectedVideo ? (
                <>
                  <p className="text-xs font-semibold text-purple-300">{selectedVideo.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{formatSize(selectedVideo.size)}</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-gray-300">Choose video file</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">MP4, MOV, AVI — up to 500MB</p>
                </>
              )}
            </div>
          </label>
        </div>

        {/* Thumbnail */}
        <div>
          <input
            id="video-thumb-input"
            type="file"
            accept="image/*"
            onChange={e => setSelectedThumb(e.target.files?.[0] ?? null)}
            className="sr-only"
          />
          <label
            htmlFor="video-thumb-input"
            className={`w-full py-3 rounded-xl border border-dashed transition flex items-center justify-center gap-2 text-xs cursor-pointer ${
              selectedThumb ? "border-purple-500/40 text-purple-300" : "border-white/15 text-gray-400 hover:text-white hover:border-white/30"
            }`}
          >
            <span>🖼</span>
            {selectedThumb ? selectedThumb.name : "Choose thumbnail image (optional)"}
          </label>
        </div>

        <p className="text-[10px] text-gray-500">Video reels are free for students — great for building your audience and getting discovered.</p>
      </section>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>
      )}

      <button onClick={submit} disabled={uploading || !title.trim()}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-50 shadow-lg">
        {uploading
          ? <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {uploadProgress || "Uploading…"}
            </span>
          : "Submit Reel for Review →"}
      </button>
    </div>
  );
}
