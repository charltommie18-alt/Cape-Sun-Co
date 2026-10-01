import React, { useState } from "react";
import { Product } from "../types";
import {
  X,
  Star,
  ShieldCheck,
  RotateCcw,
  Truck,
  Droplets,
  Check,
  ShoppingBag,
  ExternalLink,
  Plus,
  Heart,
  Play,
  Copy,
  CheckCheck,
} from "lucide-react";
import { PRODUCTS, TESTIMONIALS } from "../data/products";
import { CAPITEC_BANK_DETAILS } from "../types";
import { HonorBadges } from "./HonorBadges";

interface Props {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, color?: string, size?: string) => void;
  onOpenIndividualCheckout: (product: Product, color?: string, size?: string) => void;
  isDarkMode: boolean;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
}

export const ProductDetailModal: React.FC<Props> = ({
  product,
  onClose,
  onAddToCart,
  onOpenIndividualCheckout,
  isDarkMode,
  wishlistIds = [],
  onToggleWishlist,
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : undefined);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [mediaMode, setMediaMode] = useState<"photo" | "video">("photo");
  const [activeTab, setActiveTab] = useState<"Description" | "Video Demo" | "Specs" | "Size Chart" | "Shipping" | "Capitec EFT" | "Reviews">(
    "Description"
  );
  const [copiedBank, setCopiedBank] = useState(false);

  const isWishlisted = wishlistIds.includes(product.id);
  const galleryImages = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
  const activeImage = galleryImages[selectedImageIndex] || product.image;

  const copyBankInfo = () => {
    const text = `Bank: ${CAPITEC_BANK_DETAILS.bankName}\nAccount Name: ${CAPITEC_BANK_DETAILS.accountName}\nAccount Number: ${CAPITEC_BANK_DETAILS.accountNumber}\nBranch Code: ${CAPITEC_BANK_DETAILS.branchCode}\nSwift: ${CAPITEC_BANK_DETAILS.swiftCode}`;
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        className={`relative w-full md:max-w-[1040px] max-h-[94vh] md:max-h-[88vh] rounded-t-[24px] md:rounded-[24px] overflow-hidden flex flex-col z-10 transition-colors ${
          isDarkMode ? "bg-[#0B132B] text-slate-100 border border-slate-700" : "bg-white text-[#2C3E50]"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition"
        >
          <X size={18} />
        </button>

        <div className="overflow-y-auto">
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-0">
            {/* Left Column: Visual & Guarantee badges */}
            <div className={`p-5 md:p-6 ${isDarkMode ? "bg-[#1C2541]/50" : "bg-[#F8FAFB]"}`}>
              <div className="aspect-[4/3] rounded-[18px] bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm relative overflow-hidden group">
                {mediaMode === "video" && product.videoUrl ? (
                  product.videoUrl.includes("youtube") ? (
                    <iframe
                      src={product.videoUrl}
                      title={product.videoTitle || product.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      key={product.videoUrl}
                      src={product.videoUrl}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="w-full h-full object-contain bg-black"
                    />
                  )
                ) : activeImage ? (
                  <img
                    src={activeImage}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[84px]">{product.emoji}</span>
                )}

                {/* Media Mode Toggle Badge */}
                {product.videoUrl && (
                  <div className="absolute bottom-3 left-3 flex gap-1 z-10">
                    <button
                      type="button"
                      onClick={() => setMediaMode("photo")}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold shadow backdrop-blur-md transition cursor-pointer ${
                        mediaMode === "photo"
                          ? "bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black"
                          : "bg-black/60 text-white hover:bg-black/80"
                      }`}
                    >
                      Photos ({galleryImages.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaMode("video")}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold shadow backdrop-blur-md transition flex items-center gap-1 cursor-pointer ${
                        mediaMode === "video"
                          ? "bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black"
                          : "bg-black/60 text-white hover:bg-black/80"
                      }`}
                    >
                      <Play size={10} className="fill-current text-[#F9CA24]" />
                      <span>Video Demo</span>
                    </button>
                  </div>
                )}

                {/* Wishlist toggle button on image */}
                <button
                  type="button"
                  onClick={() => onToggleWishlist?.(product.id)}
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition z-10 cursor-pointer ${
                    isWishlisted
                      ? "bg-red-500 text-white hover:bg-red-600 scale-105"
                      : "bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-red-500"
                  }`}
                  title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                >
                  <Heart size={18} className={isWishlisted ? "fill-white text-white" : ""} />
                </button>
              </div>

              {/* Thumbnails Gallery */}
              {galleryImages.length > 0 && (
                <div className="mt-3 grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {galleryImages.map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setMediaMode("photo");
                        setSelectedImageIndex(i);
                      }}
                      className={`aspect-square rounded-[10px] border-2 overflow-hidden cursor-pointer transition ${
                        mediaMode === "photo" && selectedImageIndex === i
                          ? "border-[#0A3D62] dark:border-[#F9CA24] ring-2 ring-[#0A3D62]/20 dark:ring-[#F9CA24]/20 scale-105"
                          : "border-zinc-200 dark:border-slate-800 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.shortTitle} view ${i + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {product.videoUrl && (
                    <button
                      type="button"
                      onClick={() => setMediaMode("video")}
                      className={`aspect-square rounded-[10px] border-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition text-[10px] font-bold ${
                        mediaMode === "video"
                          ? "border-[#0A3D62] dark:border-[#F9CA24] bg-[#0A3D62]/10 dark:bg-[#F9CA24]/10 text-[#0A3D62] dark:text-[#F9CA24]"
                          : "border-zinc-200 dark:border-slate-800 bg-black/5 dark:bg-white/5 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Play size={16} className="fill-current text-[#F9CA24]" />
                      <span>Video</span>
                    </button>
                  )}
                </div>
              )}

              {/* Trust Badges - 1-Year Warranty removed and replaced with Quality Guarantee */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
                <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 rounded-[10px] p-2.5 flex items-center gap-2">
                  <Truck size={14} className="text-[#0A3D62] dark:text-[#F9CA24]" />
                  <span>2-3 Days CT</span>
                </div>
                <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 rounded-[10px] p-2.5 flex items-center gap-2">
                  <RotateCcw size={14} className="text-[#0A3D62] dark:text-[#F9CA24]" />
                  <span>30-Day Returns</span>
                </div>
                <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 rounded-[10px] p-2.5 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>Quality Guarantee</span>
                </div>
              </div>

              {/* Honor Badges */}
              <div className="mt-3">
                <HonorBadges isDarkMode={isDarkMode} variant="strip" showTitle={false} />
              </div>
            </div>

            {/* Right Column: Specs, Price, Individual Checkout Button */}
            <div className="p-5 md:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-[#F9CA24] text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                    {product.badge}
                  </span>
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Only {product.stock} left in CT!
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleWishlist?.(product.id)}
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full transition cursor-pointer ${
                    isWishlisted
                      ? "bg-red-50 dark:bg-red-950/30 text-red-500 border border-red-200 dark:border-red-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-500"
                  }`}
                >
                  <Heart size={14} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
                  <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
                </button>
              </div>

              <h2 className="text-xl md:text-2xl font-extrabold leading-tight">{product.title}</h2>
              <div className="text-[11px] opacity-60">{product.seo}</div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-extrabold text-[#0A3D62] dark:text-[#F9CA24]">R{product.price}</span>
                <span className="text-base line-through opacity-50">R{product.compare}</span>
                <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  SAVE R{product.compare - product.price}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex text-[#F9CA24]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-current" />
                  ))}
                </div>
                <span className="font-bold">{product.rating}</span>
                <span className="opacity-60">({product.reviewsCount} reviews) • Cape Town dispatch</span>
              </div>

              {/* Verified Local Sourcing Banner */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                  <div>
                    <span className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200">
                      Closest &amp; Cheapest Verified SA Sourced
                    </span>
                    <div className="text-[10px] opacity-70">
                      {product.supplierName || "Bob Shop SA / Local Wholesaler"} • SKU: {product.supplierSku || product.id}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-[9px] uppercase tracking-wider">
                  Verified Stock
                </span>
              </div>

              {/* Color Options */}
              {product.colors && (
                <div className="pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider mb-2">
                    Color: <span className="font-normal">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition cursor-pointer ${
                          selectedColor === c
                            ? "bg-[#0A3D62] text-white border-[#0A3D62] dark:bg-[#F9CA24] dark:text-black dark:border-[#F9CA24]"
                            : "bg-white dark:bg-[#1C2541] border-zinc-200 dark:border-slate-700"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Options */}
              {product.sizes && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-2">Size</div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition cursor-pointer ${
                          selectedSize === s
                            ? "bg-[#0A3D62] text-white border-[#0A3D62] dark:bg-[#F9CA24] dark:text-black dark:border-[#F9CA24]"
                            : "bg-white dark:bg-[#1C2541] border-zinc-200 dark:border-slate-700"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: Individual Checkout & Add to Cart */}
              <div className="pt-2 space-y-2.5">
                {/* Dedicated Separate Checkout Page Trigger */}
                <button
                  type="button"
                  onClick={() => onOpenIndividualCheckout(product, selectedColor, selectedSize)}
                  className="w-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-sm py-3.5 rounded-full flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition cursor-pointer"
                >
                  <span className="bg-[#F9CA24] text-black dark:bg-black dark:text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                    SEPARATE CHECKOUT
                  </span>
                  <span>Open Dedicated Checkout Page - R{product.price}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onAddToCart(product, selectedColor, selectedSize)}
                    className="w-full bg-slate-100 dark:bg-[#1C2541] text-current font-extrabold text-xs py-3 rounded-full flex items-center justify-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    <ShoppingBag size={14} /> Add to Cart
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleWishlist?.(product.id)}
                    className={`w-full font-extrabold text-xs py-3 rounded-full flex items-center justify-center gap-1.5 transition border cursor-pointer ${
                      isWishlisted
                        ? "border-red-400 bg-red-50 dark:bg-red-950/40 text-red-500"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-red-500"
                    }`}
                  >
                    <Heart size={14} className={isWishlisted ? "fill-red-500" : ""} />
                    <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
                  </button>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex gap-1 overflow-x-auto scrollbar-none pb-2">
                  {([
                    ...(product.videoUrl ? ["Video Demo"] : []),
                    "Description",
                    "Specs",
                    "Size Chart",
                    "Shipping",
                    "Capitec EFT",
                    "Reviews",
                  ] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                        activeTab === tab
                          ? "bg-[#0A3D62] text-white border-[#0A3D62] dark:bg-[#F9CA24] dark:text-black dark:border-[#F9CA24]"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-400"
                      }`}
                    >
                      {tab === "Video Demo" ? "🎥 Video Demo" : tab}
                    </button>
                  ))}
                </div>

                <div className="mt-3 text-xs leading-relaxed opacity-85">
                  {activeTab === "Video Demo" && product.videoUrl && (
                    <div className="space-y-3">
                      <div className="aspect-video rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-black">
                        {product.videoUrl.includes("youtube") ? (
                          <iframe
                            src={product.videoUrl}
                            title={product.videoTitle || product.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={product.videoUrl}
                            controls
                            autoPlay
                            muted
                            playsInline
                            loop
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                      <p className="text-[11px] opacity-75">
                        Real demonstration of the {product.title} undergoing cooling tests in Cape Town sunny conditions.
                      </p>
                    </div>
                  )}

                  {activeTab === "Description" && (
                    <div>
                      <p>{product.desc}</p>
                      <div className="mt-2 font-bold text-[#0A3D62] dark:text-[#F9CA24]">
                        Tested in real South African conditions: 38°C Oudtshoorn heatwaves, Clifton beach breezes, and outdoor braais.
                      </div>
                    </div>
                  )}

                  {activeTab === "Specs" && (
                    <ul className="space-y-1.5">
                      {product.specs.map((s, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check size={14} className="text-emerald-500 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === "Size Chart" && (
                    <div className="space-y-1">
                      <div>Kids UPF 50+ Sunsuit: 0-6M (chest 42cm), 6-12M (44cm), 1-2Y (48cm), 2-3Y (52cm), 3-4Y (54cm).</div>
                      <div>Cooling Towel: Universal 100cm x 30cm full neck and shoulder span.</div>
                      <div>Neck Fan: Ergonomic flexible silicone band - fits all neck sizes comfortably (260g).</div>
                    </div>
                  )}

                  {activeTab === "Shipping" && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                          <div className="font-extrabold text-[#0A3D62] dark:text-[#F9CA24]">Local Cape Town</div>
                          <div className="font-black text-sm text-emerald-600 dark:text-emerald-400">R85</div>
                          <div className="text-[10px] opacity-75">2 to 3 working days</div>
                        </div>
                        <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                          <div className="font-extrabold text-[#0A3D62] dark:text-[#F9CA24]">National Main Centers</div>
                          <div className="font-black text-sm text-[#0A3D62] dark:text-[#F9CA24]">R145</div>
                          <div className="text-[10px] opacity-75">JHB, DBN, PTA (3-4 days)</div>
                        </div>
                        <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                          <div className="font-extrabold text-[#0A3D62] dark:text-[#F9CA24]">Regional &amp; Outlying</div>
                          <div className="font-black text-sm text-purple-600 dark:text-purple-400">R175</div>
                          <div className="text-[10px] opacity-75">Non-metro (3-5 days)</div>
                        </div>
                        <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                          <div className="font-extrabold text-[#0A3D62] dark:text-[#F9CA24]">Priority Overnight</div>
                          <div className="font-black text-sm text-rose-600 dark:text-rose-400">R195</div>
                          <div className="text-[10px] opacity-75">Next business day</div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-[#0A3D62] dark:text-[#F9CA24]">International Courier (DHL Express)</span>
                          <span className="font-black text-sm text-amber-600 dark:text-amber-400">R495</span>
                        </div>
                        <p className="text-[10px] opacity-80 mt-0.5">
                          Door-to-door worldwide shipping with international tracking (4 to 7 working days).
                        </p>
                      </div>

                      <p className="text-[11px] opacity-80 leading-relaxed">
                        Every product comes to our Cape Town hub first for manual quality inspection and protective heat-safe repacking before courier handover. Automated The Courier Guy tracking waybill and live WhatsApp updates dispatched directly to your mobile phone.
                      </p>
                    </div>
                  )}

                  {activeTab === "Capitec EFT" && (
                    <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#0A3D62] dark:text-[#F9CA24]">
                          Capitec Official Banking Details
                        </span>
                        <button
                          type="button"
                          onClick={copyBankInfo}
                          className="px-2 py-1 rounded bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedBank ? <CheckCheck size={12} /> : <Copy size={12} />}
                          <span>{copiedBank ? "Copied" : "Copy Info"}</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>Bank: <span className="font-bold">{CAPITEC_BANK_DETAILS.bankName}</span></div>
                        <div>Account Name: <span className="font-bold">{CAPITEC_BANK_DETAILS.accountName}</span></div>
                        <div>Account No: <span className="font-bold font-mono">{CAPITEC_BANK_DETAILS.accountNumber}</span></div>
                        <div>Branch Code: <span className="font-bold font-mono">{CAPITEC_BANK_DETAILS.branchCode}</span></div>
                        <div>Swift: <span className="font-bold font-mono">{CAPITEC_BANK_DETAILS.swiftCode}</span></div>
                        <div>Reference: <span className="font-bold text-[#0A3D62] dark:text-[#F9CA24]">{product.id.toUpperCase()}-YOURNAME</span></div>
                      </div>
                    </div>
                  )}

                  {activeTab === "Reviews" && (
                    <div className="space-y-2">
                      {TESTIMONIALS.slice(0, 2).map((t, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1C2541]/40"
                        >
                          <div className="flex text-[#F9CA24] mb-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star key={j} size={11} className="fill-current" />
                            ))}
                          </div>
                          <p className="italic">"{t.text}"</p>
                          <div className="font-bold text-[10px] mt-1 text-[#0A3D62] dark:text-[#F9CA24]">
                            {t.name} • {t.verified}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
