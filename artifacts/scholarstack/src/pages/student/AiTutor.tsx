
import { useState } from "react";
import { useLocation } from "wouter";

const initMessages = [
  { role: "ai", msg: "Hi! I'm your AI Study Tutor. Ask me anything about UPSC, NEET, JEE or any exam topic. I can explain concepts, create quizzes, summarize notes, and plan your revision schedule!" },
  { role: "user", msg: "Explain the Preamble of India in simple points" },
  { role: "ai", msg: `Great question! Here's the Preamble simplified:\n\nThe Preamble declares India to be:\n• Sovereign — Independent nation, not under any foreign power\n• Socialist — Mixed economy; reducing inequality\n• Secular — No state religion; all religions treated equally\n• Democratic — Government by elected representatives\n• Republic — Elected Head of State (President)\n\nKey Goals: Justice, Liberty, Equality, Fraternity\n\nAdded by 42nd Amendment (1976): 'Socialist' and 'Secular' were added. The Preamble is NOT enforceable in court but reflects the Constitution's spirit.` },
];

export default function AiTutor() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState(initMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = () => {
    if (!input.trim()) return;
    const q = input;
    setInput("");
    setMessages(m => [...m, { role: "user", msg: q }]);
    setLoading(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: "ai", msg: `Great question about "${q}"! Here's a detailed explanation with key points, examples, and exam tips to help you master this topic for your competitive exam preparation.\n\nKey Points:\n• Point 1: Important concept related to your query\n• Point 2: Related framework or principle\n• Point 3: Common exam angle for this topic\n\nExam Tip: This topic appears frequently in prelims. Focus on the definitions and distinctions.` }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setLocation("/student")} className="text-gray-400 hover:text-white transition text-xs">← Home</button>
        <h1 className="font-black text-xl text-white">AI Study Tutor</h1>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { icon: "📝", label: "Quiz Generator", desc: "Generate MCQs from any topic" },
          { icon: "✂️", label: "Note Summarizer", desc: "Quick summaries of long notes" },
          { icon: "📅", label: "Revision Planner", desc: "AI-powered study schedule" },
        ].map(f => (
          <button key={f.label} className="bg-[#13131a] border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-violet-500/30 transition text-center">
            <div className="text-3xl mb-3">{f.icon}</div>
            <div className="font-bold text-sm text-white mb-1">{f.label}</div>
            <div className="text-xs text-gray-400">{f.desc}</div>
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="flex-1 bg-[#13131a] border border-white/10 rounded-2xl p-5 flex flex-col min-h-0">
        <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold text-white ${m.role === "ai" ? "bg-gradient-to-br from-violet-500 to-indigo-600" : "bg-gradient-to-br from-orange-400 to-red-500"}`}>
                {m.role === "ai" ? "AI" : "AS"}
              </div>
              <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${m.role === "ai" ? "bg-white/5 border border-white/10 text-gray-200" : "bg-gradient-to-br from-violet-600 to-indigo-600 text-white"}`}>
                {m.msg}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shrink-0">AI</div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-1">
                {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask anything about your exams…"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-violet-500 transition"
          />
          <button onClick={send} disabled={loading || !input.trim()}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-semibold text-white hover:opacity-90 transition disabled:opacity-50">
            Ask →
          </button>
        </div>
      </div>
    </div>
  );
}
