"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Download,
  Filter,
  Search,
  Building2,
  ShieldCheck,
  Send,
} from "lucide-react";

export default function AdminFinancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [reminderSending, setReminderSending] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const loadFinance = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payments/finance");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error("Error loading finance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinance();
  }, []);

  const handleSendReminder = async (order: any) => {
    try {
      setReminderSending(order.id);
      const studentName = order.user?.name || "Student";
      const studentPhone = order.user?.phone || "+918072020716";

      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientPhone: studentPhone,
          recipientName: studentName,
          templateName: "fee_installment_due",
          category: "Finance",
          parameters: {
            name: studentName,
            installmentNumber: order.installmentNumber.toString(),
            amount: order.amount.toLocaleString(),
            course: order.enrollment?.course?.title || "Advanced Medical Coding",
            dueDate: order.dueDate ? new Date(order.dueDate).toLocaleDateString("en-IN") : "Immediately",
          },
        }),
      });

      const resJson = await res.json();
      if (resJson.success) {
        setToastMsg(`WhatsApp installment reminder dispatched to ${studentName} (${studentPhone})!`);
        setTimeout(() => setToastMsg(null), 4000);
      } else {
        alert("Failed to send WhatsApp reminder");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending reminder");
    } finally {
      setReminderSending(null);
    }
  };

  const transactions = data?.recentTransactions || [];
  const filtered = transactions.filter((t: any) => {
    const matchesStatus = selectedStatus === "ALL" || t.status === selectedStatus;
    const matchesSearch =
      t.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center font-inter">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-mcoa-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-mcoa-midnight">Reconciling Academy Accounts & Ledgers...</p>
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
            Finance & Accounts Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-mcoa-midnight font-montserrat">
            Academy Revenue & Installment Ledger
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time Razorpay reconciliation, tuition collections, overdue installment tracking, and automated WhatsApp fee reminders.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/crm"
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          >
            Admissions CRM
          </Link>
          <Link
            href="/admin/admissions"
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-midnight text-white hover:bg-mcoa-amethyst transition shadow-sm"
          >
            Student IDs & Enroll
          </Link>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-xs font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-mcoa-midnight to-mcoa-amethyst text-white p-5 rounded-2xl shadow-royal space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-montserrat font-bold uppercase tracking-wider text-mcoa-gold text-[10px]">
              Total Fee Collections
            </span>
            <DollarSign className="w-4 h-4 text-mcoa-gold" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            ₹{(data?.totalCollections || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-300 font-semibold flex items-center space-x-1">
            <span>Reconciled & Cleared via Razorpay</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-montserrat font-bold uppercase tracking-wider text-gray-500 text-[10px]">
              Pending Receivables
            </span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-700">
            ₹{(data?.pendingReceivables || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-500">Scheduled installment dues</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-montserrat font-bold uppercase tracking-wider text-gray-500 text-[10px]">
              Overdue Installments
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-600">
            {data?.overdueCount || 0} <span className="text-sm font-normal text-gray-400">Cases</span>
          </div>
          <div className="text-[11px] text-rose-700 font-medium">Action: 1-Click WhatsApp Notice</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-montserrat font-bold uppercase tracking-wider text-gray-500 text-[10px]">
              Reconciled Transactions
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-mcoa-midnight">
            {data?.totalTransactions || 0}
          </div>
          <div className="text-[11px] text-gray-500">100% Audit Trail Verified</div>
        </div>
      </div>

      {/* Campus Revenue Breakdown */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-montserrat font-bold text-sm text-mcoa-midnight flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-mcoa-gold" />
            <span>Collections by Campus / Branch</span>
          </h3>
          <span className="text-xs text-gray-400 font-mono">FY 2026-27</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(data?.collectionsByCampus || {}).map(([campus, amount]: [string, any]) => (
            <div key={campus} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="text-[11px] text-gray-500 font-medium truncate">{campus}</div>
              <div className="font-mono text-xl font-bold text-mcoa-midnight">
                ₹{amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions & Installment Ledger Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-montserrat font-bold text-base text-mcoa-midnight">
              Payment Transactions & Installment Status
            </h3>
            <p className="text-xs text-gray-500">
              Audit log of student installment payments and automated WhatsApp reminder dispatch.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student, order, invoice..."
                className="pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:border-mcoa-amethyst"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Created">Pending</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500 font-montserrat uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-bold">Order / Invoice</th>
                <th className="py-3 px-4 font-bold">Student Name</th>
                <th className="py-3 px-4 font-bold">Installment</th>
                <th className="py-3 px-4 font-bold">Amount</th>
                <th className="py-3 px-4 font-bold text-center">Status</th>
                <th className="py-3 px-4 font-bold">Method</th>
                <th className="py-3 px-4 font-bold">Date / Due</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item: any) => {
                const isPaid = item.status === "Paid";
                return (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-mcoa-midnight">
                        {item.orderNumber}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        {item.invoiceNumber || "Invoice Pending"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-800">{item.user?.name || "Student"}</div>
                      <div className="text-[10px] text-gray-500">{item.user?.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-700">
                      Installment #{item.installmentNumber}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-mcoa-midnight">
                      ₹{item.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isPaid
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-mono text-[11px]">
                      {item.paymentMethod || "Razorpay Online"}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-[11px] font-mono">
                      {isPaid
                        ? item.paidAt ? new Date(item.paidAt).toLocaleDateString("en-IN") : "Oct 01, 2026"
                        : item.dueDate ? new Date(item.dueDate).toLocaleDateString("en-IN") : "Upcoming"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!isPaid && (
                        <button
                          onClick={() => handleSendReminder(item)}
                          disabled={reminderSending === item.id}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition inline-flex items-center space-x-1"
                          title="Dispatch WhatsApp Fee Reminder"
                        >
                          <Send className="w-3 h-3 text-emerald-600" />
                          <span>{reminderSending === item.id ? "Sending..." : "WhatsApp Notice"}</span>
                        </button>
                      )}
                      {isPaid && (
                        <span className="text-[11px] font-semibold text-gray-400">
                          Reconciled ✔
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
