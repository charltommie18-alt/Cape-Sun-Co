import React, { useState } from "react";
import {
  Award,
  Sparkles,
  ShoppingBag,
  Share2,
  CheckCircle2,
  Copy,
  ChevronRight,
  TrendingUp,
  Percent,
  Gift,
  Star,
  Video,
  Recycle,
  UserCheck,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  maxPoints: number;
  discountPercent: number;
  discountCode: string;
  badgeColor: string;
  borderColor: string;
  perks: string[];
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: "bronze",
    name: "Bronze Breeze",
    minPoints: 0,
    maxPoints: 249,
    discountPercent: 5,
    discountCode: "BREEZE5",
    badgeColor: "bg-amber-700/20 text-amber-700 dark:text-amber-300 border-amber-600/30",
    borderColor: "border-amber-600/40",
    perks: [
      "5% Off storewide discount voucher",
      "Earn 1 Sunshine Point for every R10 spent",
      "Early heatwave advisory notifications",
    ],
  },
  {
    id: "silver",
    name: "Silver Shade",
    minPoints: 250,
    maxPoints: 499,
    discountPercent: 10,
    discountCode: "SILVER10",
    badgeColor: "bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30",
    borderColor: "border-slate-400 dark:border-slate-600",
    perks: [
      "10% Off storewide discount voucher",
      "Priority dispatch queue in Cape Town",
      "Member-only secret beach bundle drops",
    ],
  },
  {
    id: "gold",
    name: "Gold Sunshine",
    minPoints: 500,
    maxPoints: 999,
    discountPercent: 15,
    discountCode: "GOLD15",
    badgeColor: "bg-amber-400/20 text-amber-600 dark:text-amber-400 border-amber-400/40",
    borderColor: "border-amber-400",
    perks: [
      "15% Off storewide discount voucher",
      "Cape Town Priority Quality Check & Repacking (2-4 day local delivery)",
      "VIP warranty extension (12 months on all electronics)",
    ],
  },
  {
    id: "platinum",
    name: "Platinum Solar VIP",
    minPoints: 1000,
    maxPoints: 99999,
    discountPercent: 20,
    discountCode: "SOLAR20",
    badgeColor: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40",
    borderColor: "border-emerald-500",
    perks: [
      "20% Off storewide VIP discount voucher",
      "Dedicated WhatsApp concierge for festival & heatwave rush orders",
      "Free seasonal replacement sponge & cooling towel kit every summer",
    ],
  },
];

export interface EarnWay {
  id: string;
  title: string;
  points: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge: string;
}

export const HOW_TO_EARN_POINTS: EarnWay[] = [
  {
    id: "shop",
    title: "Shop Cooling & Sun Gear",
    points: "+1 pt per R10",
    description: "Earn 1 Sunshine Point for every R10 spent (e.g. a R499 fan earns 49 points). Points accumulate to unlock milestone discount tiers.",
    icon: ShoppingBag,
    badge: "Continuous",
  },
  {
    id: "review",
    title: "Write a Verified Review",
    points: "+50 pts",
    description: "Leave honest feedback and photos of your neck fan or sunsuit tested under Cape sun.",
    icon: Star,
    badge: "Per Product",
  },
  {
    id: "referral",
    title: "Refer a Lekka Friend",
    points: "+100 pts",
    description: "Gift your friend R50 off their first order. You automatically get 100 points when they check out.",
    icon: Share2,
    badge: "Unlimited",
  },
  {
    id: "profile",
    title: "Complete Sun Profile",
    points: "+50 pts",
    description: "Save your Cape climate zone, cooling intensity, and outdoor activities in your account.",
    icon: UserCheck,
    badge: "One-Time",
  },
  {
    id: "video",
    title: "Upload Video / Photo Demo",
    points: "+75 pts",
    description: "Submit a clip showing your gear at Clifton 4th, Paarl heat, or festival camping.",
    icon: Video,
    badge: "Monthly",
  },
  {
    id: "recycle",
    title: "Eco-Battery Recycle Trade-in",
    points: "+120 pts",
    description: "Drop off any dead portable fan at our Cape Town depot for safe certified lithium recycling.",
    icon: Recycle,
    badge: "Eco Hero",
  },
];

interface Props {
  loyaltyPoints?: number;
  isDarkMode: boolean;
  onApplyDiscountCode?: (code: string) => void;
  userEmail?: string;
  userName?: string;
  onSimulateEarn?: (points: number, reason: string) => void;
}

