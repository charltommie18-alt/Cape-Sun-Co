import React, { useState } from "react";
import {
  ShoppingBag,
  Menu,
  X,
  Sun,
  Moon,
  Users,
  Cloud,
  BarChart3,
  FileSpreadsheet,
  ShieldCheck,
  User,
  Flame,
  Wifi,
  WifiOff,
  Heart,
  Truck,
} from "lucide-react";
import { UserProfile } from "../types";
import { Logo } from "./Logo";
import { CapeTownWeatherWidget } from "./CapeTownWeatherWidget";

interface Props {
  activeView: string;
  onNavigate: (view: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
  onOpenAuth: () => void;
  currentUser: UserProfile | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOnline: boolean;
  onOpenPolicy?: (tab: "terms" | "privacy" | "returns" | "shipping" | "banking") => void;
  onOpenOrderStatus?: (orderCode?: string) => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeView,
  onNavigate,
  cartCount,
  onOpenCart,
  wishlistCount = 0,
  onOpenWishlist,
  onOpenAuth,
  currentUser,
  isDarkMode,
  onToggleDarkMode,
  isOnline,
  onOpenPolicy,
  onOpenOrderStatus,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Customer-facing navigation only: analytics, daily reports, and storage vault belong strictly in Store Admin!
  const navItems = [
    { id: "shop", label: "Shop All" },
    { id: "bundles", label: "Bundle Builder", badge: "SAVE R150" },
    { id: "collab", label: "Group Orders", icon: <Users size={14} /> },
    { id: "faq", label: "FAQ & Help" },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#0A3D62] text-white text-[12px] md:text-[13px] font-semibold tracking-wide border-b border-white/10">
        <div className="mx-auto max-w-[1280px] px-4 py-[7px] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-[#F9CA24] text-black px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
              Cape Town Delivery
            </span>
            <span className="hidden sm:inline">Local 2-4 Days • JHB &amp; Reg 3-5 Days</span>
            <span className="sm:hidden">CT 2-4d</span>

            {/* Direct Order Tracking Button */}
            {onOpenOrderStatus && (
              <button
                type="button"
                onClick={() => onOpenOrderStatus()}
                className="hidden md:flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 hover:text-white transition text-[11px] font-bold cursor-pointer border border-white/15"
              >
                <Truck size={12} className="text-[#F9CA24]" />
                <span>Track Order Status</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Live Cape Town Weather Widget with Pulse Animation */}
            <CapeTownWeatherWidget variant="compact" isDarkMode={isDarkMode} />

            <div className="hidden lg:flex items-center gap-1.5 text-[11px] opacity-85">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>87 Dispatched this week</span>
            </div>

            {/* Connectivity Badge */}
            <div
              className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                isOnline ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
              }`}
            >
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span>{isOnline ? "Cape Town Live Hub" : "Offline Cached"}</span>
            </div>

            {/* Store Admin Portal Link in Top Bar */}
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 hover:bg-amber-400/35 text-amber-300 hover:text-white transition text-[11px] font-black cursor-pointer border border-amber-400/50 shadow-sm ml-1"
                title="Store Admin Portal (PIN Protected)"
                id="topbar-admin-portal-button"
              >
                <ShieldCheck size={12} className="text-[#F9CA24]" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          isDarkMode
            ? "bg-[#0B132B]/90 border-slate-800 text-slate-100"
            : "bg-white/90 border-zinc-100 text-[#2C3E50]"
        }`}
      >
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 h-[68px] flex items-center justify-between">
          {/* Logo & Slogan */}
          <button
            onClick={() => handleItemClick("shop")}
            className="flex items-center gap-2 text-left hover:opacity-90 transition cursor-pointer"
            title="Cape Sun Co - Home"
          >
            <Logo size="md" isDarkMode={isDarkMode} />
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-5 text-[13px] font-semibold">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`flex items-center gap-1.5 transition py-1 cursor-pointer ${
                  activeView === item.id
                    ? "text-[#0A3D62] dark:text-[#F9CA24] font-extrabold underline underline-offset-8"
                    : "opacity-80 hover:opacity-100 hover:text-[#0A3D62] dark:hover:text-[#F9CA24]"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-[#F9CA24] text-black text-[9px] px-1.5 py-0.5 rounded font-extrabold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={17} className="text-[#F9CA24]" /> : <Moon size={17} />}
            </button>

            {/* Wishlist Heart Button */}
            <button
              onClick={onOpenWishlist || onOpenAuth}
              className="relative w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 transition text-slate-700 dark:text-slate-200 cursor-pointer"
              title="My Wishlist"
            >
              <Heart
                size={17}
                className={wishlistCount > 0 ? "fill-red-500 text-red-500" : "text-slate-600 dark:text-slate-300"}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-slate-900 shadow-sm animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Track Order Button */}
            {onOpenOrderStatus && (
              <button
                type="button"
                onClick={() => onOpenOrderStatus()}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                title="Track Live Order Status"
              >
                <Truck size={14} className="text-[#0A3D62] dark:text-[#F9CA24]" />
                <span className="hidden md:inline">Track Order</span>
              </button>
            )}

            {/* Store Admin Portal Main Header Button */}
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition text-xs font-black cursor-pointer shadow-sm border ${
                  isDarkMode
                    ? "bg-amber-400/20 text-[#F9CA24] border-amber-400/50 hover:bg-amber-400/30"
                    : "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200"
                }`}
                title="Store Owner Admin Console (PIN 12021)"
                id="navbar-admin-button"
              >
                <ShieldCheck size={14} className={isDarkMode ? "text-[#F9CA24]" : "text-amber-700"} />
                <span className="inline font-bold">Admin</span>
              </button>
            )}

            {/* Auth Portal Button */}
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition text-xs font-bold cursor-pointer ${
                isDarkMode
                  ? "border-slate-700 bg-slate-800/60 text-slate-100 hover:bg-slate-800"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100"
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-[#0A3D62] text-[#F9CA24] dark:bg-[#F9CA24] dark:text-black flex items-center justify-center text-[10px] font-extrabold">
                {currentUser ? currentUser.fullName.slice(0, 2).toUpperCase() : <User size={12} />}
              </div>
              <span className="hidden sm:inline">
                {currentUser ? currentUser.fullName.split(" ")[0] : "Sign In"}
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F9CA24] text-black dark:bg-black dark:text-[#F9CA24] text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t px-4 py-4 space-y-2.5 transition-colors ${
              isDarkMode ? "bg-[#0B132B] border-slate-800" : "bg-white border-zinc-200 shadow-xl"
            }`}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full text-left py-2.5 px-3.5 rounded-xl flex items-center justify-between text-sm font-bold transition ${
                  activeView === item.id
                    ? isDarkMode
                      ? "bg-[#F9CA24] text-black font-extrabold shadow-sm"
                      : "bg-[#0A3D62] text-white shadow-sm"
                    : isDarkMode
                      ? "text-slate-100 hover:bg-slate-800/80"
                      : "text-slate-800 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#F9CA24] text-black text-[10px] px-2 py-0.5 rounded font-extrabold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              {onOpenOrderStatus && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOrderStatus();
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 border transition ${
                    isDarkMode
                      ? "bg-[#1C2541] text-[#F9CA24] border-slate-700 hover:bg-[#253258]"
                      : "bg-blue-50 text-[#0A3D62] border-blue-200 hover:bg-blue-100"
                  }`}
                >
                  <Truck size={15} />
                  <span>Track Customer Order (Courier Guy &amp; WhatsApp)</span>
                </button>
              )}

              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition shadow-sm cursor-pointer border ${
                    isDarkMode
                      ? "bg-amber-400/20 text-[#F9CA24] border-amber-400/50 hover:bg-amber-400/30"
                      : "bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200"
                  }`}
                  id="mobile-admin-portal-button"
                >
                  <ShieldCheck size={15} className={isDarkMode ? "text-[#F9CA24]" : "text-amber-700"} />
                  <span>Store Owner Admin Portal (PIN 12021)</span>
                </button>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-center border transition ${
                    isDarkMode
                      ? "bg-[#1C2541] text-white border-slate-700 hover:bg-[#253258]"
                      : "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {currentUser ? `Account (${currentUser.fullName.split(" ")[0]})` : "Sign In / Register"}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate("shop");
                  }}
                  className="flex-1 py-2.5 bg-[#F9CA24] text-black font-extrabold rounded-xl text-xs text-center shadow hover:brightness-105"
                >
                  Shop Essentials
                </button>
              </div>
            </div>

            {onOpenPolicy && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPolicy("terms");
                  }}
                  className={`text-[11px] underline cursor-pointer transition ${
                    isDarkMode ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Legal Policies (CPA, POPIA, 30-Day Returns &amp; Warranty)
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};
