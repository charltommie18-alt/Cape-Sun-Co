import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  MessageSquare,
  ShieldCheck,
  MapPin,
  AlertCircle,
  Sparkles,
  PhoneCall,
  RefreshCw,
  Box,
} from "lucide-react";

export interface OrderCheckpoint {
  title: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
  detail: string;
}

export interface TrackedOrder {
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  productTitle: string;
  quantity: number;
  color?: string;
  size?: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: string;
  shippingSpeed: string;
  createdAt: string;
  status: "confirmed" | "repacking" | "dispatched" | "out_for_delivery" | "delivered";
  statusTitle: string;
  statusDescription: string;
  estimatedDelivery: string;
  courier: {
    provider: string;
    waybillNumber: string;
    serviceType: string;
    trackingUrl: string;
    checkpoints: OrderCheckpoint[];
  };
  whatsappUpdates: {
    message: string;
    timestamp: string;
    type: string;
  }[];
}

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  isOpen,
  onClose,
  initialQuery = "",
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedWaybill, setCopiedWaybill] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync initial query if passed
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      handleSearch(initialQuery);
    } else if (isOpen && !order) {
      // Auto-load latest sample order for immediate visual feedback
      handleSearch("CSC-ZA-48291");
    }
  }, [initialQuery, isOpen]);

  const handleSearch = async (queryToSearch?: string) => {
    const q = (queryToSearch !== undefined ? queryToSearch : searchQuery).trim();
    if (!q) {
      setErrorMsg("Please enter your Cape Sun Co Order Code (e.g. CSC-ZA-48291) or your WhatsApp number.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(q)}`);
      const data = await res.json();

      if (data.found && data.order) {
        setOrder(data.order);
        setErrorMsg("");
      } else {
        setOrder(null);
        setErrorMsg(
          data.message ||
            `No order found matching "${q}". Please double-check your order number or WhatsApp cellphone number.`
        );
      }
    } catch (err) {
      console.error("Tracking lookup error:", err);
      setErrorMsg("Unable to connect to dispatch servers. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const copyWaybill = (waybill: string) => {
    navigator.clipboard.writeText(waybill);
    setCopiedWaybill(true);
    setTimeout(() => setCopiedWaybill(false), 2000);
  };

  const copyOrderCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      id="order-status-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="order-status-modal-content"
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0A3D62] to-[#1e547f] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-[#F9CA24] flex items-center justify-center border border-amber-400/30">
              <Truck size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold tracking-tight">Customer Order Status</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-400/30">
                  Live Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-200">
                Automated Courier Guy Tracking &amp; WhatsApp Notifications
              </p>
            </div>
          </div>
          <button
            type="button"
            id="order-status-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                id="order-status-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order Code (e.g. CSC-ZA-48291) or Phone (0823456789)"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#F9CA24]"
              />
            </div>
            <button
              type="submit"
              id="order-status-search-btn"
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-[#0A3D62] dark:bg-[#F9CA24] text-white dark:text-black font-extrabold text-sm hover:opacity-95 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search size={15} />
                  <span>Track</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Search Chips */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Quick Test Samples:</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("CSC-ZA-48291");
                handleSearch("CSC-ZA-48291");
              }}
              className="px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 transition cursor-pointer font-mono"
            >
              CSC-ZA-48291 (Sea Point)
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("CSC-ZA-89102");
                handleSearch("CSC-ZA-89102");
              }}
              className="px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 transition cursor-pointer font-mono"
            >
              CSC-ZA-89102 (Clifton)
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("0823456789");
                handleSearch("0823456789");
              }}
              className="px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 transition cursor-pointer font-mono"
            >
              0823456789 (By Cellphone)
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Order Not Found</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {order && (
            <>
              {/* Order Overview Banner */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/60 pb-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Order Reference
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-extrabold text-base text-[#0A3D62] dark:text-[#F9CA24]">
                        {order.orderCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyOrderCode(order.orderCode)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        title="Copy Order Code"
                      >
                        {copiedCode ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Estimated Delivery
                    </span>
                    <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400 flex items-center sm:justify-end gap-1.5 mt-0.5">
                      <Clock size={14} />
                      <span>{order.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs">
                  <div>
                    <span className="text-slate-400">Customer:</span>{" "}
                    <span className="font-bold text-slate-800 dark:text-slate-100">{order.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">WhatsApp / Phone:</span>{" "}
                    <span className="font-bold text-slate-800 dark:text-slate-100">{order.customerPhone}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400">Item:</span>{" "}
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      {order.productTitle} (Qty: {order.quantity})
                      {order.color ? ` • ${order.color}` : ""}
                      {order.size ? ` • ${order.size}` : ""}
                    </span>
                  </div>
                  <div className="sm:col-span-2 flex items-start gap-1">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-300">{order.shippingAddress}</span>
                  </div>
                </div>
              </div>

              {/* Repacking & SLA Notice Box (Explaining 2-4 days & why no same-day delivery) */}
              <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/70 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <Box size={14} />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Cape Town Hub Inspection &amp; Protective Repacking
                    </h5>
                    <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
                      Every order is shipped to our Cape Town hub first, where the store owner personally performs quality checks, battery cycle verification, and heat-safe protective repacking before handing it to the courier. Because of this thorough inspection protocol, <strong>same-day delivery cannot be guaranteed</strong> at this stage. Local Cape Town delivery is completed in <strong>2 to 4 working days</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/20">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Fulfillment &amp; Courier Milestones
                </h4>

                <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                  {order.courier.checkpoints.map((cp, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 pl-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 z-10 font-bold transition-all ${
                          cp.completed
                            ? "bg-emerald-500 text-white shadow-sm"
                            : cp.current
                            ? "bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950/50 animate-pulse"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                        }`}
                      >
                        {cp.completed ? <Check size={12} /> : idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span
                            className={`font-bold text-xs ${
                              cp.completed
                                ? "text-slate-900 dark:text-white"
                                : cp.current
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-slate-400"
                            }`}
                          >
                            {cp.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{cp.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {cp.detail}
                        </p>
                        <span className="inline-block mt-1 text-[10px] text-slate-400 font-medium">
                          📍 {cp.location}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automated Courier Guy Card */}
              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0A3D62] text-white flex items-center justify-center font-bold text-xs">
                      TCG
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#0A3D62] dark:text-[#F9CA24]">
                          {order.courier.provider}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-200/60 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-semibold">
                          Automated Waybill
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono font-bold text-xs text-slate-700 dark:text-slate-200">
                          {order.courier.waybillNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyWaybill(order.courier.waybillNumber)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          title="Copy Waybill"
                        >
                          {copiedWaybill ? (
                            <Check size={12} className="text-emerald-500" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <a
                    href={order.courier.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A3D62] hover:bg-[#072d49] text-white text-xs font-bold transition shadow-sm cursor-pointer justify-center"
                  >
                    <span>Track on Courier Guy</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Automated WhatsApp Notifications Log */}
              {order.whatsappUpdates && order.whatsappUpdates.length > 0 && (
                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                        WA
                      </div>
                      <h4 className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200">
                        Automated WhatsApp Notifications Sent to Customer
                      </h4>
                    </div>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      {order.whatsappUpdates.length} updates logged
                    </span>
                  </div>

                  <div className="space-y-2">
                    {order.whatsappUpdates.map((update, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/30 text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-line leading-relaxed shadow-xs"
                      >
                        {update.message}
                        <div className="mt-1.5 text-[10px] text-slate-400 font-sans text-right">
                          Sent: {new Date(update.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-2.5 shrink-0 text-xs">
          <a
            href="https://wa.me/27662860184?text=Hi%20Cape%20Sun%20Co,%20I'd%20like%20to%20inquire%20about%20my%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            <MessageSquare size={14} />
            <span>Need Dispatch Assistance? WhatsApp Us (+27 66 286 0184)</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer ml-auto"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
