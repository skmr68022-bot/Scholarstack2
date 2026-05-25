
import { useState, useRef } from "react";

const reels = [
  {
    id:1, scholar:"Dr. Rajiv Menon", tag:"UPSC Expert", avatar:"RM", avatarBg:"from-orange-400 to-red-500",
    title:"Preamble of India — 5 Key Points in 60 Seconds 🇮🇳",
    desc:"Master the Preamble with this quick revision. Perfect for UPSC Prelims 2025!",
    likes:"24.8K", comments:"1.2K", saves:"8.9K", shares:"3.4K",
    exam:"UPSC", premium:false,
    gradient:"from-orange-900/80 via-red-900/60 to-[#0a0a0f]",
    bg:"from-orange-500/30 to-red-500/20",
    duration:"1:02",
  },
  {
    id:2, scholar:"Priya Sharma", tag:"NEET 720", avatar:"PS", avatarBg:"from-pink-400 to-rose-500",
    title:"Mitosis vs Meiosis — Never Confuse Them Again! 🧬",
    desc:"Visual breakdown of cell division. High-yield NEET Biology concept!",
    likes:"41.2K", comments:"3.4K", saves:"18.2K", shares:"7.1K",
    exam:"NEET", premium:false,
    gradient:"from-pink-900/80 via-rose-900/60 to-[#0a0a0f]",
    bg:"from-pink-500/30 to-rose-500/20",
    duration:"0:58",
  },
  {
    id:3, scholar:"Karan Mehta", tag:"IIT Bombay", avatar:"KM", avatarBg:"from-blue-400 to-indigo-500",
    title:"Integration by Parts — Secret Trick for JEE 📐",
    desc:"LIATE rule explained with 3 examples. Solve in under 30 seconds!",
    likes:"18.6K", comments:"940", saves:"12.4K", shares:"2.8K",
    exam:"JEE", premium:true,
    gradient:"from-blue-900/80 via-indigo-900/60 to-[#0a0a0f]",
    bg:"from-blue-500/30 to-indigo-500/20",
    duration:"1:24",
  },
];
const suggestedScholars = [
  { name:"Amit T.", tag:"SSC Expert", avatar:"AT", bg:"from-yellow-400 to-orange-400" },
  { name:"Riya N.", tag:"NEET", avatar:"RN", bg:"from-pink-400 to-rose-400" },
  { name:"Saurabh K.", tag:"CAT", avatar:"SK", bg:"from-green-400 to-emerald-400" },
  { name:"Neha G.", tag:"GATE", avatar:"NG", bg:"from-cyan-400 to-blue-400" },
];

