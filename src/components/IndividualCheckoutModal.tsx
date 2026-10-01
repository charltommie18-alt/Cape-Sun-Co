import React, { useState } from "react";
import { Product, OrderItem, UserProfile } from "../types";
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle,
  CreditCard,
  Smartphone,
  Zap,
  Clock,
  Printer,
  FileText,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Bell,
  Award,
  Send,
  Building,
  Check,
  Copy,
  PackageCheck,
} from "lucide-react";
import { HonorBadges } from "./HonorBadges";
import { LegalPoliciesModal, LegalPolicyTab } from "./LegalPoliciesModal";

interface Props {
  product: Product;
  initialColor?: string;
  initialSize?: string;
  onClose: () => void;
  onOrderPlaced?: (order: OrderItem) => void;
  onOrderComplete?: (order: OrderItem) => void;
  currentUser?: UserProfile | null;
  isDarkMode: boolean;
  onOpenOrderStatus?: (orderCode?: string) => void;
}

export const IndividualCheckoutModal: React.FC<Props> = ({
  product,
  initialColor,
  initialSize,
  onClose,
  onOrderPlaced,
  onOrderComplete,
  currentUser,
  isDarkMode,
  onOpenOrderStatus,
}) => {
  const [color, setColor] = useState(initialColor || product.colors[0]);
  const [size, setSize] = useState(initialSize || (product.sizes ? product.sizes[0] : undefined));
  const [quantity, setQuantity] = useState(1);
  const [shippingMethod, setShippingMethod] = useState<
    | "Cape Town Local Courier (R85)"
    | "National SA Main Centers (R145)"
    | "Regional SA & Outlying (R175)"
    | "Express Priority Overnight (R195)"
    | "International Courier (R495)"
  >("Cape Town Local Courier (R85)");
  const [destinationCountry, setDestinationCountry] = useState("South Africa");

  // Customer Details
  const [customerName, setCustomerName] = useState(currentUser?.fullName || "Sipho Khumalo");
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || "082 555 4321");

  const [customerEmail, setCustomerEmail] = useState("sipho.k@gmail.com");
  const [street, setStreet] = useState("42 Regent Road");
  const [suburb, setSuburb] = useState("Sea Point");
  const [city, setCity] = useState("Cape Town");
  const [province, setProvince] = useState("Western Cape");
  const [postalCode, setPostalCode] = useState("8005");

  // Promo Code
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<
    "Capitec Pay" | "Ozow Instant EFT" | "PayJustNow" | "Credit/Debit Card"
  >("Capitec Pay");

  // Capitec Pay Flow Simulation
  const [capitecPhone, setCapitecPhone] = useState("082 555 4321");
  const [capitecPendingPrompt, setCapitecPendingPrompt] = useState(false);
  const [capitecApproved, setCapitecApproved] = useState(false);

  // Card Flow Simulation
  const [cardNumber, setCardNumber] = useState("4000 1234 5678 9010");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("456");

  // Ozow Bank selection
  const [selectedBank, setSelectedBank] = useState("Capitec Bank");

  // Order submission
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderItem | null>(null);
  const [whatsappNotifyData, setWhatsappNotifyData] = useState<{
    customer: { message: string; waUrl: string; sent?: boolean };
    storeOwner: { phone: string; message: string; waUrl: string; sent?: boolean };
  } | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [updateSentStatus, setUpdateSentStatus] = useState<string | null>(null);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState<LegalPolicyTab>("terms");

  const openPolicy = (tab: LegalPolicyTab) => {
    setPolicyTab(tab);
    setPolicyModalOpen(true);
  };

  // Pricing calculation
  const baseItemPrice = product.price * quantity;
  const shippingCost =
    shippingMethod === "Cape Town Local Courier (R85)"
      ? 85
      : shippingMethod === "National SA Main Centers (R145)"
      ? 145
      : shippingMethod === "Regional SA & Outlying (R175)"
      ? 175
      : shippingMethod === "Express Priority Overnight (R195)"
      ? 195
      : 495; // International Courier

  const totalBeforeDiscount = baseItemPrice + shippingCost;
  // Maximum discount is strictly capped at 20% - prevents any 100% off error
  const discountPercentClamped = Math.min(20, promoDiscount);
  const discountAmount = promoApplied ? Math.round(baseItemPrice * (discountPercentClamped / 100)) : 0;
  const grandTotal = Math.max(10, totalBeforeDiscount - discountAmount);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === "BREEZE5") {
      setPromoApplied(true);
      setPromoDiscount(5);
    } else if (code === "CAPESUMMER" || code === "SUN10" || code === "SILVER10") {
      setPromoApplied(true);
      setPromoDiscount(10);
    } else if (code === "GOLD15") {
      setPromoApplied(true);
      setPromoDiscount(15);
    } else if (code === "SOLAR20") {
      setPromoApplied(true);
      setPromoDiscount(20);
    } else {
      alert("Invalid promo code. Valid tier codes: BREEZE5 (5%), SILVER10 (10%), GOLD15 (15%), or SOLAR20 (20%). Max discount is strictly capped at 20%.");
    }
  };

  const handleCapitecRequest = () => {
    setCapitecPendingPrompt(true);
  };

  const handleCapitecApproveInApp = () => {
    setCapitecPendingPrompt(false);
    setCapitecApproved(true);
  };

  const handleCompleteOrder = async () => {
    if (!customerPhone.trim()) {
      setPhoneError("WhatsApp contact number is required so we can send your order and courier tracking updates.");
      // Scroll to delivery section
      return;
    }
    setPhoneError("");
    setIsProcessing(true);

    const orderCode = `CSC-ZA-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: OrderItem = {
      id: `ord-${Date.now()}`,
      orderCode,
      productId: product.id,
      productTitle: product.title,
      productEmoji: product.emoji,
      color,
      size,
      quantity,
      price: product.price,
      shippingCost,
      discount: discountAmount,
      total: grandTotal,
      paymentMethod,
      paymentStatus: "Paid",
      customerName: customerName.trim() || "Valued Customer",
      customerPhone: customerPhone.trim(),
      customerEmail,
      shippingAddress: {
        street: `${street}, ${suburb}`,
        city,
        province: shippingMethod === "International Courier (R495)" ? `${province} (${destinationCountry})` : province,
        postalCode,
      },
      shippingSpeed: shippingMethod,
      createdAt: new Date().toISOString(),
      status: "Confirmed at Cape Town Hub (Assigned to Courier)",
    };

    // Client fallback WhatsApp formatting
    const storeOwnerPhone = "27662860184";
    const customerPhoneClean = (customerPhone || "").replace(/[^0-9]/g, "");

    const customerMsg = `☀️ *Cape Sun Co - Order Confirmed!*\nHowzit ${customerName || "Customer"}! Thank you for your order *${orderCode}*.\n\n📦 *Item:* ${product.title} (Qty: ${quantity}${color ? ` • ${color}` : ""}${size ? ` • ${size}` : ""})\n💰 *Total Paid:* R${grandTotal} (${paymentMethod} Verified)\n🚚 *Delivery:* ${shippingMethod} (Local Cape Town 2-3 days; JHB & regional take longer)\n📍 *Ship To:* ${street}, ${suburb}, ${city}\n\n⏱️ *Cape Town Hub Dispatch:* We pack and dispatch promptly! Tracking updates are sent directly to your WhatsApp. 🇿🇦`;

    const storeOwnerMsg = `🚨 *NEW CAPE SUN CO ORDER PLACED!*\nOrder Code: *${orderCode}*\nDate: ${new Date().toLocaleString("en-ZA")}\n\n👤 *Customer:* ${customerName}\n📞 *Customer WhatsApp:* ${customerPhone}\n✉️ *Email:* ${customerEmail}\n📦 *Product:* ${product.title} (Qty: ${quantity})\n🎨 *Options:* ${color || "Standard"} / ${size || "Standard"}\n💰 *Amount:* R${grandTotal}\n💳 *Method:* ${paymentMethod}\n🚚 *Shipping:* ${shippingMethod}\n📍 *Address:* ${street}, ${suburb}, ${city}, ${province} ${postalCode}\n\n⚡ *Action:* Pack item at Cape Town warehouse. Send courier waybill updates to customer's WhatsApp (${customerPhone}).`;

    const fallbackCustomerUrl = customerPhoneClean
      ? `https://wa.me/${customerPhoneClean.startsWith("0") ? "27" + customerPhoneClean.slice(1) : customerPhoneClean}?text=${encodeURIComponent(customerMsg)}`
      : `https://wa.me/?text=${encodeURIComponent(customerMsg)}`;

    const fallbackStoreOwnerUrl = `https://wa.me/${storeOwnerPhone}?text=${encodeURIComponent(storeOwnerMsg)}`;

    // Trigger WhatsApp notification endpoint
    try {
      const response = await fetch("/api/orders/whatsapp-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrder }),
      });

      if (response.ok) {
        const data = await response.json();
        setWhatsappNotifyData(data);
      } else {
        setWhatsappNotifyData({
          customer: { message: customerMsg, waUrl: fallbackCustomerUrl, sent: true },
          storeOwner: { phone: storeOwnerPhone, message: storeOwnerMsg, waUrl: fallbackStoreOwnerUrl, sent: true },
        });
      }
    } catch {
      setWhatsappNotifyData({
        customer: { message: customerMsg, waUrl: fallbackCustomerUrl, sent: true },
        storeOwner: { phone: storeOwnerPhone, message: storeOwnerMsg, waUrl: fallbackStoreOwnerUrl, sent: true },
      });
    }

    // Auto-subscribe customer to promotional drops
    if (customerEmail && customerEmail.includes("@")) {
      fetch("/api/promotions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customerEmail,
          fullName: customerName || "Valued Customer",
          phone: customerPhone,
          source: "checkout_optin",
          notes: `Purchased ${product.title} (${orderCode})`,
        }),
      }).catch(() => {});
    }

    setCompletedOrder(newOrder);
    setIsProcessing(false);
    if (onOrderPlaced) onOrderPlaced(newOrder);
    if (onOrderComplete) onOrderComplete(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={completedOrder ? undefined : onClose}
      />

      <div
        className={`relative w-full max-w-4xl my-auto rounded-[24px] shadow-2xl overflow-hidden z-10 transition-colors ${
          isDarkMode ? "bg-[#0B132B] text-slate-100 border border-slate-700" : "bg-white text-[#2C3E50]"
        }`}
      >
        {/* Top Header Bar */}
        <div
          className={`px-5 py-4 flex items-center justify-between border-b ${
            isDarkMode ? "bg-[#1C2541] border-slate-700" : "bg-[#0A3D62] text-white border-zinc-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#F9CA24] text-black font-extrabold flex items-center justify-center text-sm">
              CSC
            </span>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#F9CA24]">
                Dedicated Item Checkout
              </div>
              <div className="font-extrabold text-sm md:text-base text-white">
                Cape Sun Co • Cape Town Dispatch (2-3 Days Local)
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Order Completed View */}
        {completedOrder ? (
          <div className="p-6 md:p-8 text-center space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle size={36} />
            </div>

            <div className="space-y-1.5">
              <span className="inline-block bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1 rounded-full text-xs">
                Payment Successful • 100% Verified
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold">Order Confirmed!</h2>
              <p className="text-xs sm:text-sm opacity-80 max-w-lg mx-auto">
                Thank you, <span className="font-bold">{completedOrder.customerName}</span>. Your order for{" "}
                <span className="font-bold">{completedOrder.productTitle}</span> has been received and routed to our Cape Town
                hub for manual quality inspection and protective heat-safe repacking before handover to The Courier Guy. Due to this dedicated repacking process, local delivery is completed in <strong>2 to 4 working days</strong> (same-day delivery is not guaranteed yet).
              </p>
            </div>

            {/* AUTOMATED WHATSAPP NOTIFICATION RECEIPT (CUSTOMER ONLY) */}
            <div
              className={`max-w-xl mx-auto p-4 md:p-5 rounded-2xl border text-left space-y-4 ${
                isDarkMode ? "bg-[#062c19]/40 border-emerald-800" : "bg-emerald-50/80 border-emerald-200"
              }`}
            >
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md shrink-0">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <span>Automated WhatsApp Dispatch Notifications</span>
                      <span className="text-[10px] bg-[#25D366] text-white px-2 py-0.5 rounded-full uppercase font-black tracking-wider">
                        Active
                      </span>
                    </h3>
                    <p className="text-[11px] opacity-80">
                      Your order confirmation and courier waybill tracking updates are dispatched automatically to your WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Confirmation Card */}
              <div
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isDarkMode ? "bg-[#0B132B]/90 border-slate-700" : "bg-white border-zinc-200 shadow-sm"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A3D62] dark:text-[#F9CA24]">
                      <Smartphone size={14} className="text-[#25D366]" />
                      <span>Customer WhatsApp Notification Number</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <Check size={11} /> Registered
                    </span>
                  </div>

                  <div className="text-xs">
                    <span className="opacity-70 text-[11px]">Courier &amp; dispatch updates queued to:</span>
                    <div className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                      {completedOrder.customerPhone}
                    </div>
                  </div>

                  <div className="text-[11px] p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 space-y-1.5">
                    <div className="font-bold flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#25D366]">
                      <CheckCircle size={12} /> Automated Courier Guy Dispatch Alerts
                    </div>
                    <p className="text-[10px] sm:text-[11px] leading-relaxed opacity-90">
                      You do not need to take any manual steps or send messages. As soon as our Cape Town warehouse finishes quality inspection and hands your parcel to the courier, live waybill tracking links and SMS/WhatsApp notifications will arrive automatically on your phone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Card */}
            <div
              className={`max-w-xl mx-auto p-4 sm:p-5 rounded-2xl border text-left space-y-2.5 ${
                isDarkMode ? "bg-[#1C2541] border-slate-700" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="opacity-70">Order Tracking Code:</span>
                <span className="font-extrabold font-mono text-[#F9CA24]">{completedOrder.orderCode}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70">Item Ordered:</span>
                <span className="font-semibold flex items-center gap-1 text-right">
                  <span>{completedOrder.productEmoji}</span> {completedOrder.productTitle}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70">Specifications:</span>
                <span>
                  {completedOrder.color} {completedOrder.size ? `• ${completedOrder.size}` : ""} • Qty:{" "}
                  {completedOrder.quantity}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70">Settlement Method:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70">Shipping Address:</span>
                <span className="text-right text-xs max-w-[240px]">
                  {typeof completedOrder.shippingAddress === "string"
                    ? completedOrder.shippingAddress
                    : `${completedOrder.shippingAddress?.street || ""}, ${completedOrder.shippingAddress?.city || ""}, ${completedOrder.shippingAddress?.province || ""}`}
                </span>
              </div>
              <div className="flex justify-between items-center text-base font-extrabold pt-2 border-t">
                <span>Total Amount:</span>
                <span className="text-xl text-[#0A3D62] dark:text-[#F9CA24]">R{completedOrder.total}</span>
              </div>
            </div>

            {/* Bank Details Card (Capitec Entrepreneur Account) */}
            <div
              className={`max-w-xl mx-auto p-3.5 rounded-xl border text-left text-xs ${
                isDarkMode ? "bg-[#0B132B] border-slate-700 text-slate-300" : "bg-amber-50/60 border-amber-200 text-slate-800"
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1 text-[#0A3D62] dark:text-[#F9CA24]">
                <Building size={14} />
                <span>Capitec Business Banking Reference</span>
              </div>
              <p className="opacity-80 leading-relaxed text-[11px]">
                <strong>Capitec. Entrepreneur acc Ct Fun.</strong> Acc number: <strong>2557334258</strong> • Swift number: <strong>CABLZAJJ</strong> • Branch code: <strong>470010</strong> • Ref: <strong>{completedOrder.orderCode}</strong>
              </p>
            </div>

            {/* Trust & Honor Badges Strip */}
            <div className="max-w-xl mx-auto">
              <HonorBadges isDarkMode={isDarkMode} variant="compact" showTitle={false} />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Cape Sun Co Order Receipt: ${completedOrder.orderCode} | Total: R${completedOrder.total} | ${completedOrder.productTitle} | Delivery: 2-3 days Cape Town`
                  );
                  setCopiedReceipt(true);
                  setTimeout(() => setCopiedReceipt(false), 2500);
                }}
                className="px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <FileText size={14} />
                <span>{copiedReceipt ? "Receipt Copied!" : "Copy Order Details"}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Printer size={14} />
                <span>Print Tax Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenOrderStatus) {
                    onOpenOrderStatus(completedOrder.orderCode);
                  }
                }}
                className="px-6 py-2.5 rounded-full bg-[#0A3D62] text-[#F9CA24] dark:bg-[#F9CA24] dark:text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition cursor-pointer"
              >
                <Truck size={14} />
                <span>Track Live Order Status</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Active Checkout Form */
          <div className="max-h-[82vh] overflow-y-auto p-4 md:p-6 grid md:grid-cols-[1.1fr_0.9fr] gap-6">
            {/* Left Column: Shipping & Payment */}
            <div className="space-y-6">
              {/* Step 1: Customer & Delivery Info */}
              <div
                className={`p-4 rounded-2xl border ${
                  isDarkMode ? "bg-[#1C2541]/70 border-slate-700" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide mb-3">
                  <span className="w-5 h-5 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black flex items-center justify-center text-xs font-extrabold">
                    1
                  </span>
                  Delivery Address &amp; Contact (South Africa)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <label className="block text-xs opacity-70 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#F9CA24] ${
                        isDarkMode ? "bg-[#0B132B] border-slate-700 text-white" : "bg-white border-zinc-300"
                      }`}
                      placeholder="e.g. Sipho Khumalo"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold flex items-center gap-1">
                        <MessageCircle size={13} className="text-[#25D366]" />
                        <span>WhatsApp Contact Number</span>
                        <span className="text-red-500 font-black">*</span>
                      </label>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        Live Order Updates
                      </span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (phoneError) setPhoneError("");
                      }}
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#F9CA24] ${
                        phoneError
                          ? "border-red-500 ring-1 ring-red-500 bg-red-500/5"
                          : isDarkMode
                          ? "bg-[#0B132B] border-slate-700 text-white"
                          : "bg-white border-zinc-300"
                      }`}
                      placeholder="e.g. 082 123 4567 or +27..."
                    />
                    {phoneError ? (
                      <p className="text-[11px] text-red-500 font-bold mt-1">{phoneError}</p>
                    ) : (
                      <p className="text-[10px] opacity-70 mt-1">
                        Automated order confirmation &amp; courier tracking will be sent to this WhatsApp. No need to message us.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs opacity-70 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#F9CA24] ${
                        isDarkMode ? "bg-[#0B132B] border-slate-700 text-white" : "bg-white border-zinc-300"
                      }`}
                      placeholder="you@domain.co.za"
                    />
                  </div>

                  <div>
                    <label className="block text-xs opacity-70 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#F9CA24] ${
                        isDarkMode ? "bg-[#0B132B] border-slate-700 text-white" : "bg-white border-zinc-300"
                      }`}
                      placeholder="e.g. 42 Regent Road"
                    />
                  </div>
                  <div>
                    <label className="block text-xs opacity-70 mb-1">Suburb</label>
                    <input
                      type="text"
                      value={suburb}
                      onChange={(e) => setSuburb(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#F9CA24] ${
                        isDarkMode ? "bg-[#0B132B] border-slate-700 text-white" : "bg-white border-zinc-300"
                      }`}
                      placeholder="e.g. Sea Point"
                    />
                  </div>

                  <div>
                    <label className="block text-xs opacity-70 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#F9CA24] ${
                        isDarkMode ? "bg-[#0B132B] border-slate-700 text-white" : "bg-white border-zinc-300"
                      }`}
                      placeholder="e.g. Cape Town"
                    />
                  </div>
                  <div>
                    <label className="block text-xs opacity-70 mb-1">Province</label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#F9CA24] ${
                        isDarkMode ? "bg-[#0B132B] border-slate-700 text-white" : "bg-white border-zinc-300"
                      }`}
                    >
                      <option value="Western Cape">Western Cape</option>
                      <option value="Gauteng">Gauteng</option>
                      <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                      <option value="Eastern Cape">Eastern Cape</option>
                      <option value="Free State">Free State</option>
                      <option value="Mpumalanga">Mpumalanga</option>
                      <option value="Limpopo">Limpopo</option>
                      <option value="North West">North West</option>
                      <option value="Northern Cape">Northern Cape</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Speed */}
              <div
                className={`p-4 rounded-2xl border ${
                  isDarkMode ? "bg-[#1C2541]/70 border-slate-700" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide mb-3">
                  <span className="w-5 h-5 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black flex items-center justify-center text-xs font-extrabold">
                    2
                  </span>
                  Select Dispatch &amp; Courier Speed
                </div>

                <div className="space-y-2 text-sm">
                  {[
                    {
                      id: "Cape Town Local Courier (R85)",
                      title: "Cape Town Local Courier (2-3 Days)",
                      desc: "The Courier Guy door-to-door delivery across Cape Town metro & Western Cape",
                      price: "R85",
                    },
                    {
                      id: "National SA Main Centers (R145)",
                      title: "National SA Main Centers (3-4 Days)",
                      desc: "Johannesburg, Pretoria, Durban, Gqeberha, Bloemfontein door-to-door courier",
                      price: "R145",
                    },
                    {
                      id: "Regional SA & Outlying (R175)",
                      title: "Regional & Outlying Areas SA (3-5 Days)",
                      desc: "Non-metro, agricultural, township & regional destinations nationwide",
                      price: "R175",
                    },
                    {
                      id: "Express Priority Overnight (R195)",
                      title: "Express Priority Overnight",
                      desc: "Next business day priority express air courier to your door",
                      price: "R195",
                    },
                    {
                      id: "International Courier (R495)",
                      title: "International Courier (4-7 Days)",
                      desc: "DHL Express priority international door-to-door worldwide shipping",
                      price: "R495",
                    },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        shippingMethod === opt.id
                          ? "border-[#0A3D62] dark:border-[#F9CA24] bg-[#0A3D62]/5 dark:bg-[#F9CA24]/10 shadow-xs"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingOption"
                          checked={shippingMethod === opt.id}
                          onChange={() => setShippingMethod(opt.id as any)}
                          className="w-4 h-4 accent-[#F9CA24]"
                        />
                        <div>
                          <div className="font-bold text-sm">{opt.title}</div>
                          <div className="text-xs opacity-70">{opt.desc}</div>
                        </div>
                      </div>
                      <span className="font-extrabold text-sm text-[#0A3D62] dark:text-[#F9CA24]">{opt.price}</span>
                    </label>
                  ))}
                </div>

                {/* International destination country input when international courier selected */}
                {shippingMethod === "International Courier (R495)" && (
                  <div className="mt-3 p-3.5 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/70 dark:bg-amber-950/30">
                    <label className="block text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
                      International Destination Country
                    </label>
                    <input
                      type="text"
                      value={destinationCountry}
                      onChange={(e) => setDestinationCountry(e.target.value)}
                      placeholder="e.g. United Kingdom, USA, Germany, Namibia, Australia"
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#F9CA24] ${
                        isDarkMode ? "bg-[#0B132B] border-slate-700 text-white" : "bg-white border-zinc-300 text-slate-900"
                      }`}
                    />
                    <p className="text-[11px] text-amber-800 dark:text-amber-300/80 mt-1">
                      Air courier express with international door-to-door tracking and customs pre-clearance.
                    </p>
                  </div>
                )}
              </div>

              {/* Step 3: Payment Gateway */}
              <div
                className={`p-4 rounded-2xl border ${
                  isDarkMode ? "bg-[#1C2541]/70 border-slate-700" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                    <span className="w-5 h-5 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black flex items-center justify-center text-xs font-extrabold">
                      3
                    </span>
                    Payment Method (Paystack ZA &amp; Instant EFT)
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded">
                    256-Bit SSL Encrypted
                  </span>
                </div>

                {/* Method selector tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {[
                    { id: "Capitec Pay", label: "Capitec Pay", badge: "Instant Push" },
                    { id: "Ozow Instant EFT", label: "Ozow EFT", badge: "All SA Banks" },
                    { id: "PayJustNow", label: "PayJustNow", badge: "3 Slices" },
                    { id: "Credit/Debit Card", label: "Cards", badge: "Visa/MC" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        paymentMethod === m.id
                          ? "border-[#0A3D62] dark:border-[#F9CA24] bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] hover:border-slate-400"
                      }`}
                    >
                      <div className="text-xs font-bold">{m.label}</div>
                      <div className="text-[9px] opacity-75">{m.badge}</div>
                    </button>
                  ))}
                </div>

                {/* Method details */}
                {paymentMethod === "Capitec Pay" && (
                  <div
                    className={`p-4 rounded-xl border space-y-3 ${
                      isDarkMode ? "bg-[#0B132B] border-slate-700" : "bg-white border-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <Smartphone size={16} className="text-[#F9CA24]" />
                        <span>Capitec Pay - Fast Remote Approval</span>
                      </div>
                      <span className="text-[10px] bg-[#F9CA24] text-black font-extrabold px-2 py-0.5 rounded">
                        Zero Card Fees
                      </span>
                    </div>

                    <p className="text-xs opacity-80">
                      Enter your cellphone or SA ID number. We send a secure push notification straight to your Capitec
                      Banking App for 1-click confirmation.
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={capitecPhone}
                        onChange={(e) => setCapitecPhone(e.target.value)}
                        placeholder="082 123 4567 or SA ID"
                        className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                          isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-slate-50 border-zinc-300"
                        }`}
                      />
                      {!capitecApproved && (
                        <button
                          type="button"
                          onClick={handleCapitecRequest}
                          className="px-4 py-2 bg-[#F9CA24] text-black font-extrabold text-xs rounded-lg shadow-sm hover:brightness-105"
                        >
                          Send Push
                        </button>
                      )}
                    </div>

                    {capitecPendingPrompt && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between">
                        <div className="text-xs">
                          <span className="font-bold text-amber-500">Capitec Alert Sent:</span> Approve R{grandTotal} in
                          app.
                        </div>
                        <button
                          type="button"
                          onClick={handleCapitecApproveInApp}
                          className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded shadow hover:bg-emerald-700"
                        >
                          Simulate App Approval
                        </button>
                      </div>
                    )}

                    {capitecApproved && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle size={16} /> Capitec Push Authorized! Ready to complete order.
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === "Ozow Instant EFT" && (
                  <div
                    className={`p-4 rounded-xl border space-y-3 ${
                      isDarkMode ? "bg-[#0B132B] border-slate-700" : "bg-white border-zinc-200"
                    }`}
                  >
                    <div className="font-bold text-sm">Select Your South African Bank for Instant EFT:</div>
                    <div className="grid grid-cols-3 gap-2">
                      {["Capitec Bank", "FNB", "Standard Bank", "ABSA", "Nedbank", "TymeBank"].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2 rounded-lg border text-xs font-medium text-center transition ${
                            selectedBank === bank
                              ? "border-[#0A3D62] dark:border-[#F9CA24] font-bold bg-[#0A3D62]/10 dark:bg-[#F9CA24]/20"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-400"
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] opacity-70">
                      You will be authenticated via bank-grade Ozow Instant EFT. Immediate dispatch confirmation.
                    </p>
                  </div>
                )}

                {paymentMethod === "PayJustNow" && (
                  <div
                    className={`p-4 rounded-xl border space-y-2 ${
                      isDarkMode ? "bg-[#0B132B] border-slate-700" : "bg-white border-zinc-200"
                    }`}
                  >
                    <div className="font-bold text-sm text-[#0A3D62] dark:text-[#F9CA24]">
                      Pay in 3 equal monthly installments of R{(grandTotal / 3).toFixed(2)}
                    </div>
                    <p className="text-xs opacity-80">
                      Interest-free, zero hidden charges. 1st payment today, 2nd next month, 3rd in 60 days.
                    </p>
                  </div>
                )}

                {paymentMethod === "Credit/Debit Card" && (
                  <div
                    className={`p-4 rounded-xl border space-y-3 ${
                      isDarkMode ? "bg-[#0B132B] border-slate-700" : "bg-white border-zinc-200"
                    }`}
                  >
                    <div>
                      <label className="block text-xs opacity-70 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm font-mono ${
                          isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-slate-50 border-zinc-300"
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs opacity-70 mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-sm font-mono ${
                            isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-slate-50 border-zinc-300"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs opacity-70 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-sm font-mono ${
                            isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-slate-50 border-zinc-300"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Item Summary & Final Total */}
            <div className="space-y-5">
              {/* Product Card Overview */}
              <div
                className={`p-4 md:p-5 rounded-2xl border ${
                  isDarkMode ? "bg-[#1C2541]/80 border-slate-700" : "bg-[#F8FAFB] border-zinc-200"
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
                  Individual Order Item
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-20 h-20 rounded-xl bg-white dark:bg-[#0B132B] border overflow-hidden flex items-center justify-center text-3xl shadow-sm shrink-0">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      product.emoji
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block bg-[#F9CA24] text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase mb-1">
                      {product.badge}
                    </span>
                    <h3 className="font-extrabold text-sm md:text-base leading-tight line-clamp-2">
                      {product.shortTitle}
                    </h3>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-lg font-extrabold">R{product.price}</span>
                      <span className="text-xs line-through opacity-60">R{product.compare}</span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        Save R{product.compare - product.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-xs font-bold mb-2">Color: {color}</div>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                            color === c
                              ? "bg-[#0A3D62] text-white border-[#0A3D62] dark:bg-[#F9CA24] dark:text-black dark:border-[#F9CA24]"
                              : "bg-white dark:bg-[#0B132B] border-zinc-300 dark:border-slate-700"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-xs font-bold mb-2">Size: {size}</div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSize(s)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                            size === s
                              ? "bg-[#0A3D62] text-white border-[#0A3D62] dark:bg-[#F9CA24] dark:text-black dark:border-[#F9CA24]"
                              : "bg-white dark:bg-[#0B132B] border-zinc-300 dark:border-slate-700"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Stepper */}
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-bold">Quantity</span>
                  <div className="flex items-center gap-2 border rounded-full px-2 py-1 bg-white dark:bg-[#0B132B]">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-6 h-6 flex items-center justify-center font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                    >
                      -
                    </button>
                    <span className="font-extrabold text-sm w-4 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Promo Code Box */}
              <div
                className={`p-3 rounded-xl border flex gap-2 ${
                  isDarkMode ? "bg-[#1C2541] border-slate-700" : "bg-slate-50 border-zinc-200"
                }`}
              >
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo Code (e.g. CAPESUMMER)"
                  disabled={promoApplied}
                  className={`flex-1 px-3 py-1.5 rounded-lg border text-xs uppercase ${
                    isDarkMode ? "bg-[#0B132B] border-slate-700 text-white" : "bg-white border-zinc-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={promoApplied}
                  className="px-3 py-1.5 bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-bold text-xs rounded-lg"
                >
                  {promoApplied ? "Applied!" : "Apply"}
                </button>
              </div>

              {/* Order Cost Breakdown */}
              <div
                className={`p-4 rounded-2xl border space-y-2.5 text-sm ${
                  isDarkMode ? "bg-[#1C2541]/50 border-slate-700" : "bg-white border-zinc-200"
                }`}
              >
                <div className="flex justify-between">
                  <span className="opacity-70">
                    Item Subtotal ({quantity}x R{product.price}):
                  </span>
                  <span className="font-semibold">R{baseItemPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Courier Shipping:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    R{shippingCost}
                  </span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Discount ({promoDiscount}% off):</span>
                    <span>-R{discountAmount}</span>
                  </div>
                )}
                <div className="pt-2 border-t flex justify-between items-baseline font-extrabold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-2xl text-[#0A3D62] dark:text-[#F9CA24]">R{grandTotal}</span>
                </div>
                <div className="text-[11px] opacity-70 text-right">Includes 15% VAT • No hidden fees</div>
              </div>

              {/* Honor Badges strip */}
              <div className="py-1">
                <HonorBadges isDarkMode={isDarkMode} variant="strip" showTitle={false} />
              </div>

              {/* Complete Order Button */}
              <button
                type="button"
                onClick={handleCompleteOrder}
                disabled={isProcessing}
                className="w-full py-4 rounded-full bg-[#F9CA24] text-black font-extrabold text-base shadow-lg hover:brightness-105 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Processing Payment &amp; Dispatch...
                  </div>
                ) : (
                  <>
                    <span>Confirm &amp; Place Order - R{grandTotal}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="space-y-1.5 text-center">
                <div className="flex items-center justify-center gap-2 text-xs opacity-75">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>30-Day Returns • Quality Guarantee • Local CT Stock</span>
                </div>
                <div className="text-[11px] opacity-75 flex flex-wrap items-center justify-center gap-1.5">
                  <span>By confirming, you accept our</span>
                  <button
                    type="button"
                    onClick={() => openPolicy("terms")}
                    className="underline text-[#0A3D62] dark:text-[#F9CA24] hover:opacity-80 cursor-pointer font-medium"
                  >
                    Terms of Sale
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => openPolicy("privacy")}
                    className="underline text-[#0A3D62] dark:text-[#F9CA24] hover:opacity-80 cursor-pointer font-medium"
                  >
                    POPIA Privacy Policy
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => openPolicy("returns")}
                    className="underline text-[#0A3D62] dark:text-[#F9CA24] hover:opacity-80 cursor-pointer font-medium"
                  >
                    Returns &amp; Guarantee
                  </button>
                </div>
                <div className="text-[10px] opacity-60">
                  Your order is reserved at our Cape Town warehouse for immediate packing (2-3 days local delivery).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Embedded Legal Policy Modal */}
        <LegalPoliciesModal
          isOpen={policyModalOpen}
          onClose={() => setPolicyModalOpen(false)}
          initialTab={policyTab}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};
