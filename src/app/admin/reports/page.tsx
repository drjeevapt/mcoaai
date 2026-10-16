'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, Building2, Users, IndianRupee, BookOpen, Bot, CheckCircle, RefreshCw, Layers } from 'lucide-react';

interface ReportData {
  timestamp: string;
  summary: {
    totalRevenue: number;
    totalReceivables: number;
    totalEnrolled: number;
    averageProgress: number;
    totalLeads: number;
    aiInteractions: number;
    aiEscalations: number;
    knowledgeBaseArticles: number;
  };
  branchMatrix: {
    id: string;
    name: string;
    city: string;
    leadsCount: number;
    enrollmentsCount: number;
    totalCollections: number;
    pendingReceivables: number;
    conversionRate: string;
  }[];
  funnelData: {
    source: string;
    totalLeads: number;
    enrolled: number;
    conversionRate: string;
  }[];
  landingStats: {
    slug: string;
    title: string;
    views: number;
    leads: number;
    conversionRate: string;
  }[];
}

export default function AdminReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reports');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!data) return;
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'MCOA ACADEMY EXECUTIVE REPORT\n';
    csvContent += `Generated At,${data.timestamp}\n\n`;

    csvContent += 'BRANCH PERFORMANCE MATRIX\n';
    csvContent += 'Branch Name,City,Leads,Enrollments,Total Collections (INR),Pending Receivables (INR),Conversion Rate\n';
    data.branchMatrix.forEach(b => {
      csvContent += `"${b.name}","${b.city}",${b.leadsCount},${b.enrollmentsCount},${b.totalCollections},${b.pendingReceivables},"${b.conversionRate}"\n`;
    });

    csvContent += '\nLEAD SOURCE CONVERSION FUNNEL\n';
    csvContent += 'Source,Total Leads,Enrolled Students,Conversion Rate\n';
    data.funnelData.forEach(f => {
      csvContent += `"${f.source}",${f.totalLeads},${f.enrolled},"${f.conversionRate}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MCOA_Executive_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !data) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-[#50458F] animate-spin mx-auto" />
        <p className="text-slate-500 text-sm font-medium">Aggregating cross-branch academy analytics...</p>
      </div>
    );
  }

  const { summary, branchMatrix, funnelData, landingStats } = data;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-cinzel text-2xl font-bold text-[#211747]">Executive Analytics & Multi-Branch Reports</h1>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Live Real-Time
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Cross-branch admissions comparison, fee collections, conversion attribution, and academic progress across cohorts.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 bg-[#211747] text-[#D8AC55] hover:bg-[#50458F] px-4 py-2.5 rounded-xl font-montserrat font-bold text-xs shadow-md transition-all border border-[#D8AC55]/30"
        >
          <Download className="w-4 h-4" /> Export CSV Audit Report
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Total Academy Revenue</div>
            <div className="text-2xl font-bold font-montserrat text-[#211747] mt-1">
              ₹{summary.totalRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">₹{summary.totalReceivables.toLocaleString()} receivables</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#50458F]">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Enrolled Students</div>
            <div className="text-2xl font-bold font-montserrat text-[#50458F] mt-1">
              {summary.totalEnrolled} Active
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{summary.totalLeads} total leads</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">LMS Cohort Completion</div>
            <div className="text-2xl font-bold font-montserrat text-emerald-600 mt-1">
              {summary.averageProgress}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Average across all modules</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">AI Counselor Queries</div>
            <div className="text-2xl font-bold font-montserrat text-amber-600 mt-1">
              {summary.aiInteractions}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{summary.aiEscalations} phone escalations</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Bot className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Cross-Branch Performance Matrix */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#50458F]" />
            <h2 className="font-cinzel text-lg font-bold text-[#211747]">Multi-Campus Performance Matrix</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Updated as of {new Date(data.timestamp).toLocaleTimeString()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-montserrat font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-4 px-6">Campus Hub</th>
                <th className="py-4 px-6">City</th>
                <th className="py-4 px-6">CRM Leads</th>
                <th className="py-4 px-6">Enrollments</th>
                <th className="py-4 px-6">Collections</th>
                <th className="py-4 px-6">Pending Dues</th>
                <th className="py-4 px-6 text-right">Lead Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {branchMatrix.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#211747]">{b.name}</td>
                  <td className="py-4 px-6">{b.city}</td>
                  <td className="py-4 px-6">{b.leadsCount}</td>
                  <td className="py-4 px-6 font-bold text-[#50458F]">{b.enrollmentsCount}</td>
                  <td className="py-4 px-6 font-semibold text-emerald-600">₹{b.totalCollections.toLocaleString()}</td>
                  <td className="py-4 px-6 text-slate-400">₹{b.pendingReceivables.toLocaleString()}</td>
                  <td className="py-4 px-6 text-right">
                    <span className="bg-purple-50 text-[#50458F] font-bold text-xs px-2.5 py-1 rounded-full border border-purple-200">
                      {b.conversionRate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Conversion Funnel & Landing Page Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Funnel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers className="w-5 h-5 text-[#50458F]" />
            <h3 className="font-cinzel text-base font-bold text-[#211747]">Lead Conversion Funnel by Source</h3>
          </div>

          <div className="space-y-3">
            {funnelData.map((f, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-800">{f.source}</div>
                  <div className="text-[11px] text-slate-400">{f.totalLeads} inquiries • {f.enrolled} enrolled</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-600">{f.conversionRate}</div>
                  <div className="text-[10px] text-slate-400 uppercase">Conversion</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Landing Page Conversion */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrendingUp className="w-5 h-5 text-[#D8AC55]" />
            <h3 className="font-cinzel text-base font-bold text-[#211747]">PPC Landing Page Performance</h3>
          </div>

          <div className="space-y-3">
            {landingStats.map((lp, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between">
                <div className="max-w-[240px]">
                  <div className="font-bold text-xs text-slate-800 truncate">{lp.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono">/lp/{lp.slug}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#211747]">{lp.leads} leads ({lp.conversionRate})</div>
                  <div className="text-[10px] text-slate-400">{lp.views} impressions</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
