import React, { useState } from "react";
import {
  X,
  Scale,
  ShieldCheck,
  FileText,
  Truck,
  RotateCcw,
  Building,
  Phone,
  Mail,
  Printer,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import { CAPITEC_BANK_DETAILS } from "../types";

export type LegalPolicyTab = "terms" | "privacy" | "returns" | "shipping" | "banking" | "all";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalPolicyTab;
  isDarkMode: boolean;
}

export const LegalPoliciesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialTab = "terms",
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<LegalPolicyTab>(initialTab);
  const [copiedBank, setCopiedBank] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const handleCopyBank = () => {
    navigator.clipboard.writeText(
      `Bank: ${CAPITEC_BANK_DETAILS.bankName}\nAccount Name: ${CAPITEC_BANK_DETAILS.accountName}\nAccount Type: ${CAPITEC_BANK_DETAILS.accountType}\nAccount Number: ${CAPITEC_BANK_DETAILS.accountNumber}\nBranch Code: ${CAPITEC_BANK_DETAILS.branchCode}\nSwift: ${CAPITEC_BANK_DETAILS.swiftCode}\nContact WhatsApp: +27 66 286 0184`
    );
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const navTabs: { id: LegalPolicyTab; label: string; icon: React.ElementType }[] = [
    { id: "terms", label: "Terms of Service", icon: Scale },
    { id: "privacy", label: "Privacy Policy (POPIA)", icon: ShieldCheck },
    { id: "returns", label: "Returns & Quality Guarantee", icon: RotateCcw },
    { id: "shipping", label: "Shipping & Delivery", icon: Truck },
    { id: "banking", label: "Business & Banking Disclosure", icon: Building },
    { id: "all", label: "Full Legal Codex", icon: FileText },
  ];

  return (
    <div
      id="legal-policies-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="legal-policies-modal"
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
          isDarkMode
            ? "bg-[#0B132B] text-slate-100 border-slate-700"
            : "bg-white text-slate-900 border-slate-200"
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            isDarkMode ? "border-slate-800 bg-[#070C1A]" : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A3D62] text-[#F9CA24] flex items-center justify-center font-bold shadow-sm">
              <Scale size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-[#0A3D62] dark:text-[#F9CA24]">
                Cape Sun Co Legal &amp; Regulatory Policies
              </h2>
              <p className="text-xs opacity-75">
                Full compliance with South African CPA, POPIA, ECTA &amp; Banking Regulations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold flex items-center gap-1.5"
              title="Print legal documentation"
            >
              <Printer size={15} />
              <span className="hidden sm:inline">Print Policies</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div
          className={`flex border-b overflow-x-auto scrollbar-none px-4 pt-2 gap-1.5 text-xs font-bold ${
            isDarkMode ? "border-slate-800 bg-[#091024]" : "border-slate-200 bg-slate-100/70"
          }`}
        >
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 px-3.5 rounded-t-lg transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? isDarkMode
                      ? "bg-[#0B132B] text-[#F9CA24] border-t-2 border-[#F9CA24]"
                      : "bg-white text-[#0A3D62] border-t-2 border-[#0A3D62] shadow-sm"
                    : "opacity-70 hover:opacity-100 hover:bg-white/40 dark:hover:bg-slate-800/40"
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 text-sm leading-relaxed">
          {/* Quick Notice Header */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
              isDarkMode ? "bg-amber-950/20 border-amber-800/50 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="shrink-0 text-[#F9CA24]" />
              <span>
                <strong>Official Merchant Notice:</strong> Cape Sun Co operates under registered South African business entity <strong>Ct Fun</strong> with verified Capitec Bank commercial accounts.
              </span>
            </div>
            <a
              href="https://wa.me/27662860184?text=Hi%20Cape%20Sun%20Co%20Legal%20Team,%20I%20have%20an%20inquiry%20regarding%20your%20policies."
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white font-extrabold flex items-center gap-1.5 shadow hover:brightness-105 transition shrink-0"
            >
              <MessageCircle size={14} />
              <span>Legal WhatsApp (+27 66 286 0184)</span>
            </a>
          </div>

          {/* SECTION 1: TERMS OF SERVICE */}
          {(activeTab === "terms" || activeTab === "all") && (
            <section id="policy-terms" className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
              <div className="flex items-center gap-2.5 text-[#0A3D62] dark:text-[#F9CA24]">
                <Scale size={20} />
                <h3 className="text-lg font-black tracking-tight">1. Terms of Service &amp; Conditions of Sale</h3>
              </div>
              <p className="text-xs opacity-75">
                Last updated: September 2026 • Governed under the laws of the Republic of South Africa.
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">1.1 Agreement to Terms</h4>
                  <p className="opacity-80">
                    By browsing, accessing, registering an account, or purchasing summer cooling gear from Cape Sun Co (operated by Ct Fun, Cape Town), you enter into a legally binding agreement in terms of the Electronic Communications and Transactions Act 25 of 2002 (ECTA) and the Consumer Protection Act 68 of 2008 (CPA).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">1.2 Pricing &amp; Currency</h4>
                  <p className="opacity-80">
                    All prices displayed on capesun.co.za are in South African Rand (ZAR) and include statutory Value-Added Tax (VAT) at the prevailing rate of 15%. We reserve the right to correct inadvertent pricing typographical errors prior to shipping confirmation.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">1.3 Orders &amp; Electronic Contracting</h4>
                  <p className="opacity-80">
                    When you place an order, your transaction constitutes an offer to purchase. Acceptance occurs upon automated order confirmation generated via our Cape Town fulfillment system. You will receive an immediate SMS/WhatsApp notification with your unique order tracking reference code (e.g. <code>CSC-ZA-XXXXX</code>).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">1.4 Acceptable Use &amp; Intellectual Property</h4>
                  <p className="opacity-80">
                    All trademarks, logos, product designs, curated braai bundles, and content belong to Cape Sun Co / Ct Fun. Unauthorized commercial reproduction, scraping, or misrepresentation is prohibited.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 2: PRIVACY POLICY (POPIA) */}
          {(activeTab === "privacy" || activeTab === "all") && (
            <section id="policy-privacy" className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
              <div className="flex items-center gap-2.5 text-[#0A3D62] dark:text-[#F9CA24]">
                <ShieldCheck size={20} />
                <h3 className="text-lg font-black tracking-tight">2. Privacy Policy &amp; POPIA Compliance</h3>
              </div>
              <p className="text-xs opacity-75">
                Compliance with the Protection of Personal Information Act No. 4 of 2013 (POPIA) &amp; PAIA.
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">2.1 Information We Collect</h4>
                  <p className="opacity-80">
                    To deliver your order safely and provide real-time WhatsApp updates, we collect only necessary personal data:
                  </p>
                  <ul className="list-disc list-inside mt-1.5 space-y-1 opacity-80 text-xs pl-2">
                    <li>Full Name and Contact Number (for courier SMS and WhatsApp dispatch notifications).</li>
                    <li>Delivery Street Address, Suburb, City, and Postal Code.</li>
                    <li>Email Address (for VAT tax invoices and order status archives).</li>
                    <li>Payment confirmation metadata (tokens verified securely through Capitec Pay, Ozow, or card gateways — we NEVER store plain card PINs or full numbers).</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">2.2 Purpose of Processing</h4>
                  <p className="opacity-80">
                    In accordance with POPIA Principle 3, your personal information is used exclusively for order fulfillment, courier handover to registered South African logistics partners, WhatsApp customer support via <code>+27 66 286 0184</code>, warranty tracking, and mandatory statutory tax accounting. We do not sell or monetize your data.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">2.3 Information Security</h4>
                  <p className="opacity-80">
                    We maintain technical, physical, and organizational safeguards including 256-bit TLS/SSL encryption for data in transit, tokenized payment pipelines, and restricted access control at our Cape Town operations center.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">2.4 Data Subject Rights &amp; POPIA Information Officer</h4>
                  <p className="opacity-80">
                    You have the right to request access to, correction of, or deletion of your personal data at any time. To exercise your rights, email our designated Information Officer at <strong>popia@capesun.co.za</strong> or contact our Cape Town team directly on WhatsApp: <strong>+27 66 286 0184</strong>.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 3: REFUND, RETURNS & QUALITY GUARANTEE */}
          {(activeTab === "returns" || activeTab === "all") && (
            <section id="policy-returns" className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
              <div className="flex items-center gap-2.5 text-[#0A3D62] dark:text-[#F9CA24]">
                <RotateCcw size={20} />
                <h3 className="text-lg font-black tracking-tight">3. Returns, Exchanges &amp; Quality Guarantee</h3>
              </div>
              <p className="text-xs opacity-75">
                Consumer Protection Act (Act 68 of 2008) Section 55 &amp; 56 Right to Safe, Good Quality Goods.
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className={`p-3.5 rounded-xl border ${isDarkMode ? "bg-emerald-950/20 border-emerald-800/40" : "bg-emerald-50 border-emerald-200"}`}>
                  <h4 className="font-extrabold text-sm text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                    <CheckCircle size={16} />
                    <span>30-Day Money-Back Guarantee &amp; Quality Assurance</span>
                  </h4>
                  <p className="text-xs opacity-85">
                    Every portable neck fan, UV protection sunsuit, and instant ice cooling towel is backed by our full 30-day South African quality guarantee and money-back commitment.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">3.1 30-Day Hassle-Free Returns</h4>
                  <p className="opacity-80">
                    If you change your mind within 30 days of receipt, you may return any unused item in its original packaging with tags intact for a full refund or store exchange. Under the CPA, cooling-off periods apply for direct marketing transactions.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">3.2 Defective Goods &amp; Quality Replacement Claim</h4>
                  <p className="opacity-80">
                    If an item experiences electrical failure, battery breakdown, or manufacturing defect within the guarantee period, we will promptly repair, replace, or refund the item in full under Section 56 of the CPA.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">3.3 How to Initiate a Return</h4>
                  <p className="opacity-80">
                    Initiating a return is simple:
                  </p>
                  <ol className="list-decimal list-inside mt-1.5 space-y-1 opacity-80 text-xs pl-2">
                    <li>Send a WhatsApp message to our Cape Town returns line: <strong>+27 66 286 0184</strong>.</li>
                    <li>State your Order Number (e.g. <code>CSC-ZA-XXXXX</code>) and a photo/video of the item.</li>
                    <li>Our team arranges courier collection from your doorstep or a convenient Pudo locker.</li>
                    <li>Refunds are paid directly into your verified bank account via Capitec / EFT within 2 business days of warehouse receipt.</li>
                  </ol>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 4: SHIPPING & DELIVERY */}
          {(activeTab === "shipping" || activeTab === "all") && (
            <section id="policy-shipping" className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
              <div className="flex items-center gap-2.5 text-[#0A3D62] dark:text-[#F9CA24]">
                <Truck size={20} />
                <h3 className="text-lg font-black tracking-tight">4. Shipping, Courier &amp; Fulfillment SLA</h3>
              </div>
              <p className="text-xs opacity-75">
                Cape Town operations center dispatch schedule and national delivery policies.
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className={`p-3.5 rounded-xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                    <div className="font-bold text-xs text-[#0A3D62] dark:text-[#F9CA24] uppercase tracking-wider mb-1">
                      Local Cape Town &amp; Metro (R85)
                    </div>
                    <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">2 to 3 Working Days</div>
                    <p className="text-xs opacity-75 mt-1">
                      Every order arrives at our Cape Town hub first for manual quality testing and protective repacking before courier handover. Due to this dedicated inspection, local delivery is completed in 2 to 3 working days.
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                    <div className="font-bold text-xs text-[#0A3D62] dark:text-[#F9CA24] uppercase tracking-wider mb-1">
                      National SA Main Centers (R145) &amp; Regional (R175)
                    </div>
                    <div className="text-lg font-extrabold text-amber-500">3 to 5 Working Days</div>
                    <p className="text-xs opacity-75 mt-1">
                      Shipped via The Courier Guy express road/air freight with automated WhatsApp and SMS delivery waybill notifications.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">4.1 Courier Logistics Tariffs &amp; Non-Free Delivery Policy</h4>
                  <p className="opacity-80 leading-relaxed">
                    All deliveries are handled by professional door-to-door courier services (The Courier Guy for domestic South Africa and DHL Express for international orders). In order to maintain strict quality-check repacking, door-to-door transit insurance, and automated live WhatsApp tracking, delivery is chargeable on all orders without exception:
                  </p>
                  <ul className="list-disc pl-5 mt-1.5 space-y-1 text-xs opacity-85">
                    <li><strong>Cape Town Local Courier:</strong> R85 (2 to 3 working days)</li>
                    <li><strong>National Main Centers (JHB, DBN, PTA, Gqeberha, Bloemfontein):</strong> R145 (3 to 4 working days)</li>
                    <li><strong>Regional &amp; Outlying Areas SA:</strong> R175 (3 to 5 working days)</li>
                    <li><strong>Priority Express Overnight:</strong> R195 (Next business day)</li>
                    <li><strong>International Courier (DHL Express worldwide):</strong> R495 (4 to 7 working days)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">4.2 Delivery Address Accuracy &amp; Courier Handover</h4>
                  <p className="opacity-80">
                    Please ensure someone is available at the provided delivery address. Our logistics drivers will contact you on your registered telephone number prior to delivery.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 5: BUSINESS IDENTITY & BANKING DISCLOSURE */}
          {(activeTab === "banking" || activeTab === "all") && (
            <section id="policy-banking" className="space-y-4">
              <div className="flex items-center gap-2.5 text-[#0A3D62] dark:text-[#F9CA24]">
                <Building size={20} />
                <h3 className="text-lg font-black tracking-tight">5. Business Identity &amp; Statutory Banking Disclosure</h3>
              </div>
              <p className="text-xs opacity-75">
                Statutory disclosure in terms of Section 43 of the Electronic Communications and Transactions Act.
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <div
                  className={`p-4 rounded-xl border space-y-3 ${
                    isDarkMode ? "bg-[#070C1A] border-slate-700" : "bg-amber-50/70 border-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-[#0A3D62] dark:text-[#F9CA24]">
                      Capitec Bank Entrepreneur Commercial Account
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyBank}
                      className="text-xs font-bold px-3 py-1 rounded-lg bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black flex items-center gap-1 hover:opacity-90 transition cursor-pointer"
                    >
                      {copiedBank ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedBank ? "Details Copied" : "Copy Banking Info"}</span>
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="opacity-70">Trading Name:</span>
                      <div className="font-bold text-sm">Cape Sun Co (Ct Fun)</div>
                    </div>
                    <div>
                      <span className="opacity-70">Banking Institution:</span>
                      <div className="font-bold text-sm">Capitec Bank</div>
                    </div>
                    <div>
                      <span className="opacity-70">Account Name:</span>
                      <div className="font-bold text-sm">Ct Fun</div>
                    </div>
                    <div>
                      <span className="opacity-70">Account Type:</span>
                      <div className="font-bold text-sm">Capitec Entrepreneur Account</div>
                    </div>
                    <div>
                      <span className="opacity-70">Account Number:</span>
                      <div className="font-mono font-bold text-sm tracking-wider">2557334258</div>
                    </div>
                    <div>
                      <span className="opacity-70">Universal Branch Code:</span>
                      <div className="font-mono font-bold text-sm">470010</div>
                    </div>
                    <div>
                      <span className="opacity-70">Swift / BIC Code:</span>
                      <div className="font-mono font-bold text-sm">CABLZAJJ</div>
                    </div>
                    <div>
                      <span className="opacity-70">Registered Physical Location:</span>
                      <div className="font-semibold text-xs">Cape Town Metro, Western Cape, 8001</div>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className={`p-3.5 rounded-xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                    <div className="flex items-center gap-2 font-bold mb-1 text-[#0A3D62] dark:text-[#F9CA24]">
                      <Phone size={15} />
                      <span>Official Store Support Line</span>
                    </div>
                    <p className="text-xs opacity-80">
                      Telephone &amp; WhatsApp: <strong>+27 66 286 0184</strong> (066 286 0184)<br />
                      Hours: Monday – Friday, 08:00 – 17:00 SAST
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                    <div className="flex items-center gap-2 font-bold mb-1 text-[#0A3D62] dark:text-[#F9CA24]">
                      <Mail size={15} />
                      <span>Official Email Contacts</span>
                    </div>
                    <p className="text-xs opacity-80">
                      General: <strong>hello@capesun.co.za</strong><br />
                      Legal &amp; POPIA: <strong>legal@capesun.co.za</strong>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
            isDarkMode ? "border-slate-800 bg-[#070C1A]" : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="opacity-75 text-center sm:text-left">
            Cape Sun Co • Protected by South African Consumer Protection Act &amp; POPIA
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/27662860184?text=Hi%20Cape%20Sun%20Co%20Team!%20I%20have%20a%20legal%20or%20order%20question."
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-[#25D366] text-white font-extrabold flex items-center gap-1.5 shadow hover:brightness-105 transition"
            >
              <MessageCircle size={14} />
              <span>WhatsApp +27 66 286 0184</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold transition cursor-pointer"
            >
              Accept &amp; Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
