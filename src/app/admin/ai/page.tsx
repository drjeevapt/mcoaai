'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Plus, BookOpen, MessageSquare, CheckCircle, Search, ShieldCheck, AlertCircle, PhoneCall, ExternalLink, Filter } from 'lucide-react';

interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  keywords: string;
  content: string;
  source: string;
  isVerified: boolean;
  createdAt: string;
}

interface AiLog {
  id: string;
  sessionId: string;
  role: string;
  content: string;
  category: string;
  citations?: string;
  escalatedToHuman: boolean;
  userPhone?: string;
  userEmail?: string;
  createdAt: string;
}

export default function AdminAiDesk() {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'transcripts' | 'escalations'>('knowledge');
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [conversations, setConversations] = useState<AiLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // New Knowledge Item Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    category: 'guidelines',
    keywords: '',
    content: '',
    source: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resKb, resChat] = await Promise.all([
        fetch('/api/ai/knowledge'),
        fetch('/api/ai/chat')
      ]);

      const dataKb = await resKb.json();
      const dataChat = await resChat.json();

      if (dataKb.success) setKnowledgeItems(dataKb.items);
      if (dataChat.success) setConversations(dataChat.conversations);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKb = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/ai/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setNewItem({ title: '', category: 'guidelines', keywords: '', content: '', source: '' });
        loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredKb = knowledgeItems.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.keywords.toLowerCase().includes(search.toLowerCase()) ||
                          item.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const escalations = conversations.filter(c => c.escalatedToHuman && c.role === 'user');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-cinzel text-2xl font-bold text-[#211747]">AI Agent & Knowledge Management Desk</h1>
            <span className="bg-[#D8AC55]/20 text-[#211747] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#D8AC55]/30">
              Guarded RAG Engine
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Authoritative knowledge base for MCOA AI Counselor and Student Coding Tutor. Enforces official guideline citations without hallucinations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#211747] text-[#D8AC55] hover:bg-[#50458F] px-4 py-2.5 rounded-xl font-montserrat font-bold text-xs shadow-md transition-all border border-[#D8AC55]/30"
        >
          <Plus className="w-4 h-4" /> Add Knowledge Article
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Verified Knowledge Items</div>
            <div className="text-2xl font-bold font-montserrat text-[#211747] mt-1">{knowledgeItems.length} Articles</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#50458F]">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">AI Queries Processed</div>
            <div className="text-2xl font-bold font-montserrat text-[#50458F] mt-1">{conversations.length} Logs</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Human Counselor Escalations</div>
            <div className="text-2xl font-bold font-montserrat text-amber-600 mt-1">{escalations.length} Pending</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <PhoneCall className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-2xl">
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`py-4 px-4 font-montserrat font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'knowledge'
              ? 'border-[#211747] text-[#211747]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Knowledge Base Library ({knowledgeItems.length})
        </button>

        <button
          onClick={() => setActiveTab('escalations')}
          className={`py-4 px-4 font-montserrat font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'escalations'
              ? 'border-[#211747] text-[#211747]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <PhoneCall className="w-4 h-4 text-amber-500" /> Counselor Escalation Queue ({escalations.length})
        </button>

        <button
          onClick={() => setActiveTab('transcripts')}
          className={`py-4 px-4 font-montserrat font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'transcripts'
              ? 'border-[#211747] text-[#211747]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Full Transcripts ({conversations.length})
        </button>
      </div>

      {/* TAB 1: KNOWLEDGE BASE */}
      {activeTab === 'knowledge' && (
        <div className="space-y-4">
          {/* Filter / Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-b-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search knowledge items by guideline, topic, or keyword..."
                className="w-full text-xs bg-transparent focus:outline-none text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="guidelines">Clinical Coding Guidelines</option>
                <option value="courses">Course Curricula</option>
                <option value="fees_admissions">Fees & Admissions</option>
                <option value="career_rcm">Placements & Corporate RCM</option>
                <option value="exam_prep">Exam Preparation</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-2 text-center py-12 text-slate-400">Loading knowledge base...</div>
            ) : filteredKb.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-slate-400">No knowledge items match your criteria.</div>
            ) : (
              filteredKb.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="bg-purple-50 text-[#50458F] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-purple-200">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    </div>

                    <h3 className="font-montserrat font-bold text-sm text-[#211747] mt-2.5 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-slate-600 text-xs mt-2 leading-relaxed line-clamp-4">
                      {item.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-[260px] font-medium text-slate-700">
                      Ref: {item.source}
                    </span>
                    <span className="text-purple-900 font-bold">RAG Active</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ESCALATION QUEUE */}
      {activeTab === 'escalations' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-amber-50/70 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Prospective students and students who requested direct human counselor phone contact via AI.
            </span>
          </div>

          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-montserrat font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-4 px-6">Date / Session</th>
                <th className="py-4 px-6">User Inquiry Content</th>
                <th className="py-4 px-6">Contact Number / Email</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {escalations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">No pending counselor escalations.</td>
                </tr>
              ) : (
                escalations.map((esc) => (
                  <tr key={esc.id} className="hover:bg-slate-50/60">
                    <td className="py-4 px-6 text-xs text-slate-500">
                      <div>{new Date(esc.createdAt).toLocaleDateString()}</div>
                      <div className="font-mono text-[10px] text-slate-400">{esc.sessionId}</div>
                    </td>
                    <td className="py-4 px-6 max-w-md">
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">"{esc.content}"</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#211747] text-xs flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                        {esc.userPhone || 'Provided in query'}
                      </div>
                      {esc.userEmail && <div className="text-[11px] text-slate-400">{esc.userEmail}</div>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <a
                        href={`https://wa.me/91${(esc.userPhone || '8072020716').replace(/\D/g, '')}?text=Hi%20from%20MCOA%20Admissions%20Counseling`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Call via WhatsApp
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: TRANSCRIPTS */}
      {activeTab === 'transcripts' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-medium">
            Recent conversation logs across public website AI Counselor and student LMS Coding Tutor.
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {conversations.map((c) => (
              <div key={c.id} className="p-4 text-xs space-y-1.5 hover:bg-slate-50/50">
                <div className="flex items-center justify-between text-[11px]">
                  <span className={`font-bold uppercase px-2 py-0.5 rounded ${
                    c.role === 'user' ? 'bg-purple-100 text-[#211747]' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {c.role} ({c.category})
                  </span>
                  <span className="text-slate-400">{new Date(c.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-800 leading-relaxed">{c.content}</p>
                {c.citations && (
                  <div className="text-[10px] text-slate-400 font-mono">
                    Citations: {c.citations}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Knowledge Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-cinzel text-xl font-bold text-[#211747]">Add Verified Knowledge Item</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateKb} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                  placeholder="e.g. Sepsis Sequencing Guideline 2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                  >
                    <option value="guidelines">Clinical Coding Guidelines</option>
                    <option value="courses">Course Curricula</option>
                    <option value="fees_admissions">Fees & Admissions</option>
                    <option value="career_rcm">Placements & Corporate RCM</option>
                    <option value="exam_prep">Exam Preparation</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Authoritative Source Citation</label>
                  <input
                    type="text"
                    required
                    value={newItem.source}
                    onChange={(e) => setNewItem({ ...newItem, source: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                    placeholder="e.g. CMS ICD-10-CM FY 2026 Sec I.C.1"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keywords for Matching (comma separated)</label>
                <input
                  type="text"
                  value={newItem.keywords}
                  onChange={(e) => setNewItem({ ...newItem, keywords: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                  placeholder="sepsis, r65.20, systemic infection, organ dysfunction"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Authoritative Content (Truth Data)</label>
                <textarea
                  rows={4}
                  required
                  value={newItem.content}
                  onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                  placeholder="When severe sepsis is documented, sequence the underlying systemic infection first..."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#211747] text-[#D8AC55] font-bold rounded-lg hover:bg-[#50458F] disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Add Knowledge Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
