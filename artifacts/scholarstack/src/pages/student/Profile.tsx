
import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "../../context/AppContext";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { currentUser, purchased, bookmarked, logout, updateUserProfile } = useApp();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const result = await updateUserProfile({ name: name.trim() });
    setSaving(false);
    if (result.success) {
      setSaveMsg("Profile updated!");
      setEditing(false);
      setTimeout(() => setSaveMsg(""), 2000);
    } else {
      setSaveMsg(result.error ?? "Save failed.");
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/role");
  };

  const initials = (currentUser?.name ?? "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="p-6 max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setLocation("/student")} className="text-gray-400 hover:text-white text-xs">← Home</button>
        <h1 className="font-black text-xl text-white">My Profile</h1>
      </div>

      {/* Avatar + Name */}
      <div className="bg-[#13131a] border border-white/8 rounded-2xl p-6 mb-4 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-black text-xl text-white shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex gap-2 items-center">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1 bg-white/5 border border-violet-500/50 rounded-xl px-3 py-2 text-sm text-white outline-none"
                autoFocus
              />
              <button onClick={handleSave} disabled={saving}
                className="px-3 py-2 rounded-xl bg-violet-600 text-xs font-bold text-white disabled:opacity-60">
                {saving ? "…" : "Save"}
              </button>
              <button onClick={() => { setEditing(false); setName(currentUser?.name ?? ""); }}
                className="px-3 py-2 rounded-xl bg-white/5 text-xs text-gray-400">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-black text-lg text-white truncate">{currentUser?.name}</p>
              <button onClick={() => setEditing(true)} className="text-[10px] text-violet-400 hover:text-violet-300 transition">
                Edit
              </button>
            </div>
          )}
          {saveMsg && <p className="text-xs text-green-400 mt-1">{saveMsg}</p>}
          <p className="text-xs text-gray-400 mt-0.5">{currentUser?.email}</p>
          <span className="inline-block mt-1 text-[10px] font-bold bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">
            {currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : "Student"}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "Notes Purchased", value: purchased.size, icon: "📚", color: "text-violet-400" },
          { label: "Bookmarked", value: bookmarked.size, icon: "★", color: "text-amber-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#13131a] border border-white/8 rounded-2xl p-4 text-center">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="bg-[#13131a] border border-white/8 rounded-2xl overflow-hidden mb-4">
        {[
          { label: "Purchase History", icon: "🛒", action: () => setLocation("/student/orders") },
          { label: "My Library", icon: "📖", action: () => setLocation("/student/library") },
          { label: "AI Tutor", icon: "🤖", action: () => setLocation("/student/ai-tutor") },
        ].map((item, i, arr) => (
          <button key={item.label} onClick={item.action}
            className={`w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white/5 transition text-left ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}>
            <span className="text-base">{item.icon}</span>
            <span className="text-sm font-medium text-white">{item.label}</span>
            <span className="ml-auto text-gray-500 text-xs">→</span>
          </button>
        ))}
      </div>

      {/* Account info */}
      <div className="bg-[#13131a] border border-white/8 rounded-2xl p-5 mb-4">
        <p className="text-xs text-gray-400 font-semibold mb-3">Account</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Email</span>
            <span className="text-white">{currentUser?.email}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Auth Provider</span>
            <span className="text-white">Supabase Auth</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Role</span>
            <span className="text-violet-400 capitalize">{currentUser?.role}</span>
          </div>
        </div>
      </div>

      <button onClick={handleLogout}
        className="w-full py-3 rounded-2xl border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition">
        Sign Out
      </button>
    </div>
  );
}
