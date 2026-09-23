import React, { useState, useEffect } from "react";
import { DailyReport } from "../types";
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Truck,
  CheckCircle,
  Clock,
  Printer,
  Copy,
  RefreshCw,
} from "lucide-react";

interface Props {
  isDarkMode: boolean;
}

export const DailyReportsView: React.FC<Props> = ({ isDarkMode }) => {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [archive, setArchive] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedDigest, setCopiedDigest] = useState(false);

  const fetchDailyReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reports/daily");
      const data = await res.json();
      if (data.latestReport) {
        setReport(data.latestReport);
      }
      if (data.archive) {
        setArchive(data.archive);
      }
    } catch (err) {
      console.error("Failed to fetch daily reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyReports();
  }, []);

  const handleGenerateFresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reports/daily/generate", { method: "POST" });
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
        fetchDailyReports();
      }
    } catch (err) {
      console.error("Failed to generate fresh report:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDigest = () => {
    if (!report) return;
    const text = `📊 Cape Sun Co - Automated Daily Performance Audit (${report.date})
• Gross Revenue: R${report.summary.grossRevenueZar.toLocaleString()}
• Orders Completed: ${report.summary.ordersCount} (${report.summary.unitsSold} units)
• Top Essential: ${report.summary.topProduct} (${report.summary.topProductUnits} units)
• Delivery SLA: ${report.summary.onTimeDeliveryRatePercent}% on-time (Cape Town Hub)
• Capitec Pay Share: ${report.summary.capitecPaySharePercent}%
• Critical Alerts: ${report.inventoryAlerts.filter((a) => a.status === "Critical").map((a) => a.product).join(", ") || "None"}
💡 Briefing: ${report.aiExecutiveSummary}`;

    navigator.clipboard?.writeText(text);
    setCopiedDigest(true);
    setTimeout(() => setCopiedDigest(false), 2500);
  };

  return (
    <section id="daily-reports" className="py-12 px-4 md:px-6 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A3D62]/10 dark:bg-[#F9CA24]/20 text-[#0A3D62] dark:text-[#F9CA24] text-xs font-bold uppercase tracking-wider mb-2">
            <FileSpreadsheet size={14} /> Automated Daily Reporting Engine
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Automated Daily Performance &amp; Ops Reports
          </h2>
          <p className="text-sm opacity-75 max-w-xl mt-1">
            Automated daily audits generated every 24 hours. Includes sales volume, delivery SLAs, stock depletion
            triggers, and AI executive briefings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
            <Clock size={14} className="text-[#F9CA24]" />
            <span>Automated Cron: Runs daily at 23:59 SAST</span>
          </div>

          <button
            onClick={handleGenerateFresh}
            disabled={loading}
            className="px-5 py-2 rounded-full bg-[#F9CA24] text-black font-extrabold text-xs shadow hover:brightness-105 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Generate Fresh Audit Now
          </button>
        </div>
      </div>

      {report && (
        <div className="space-y-6">
          {/* Main Daily Report Card */}
          <div
            className={`p-6 md:p-8 rounded-[24px] border shadow-lg ${
              isDarkMode ? "bg-[#1C2541]/80 border-slate-700" : "bg-white border-zinc-200"
            }`}
          >
            {/* Top Report Identity */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <div className="text-xs font-mono font-bold text-[#F9CA24]">{report.id}</div>
                <h3 className="text-xl md:text-2xl font-extrabold">
                  Cape Sun Co Performance Report • {report.date}
                </h3>
                <div className="text-xs opacity-60 mt-0.5">
                  Generated at {new Date(report.generatedAt).toLocaleTimeString()} SAST • Cape Town Operations
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyDigest}
                  className={`px-4 py-2 rounded-full border text-xs font-bold flex items-center gap-1.5 transition ${
                    copiedDigest
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "border-slate-300 dark:border-slate-700 hover:border-slate-400"
                  }`}
                >
                  <Copy size={14} />
                  {copiedDigest ? "WhatsApp Digest Copied!" : "Copy WhatsApp Digest"}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-full bg-[#0A3D62] text-white dark:bg-[#0B132B] border dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition"
                >
                  <Printer size={14} /> Print / Export PDF
                </button>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-b border-slate-200 dark:border-slate-700">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800">
                <div className="text-xs opacity-70">Daily Gross Revenue</div>
                <div className="text-xl md:text-2xl font-black text-[#0A3D62] dark:text-[#F9CA24] mt-1">
                  R{report.summary.grossRevenueZar.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                  +18.2% vs 7-day average
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800">
                <div className="text-xs opacity-70">Orders / Units Dispatched</div>
                <div className="text-xl md:text-2xl font-black mt-1">
                  {report.summary.ordersCount} orders / {report.summary.unitsSold} units
                </div>
                <div className="text-[11px] opacity-70 mt-1">
                  AOV: R{report.summary.averageOrderValueZar.toFixed(0)} per basket
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800">
                <div className="text-xs opacity-70">Fulfillment On-Time SLA</div>
                <div className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {report.summary.onTimeDeliveryRatePercent}%
                </div>
                <div className="text-[11px] opacity-70 mt-1">Cape Town Courier Guy SLA</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800">
                <div className="text-xs opacity-70">Top Selling Item</div>
                <div className="text-sm md:text-base font-extrabold text-[#0A3D62] dark:text-white mt-1 truncate">
                  {report.summary.topProduct}
                </div>
                <div className="text-[11px] text-[#F9CA24] font-extrabold mt-1">
                  {report.summary.topProductUnits} units dispatched today
                </div>
              </div>
            </div>

            {/* AI Executive Summary & Ops Insights */}
            <div className="py-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm font-extrabold mb-2 text-[#0A3D62] dark:text-[#F9CA24]">
                <Sparkles size={16} /> Automated AI Operations Briefing
              </div>
              <p className="text-sm leading-relaxed opacity-85 bg-slate-50 dark:bg-[#0B132B] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                {report.aiExecutiveSummary}
              </p>
            </div>

            {/* Two Column Layout: Regional Sales vs Stock Depletion Alerts */}
            <div className="pt-6 grid md:grid-cols-2 gap-6">
              {/* Regional Sales */}
              <div>
                <h4 className="font-extrabold text-sm mb-3">Regional Delivery Performance</h4>
                <div className="space-y-2.5 text-xs">
                  {report.regionalBreakdown.map((r) => (
                    <div
                      key={r.region}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <span className="font-semibold">{r.region}</span>
                      <span className="font-extrabold">
                        R{r.revenueZar.toLocaleString()} ({r.orders} orders)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Depletion Alerts */}
              <div>
                <h4 className="font-extrabold text-sm mb-3">Cape Town Warehouse Low Stock Triggers</h4>
                <div className="space-y-2.5 text-xs">
                  {report.inventoryAlerts.map((item) => (
                    <div
                      key={item.product}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold">{item.product}</div>
                        <div className="text-[11px] opacity-70">Only {item.remainingStock} units remaining</div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          item.status === "Critical"
                            ? "bg-red-500/20 text-red-600 dark:text-red-400"
                            : item.status === "Warning"
                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                            : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Historical Daily Reports Archive */}
          <div
            className={`p-5 rounded-[22px] border ${
              isDarkMode ? "bg-[#1C2541]/70 border-slate-700" : "bg-white border-zinc-200"
            }`}
          >
            <h4 className="font-extrabold text-sm mb-3">Historical Reports Archive</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {archive.map((arch) => (
                <button
                  key={arch.id}
                  onClick={() => setReport(arch)}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    report.id === arch.id
                      ? "border-[#0A3D62] dark:border-[#F9CA24] bg-[#0A3D62]/5 dark:bg-[#F9CA24]/10 font-bold"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400"
                  }`}
                >
                  <div className="text-[10px] opacity-60">{arch.id}</div>
                  <div className="font-extrabold text-sm">{arch.date}</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    R{arch.summary.grossRevenueZar.toLocaleString()} • {arch.summary.ordersCount} orders
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
