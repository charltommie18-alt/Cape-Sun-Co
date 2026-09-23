import React, { useState } from "react";
import { ChevronDown, HelpCircle, Phone, MessageSquare } from "lucide-react";
import { FAQS } from "../data/products";

interface Props {
  isDarkMode: boolean;
}

export const FaqSection: React.FC<Props> = ({ isDarkMode }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="py-12 px-4 md:px-6 max-w-[900px] mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A3D62]/10 dark:bg-[#F9CA24]/20 text-[#0A3D62] dark:text-[#F9CA24] text-xs font-bold uppercase tracking-wider mb-2">
          <HelpCircle size={14} /> Clear Answers
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-sm opacity-75 mt-1">
          Everything you need to know about braid safety, Cape Town local 2-3 day dispatch, and Capitec Pay.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition overflow-hidden ${
                isDarkMode ? "bg-[#1C2541]/70 border-slate-700" : "bg-white border-zinc-200"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-4 md:p-5 text-left font-extrabold text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 shrink-0 text-[#0A3D62] dark:text-[#F9CA24] ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 md:px-5 text-xs sm:text-sm leading-relaxed opacity-85 border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* WhatsApp Help CTA */}
      <div
        className={`mt-8 p-5 rounded-2xl border text-center flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isDarkMode ? "bg-[#0B132B] border-slate-700" : "bg-emerald-50/60 border-emerald-200"
        }`}
      >
        <div className="text-left">
          <div className="font-extrabold text-sm text-emerald-800 dark:text-emerald-300">
            Still got questions about your summer gear?
          </div>
          <div className="text-xs opacity-75">
            Chat to our Cape Town customer support team on WhatsApp directly.
          </div>
        </div>
        <a
          href="https://wa.me/27662860184?text=Hi%20Cape%20Sun%20Co,%20I%20have%20a%20question%20about%20your%20summer%20products"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-full shadow flex items-center gap-2 shrink-0 transition"
        >
          <MessageSquare size={14} /> WhatsApp Us (+27 66 286 0184)
        </a>
      </div>
    </section>
  );
};
