
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "../context/AppContext";

export default function Splash() {
  const [, setLocation] = useLocation();
  const { currentUser, loading } = useApp();
  const [pct, setPct] = useState(0);
  const [fading, setFading] = useState(false);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += 2;
      setPct(Math.min(v, loading ? 85 : 100));
      if (v >= 85 && !loading && !resolved) {
        setPct(100);
        clearInterval(id);
        setResolved(true);
        setFading(true);
        setTimeout(() => {
          setLocation("/role");
        }, 400);
      }
      if (v >= 140) {
        clearInterval(id);
        if (!resolved) {
          setPct(100);
          setResolved(true);
          setFading(true);
          setTimeout(() => setLocation("/role"), 400);
        }
      }
    }, 30);
    return () => clearInterval(id);
  }, [loading, currentUser, setLocation, resolved]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#070709] transition-opacity duration-500"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-violet-600/15 to-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-20 right-32 w-48 h-48 bg-cyan-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-32 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center">
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-violet-500/40 mx-auto">
            <span className="text-white font-black text-4xl">S</span>
          </div>
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50 animate-pulse" />
          <div className="absolute -bottom-2 -left-2 w-3.5 h-3.5 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50" />
        </div>
        <h1 className="text-5xl font-black text-white tracking-tight mb-2">ScholarStack</h1>
        <p className="text-gray-400 text-base font-medium mb-8">India's Scholar Economy Platform</p>
        <div className="flex gap-3 justify-center mb-12 flex-wrap">
          {["2.8L+ Notes", "Video Reels", "AI Tutor", "12L+ Students"].map(t => (
            <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300">{t}</span>
          ))}
        </div>
        <div className="w-56 mx-auto">
          <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-75"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            {loading ? "Checking your session…" : "Loading your experience…"}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 text-xs text-gray-600 text-center">
        Trusted by 12L+ students · Join the scholar economy
      </div>
    </div>
  );
}
