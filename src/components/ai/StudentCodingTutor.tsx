'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, BookOpen, Send, X, ShieldAlert, ChevronRight, HelpCircle } from 'lucide-react';

interface TutorMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
}

export default function StudentCodingTutor() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      role: 'assistant',
      content: 'Hello Coder! I am your MCOA Coding & Guideline Assistant. Ask me about ICD-10-CM chapter guidelines, CPT modifiers (like 25 vs 59), 2-of-3 E&M MDM leveling, or MS-DRG CC/MCC reasoning.',
      citations: ['AAPC CPC Study Guide', 'CMS ICD-10-CM FY 2026 Guidelines']
    }
  ]);

  const quickCodingQuestions = [
    'How do I sequence diabetes with chronic kidney disease?',
    'What qualifies as a moderate risk MDM in E&M?',
    'When should Modifier 59 be avoided?',
    'Explain the definition of Principal Diagnosis'
  ];

  const handleAsk = async (text?: string) => {
    const q = text || input;
    if (!q.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: q.trim() }]);
    if (!text) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q.trim(),
          category: 'tutor',
          sessionId: 'student_coding_tutor'
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            citations: data.citations || []
          }
        ]);
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Unable to query the digital reference library right now. Please refer to your student manual.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating or embedded trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-[#50458F] text-[#D8AC55] hover:bg-[#211747] px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all border border-[#D8AC55]/30"
      >
        <Bot className="w-4 h-4 text-[#D8AC55]" />
        <span>Open AI Coding Tutor</span>
        <Sparkles className="w-3.5 h-3.5 text-[#D8AC55]" />
      </button>

      {/* Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#211747] to-[#50458F] text-white flex items-center justify-between border-b border-[#D8AC55]/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-[#D8AC55]/40">
                  <Bot className="w-5 h-5 text-[#D8AC55]" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-sm tracking-wide text-white">MCOA Coding Tutor</h3>
                  <p className="text-[11px] text-purple-200">Guideline Interpretation & Doubt Clearance</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-purple-200 hover:text-white"
                aria-label="Close Tutor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[90%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#50458F] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.content}</p>
                    {m.citations && m.citations.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1 items-center">
                        <BookOpen className="w-3 h-3 text-[#50458F]" />
                        <span className="text-[10px] text-slate-400 font-medium">Ref:</span>
                        {m.citations.map((c, i) => (
                          <span key={i} className="text-[9px] bg-purple-50 text-[#211747] px-1.5 py-0.5 rounded border border-purple-200">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2 w-fit">
                  <div className="w-2 h-2 rounded-full bg-[#50458F] animate-ping" />
                  <span>Searching coding manuals...</span>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 2 && (
              <div className="p-3 bg-white border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Frequently Asked Concepts:</span>
                {quickCodingQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleAsk(q)}
                    className="w-full text-left text-xs bg-slate-50 hover:bg-purple-50 hover:text-[#211747] p-2 rounded-lg border border-slate-200 transition-colors flex items-center justify-between"
                  >
                    <span className="truncate">{q}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAsk();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a coding or guideline question..."
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#50458F]"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-2 bg-[#211747] text-[#D8AC55] rounded-xl hover:bg-[#50458F] disabled:opacity-40"
                  aria-label="Send query"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
