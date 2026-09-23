import React, { useState } from "react";
import { Product, UserProfile } from "../types";
import { PRODUCTS } from "../data/products";
import { Star, ShieldCheck, Truck, ShoppingBag, Eye, Sparkles, History, Flame, Check, Heart, Play } from "lucide-react";

interface Props {
  currentUser: UserProfile | null;
  onSelectProduct: (product: Product) => void;
  onOpenIndividualCheckout: (product: Product, color?: string, size?: string) => void;
  onAddToCart: (product: Product, color?: string, size?: string) => void;
  isDarkMode: boolean;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
}

export const ProductCatalog: React.FC<Props> = ({
  currentUser,
  onSelectProduct,
  onOpenIndividualCheckout,
  onAddToCart,
  isDarkMode,
  wishlistIds = [],
  onToggleWishlist,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Determine personalized match tags for each product
  const getProductPersonalizationTag = (prod: Product): string | null => {
    if (!currentUser) return null;
    const interests = currentUser.interests || [];
    const interestsStr = interests.join(" ").toLowerCase();
    const prefs = currentUser.preferences;
    const purchased = currentUser.purchasedProductIds || [];

    if (prod.id === "uvbundle") {
      if (
        interestsStr.includes("kid") ||
        interestsStr.includes("toddler") ||
        interestsStr.includes("uv") ||
        prefs?.familyStatus === "Parent with Kids / Toddlers"
      ) {
        return "✨ Tailored for your Kids UV Safety profile";
      }
    }

    if (prod.id === "neckfan") {
      if (
        prefs?.coolingIntensity?.includes("Turbo") ||
        interestsStr.includes("heatwave") ||
        interestsStr.includes("braid") ||
        interestsStr.includes("paarl")
      ) {
        return `✨ Matched to your ${prefs?.climateZone || "heatwave"} defense`;
      }
    }

    if (prod.id === "powerbank") {
      if (
        interestsStr.includes("camp") ||
        interestsStr.includes("power") ||
        interestsStr.includes("solar") ||
        interestsStr.includes("off-grid") ||
        prefs?.familyStatus === "Outdoor Camper & Hiker"
      ) {
        return "✨ Matched to your Outdoor & Solar Backup interests";
      }
    }

    if (prod.id === "towel") {
      if (purchased.includes("neckfan")) {
        return "✨ Top companion to your Bladeless Neck Fan";
      }
      if (interestsStr.includes("beach") || interestsStr.includes("clifton") || interestsStr.includes("fitness")) {
        return "✨ 3-Second chill matched to your active beach profile";
      }
    }

    return null;
  };

  // Filter products based on selected tab
  const getFilteredProducts = (): Product[] => {
    if (filterCategory === "all") return PRODUCTS;
    if (filterCategory === "wishlist") {
      return PRODUCTS.filter((p) => wishlistIds.includes(p.id));
    }
    if (filterCategory === "tailored") {
      if (!currentUser) return PRODUCTS;
      const userInterestsStr = (currentUser.interests || []).join(" ").toLowerCase();
      const preferredCategories = currentUser.preferences?.preferredCategories || ["cooling"];

      return [...PRODUCTS].sort((a, b) => {
        const aMatch =
          preferredCategories.includes(a.category) ||
          userInterestsStr.includes(a.category === "sun-protection" ? "uv" : a.category);
        const bMatch =
          preferredCategories.includes(b.category) ||
          userInterestsStr.includes(b.category === "sun-protection" ? "uv" : b.category);
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
    }
    return PRODUCTS.filter((p) => p.category.toLowerCase().includes(filterCategory.toLowerCase()));
  };

  const filtered = getFilteredProducts();

  // Recently viewed items from user profile
  const recentlyViewed = currentUser?.viewedItemsHistory || [];

  return (
    <section id="products-catalog" className="py-12 px-4 md:px-6 max-w-[1280px] mx-auto">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A3D62]/10 dark:bg-[#F9CA24]/20 text-[#0A3D62] dark:text-[#F9CA24] text-xs font-bold uppercase tracking-wider mb-2">
            Cape Town Summer Essentials
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            South African Summer Essentials
          </h2>
          <p className="text-sm opacity-80 max-w-xl mt-1">
            Engineered for high-heat conditions in Cape Town and across SA. Local dispatch in 2 to 3 days; JHB &amp; regional 3 to 5 days.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: "All Essentials" },
            {
              id: "wishlist",
              label: `Saved Wishlist (${wishlistIds.length}) ❤️`,
            },
            {
              id: "tailored",
              label: currentUser
                ? `Tailored For ${currentUser.fullName.split(" ")[0]} ✨`
                : "Personalized Picks ✨",
            },
            { id: "cooling", label: "Neck Fans & Cooling" },
            { id: "sun-protection", label: "Kids UPF 50+" },
            { id: "power", label: "Solar & Power Backup" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition cursor-pointer ${
                filterCategory === cat.id
                  ? "bg-[#0A3D62] text-white border-[#0A3D62] dark:bg-[#F9CA24] dark:text-black dark:border-[#F9CA24]"
                  : "bg-white dark:bg-[#1C2541] border-slate-200 dark:border-slate-700 hover:border-slate-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Wishlist Empty State in Wishlist Tab */}
      {filterCategory === "wishlist" && filtered.length === 0 && (
        <div className="p-10 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 my-8">
          <Heart size={42} className="mx-auto text-red-400 opacity-60 mb-3" />
          <h3 className="font-extrabold text-lg mb-1">Your Wishlist is Empty</h3>
          <p className="text-xs opacity-75 max-w-md mx-auto mb-4">
            Click the heart icon on any product to save it here for later. You can move items directly to your cart whenever you are ready!
          </p>
          <button
            onClick={() => setFilterCategory("all")}
            className="px-5 py-2 bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-bold text-xs rounded-full cursor-pointer"
          >
            Browse All Essentials
          </button>
        </div>
      )}

      {/* Personalized Banner if Tailored mode is active */}
      {filterCategory === "tailored" && currentUser && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="text-[#F9CA24] shrink-0" size={18} />
            <div>
              <span className="font-extrabold text-slate-900 dark:text-amber-200">
                Sorted by your profile preferences:
              </span>{" "}
              <span className="opacity-80">
                {currentUser.preferences?.climateZone || currentUser.city} • {currentUser.preferences?.coolingIntensity || "Turbo Cooling"} •{" "}
                {currentUser.interests?.slice(0, 2).join(", ")}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-[10px] shrink-0">
            Personalized Match
          </span>
        </div>
      )}

      {/* Catalog Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((prod) => {
          const matchTag = getProductPersonalizationTag(prod);
          const isWishlisted = wishlistIds.includes(prod.id);

          return (
            <div
              key={prod.id}
              className={`rounded-[24px] border overflow-hidden flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-xl relative ${
                isDarkMode ? "bg-[#1C2541]/80 border-slate-700" : "bg-white border-zinc-200 shadow-sm"
              }`}
            >
              {/* Visual Top */}
              <div className="relative p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0B132B]/60 border-b border-slate-100 dark:border-slate-800">
                <span className="absolute top-3 left-3 bg-[#F9CA24] text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {prod.badge}
                </span>

                {/* Heart Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist?.(prod.id);
                  }}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm z-10 cursor-pointer ${
                    isWishlisted
                      ? "bg-red-500 text-white hover:bg-red-600 scale-105"
                      : "bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-red-500 hover:bg-white"
                  }`}
                  title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                >
                  <Heart size={15} className={isWishlisted ? "fill-white text-white" : "text-slate-500"} />
                </button>

                <div
                  onClick={() => onSelectProduct(prod)}
                  className="w-full aspect-[4/3] rounded-2xl overflow-hidden my-2 relative group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-center justify-center shadow-inner"
                >
                  {prod.image ? (
                    <img
                      src={prod.image}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <span className="text-7xl group-hover:scale-110 transition">{prod.emoji}</span>
                  )}
                  {prod.videoUrl && (
                    <div className="absolute bottom-2 right-2 bg-black/75 hover:bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm shadow transition">
                      <Play size={9} className="fill-current text-[#F9CA24]" />
                      <span>{prod.videoDuration || "Video"}</span>
                    </div>
                  )}
                </div>

                {/* Stock & Video indicator */}
                <div className="w-full flex justify-between items-center px-1 text-[9px]">
                  <span className="text-red-500 bg-red-500/10 font-bold px-2 py-0.5 rounded-full">
                    Only {prod.stock} left in CT
                  </span>
                  {prod.videoUrl && (
                    <button
                      type="button"
                      onClick={() => onSelectProduct(prod)}
                      className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-emerald-500/20 transition cursor-pointer"
                    >
                      <Play size={8} className="fill-current" /> Video Demo
                    </button>
                  )}
                </div>

                {/* Color swatches preview */}
                <div className="flex gap-1.5 mt-2">
                  {prod.colors.map((c, i) => (
                    <span
                      key={i}
                      title={c}
                      className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 bg-slate-300 dark:bg-slate-700"
                    />
                  ))}
                </div>
              </div>

              {/* Info Area */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Match Tag if applicable */}
                  {matchTag && (
                    <div className="mb-2 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md">
                      {matchTag}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-[#F9CA24] mb-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className="fill-current" />
                      ))}
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{prod.rating}</span>
                    <span className="opacity-60 text-[11px]">({prod.reviewsCount})</span>
                  </div>

                  <h3
                    onClick={() => onSelectProduct(prod)}
                    className="font-extrabold text-base leading-snug hover:text-[#0A3D62] dark:hover:text-[#F9CA24] transition cursor-pointer"
                  >
                    {prod.title}
                  </h3>
                  <p className="text-xs opacity-75 mt-1 line-clamp-2">{prod.subtitle || prod.desc}</p>
                </div>

                {/* Price Row */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                  <div className="flex justify-between items-baseline mb-3">
                    <div>
                      <span className="text-xl font-black text-[#0A3D62] dark:text-[#F9CA24]">
                        R{prod.price}
                      </span>
                      <span className="text-xs line-through opacity-50 ml-1.5">R{prod.compare}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      SAVE R{prod.compare - prod.price}
                    </span>
                  </div>

                  {/* Direct Individual Checkout CTA for this order item */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => onOpenIndividualCheckout(prod)}
                      className="w-full py-2.5 bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-xs rounded-full shadow hover:brightness-105 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="bg-[#F9CA24] text-black dark:bg-black dark:text-white text-[8px] font-black px-1 rounded">
                        SEPARATE CHECKOUT
                      </span>
                      <span>Order Item • R{prod.price}</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(prod)}
                        className="py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-[11px] font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye size={12} /> Specs
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddToCart(prod)}
                        className="py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag size={12} /> Add Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recently Viewed Shelf */}
      {recentlyViewed.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History size={16} className="text-[#F9CA24]" />
              <h3 className="font-extrabold text-base">Recently Viewed by You</h3>
            </div>
            <span className="text-xs opacity-60">Synced with your active profile</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentlyViewed.map((item) => {
              const fullProd = PRODUCTS.find((p) => p.id === item.productId);
              if (!fullProd) return null;
              return (
                <div
                  key={item.productId}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-2 text-xs transition hover:shadow-sm ${
                    isDarkMode ? "bg-[#1C2541]/50 border-slate-700" : "bg-white border-zinc-200"
                  }`}
                >
                  <div
                    onClick={() => onSelectProduct(fullProd)}
                    className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
                  >
                    {fullProd.image ? (
                      <img
                        src={fullProd.image}
                        alt={fullProd.title}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                    ) : (
                      <span className="text-2xl shrink-0">{item.productEmoji}</span>
                    )}
                    <div className="truncate">
                      <div className="font-bold truncate">{item.productTitle}</div>
                      <div className="text-[10px] text-[#0A3D62] dark:text-[#F9CA24] font-black">
                        R{item.price}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenIndividualCheckout(fullProd)}
                    className="px-2.5 py-1 bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black rounded-full text-[10px] font-bold shrink-0 hover:opacity-90 cursor-pointer"
                  >
                    Order
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
