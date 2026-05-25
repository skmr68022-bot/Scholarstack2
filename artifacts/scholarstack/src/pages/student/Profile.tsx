
import { useLocation } from "wouter";
import { useApp } from "../../context/AppContext";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { purchased, bookmarked } = useApp();

  return (
    <div className="p-6 max-w-xl">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setLocation("/student")} className="text-gray-400 hover:text-white transition text-xs">← Home</button>
        <h1 className="font-black text-xl text-white flex-1">My Profile</h1>
        <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/10 transition">Edit Profile</button>
      </div>

      {/* Profile card */}
      <div className="bg-[#13131a] border border-white/10 rounded-2xl p-6 mb-5 text-center">
        <div className="relative inline-block mb-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center font-black text-2xl mx-auto text-white">AS</div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-[#13131a] flex items-center justify-center text-[9px]">✓</div>
        </div>
        <div className="font-black text-xl text-white mb-1">Arjun Singh</div>
        <div className="text-gray-400 text-sm mb-1">UPSC Aspirant</div>
        <div className="inline-block text-[10px] bg-violet-500/20 text-violet-400 px-3 py-1 rounded-full font-bold mb-5">PRO MEMBER</div>
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="font-black text-2xl text-violet-400">{purchased.size}</div>
            <div className="text-gray-400 text-xs">Purchased</div>
          </div>
          <div className="text-center">
            <div className="font-black text-2xl text-orange-400">14</div>
            <div className="text-gray-400 text-xs">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="font-black text-2xl text-green-400">{bookmarked.size}</div>
            <div className="text-gray-400 text-xs">Bookmarks</div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden mb-5">
        {[
          ["Email", "arjun.singh@email.com"],
          ["Phone", "+91 98765 43210"],
          ["Exam Goal", "UPSC CSE 2025"],
          ["City", "New Delhi"],
          ["Joined", "January 2025"],
        ].map(([l, v]) => (
          <div key={l} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0">
            <div className="flex-1">
              <div className="text-xs text-gray-400">{l}</div>
              <div className="text-sm font-medium text-white mt-0.5">{v}</div>
            </div>
            <button className="text-xs text-violet-400 hover:underline transition">Edit</button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {[
          { label: "Notification Settings", icon: "🔔" },
          { label: "Privacy & Security", icon: "🔒" },
          { label: "Help & Support", icon: "💬" },
        ].map(a => (
          <button key={a.label} className="w-full flex items-center gap-3 px-5 py-4 bg-[#13131a] border border-white/10 rounded-xl hover:bg-white/5 transition text-left">
            <span className="text-lg">{a.icon}</span>
            <span className="text-sm font-medium text-white">{a.label}</span>
            <span className="ml-auto text-gray-400 text-xs">→</span>
          </button>
        ))}
        <button onClick={() => setLocation("/role")} className="w-full flex items-center gap-3 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/15 transition text-left">
          <span className="text-lg">🚪</span>
          <span className="text-sm font-medium text-red-400">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