export const LoyaltyRewards: React.FC<Props> = ({
  loyaltyPoints = 0,
  isDarkMode,
  onApplyDiscountCode,
  userEmail,
  userName = "Sunshine Member",
  onSimulateEarn,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [referralCopied, setReferralCopied] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Determine current tier
  const currentTierIndex = LOYALTY_TIERS.findIndex(
    (tier, idx) =>
      loyaltyPoints >= tier.minPoints &&
      (idx === LOYALTY_TIERS.length - 1 || loyaltyPoints <= tier.maxPoints)
  );
  const activeTier = LOYALTY_TIERS[Math.max(0, currentTierIndex)];
  const nextTier =
    currentTierIndex < LOYALTY_TIERS.length - 1
      ? LOYALTY_TIERS[currentTierIndex + 1]
      : null;

  // Calculate progress toward next tier
  let progressPercentage = 100;
  let pointsNeeded = 0;

  if (nextTier) {
    const rangeSpan = nextTier.minPoints - activeTier.minPoints;
    const currentProgress = loyaltyPoints - activeTier.minPoints;
    progressPercentage = Math.min(
      100,
      Math.max(5, Math.round((currentProgress / rangeSpan) * 100))
    );
    pointsNeeded = Math.max(0, nextTier.minPoints - loyaltyPoints);
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    if (onApplyDiscountCode) {
      onApplyDiscountCode(code);
    }
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const referralCode = `CAPESUN-${(userEmail?.split("@")[0] || "LEKKA").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)}`;
  const referralLink = `https://capesun.co.za?ref=${referralCode}`;

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(referralLink);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 3000);
  };

  return (
    <div className="space-y-6" id="loyalty-rewards-component">
      {/* Top Banner: Current Points & Next Tier Countdown */}
      <div
        className={`p-5 md:p-6 rounded-[20px] border shadow-sm relative overflow-hidden ${
          isDarkMode
            ? "bg-gradient-to-br from-[#1C2541] to-[#0B132B] border-slate-700"
            : "bg-gradient-to-br from-[#0A3D62] to-[#082d49] border-[#0A3D62] text-white"
        }`}
      >
        {/* Subtle decorative background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#F9CA24]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F9CA24]/20 text-[#F9CA24] border border-[#F9CA24]/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Award size={13} /> Cape Sun Loyalty Rewards
            </div>
            <h3 className="text-xl md:text-2xl font-black tracking-tight text-white">
              {userName}&apos;s Rewards Status
            </h3>
            <p className="text-xs text-slate-300 max-w-md mt-1 leading-relaxed">
              Earn Sunshine Points on every order and climb through our South African cooling discount tiers.
            </p>
          </div>

          {/* Points Display Counter */}
          <div className="bg-black/30 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 flex items-center gap-4 shrink-0">
            <div>
              <div className="text-[10px] uppercase font-black text-slate-300 tracking-wider">
                Current Balance
              </div>
              <div className="text-2xl md:text-3xl font-black text-[#F9CA24] flex items-baseline gap-1">
                <span>{loyaltyPoints}</span>
                <span className="text-xs font-bold text-white/80">pts</span>
              </div>
            </div>
            <div className="h-10 w-[1px] bg-white/15" />
            <div>
              <div className="text-[10px] uppercase font-black text-slate-300 tracking-wider">
                Active Tier
              </div>
              <div className="text-sm font-extrabold text-white flex items-center gap-1 mt-0.5">
                <Sparkles size={14} className="text-[#F9CA24]" />
                <span>{activeTier.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar Towards Next Discount Tier */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <TrendingUp size={14} className="text-[#F9CA24]" />
              {nextTier ? (
                <>
                  Progress to{" "}
                  <span className="text-[#F9CA24] underline decoration-[#F9CA24]/40 font-extrabold">
                    {nextTier.name} ({nextTier.discountPercent}% OFF)
                  </span>
                </>
              ) : (
                <span className="text-emerald-400 font-extrabold">
                  Highest Tier Achieved: Platinum Solar VIP (20% OFF)
                </span>
              )}
            </span>

            {nextTier ? (
              <span className="text-slate-300 font-medium">
                <strong className="text-white font-extrabold">{pointsNeeded} points</strong> needed to unlock{" "}
                {nextTier.discountPercent}% off
              </span>
            ) : (
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <CheckCircle2 size={13} /> Max Discount Unlocked
              </span>
            )}
          </div>

          {/* Graphical Progress Bar */}
          <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F9CA24] via-amber-400 to-emerald-400 transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-300 mt-2 font-medium">
            <span>{activeTier.name} ({activeTier.minPoints} pts)</span>
            <span className="text-[#F9CA24] font-bold">{progressPercentage}% Completed</span>
            <span>{nextTier ? `${nextTier.name} (${nextTier.minPoints} pts)` : "VIP"}</span>
          </div>
        </div>

        {/* Current Tier Unlocked Voucher Box */}
        <div className="mt-4 p-3.5 bg-black/25 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F9CA24]/20 border border-[#F9CA24]/40 flex items-center justify-center text-[#F9CA24] shrink-0 font-black">
              %{activeTier.discountPercent}
            </div>
            <div>
              <div className="font-bold text-white">
                Your Current Unlocked Benefit: {activeTier.discountPercent}% Off Storewide
              </div>
              <div className="text-[11px] text-slate-300">
                Use voucher code at checkout to claim your tier savings.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <code className="px-3 py-1.5 rounded-lg bg-black/40 font-mono font-black text-[#F9CA24] border border-[#F9CA24]/30 tracking-wider text-xs">
              {activeTier.discountCode}
            </code>
            <button
              type="button"
              onClick={() => handleCopyCode(activeTier.discountCode)}
              className="px-3 py-1.5 rounded-lg bg-[#F9CA24] text-black font-extrabold hover:bg-amber-300 transition flex items-center gap-1.5 cursor-pointer shadow"
            >
              {copiedCode === activeTier.discountCode ? (
                <>
                  <CheckCircle2 size={13} />
                  <span>Applied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Clear Math Explainer & Pricing Protection Safeguard */}
        <div className="mt-3.5 p-3.5 rounded-xl bg-black/40 backdrop-blur-sm border border-amber-400/30 text-[11px] text-slate-200 flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
            !
          </div>
          <div className="leading-relaxed">
            <strong className="text-[#F9CA24] font-black uppercase tracking-wider block mb-0.5">
              Pricing Safeguard &amp; Loyalty Math:
            </strong>
            Points are earned at <strong className="text-white">1 Sunshine Point per R10 spent</strong>. If a customer spends R100, they earn <strong className="text-[#F9CA24]">10 points (worth R1.00 credit)</strong> — they do <span className="underline font-bold text-red-300">NOT</span> get 100% off. <strong className="text-white">1 point NEVER equals 10% or 1%</strong>. Accumulating points redeems as store credit vouchers (100 points = R10 voucher) or unlocks fixed milestone codes: 5% (BREEZE5), 10% (SILVER10), 15% (GOLD15), or 20% (SOLAR20). Storewide order discount is strictly capped at maximum 20%.
          </div>
        </div>
      </div>

      {/* Tier Breakdown: Visual Roadmap */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-base font-extrabold tracking-tight">Discount Tiers &amp; Milestone Benefits</h4>
            <p className="text-xs opacity-75">
              Accumulate points to automatically unlock higher storewide discounts and VIP perks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {LOYALTY_TIERS.map((tier, idx) => {
            const isCurrent = tier.id === activeTier.id;
            const isUnlocked = loyaltyPoints >= tier.minPoints;
            const isNext = nextTier?.id === tier.id;

            return (
              <div
                key={tier.id}
                className={`p-4 rounded-[16px] border flex flex-col justify-between transition-all duration-200 ${
                  isCurrent
                    ? `${tier.borderColor} ring-2 ring-amber-400/50 ${
                        isDarkMode ? "bg-[#1C2541]" : "bg-amber-50/50"
                      }`
                    : isUnlocked
                    ? `${isDarkMode ? "bg-[#1C2541]/50 border-slate-700" : "bg-white border-zinc-200"}`
                    : `opacity-70 ${isDarkMode ? "bg-[#0B132B]/50 border-slate-800" : "bg-slate-50 border-zinc-200"}`
                }`}
              >
                <div>
                  {/* Status header */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${tier.badgeColor}`}
                    >
                      {tier.minPoints}+ Pts
                    </span>
                    {isCurrent ? (
                      <span className="text-[10px] font-black bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black px-2 py-0.5 rounded-full shadow-sm">
                        Current Tier
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={11} /> Unlocked
                      </span>
                    ) : isNext ? (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        Next Tier
                      </span>
                    ) : (
                      <span className="text-[10px] opacity-50">Locked</span>
                    )}
                  </div>

                  <h5 className="font-extrabold text-sm">{tier.name}</h5>
                  <div className="flex items-baseline gap-1 my-1.5">
                    <span className="text-2xl font-black text-amber-500">{tier.discountPercent}%</span>
                    <span className="text-xs font-bold opacity-75">OFF Storewide</span>
                  </div>

                  {/* Perks list */}
                  <ul className="space-y-1.5 my-3 text-[11px] leading-snug opacity-85">
                    {tier.perks.map((perk, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <CheckCircle2
                          size={12}
                          className={`shrink-0 mt-0.5 ${
                            isUnlocked
                              ? "text-emerald-500"
                              : isCurrent
                              ? "text-amber-500"
                              : "opacity-40"
                          }`}
                        />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tier Code Voucher Action */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 mt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] opacity-60">Voucher Code:</span>
                    <code className="font-mono font-bold text-xs">{tier.discountCode}</code>
                  </div>
                  {isUnlocked && (
                    <button
                      type="button"
                      onClick={() => handleCopyCode(tier.discountCode)}
                      className="w-full mt-2 py-1 px-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-[#F9CA24] hover:text-black dark:hover:bg-[#F9CA24] dark:hover:text-black text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {copiedCode === tier.discountCode ? (
                        <>
                          <CheckCircle2 size={12} /> Copied to Checkout
                        </>
                      ) : (
                        <>
                          <Percent size={11} /> Use {tier.discountPercent}% Code
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clear Breakdown: How to Earn More Points */}
      <div
        className={`p-5 rounded-[20px] border ${
          isDarkMode ? "bg-[#1C2541]/40 border-slate-700" : "bg-white border-zinc-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              <Gift size={14} /> Clear Earning Breakdown
            </div>
            <h4 className="text-base font-extrabold tracking-tight">How to Earn More Sunshine Points</h4>
            <p className="text-xs opacity-75">
              Simple ways to boost your balance and reach the next tier faster.
            </p>
          </div>

          <div className="text-[11px] font-bold opacity-80 flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full w-fit">
            <Sparkles size={13} />
            <span>R10 Spent = 1 Point Earned</span>
          </div>
        </div>

        {/* Earning methods grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {HOW_TO_EARN_POINTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition hover:border-amber-400/60 ${
                  isDarkMode ? "bg-[#0B132B]/60 border-slate-700/80" : "bg-slate-50/70 border-zinc-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <Icon size={16} />
                    </div>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {item.points}
                    </span>
                  </div>

                  <h5 className="text-xs font-extrabold">{item.title}</h5>
                  <p className="text-[11px] opacity-75 mt-1 leading-snug">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="opacity-60">{item.badge}</span>
                  {onSimulateEarn && (
                    <button
                      type="button"
                      onClick={() => {
                        const pts = parseInt(item.points.replace(/[^0-9]/g, "")) || 50;
                        onSimulateEarn(pts, item.title);
                        setActionNotice(`Added ${pts} points for "${item.title}"!`);
                        setTimeout(() => setActionNotice(null), 3000);
                      }}
                      className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Simulate</span>
                      <ArrowUpRight size={11} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Simulated notification banner */}
        {actionNotice && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={15} />
            <span>{actionNotice}</span>
          </div>
        )}
      </div>

      {/* Refer a Friend Share Box */}
      <div
        className={`p-5 rounded-[20px] border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          isDarkMode ? "bg-[#1C2541]/60 border-slate-700" : "bg-amber-50/60 border-amber-200"
        }`}
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Share2 size={14} /> Friend Referral Program (+100 Points)
          </div>
          <h4 className="text-sm font-extrabold">Give R50, Get 100 Sunshine Points</h4>
          <p className="text-xs opacity-75 max-w-lg">
            Share your personal referral link with family, colleagues, and festival buddies. When they place their first order, they receive R50 off and you earn 100 Sunshine Points.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <input
            type="text"
            readOnly
            value={referralLink}
            className={`text-xs px-3 py-2 rounded-xl border font-mono w-full md:w-56 focus:outline-none select-all ${
              isDarkMode ? "bg-[#0B132B] border-slate-700 text-white" : "bg-white border-zinc-300"
            }`}
          />
          <button
            type="button"
            onClick={handleCopyReferral}
            className="px-3.5 py-2 rounded-xl bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-xs flex items-center gap-1.5 hover:opacity-90 transition shrink-0 cursor-pointer shadow"
          >
            {referralCopied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
            <span>{referralCopied ? "Link Copied!" : "Copy Link"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
