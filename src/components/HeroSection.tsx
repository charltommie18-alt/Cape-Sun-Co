import React from "react";
import { Star, ShieldCheck, Truck, Zap, ShoppingBag, Sparkles, Flame, Users, Play } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data/products";
import { CapeTownWeatherWidget } from "./CapeTownWeatherWidget";

interface Props {
  onExploreProducts: () => void;
  onOpenBundleBuilder: () => void;
  onOpenIndividualCheckout: (product: Product) => void;
  onOpenCollab: () => void;
  isDarkMode: boolean;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
}

export const HeroSection: React.FC<Props> = ({
  onExploreProducts,
  onOpenBundleBuilder,
  onOpenIndividualCheckout,
  onOpenCollab,
  isDarkMode,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  const neckFan = PRODUCTS.find((p) => p.id === "neckfan") || PRODUCTS[0];

  return (
    <section className="relative overflow-hidden py-10 md:py-16 px-4 md:px-6 max-w-[1280px] mx-auto">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F9CA24]/10 dark:bg-[#F9CA24]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        {/* Left Column: Headlines & Call to Actions */}
        <div className="space-y-6">
          {/* Top urgency badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F9CA24]/20 border border-[#F9CA24]/40 text-xs font-extrabold text-[#0A3D62] dark:text-[#F9CA24]">
            <Flame size={15} className="text-[#F9CA24] fill-[#F9CA24]" />
            <span>Cape Town Summer: Stay Cool &amp; Sun-Safe In 38°C Heatwaves</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.08]">
            Cape Town Summer? <br />
            <span className="text-[#0A3D62] dark:text-[#F9CA24] underline decoration-[#F9CA24] decoration-wavy decoration-2">
              Stay Ice Cold
            </span>{" "}
            Without AC.
          </h1>

          <p className="text-base sm:text-lg opacity-85 max-w-xl leading-relaxed">
            Welcome to Cape Sun Co — keeping Cape Town cool, refreshed, and sun-safe through sunny Clifton beach days, taxi commutes, weekend braais, and sweltering summer afternoons. Braid-safe, toddler-certified, and delivered locally in 2 to 3 days.
          </p>

          {/* Social Proof Rating */}
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <div className="flex text-[#F9CA24]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-current" />
              ))}
            </div>
            <span className="font-extrabold">4.88 / 5</span>
            <span className="opacity-70">• 1,243 Capetonians chilling cool</span>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={onExploreProducts}
              className="px-7 py-3.5 bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-sm rounded-full shadow-lg hover:opacity-95 hover:scale-[1.02] transition flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={16} /> Shop Summer Essentials
            </button>

            <button
              type="button"
              onClick={onOpenBundleBuilder}
              className="px-6 py-3.5 bg-[#F9CA24] text-black font-extrabold text-sm rounded-full shadow-md hover:brightness-105 hover:scale-[1.02] transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={16} /> Build Bundle (Save R150)
            </button>

            <button
              type="button"
              onClick={onOpenCollab}
              className="px-5 py-3.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Users size={15} /> Group Collab
            </button>
          </div>

          {/* Value props badges */}
          <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-[#0A3D62] dark:text-[#F9CA24] shrink-0" />
              <span>CT Delivery 2 to 3 Days</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span>100% Braid &amp; Hair Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#F9CA24] shrink-0" />
              <span>Capitec Pay &amp; EFT</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Showcase Spotlight */}
        <div className="relative">
          <div
            className={`p-6 sm:p-8 rounded-[28px] border shadow-2xl transition ${
              isDarkMode ? "bg-[#1C2541]/80 border-slate-700" : "bg-white border-zinc-200"
            }`}
          >
            {/* Top Pill */}
            <div className="flex justify-between items-center mb-4">
              <span className="bg-[#F9CA24] text-black text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Summer #1 Bestseller
              </span>
              <span className="text-red-500 font-extrabold text-xs flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                Only {neckFan.stock} left in CT
              </span>
            </div>

            {/* Visual */}
            <div
              onClick={() => onOpenIndividualCheckout(neckFan)}
              className="aspect-[4/3] rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#0B132B] dark:to-[#1C2541] flex flex-col items-center justify-center shadow-inner relative overflow-hidden cursor-pointer group"
            >
              {neckFan.image ? (
                <img
                  src={neckFan.image}
                  alt={neckFan.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              ) : (
                <span className="text-7xl sm:text-8xl">{neckFan.emoji}</span>
              )}
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>4000mAh • 8h Battery</span>
              </div>
              <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                <Play size={10} className="fill-current text-[#F9CA24]" />
                <span>0:15 Demo Video</span>
              </div>
            </div>

            {/* Product Meta */}
            <div className="mt-5 space-y-2">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-extrabold">{neckFan.title}</h3>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#0A3D62] dark:text-[#F9CA24]">
                    R{neckFan.price}
                  </span>
                  <span className="text-xs line-through opacity-50 ml-1.5">R{neckFan.compare}</span>
                </div>
              </div>
              <p className="text-xs opacity-75">{neckFan.subtitle}</p>
            </div>

            {/* Fast Dedicated Checkout Trigger */}
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
              <button
                type="button"
                onClick={() => onOpenIndividualCheckout(neckFan)}
                className="w-full py-3 bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-xs rounded-full shadow hover:brightness-105 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="bg-[#F9CA24] text-black dark:bg-black dark:text-white text-[9px] px-1.5 py-0.5 rounded font-extrabold">
                  INSTANT
                </span>
                <span>Open Dedicated Item Checkout (R{neckFan.price})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Cape Town Weather Widget with Pulse Animation & Cooling Recommendations */}
      <div className="mt-8">
        <CapeTownWeatherWidget
          variant="banner"
          isDarkMode={isDarkMode}
          onSelectProduct={(productId) => {
            const found = PRODUCTS.find((p) => p.id === productId);
            if (found) onOpenIndividualCheckout(found);
          }}
        />
      </div>
    </section>
  );
};