export function VideoReels() {
  const [activeReel, setActiveReel] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [followed, setFollowed] = useState<Set<number>>(new Set());
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [speed, setSpeed] = useState("1x");
  const [playing, setPlaying] = useState(true);

  const reel = reels[activeReel];

  const toggleLike = () => {
    const n = new Set(liked);
    n.has(reel.id) ? n.delete(reel.id) : n.add(reel.id);
    setLiked(n);
  };
  const toggleSave = () => {
    const n = new Set(saved);
    n.has(reel.id) ? n.delete(reel.id) : n.add(reel.id);
    setSaved(n);
  };
  const toggleFollow = (id: number) => {
    const n = new Set(followed);
    n.has(id) ? n.delete(id) : n.add(id);
    setFollowed(n);
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      {/* Left sidebar */}
      <div className="w-64 bg-[#0a0a0f] border-r border-white/10 flex flex-col py-6 px-4 shrink-0">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">S</div>
          <span className="font-black text-xl">Reels</span>
        </div>

        {/* Category filter */}
        <div className="mb-5">
          <div className="text-xs text-gray-500 font-semibold mb-2 px-1">EXPLORE</div>
          <div className="space-y-1">
            {[
              { icon:"🔥", label:"For You", active:true },
              { icon:"📚", label:"Following" },
              { icon:"🎯", label:"UPSC" },
              { icon:"🧬", label:"NEET" },
              { icon:"📐", label:"JEE" },
              { icon:"📊", label:"CAT/MBA" },
              { icon:"📝", label:"SSC" },
              { icon:"💾", label:"Saved" },
              { icon:"📜", label:"Watch History" },
            ].map(c => (
              <button key={c.label} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${c.active ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                <span>{c.icon}</span> {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <div className="text-xs text-gray-500 font-semibold mb-3 px-1">SUGGESTED SCHOLARS</div>
          <div className="space-y-3">
            {suggestedScholars.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center font-black text-xs shrink-0`}>{s.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{s.name}</div>
                  <div className="text-xs text-gray-400">{s.tag}</div>
                </div>
                <button onClick={() => toggleFollow(i)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${followed.has(i) ? "bg-white/10 text-white" : "bg-violet-600 text-white hover:bg-violet-700"}`}>
                  {followed.has(i) ? "✓" : "+"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Feed — center */}
      <div className="flex-1 flex justify-center items-center bg-black relative">
        {/* Reel cards navigation dots */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
          {reels.map((_, i) => (
            <button key={i} onClick={() => setActiveReel(i)}
              className={`transition-all rounded-full ${i === activeReel ? "w-2 h-8 bg-white" : "w-2 h-2 bg-white/30"}`} />
          ))}
        </div>

        {/* Main Reel */}
        <div className="relative w-96 h-full max-h-screen overflow-hidden">
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-b ${reel.gradient}`} />
          <div className={`absolute inset-0 bg-gradient-to-br ${reel.bg} opacity-40`} />

          {/* Video placeholder */}
          <div className="absolute inset-0 flex items-center justify-center" onClick={() => setPlaying(!playing)}>
            <div className="text-8xl opacity-20">🎬</div>
            {!playing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-4xl">▶️</div>
              </div>
            )}
          </div>

          {/* Premium overlay */}
          {reel.premium && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/60 backdrop-blur-sm">
              <div className="text-5xl mb-3">🔒</div>
              <div className="font-black text-xl mb-2">Premium Content</div>
              <div className="text-sm text-gray-300 mb-6 text-center px-8">Subscribe to watch this and 2,400+ premium videos</div>
              <button className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-sm hover:opacity-90 transition">
                Unlock — ₹199/month
              </button>
            </div>
          )}

          {/* Top bar */}
          <div className="absolute top-0 inset-x-0 p-5 flex items-center justify-between z-20">
            <span className="text-xs bg-black/40 backdrop-blur px-3 py-1.5 rounded-full font-semibold border border-white/10">{reel.exam}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-black/40 backdrop-blur px-2.5 py-1.5 rounded-full font-semibold">{reel.duration}</span>
              <select value={speed} onChange={e => setSpeed(e.target.value)}
                className="text-xs bg-black/40 backdrop-blur px-2 py-1.5 rounded-lg border border-white/10 text-white font-semibold outline-none cursor-pointer">
                {["0.5x","0.75x","1x","1.25x","1.5x","2x"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-32 inset-x-5 z-20">
            <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full w-2/5" />
            </div>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 inset-x-0 p-5 z-20">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                {/* Scholar */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${reel.avatarBg} flex items-center justify-center font-black text-sm shrink-0`}>{reel.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{reel.scholar}</span>
                      <span className="text-[10px] bg-yellow-500/30 text-yellow-400 px-1.5 py-0.5 rounded-full font-bold">✅</span>
                    </div>
                    <div className="text-xs text-gray-400">{reel.tag}</div>
                  </div>
                  <button onClick={() => toggleFollow(reel.id)}
                    className={`ml-auto text-xs px-3 py-1.5 rounded-lg font-semibold border transition ${followed.has(reel.id) ? "border-white/20 text-white/70" : "border-violet-500 text-violet-400 hover:bg-violet-500/20"}`}>
                    {followed.has(reel.id) ? "Following ✓" : "+ Follow"}
                  </button>
                </div>

                <div className="font-bold text-sm leading-tight mb-1">{reel.title}</div>
                <div className="text-xs text-gray-300 leading-relaxed line-clamp-2">{reel.desc}</div>

                {/* Caption button */}
                <button className="mt-3 text-xs bg-white/10 px-3 py-1.5 rounded-lg font-medium hover:bg-white/20 transition">CC Captions</button>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col items-center gap-4 shrink-0">
                <button onClick={toggleLike} className="flex flex-col items-center gap-1 group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${liked.has(reel.id) ? "bg-red-500/30 scale-110" : "bg-white/10 group-hover:bg-white/20"}`}>
                    {liked.has(reel.id) ? "❤️" : "🤍"}
                  </div>
                  <span className="text-[10px] font-semibold">{reel.likes}</span>
                </button>

                <button onClick={() => setShowComment(!showComment)} className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl group-hover:bg-white/20 transition">💬</div>
                  <span className="text-[10px] font-semibold">{reel.comments}</span>
                </button>

                <button onClick={toggleSave} className="flex flex-col items-center gap-1 group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${saved.has(reel.id) ? "bg-yellow-500/30 scale-110" : "bg-white/10 group-hover:bg-white/20"}`}>
                    {saved.has(reel.id) ? "🔖" : "📌"}
                  </div>
                  <span className="text-[10px] font-semibold">{reel.saves}</span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl group-hover:bg-white/20 transition">📤</div>
                  <span className="text-[10px] font-semibold">{reel.shares}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Comments panel (toggled) */}
      <div className={`w-80 bg-[#0a0a0f] border-l border-white/10 flex flex-col transition-all ${showComment ? "translate-x-0" : "translate-x-full w-0 overflow-hidden border-0"}`}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="font-bold">Comments <span className="text-gray-400 text-sm font-normal">(1,240)</span></div>
          <button onClick={() => setShowComment(false)} className="text-gray-400 hover:text-white transition">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[
            { name:"Priya M.", text:"This is exactly what I needed before my exam tomorrow! Thank you so much 🙏", likes:124, time:"2m ago", avatar:"PM" },
            { name:"Rahul K.", text:"Sir please make a video on DPSP next! Your teaching style is amazing.", likes:87, time:"15m ago", avatar:"RK" },
            { name:"Ananya S.", text:"I've watched this 5 times already and still learning something new each time!", likes:64, time:"1h ago", avatar:"AS" },
          ].map(c => (
            <div key={c.name} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center font-bold text-xs shrink-0">{c.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-xs">{c.name}</span>
                  <span className="text-gray-500 text-[10px]">{c.time}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{c.text}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 transition">❤️ {c.likes}</button>
                  <button className="text-[10px] text-gray-400 hover:text-white transition">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none placeholder-gray-500 focus:border-violet-500 transition"
            />
            <button className="px-3 py-2.5 rounded-xl bg-violet-600 text-xs font-semibold hover:bg-violet-700 transition">Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}
