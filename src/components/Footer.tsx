import React, { useState } from "react";
import { ShieldCheck, Truck, RotateCcw, MapPin, Phone, Mail, Copy, Check, Building, Scale, ExternalLink, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { CAPITEC_BANK_DETAILS } from "../types";

interface Props {
  onNavigate: (view: string) => void;
  isDarkMode: boolean;
  onOpenPolicy?: (tab: "terms" | "privacy" | "returns" | "shipping" | "banking" | "all") => void;
  onOpenOrderStatus?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<Props> = ({ onNavigate, isDarkMode, onOpenPolicy, onOpenOrderStatus, onOpenAdmin }) => {
  const [copiedAccount, setCopiedAccount] = useState(false);

  const handleCopyBank = () => {
    navigator.clipboard.writeText(
      `Bank: ${CAPITEC_BANK_DETAILS.bankName}\nAccount Name: ${CAPITEC_BANK_DETAILS.accountName}\nAccount Type: ${CAPITEC_BANK_DETAILS.accountType}\nAccount Number: ${CAPITEC_BANK_DETAILS.accountNumber}\nBranch Code: ${CAPITEC_BANK_DETAILS.branchCode}\nSwift: ${CAPITEC_BANK_DETAILS.swiftCode}\nStore Phone: +27 66 286 0184`
    );
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  return (
    <footer
      className={`border-t transition-colors ${
        isDarkMode ? "bg-[#080D1D] text-slate-300 border-slate-800" : "bg-[#0A3D62] text-white border-white/10"
      }`}
    >
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-3">
            <Logo size="md" isDarkMode={true} />
            <p className="text-xs opacity-85 leading-relaxed pt-2">
              Welcome to Cape Sun Co — keeping Cape Town cool, refreshed, and sun-safe through sunny beach days, weekend braais, and sweltering summer afternoons.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-300 font-semibold">Cape Town Distribution Online</span>
            </div>
            <p className="text-[11px] text-[#F9CA24] font-medium">
              Local delivery: 2 to 3 working days • JHB &amp; regional: 3 to 5 days
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#F9CA24] mb-3">
              Store &amp; Tools
            </h4>
            <ul className="space-y-2 opacity-85">
              <li>
                <button onClick={() => onNavigate("shop")} className="hover:text-[#F9CA24] transition cursor-pointer">
                  Summer Essentials Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("bundles")} className="hover:text-[#F9CA24] transition cursor-pointer">
                  Bundle Builder (Save R150)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("collab")} className="hover:text-[#F9CA24] transition cursor-pointer">
                  Group Collab Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("faq")} className="hover:text-[#F9CA24] transition cursor-pointer">
                  Frequently Asked Questions
                </button>
              </li>
              {onOpenOrderStatus && (
                <li className="pt-1">
                  <button
                    type="button"
                    onClick={onOpenOrderStatus}
                    className="text-[#F9CA24] font-bold hover:underline transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Truck size={13} />
                    <span>Track Customer Order Status</span>
                  </button>
                </li>
              )}
              {onOpenAdmin && (
                <li className="pt-2 mt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="text-amber-300 font-extrabold hover:text-white transition cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-xs shadow-sm"
                    id="footer-admin-portal-button"
                  >
                    <ShieldCheck size={14} className="text-[#F9CA24]" />
                    <span>Store Admin Portal (PIN 12021)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Fulfilment & Contact */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#F9CA24] mb-3">
              Cape Town Hub
            </h4>
            <div className="space-y-2.5 opacity-85">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="shrink-0 mt-0.5 text-[#F9CA24]" />
                <span>Cape Town Metro, Western Cape, 8001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-[#F9CA24]" />
                <a
                  href="https://wa.me/27662860184"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#F9CA24] transition underline"
                >
                  WhatsApp: +27 66 286 0184
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="shrink-0 text-[#F9CA24]" />
                <span>hello@capesun.co.za</span>
              </div>
              <div className="text-[11px] opacity-75 pt-1">
                Mon - Fri: 08:00 - 17:00 SAST • Sat: 08:30 - 13:00
              </div>
            </div>
          </div>

          {/* Capitec Bank Details & SA Trust */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#F9CA24] mb-3 flex items-center gap-1.5">
              <Building size={16} /> Official Banking Details
            </h4>
            <div className="bg-white/10 dark:bg-slate-900/60 p-3.5 rounded-xl border border-white/15 space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center text-[#F9CA24] font-bold">
                <span>Capitec Bank</span>
                <span className="text-[10px] bg-[#F9CA24]/20 text-[#F9CA24] px-1.5 py-0.5 rounded">
                  Entrepreneur
                </span>
              </div>
              <div className="text-white/90">
                <span className="opacity-70">Account Name: </span>
                <strong className="text-white font-semibold">Ct Fun</strong>
              </div>
              <div className="text-white/90 font-mono flex items-center justify-between">
                <span>Acc: <strong className="text-white">2557334258</strong></span>
                <button
                  onClick={handleCopyBank}
                  className="hover:text-[#F9CA24] transition text-[10px] flex items-center gap-1 underline ml-2 cursor-pointer"
                  title="Copy account details"
                >
                  {copiedAccount ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedAccount ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="text-white/80 font-mono text-[10px] flex justify-between">
                <span>Branch: <strong>470010</strong></span>
                <span>Swift: <strong>CABLZAJJ</strong></span>
              </div>
            </div>

            <div className="space-y-2 text-[11px] opacity-85 pt-1">
              <button
                type="button"
                onClick={() => onOpenPolicy && onOpenPolicy("shipping")}
                className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 transition flex items-center gap-2 cursor-pointer"
              >
                <Truck size={14} className="text-emerald-400 shrink-0" />
                <span>Local Cape Town delivery 2 to 4 days (Hub Repacked)</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenPolicy && onOpenPolicy("returns")}
                className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 transition flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck size={14} className="text-[#F9CA24] shrink-0" />
                <span>30-Day Money-Back &amp; Quality Guarantee</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Interactive Legal Policies */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs opacity-85">
          <div>
            &copy; {new Date().getFullYear()} Cape Sun Co (Ct Fun). Registered in the Republic of South Africa.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => onOpenPolicy && onOpenPolicy("terms")}
              className="hover:text-[#F9CA24] transition underline underline-offset-2 cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenPolicy && onOpenPolicy("privacy")}
              className="hover:text-[#F9CA24] transition underline underline-offset-2 cursor-pointer"
            >
              Privacy Policy (POPIA Compliant)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenPolicy && onOpenPolicy("returns")}
              className="hover:text-[#F9CA24] transition underline underline-offset-2 cursor-pointer"
            >
              30-Day Returns &amp; Quality Guarantee
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenPolicy && onOpenPolicy("shipping")}
              className="hover:text-[#F9CA24] transition underline underline-offset-2 cursor-pointer"
            >
              Shipping Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenPolicy && onOpenPolicy("banking")}
              className="hover:text-[#F9CA24] transition underline underline-offset-2 cursor-pointer"
            >
              Banking Disclosure
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
