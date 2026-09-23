import React, { useState } from "react";
import { Product } from "../types";
import { PRODUCTS } from "../data/products";
import { Sparkles, Check, ShoppingBag, Plus, ArrowRight } from "lucide-react";

interface Props {
  onOpenIndividualCheckout: (product: Product, color?: string, size?: string) => void;
  onAddToCart: (product: Product, color?: string, size?: string) => void;
  isDarkMode: boolean;
}

export const BundleBuilder: React.FC<Props> = ({
  onOpenIndividualCheckout,
  onAddToCart,
  isDarkMode,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(["neckfan", "towel"]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedProducts = PRODUCTS.filter((p) => selectedIds.includes(p.id));
  const subtotal = selectedProducts.reduce((acc, p) => acc + p.price, 0);
  const discount = selectedProducts.length >= 2 ? 150 : 0;
  const total = subtotal - discount;

  const handleAddAllToCart = () => {
    selectedProducts.forEach((p) => {
      onAddToCart(p, p.colors[0], p.sizes ? p.sizes[0] : undefined);
    });
  };

  return (
    <section id="bundle-builder" className="py-12 px-4 md:px-6 max-w-[1280px] mx-auto">
      <div
        className={`p-6 md:p-10 rounded-[28px] border shadow-xl ${
          isDarkMode ? "bg-[#1C2541]/80 border-slate-700" : "bg-gradient-to-br from-slate-50 to-white border-zinc-200"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F9CA24] text-black text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles size={14} /> Summer Bundle Special
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Build Your Cape Summer Kit &amp; Save R150
            </h2>
            <p className="text-sm opacity-75 max-w-xl mt-1">
              Select 2 or more essentials below to automatically apply the R150 bundle rebate at checkout.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs uppercase font-bold opacity-70">Automatic Bundle Rebate</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">-R150 OFF</div>
          </div>
        </div>

        {/* Product Selection Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {PRODUCTS.map((prod) => {
            const isSelected = selectedIds.includes(prod.id);
            return (
              <div
                key={prod.id}
                onClick={() => toggleSelect(prod.id)}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-[#0A3D62] dark:border-[#F9CA24] bg-[#0A3D62]/5 dark:bg-[#F9CA24]/10 shadow-md"
                    : isDarkMode
                    ? "border-slate-800 bg-[#0B132B] opacity-70 hover:opacity-100"
                    : "border-zinc-200 bg-white opacity-80 hover:opacity-100"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative shrink-0">
                      {prod.image ? (
                        <img
                          src={prod.image}
                          alt={prod.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl flex items-center justify-center h-full">{prod.emoji}</span>
                      )}
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected
                          ? "bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black"
                          : "border border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {isSelected && <Check size={14} />}
                    </div>
                  </div>

                  <h3 className="font-extrabold text-sm leading-snug">{prod.shortTitle}</h3>
                  <p className="text-[11px] opacity-70 mt-1 line-clamp-2">{prod.subtitle}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                  <span className="text-xs line-through opacity-50">R{prod.compare}</span>
                  <span className="text-base font-black text-[#0A3D62] dark:text-[#F9CA24]">
                    R{prod.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bundle Summary Bar */}
        <div
          className={`p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
            isDarkMode ? "bg-[#0B132B] border-slate-700" : "bg-white border-zinc-200 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {selectedProducts.map((p) => (
                <span
                  key={p.id}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-lg shadow-sm"
                >
                  {p.emoji}
                </span>
              ))}
            </div>
            <div>
              <div className="text-xs font-bold">
                {selectedProducts.length} Items Selected: {selectedProducts.map((p) => p.shortTitle).join(" + ")}
              </div>
              <div className="text-[11px] opacity-70">
                Original Price: <span className="line-through">R{subtotal}</span> • Instant Bundle Discount:{" "}
                <span className="text-emerald-500 font-bold">-R{discount}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="text-right">
              <span className="text-[10px] opacity-70 uppercase font-bold">Bundle Total</span>
              <div className="text-2xl font-black text-[#0A3D62] dark:text-[#F9CA24]">R{total}</div>
            </div>

            <button
              type="button"
              onClick={handleAddAllToCart}
              className="flex-1 md:flex-none px-6 py-3.5 bg-[#F9CA24] text-black font-black text-xs rounded-full shadow hover:brightness-105 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={16} /> Add Bundle To Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
