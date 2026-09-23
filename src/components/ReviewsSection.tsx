import React from "react";
import { Star, CheckCircle, Quote } from "lucide-react";
import { TESTIMONIALS } from "../data/products";

interface Props {
  isDarkMode: boolean;
}

export const ReviewsSection: React.FC<Props> = ({ isDarkMode }) => {
  return (
    <section className="py-12 px-4 md:px-6 max-w-[1280px] mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          Verified Buyer Experiences
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Tested Across South Africa
        </h2>
        <p className="text-sm opacity-75 mt-2">
          From Oudtshoorn heatwaves to Clifton 4th beach afternoons and Khayelitsha taxi commutes.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TESTIMONIALS.map((rev, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-[22px] border flex flex-col justify-between transition hover:shadow-md ${
              isDarkMode ? "bg-[#1C2541]/70 border-slate-700" : "bg-white border-zinc-200"
            }`}
          >
            <div>
              <div className="flex text-[#F9CA24] mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-current" />
                ))}
              </div>
              <p className="text-xs leading-relaxed opacity-90 italic">"{rev.text}"</p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-extrabold">{rev.name}</div>
                <div className="text-[11px] opacity-60">{rev.product}</div>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle size={12} /> {rev.verified}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
