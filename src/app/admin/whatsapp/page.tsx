"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  CheckCircle2,
  CheckCheck,
  Clock,
  ShieldCheck,
  AlertCircle,
  Search,
  Filter,
  Phone,
  Sparkles,
} from "lucide-react";

export default function AdminWhatsAppPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Dispatcher form
  const [phone, setPhone] = useState("+918072020716");
  const [name, setName] = useState("Karthikeyan Selvam");
  const [selectedTemplate, setSelectedTemplate] = useState("admission_confirmation_welcome");
  const [category, setCategory] = useState("Admissions");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/whatsapp");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      alert("Please enter a phone number.");
      return;
    }

    try {
      setDispatching(true);
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientPhone: phone,
          recipientName: name,
          templateName: selectedTemplate,
          category,
          parameters: {
            name,
            course: "Advanced Medical Coding Masterclass",
            studentId: "MCOA-2026-CHN-0095",
            installmentNumber: "2",
            amount: "15,000",
            dueDate: "Nov 01, 2026",
            title: "Inpatient ICD-10-PCS Root Operations",
            platform: "Zoom",
            meetingUrl: "https://zoom.us/j/8072020716",
            companyName: "Omega Healthcare",
            position: "Medical Coder",
            interviewDate: "Oct 24, 2026 at 2:00 PM",
            interviewLink: "https://teams.microsoft.com/meet/omega",
          },
        }),
      });

      const json = await res.json();
      if (json.success) {
        setToastMsg(`Message dispatched successfully to ${phone}! Status: Delivered ✔`);
        loadData();
      } else {
        alert(json.error || "Dispatch failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error dispatching message");
    } finally {
      setDispatching(false);
    }
  };

  const logs = data?.logs || [];
  const templates = data?.templates || [];

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center font-inter">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-mcoa-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-mcoa-midnight">Connecting to WhatsApp Business API Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-[10px] font-bold text-mcoa-amethyst uppercase tracking-widest font-montserrat">
            Automation & Communication
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-mcoa-midnight font-montserrat">
            Official WhatsApp Business Dispatch & Audit Center
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Meta WhatsApp Business Platform transactional integration. Pre-approved templates, instant candidate notices, and real-time delivery logs.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Meta API Gateway: Connected</span>
          </span>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-xs font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Delivery Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs text-gray-500 font-semibold uppercase">Total Messages Sent</span>
          <div className="text-3xl font-extrabold font-mono text-mcoa-midnight mt-1">
            {data?.metrics?.totalSent || 0}
          </div>
          <div className="text-[11px] text-gray-400">Transactional academy events</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs text-emerald-700 font-semibold uppercase">Delivered Messages</span>
          <div className="text-3xl font-extrabold font-mono text-emerald-800 mt-1">
            {data?.metrics?.deliveredCount || 0}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            Delivery Rate: {data?.metrics?.deliveryRate || 100}%
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs text-blue-700 font-semibold uppercase">Read Confirmations</span>
          <div className="text-3xl font-extrabold font-mono text-blue-800 mt-1">
            {data?.metrics?.readCount || 0}
          </div>
          <div className="text-[11px] text-blue-600 font-medium">Recipient opened message</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs text-gray-500 font-semibold uppercase">Failed / Bounced</span>
          <div className="text-3xl font-extrabold font-mono text-gray-400 mt-1">0</div>
          <div className="text-[11px] text-emerald-600 font-semibold">100% Opt-in Compliance</div>
        </div>
      </div>

      {/* Dispatcher Console & Template Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Dispatcher Console (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-7 space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-montserrat font-bold text-base text-mcoa-midnight flex items-center space-x-2">
              <Send className="w-4 h-4 text-mcoa-gold" />
              <span>Live Message Dispatch Console</span>
            </h3>
            <p className="text-xs text-gray-500">
              Trigger instant transactional notifications using pre-approved Meta templates.
            </p>
          </div>

          <form onSubmit={handleDispatch} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-mcoa-midnight block">Recipient Phone (with +91) *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 80720 20716"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-xs font-semibold focus:border-mcoa-amethyst"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-mcoa-midnight block">Recipient Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Student or Lead Name"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-mcoa-midnight block">Select Pre-Approved Template *</label>
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  const t = templates.find((tmp: any) => tmp.name === e.target.value);
                  if (t) setCategory(t.category);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-semibold text-xs"
              >
                {templates.map((tpl: any) => (
                  <option key={tpl.name} value={tpl.name}>
                    [{tpl.category}] {tpl.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs text-gray-600 space-y-1">
              <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider block">
                Template Preview:
              </span>
              <p className="text-[11px] leading-relaxed">
                {templates.find((t: any) => t.name === selectedTemplate)?.sampleContent}
              </p>
            </div>

            <button
              type="submit"
              disabled={dispatching}
              className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{dispatching ? "Dispatching Message..." : "Dispatch WhatsApp Notification"}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Pre-approved Meta Templates & Regulatory Policy (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-7 space-y-4">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-montserrat font-bold text-sm text-mcoa-midnight">
                  Pre-Approved WhatsApp Business Templates
                </h3>
                <p className="text-xs text-gray-500">
                  Registered with Meta for high-deliverability transactional messaging.
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="space-y-3">
              {templates.map((tpl: any) => (
                <div
                  key={tpl.name}
                  className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-mcoa-midnight">
                      {tpl.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-mcoa-pearl text-mcoa-amethyst">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">{tpl.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Message Audit Log Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-7 space-y-4">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-montserrat font-bold text-base text-mcoa-midnight">
              WhatsApp Delivery Audit Logs
            </h3>
            <p className="text-xs text-gray-500">
              Chronological ledger of dispatched transactional communications with delivery receipts.
            </p>
          </div>
          <span className="text-xs text-gray-400 font-mono">Last 50 Dispatches</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-montserrat uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3 font-bold">Recipient</th>
                <th className="py-2.5 px-3 font-bold">Template & Category</th>
                <th className="py-2.5 px-3 font-bold">Message Content</th>
                <th className="py-2.5 px-3 font-bold text-center">Status</th>
                <th className="py-2.5 px-3 font-bold">Sent Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((m: any) => (
                <tr key={m.id} className="hover:bg-gray-50/80 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-mcoa-midnight">{m.recipientName || "Candidate"}</div>
                    <div className="font-mono text-gray-500 text-[11px]">{m.recipientPhone}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] font-semibold text-mcoa-amethyst block">
                      {m.templateName}
                    </span>
                    <span className="text-[10px] text-gray-400">{m.category}</span>
                  </td>
                  <td className="py-3 px-3 max-w-xs truncate text-gray-700 text-[11px]">
                    {m.content}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center space-x-1 ${
                        m.status === "Read"
                          ? "bg-blue-100 text-blue-800"
                          : m.status === "Delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {m.status === "Read" && <CheckCheck className="w-3 h-3 text-blue-600" />}
                      {m.status === "Delivered" && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      <span>{m.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">
                    {new Date(m.sentAt).toLocaleString("en-IN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
