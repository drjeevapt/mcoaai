"use client";

import Image from "next/image";
import { CheckCircle2, Download, Printer, ShieldCheck, CreditCard } from "lucide-react";

export default function StudentFeesPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-mcoa-amethyst font-montserrat">
            Finance & Accounts
          </span>
          <h1 className="text-2xl font-bold font-montserrat text-mcoa-midnight mt-0.5">
            Fee Statement & Payment Receipts
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Official academy invoices and tax-compliant transaction records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-midnight text-white hover:bg-mcoa-amethyst transition flex items-center space-x-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-mcoa-gold" />
            <span>Print Official Receipt</span>
          </button>
        </div>
      </div>

      {/* Financial Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold uppercase">Total Program Fee</span>
          <div className="text-2xl font-bold text-mcoa-midnight font-montserrat mt-1">₹27,500</div>
          <div className="text-[11px] text-gray-400">Inclusive of all courseware & mock exams</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs text-emerald-700 font-semibold uppercase">Total Amount Paid</span>
          <div className="text-2xl font-bold text-emerald-800 font-montserrat mt-1">₹27,500</div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Cleared (Zero Balance)</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold uppercase">Payment Status</span>
          <div className="text-xl font-bold text-mcoa-amethyst font-montserrat mt-1">PAID IN FULL</div>
          <div className="text-[11px] text-gray-500">Transaction ID: TXN_MCOA_9812481</div>
        </div>
      </div>

      {/* Official Tax Invoice / Receipt Card */}
      <div className="bg-white rounded-3xl border border-mcoa-gold/40 shadow-royal p-8 sm:p-10 max-w-3xl mx-auto space-y-6">
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="bg-white p-2 rounded-lg">
            <Image
              src="/mcoa-logo.png"
              alt="MCOA Official Logo"
              width={200}
              height={55}
              className="object-contain h-10 w-auto"
            />
          </div>

          <div className="text-right text-xs">
            <div className="font-montserrat font-bold text-mcoa-midnight text-sm">
              OFFICIAL TUITION RECEIPT
            </div>
            <div className="font-mono text-gray-500">Receipt No: MCOA-REC-2026-0082</div>
            <div className="text-gray-400">Date: October 01, 2026</div>
          </div>
        </div>

        {/* Student and Institution Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-700">
          <div className="space-y-1">
            <span className="font-bold text-mcoa-midnight uppercase text-[10px] tracking-wider text-mcoa-amethyst">
              Student Details
            </span>
            <div className="font-bold text-sm text-mcoa-midnight">Sneha Ramachandran</div>
            <div>Student ID: <strong className="font-mono">MCOA-2026-CHN-0082</strong></div>
            <div>Phone: +91 98765 43210</div>
            <div>Email: sneha.student@example.com</div>
          </div>

          <div className="space-y-1 text-left sm:text-right">
            <span className="font-bold text-mcoa-midnight uppercase text-[10px] tracking-wider text-mcoa-amethyst">
              Campus Details
            </span>
            <div className="font-bold text-mcoa-midnight">Chennai Head Office Campus</div>
            <p className="text-[11px] text-gray-500">
              #80/1, 200 Feet Radial Road, Pallikaranai, Chennai - 600100
            </p>
            <div className="text-[11px] text-gray-500">GSTIN / Reg No: 33AAACM1234F1Z8</div>
          </div>
        </div>

        {/* Line Item Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-mcoa-midnight text-white text-[10px] uppercase font-montserrat tracking-wider">
              <tr>
                <th className="py-3 px-4">Item Description</th>
                <th className="py-3 px-4 text-center">Batch Code</th>
                <th className="py-3 px-4 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-mcoa-midnight">Advanced Medical Coding Masterclass</div>
                  <div className="text-[11px] text-gray-500">
                    Comprehensive Terminology, Anatomy, ICD-10-CM, CPT, HCPCS & Placement Drills
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-[11px]">
                  CHN-AMC-OCT26-WE
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-mcoa-midnight">
                  ₹27,500.00
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200 font-bold text-xs">
              <tr>
                <td colSpan={2} className="py-3 px-4 text-right text-gray-700">Total Amount Paid:</td>
                <td className="py-3 px-4 text-right text-emerald-800 font-montserrat text-sm">
                  ₹27,500.00
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="py-2 px-4 text-right text-gray-500 text-[11px]">Remaining Balance:</td>
                <td className="py-2 px-4 text-right text-gray-500 text-[11px]">₹0.00</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Verification and Seal */}
        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-semibold text-[11px]">Official Verified Receipt — Medical Coding Officers Academy</span>
          </div>

          <div className="text-center sm:text-right">
            <div className="font-cinzel font-bold text-xs text-mcoa-midnight">
              Dr. Jeevanantham Mariappan
            </div>
            <div className="text-[10px] text-gray-500">Founder & Chief Executive Officer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
