import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Percent,
  MapPin,
  CreditCard,
  Smartphone,
} from "lucide-react";

interface Props {
  isDarkMode: boolean;
}

export const AnalyticsDashboard: React.FC<Props> = ({ isDarkMode }) => {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/analytics/summary");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const metrics = data?.metrics || {
    totalRevenueZar: 482950,
    monthlyRevenueGrowth: 24.6,
    ordersTotal: 1243,
    avgOrderValueZar: 388.5,
    liveVisitors: 42,
    conversionRate: 3.82,
    stockTurnoverDays: 4.2,
    csatRating: 4.88,
  };

  const salesPoints = [
    { label: "Mon", revenue: 27800, orders: 68 },
    { label: "Tue", revenue: 34200, orders: 84 },
    { label: "Wed", revenue: 45600, orders: 112 },
    { label: "Thu", revenue: 39800, orders: 98 },
    { label: "Fri", revenue: 58900, orders: 142 },
    { label: "Sat", revenue: 64100, orders: 156 },
    { label: "Sun", revenue: 46820, orders: 114 },
  ];

  const maxRev = Math.max(...salesPoints.map((s) => s.revenue));

  return (
    <section id="analytics-dashboard" className="py-12 px-4 md:px-6 max-w-[1280px] mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A3D62]/10 dark:bg-[#F9CA24]/20 text-[#0A3D62] dark:text-[#F9CA24] text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 size={14} /> Comprehensive Business Intelligence
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Live Store Analytics &amp; Sales Dashboard
          </h2>
          <p className="text-sm opacity-75 max-w-xl mt-1">
            Real-time revenue, conversion funnels, regional dispatch velocity, and inventory health for Cape Sun Co.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-[#1C2541] p-1 rounded-full border border-slate-200 dark:border-slate-700">
          {(["7d", "30d", "90d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-xs font-extrabold rounded-full transition ${
                period === p
                  ? "bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black shadow-sm"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: "Gross Sales (ZAR)",
            value: `R${metrics.totalRevenueZar.toLocaleString()}`,
            change: `+${metrics.monthlyRevenueGrowth}% vs last mo`,
            icon: <DollarSign size={20} className="text-[#F9CA24]" />,
          },
          {
            title: "Completed Orders",
            value: metrics.ordersTotal.toLocaleString(),
            change: "1,243 Capetonians served",
            icon: <ShoppingCart size={20} className="text-emerald-500" />,
          },
          {
            title: "Conversion Rate",
            value: `${metrics.conversionRate}%`,
            change: "Top 5% SA e-commerce",
            icon: <Percent size={20} className="text-blue-500" />,
          },
          {
            title: "Live Active Visitors",
            value: `${metrics.liveVisitors} online`,
            change: "Cape Town & JHB surge",
            icon: <Users size={20} className="text-purple-500" />,
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition ${
              isDarkMode ? "bg-[#1C2541]/70 border-slate-700" : "bg-white border-zinc-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between opacity-80 mb-2">
              <span className="text-xs font-semibold">{kpi.title}</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#0B132B] flex items-center justify-center">
                {kpi.icon}
              </div>
            </div>
            <div className="text-xl md:text-2xl font-extrabold">{kpi.value}</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight size={13} /> {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Breakdown Row */}
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 mb-8">
        {/* Sales Chart */}
        <div
          className={`p-5 md:p-6 rounded-[22px] border ${
            isDarkMode ? "bg-[#1C2541]/70 border-slate-700" : "bg-white border-zinc-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-base">Weekly Revenue Velocity (ZAR)</h3>
              <p className="text-xs opacity-70">Peak heat spikes on Friday &amp; Saturday braai prep</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              +28.4% WoW Surge
            </span>
          </div>

          {/* Visual SVG / Bar Graph */}
          <div className="h-56 flex items-end gap-3 sm:gap-6 pt-6 pb-2 border-b border-slate-200 dark:border-slate-700">
            {salesPoints.map((pt) => {
              const heightPct = Math.round((pt.revenue / maxRev) * 100);
              return (
                <div key={pt.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="opacity-0 group-hover:opacity-100 transition text-[10px] font-mono font-bold bg-black text-white px-1.5 py-0.5 rounded whitespace-nowrap">
                    R{(pt.revenue / 1000).toFixed(1)}k ({pt.orders})
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#0B132B] rounded-t-lg h-full flex items-end overflow-hidden">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-[#0A3D62] dark:bg-[#F9CA24] rounded-t-lg transition-all duration-700 group-hover:brightness-110"
                    />
                  </div>
                  <span className="text-xs font-bold opacity-70">{pt.label}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs opacity-70">
            <span>Average Daily Run-Rate: R45,280</span>
            <span>Total Units This Week: 774 units</span>
          </div>
        </div>

        {/* Payment Methods & Regional Distribution */}
        <div className="space-y-6">
          {/* Payment Method Breakdown */}
          <div
            className={`p-5 rounded-[22px] border ${
              isDarkMode ? "bg-[#1C2541]/70 border-slate-700" : "bg-white border-zinc-200 shadow-sm"
            }`}
          >
            <h3 className="font-extrabold text-sm mb-1">South African Payment Settlement Share</h3>
            <p className="text-xs opacity-70 mb-4">Capitec Pay drives over half of all checkouts</p>

            <div className="space-y-3">
              {[
                { name: "Capitec Pay", share: 52.4, color: "bg-[#F9CA24]" },
                { name: "Visa / Mastercard", share: 23.8, color: "bg-[#0A3D62]" },
                { name: "Ozow Instant EFT", share: 14.6, color: "bg-emerald-500" },
                { name: "PayJustNow (3 Slices)", share: 9.2, color: "bg-purple-500" },
              ].map((m) => (
                <div key={m.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{m.name}</span>
                    <span>{m.share}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Sales Breakdown */}
          <div
            className={`p-5 rounded-[22px] border ${
              isDarkMode ? "bg-[#1C2541]/70 border-slate-700" : "bg-white border-zinc-200 shadow-sm"
            }`}
          >
            <h3 className="font-extrabold text-sm mb-1 flex items-center gap-1.5">
              <MapPin size={15} /> Regional Dispatch Volume
            </h3>
            <p className="text-xs opacity-70 mb-3">Western Cape represents our primary fulfillment zone</p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-[#0A3D62] dark:text-[#F9CA24]">Western Cape (54%)</div>
                <div className="opacity-70 mt-0.5">Cape Town, Paarl, Stellenbosch</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800">
                <div className="font-bold">Gauteng (28%)</div>
                <div className="opacity-70 mt-0.5">Johannesburg, Pretoria, Sandton</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800">
                <div className="font-bold">KwaZulu-Natal (12%)</div>
                <div className="opacity-70 mt-0.5">Durban, Ballito, Umhlanga</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800">
                <div className="font-bold">Eastern &amp; Garden (6%)</div>
                <div className="opacity-70 mt-0.5">George, Knysna, Gqeberha</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Health & Low Stock Triggers */}
      <div
        className={`p-5 md:p-6 rounded-[22px] border ${
          isDarkMode ? "bg-[#1C2541]/70 border-slate-700" : "bg-white border-zinc-200 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-amber-500" />
            <h3 className="font-extrabold text-base">Cape Town Real-Time Stock Status</h3>
          </div>
          <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
            2 Products Below Reorder Threshold
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {[
            {
              name: "Bladeless Neck Fan 4000mAh",
              stock: 13,
              status: "Warning",
              statusClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
              note: "87 sold this week. Paarl heatwave driving demand.",
            },
            {
              name: "Kids UPF 50+ Sunsuit Bundle",
              stock: 9,
              status: "Critical",
              statusClass: "text-red-500 bg-red-500/10 border-red-500/20",
              note: "Sizes 1-2Y and 2-3Y almost depleted.",
            },
            {
              name: "Solar Power Bank 20000mAh",
              stock: 11,
              status: "Warning",
              statusClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
              note: "Cederberg camping & festival season surge.",
            },
            {
              name: "Instant Ice Cooling Towel",
              stock: 27,
              status: "Healthy",
              statusClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
              note: "Sufficient buffer for Comrades & sports events.",
            },
          ].map((prod) => (
            <div
              key={prod.name}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                isDarkMode ? "bg-[#0B132B] border-slate-700" : "bg-slate-50 border-zinc-200"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-extrabold text-sm">{prod.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${prod.statusClass}`}>
                    {prod.status}
                  </span>
                </div>
                <div className="text-2xl font-black mb-1">{prod.stock} left</div>
                <p className="text-[11px] opacity-75">{prod.note}</p>
              </div>
              <button
                type="button"
                onClick={() => alert(`Automated purchase order sent for ${prod.name}`)}
                className="mt-3 w-full py-1.5 rounded-lg bg-white dark:bg-[#1C2541] border border-slate-300 dark:border-slate-700 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition text-[11px]"
              >
                Trigger Supplier PO
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
