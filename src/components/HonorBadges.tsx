import React from "react";
import {
  ShieldCheck,
  Truck,
  Award,
  Lock,
  Zap,
  Sun,
  CheckCircle2,
  HeartHandshake,
  BadgePercent,
  Sparkles,
  MessageCircle,
} from "lucide-react";

export interface HonorBadgeItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tag?: string;
  highlight?: boolean;
}

export const HONOR_BADGES: HonorBadgeItem[] = [
  {
    id: "cape-town-local",
    title: "Cape Town Stocked",
    subtitle: "Locally curated & verified for South African summers",
    icon: <span className="text-xl">🇿🇦</span>,
    tag: "Authentic Local",
    highlight: true,
  },
  {
    id: "fast-delivery",
    title: "2-3 Day Local Dispatch",
    subtitle: "Direct courier to your door (JHB & regional take longer)",
    icon: <Truck className="text-[#0A3D62] dark:text-[#F9CA24]" size={20} />,
    tag: "Cape Town Hub",
  },
  {
    id: "quality-guarantee",
    title: "30-Day Quality Guarantee",
    subtitle: "100% money-back & replacement guarantee",
    icon: <ShieldCheck className="text-emerald-500" size={20} />,
    tag: "100% Protected",
    highlight: true,
  },
  {
    id: "capitec-verified",
    title: "Capitec Pay Verified",
    subtitle: "Zero card fees & 1-click in-app instant approval",
    icon: <Zap className="text-amber-500" size={20} />,
    tag: "Merchant Partner",
  },
  {
    id: "ssl-security",
    title: "256-Bit SSL Encrypted",
    subtitle: "Bank-level payment data protection & privacy",
    icon: <Lock className="text-blue-500" size={20} />,
    tag: "Encrypted",
  },
  {
    id: "heatwave-tested",
    title: "38°C+ Climate Tested",
    subtitle: "Proven in Paarl, Oudtshoorn & Atlantic Seaboard heat",
    icon: <Sun className="text-orange-500" size={20} />,
    tag: "Extreme Rated",
  },
  {
    id: "whatsapp-sync",
    title: "Instant WhatsApp Confirmation",
    subtitle: "Instant receipt sent to you + immediate warehouse alert",
    icon: <MessageCircle className="text-[#25D366]" size={20} />,
    tag: "Live Alerts",
    highlight: true,
  },
  {
    id: "returns-policy",
    title: "30-Day Hassle-Free Returns",
    subtitle: "Love it or swap it with no stressful questions",
    icon: <HeartHandshake className="text-rose-500" size={20} />,
    tag: "Guaranteed",
  },
];

interface Props {
  isDarkMode: boolean;
  variant?: "banner" | "strip" | "compact" | "cards";
  showTitle?: boolean;
}

export const HonorBadges: React.FC<Props> = ({
  isDarkMode,
  variant = "banner",
  showTitle = true,
}) => {
  if (variant === "strip") {
    return (
      <div className="flex flex-wrap items-center gap-2 pt-2">
        {HONOR_BADGES.slice(0, 4).map((badge) => (
          <div
            key={badge.id}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
              isDarkMode
                ? "bg-[#1C2541]/70 border-slate-700 text-slate-200"
                : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            {badge.icon}
            <span>{badge.title}</span>
            {badge.tag && (
              <span className="text-[10px] font-extrabold text-[#F9CA24] ml-0.5">
                • {badge.tag}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`p-3.5 rounded-2xl border ${
          isDarkMode ? "bg-[#0B132B] border-slate-800" : "bg-amber-50/50 border-amber-200/60"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Award size={16} className="text-[#F9CA24]" />
          <span className="text-xs font-extrabold tracking-wide uppercase">
            Cape Sun Co Honor &amp; Trust Badges
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span className="font-semibold">2-3 Day Local CT Delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span className="font-semibold">30-Day Quality Guarantee</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span className="font-semibold">Capitec Pay &amp; Ozow Verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span className="font-semibold">WhatsApp Order Notifications</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-10 px-4 md:px-6 max-w-[1280px] mx-auto">
      {showTitle && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A3D62]/10 dark:bg-[#F9CA24]/20 text-[#0A3D62] dark:text-[#F9CA24] text-xs font-bold uppercase tracking-wider mb-2">
            <Award size={14} /> Official Customer Honor Badges
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Built for Cape Town Heat. Backed by Real Guarantees.
          </h2>
          <p className="text-xs sm:text-sm opacity-75 max-w-xl mx-auto mt-1">
            Every product is backed by official South African consumer protection, local Cape Town fulfillment, and immediate WhatsApp dispatch communication.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {HONOR_BADGES.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
              isDarkMode
                ? "bg-[#1C2541]/70 border-slate-700 hover:border-slate-600"
                : "bg-white border-zinc-200 hover:border-slate-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#0B132B] flex items-center justify-center">
                  {badge.icon}
                </div>
                {badge.tag && (
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      badge.highlight
                        ? "bg-[#F9CA24]/10 text-amber-600 dark:text-[#F9CA24] border-[#F9CA24]/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {badge.tag}
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-sm mb-1">{badge.title}</h3>
              <p className="text-xs opacity-75 leading-relaxed">{badge.subtitle}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 size={13} />
              <span>Verified &amp; Active</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Customer Loyalty Honor Badge Level Component
export const CustomerHonorBadgeLevel: React.FC<{
  loyaltyPoints: number;
  isDarkMode: boolean;
}> = ({ loyaltyPoints, isDarkMode }) => {
  let tierName = "Bronze Sun Explorer";
  let tierEmoji = "☀️";
  let tierColor = "from-amber-600 to-amber-800";
  let nextTier = "Silver Breeze Member (at 500 pts)";
  let progress = Math.min(100, (loyaltyPoints / 500) * 100);

  if (loyaltyPoints >= 1500) {
    tierName = "Diamond Cape Ambassador";
    tierEmoji = "💎";
    tierColor = "from-cyan-500 to-blue-700";
    nextTier = "Maximum Honor Achieved";
    progress = 100;
  } else if (loyaltyPoints >= 1000) {
    tierName = "Gold Solar Champion";
    tierEmoji = "👑";
    tierColor = "from-yellow-400 to-amber-600";
    nextTier = "Diamond Cape at 1,500 pts";
    progress = ((loyaltyPoints - 1000) / 500) * 100;
  } else if (loyaltyPoints >= 500) {
    tierName = "Silver Breeze Member";
    tierEmoji = "🌀";
    tierColor = "from-slate-400 to-slate-600";
    nextTier = "Gold Solar at 1,000 pts";
    progress = ((loyaltyPoints - 500) / 500) * 100;
  }

  return (
    <div
      className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isDarkMode ? "bg-[#1C2541]/80 border-slate-700" : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black flex items-center justify-center text-2xl shadow-sm">
          {tierEmoji}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm">{tierName}</span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#F9CA24] text-black">
              Honor Tier
            </span>
          </div>
          <div className="text-xs opacity-75 mt-0.5">
            {loyaltyPoints} Cape Sun Honor Points • Free priority queue &amp; bundle access
          </div>
        </div>
      </div>

      <div className="w-full sm:w-48 text-right">
        <div className="text-[11px] font-semibold opacity-80 mb-1">{nextTier}</div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#F9CA24] to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
