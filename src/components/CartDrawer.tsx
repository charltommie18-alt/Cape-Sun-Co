import React from "react";
import { Product, CartItem } from "../types";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onOpenIndividualCheckout: (product: Product, color?: string, size?: string) => void;
  isDarkMode: boolean;
}

export const CartDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onOpenIndividualCheckout,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const bundleDiscount = items.length >= 2 ? 150 : 0;
  const total = Math.max(0, subtotal - bundleDiscount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md flex flex-col shadow-2xl transition-colors ${
            isDarkMode ? "bg-[#0B132B] text-slate-100 border-l border-slate-700" : "bg-white text-[#2C3E50]"
          }`}
        >
          {/* Header */}
          <div
            className={`px-5 py-4 border-b flex items-center justify-between ${
              isDarkMode ? "border-slate-700 bg-[#1C2541]" : "border-zinc-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#0A3D62] dark:text-[#F9CA24]" />
              <h2 className="text-base font-extrabold">Your Summer Basket ({items.length})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Bundle Rebate Indicator */}
          {items.length >= 2 ? (
            <div className="px-5 py-2.5 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>R150 Bundle Discount Unlocked! Applied at checkout.</span>
            </div>
          ) : items.length === 1 ? (
            <div className="px-5 py-2.5 bg-amber-500/15 border-b border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold">
              Add 1 more item to automatically save R150!
            </div>
          ) : null}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3 opacity-60">
                <ShoppingBag size={48} className="mx-auto" />
                <p className="text-sm font-semibold">Your basket is empty</p>
                <p className="text-xs">Browse our summer essentials to stay cool this season.</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                  className={`p-3.5 rounded-2xl border space-y-2.5 ${
                    isDarkMode ? "bg-[#1C2541]/50 border-slate-700" : "bg-slate-50/70 border-zinc-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl bg-white dark:bg-[#0B132B] p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                      {item.product.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-sm leading-tight truncate">{item.product.shortTitle}</h3>
                      <div className="text-xs opacity-60 mt-0.5">
                        {item.selectedColor} {item.selectedSize ? `• ${item.selectedSize}` : ""}
                      </div>
                      <div className="text-sm font-bold text-[#0A3D62] dark:text-[#F9CA24] mt-1">
                        R{item.product.price * item.quantity}
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-red-400 hover:text-red-600 p-1 transition"
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Quantity & Individual Checkout Row */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-white dark:bg-[#0B132B] px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="opacity-70 hover:opacity-100"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="opacity-70 hover:opacity-100"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Dedicated Individual Checkout Trigger for this single item */}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenIndividualCheckout(item.product, item.selectedColor, item.selectedSize);
                      }}
                      className="px-3 py-1.5 bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-[10px] rounded-lg shadow hover:opacity-90 transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Checkout This Item (R{item.product.price * item.quantity})</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div
              className={`p-5 border-t space-y-3 ${
                isDarkMode ? "border-slate-700 bg-[#1C2541]" : "border-zinc-200 bg-slate-50"
              }`}
            >
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="opacity-70">Subtotal:</span>
                  <span className="font-semibold">R{subtotal}</span>
                </div>
                {bundleDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Bundle Savings:</span>
                    <span>-R{bundleDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="opacity-70">Cape Town Delivery:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">FREE</span>
                </div>
                <div className="pt-2 border-t flex justify-between items-baseline font-black text-base">
                  <span>Total Amount:</span>
                  <span className="text-xl text-[#0A3D62] dark:text-[#F9CA24]">R{total}</span>
                </div>
              </div>

              {/* Checkout All */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenIndividualCheckout(items[0].product, items[0].selectedColor, items[0].selectedSize);
                }}
                className="w-full py-3.5 bg-[#F9CA24] text-black font-black text-xs rounded-full shadow hover:brightness-105 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Capitec Pay / Card Checkout</span>
                <ArrowRight size={15} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] opacity-70">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span>Encrypted 256-bit checkout • Cape Town, South Africa</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
