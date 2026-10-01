import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  X,
  Users,
  Mail,
  FileSpreadsheet,
  Cloud,
  Truck,
  Percent,
  Check,
  Copy,
  ExternalLink,
  Download,
  AlertTriangle,
  UserCheck,
  LogIn,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  BarChart3,
  MessageCircle,
  Phone,
  Package,
  DollarSign,
  Calculator,
  Tag,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { UserProfile, PromotionalSubscriber, Product } from "../types";
import { PRODUCTS } from "../data/products";
import { DailyReportsView } from "./DailyReportsView";
import { CloudStorageView } from "./CloudStorageView";
import { AnalyticsDashboard } from "./AnalyticsDashboard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSelectClient: (client: UserProfile | null) => void;
  isDarkMode: boolean;
  onOpenOrderStatus?: (orderCode?: string) => void;
}

export const AdminPortalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectClient,
  isDarkMode,
  onOpenOrderStatus,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("capesun_admin_auth") === "true";
  });
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<
    "suppliers" | "clients" | "promotions" | "analytics" | "reports" | "storage" | "orders" | "safeguards"
  >("suppliers");

  // Suppliers & Sourcing State
  const [sourcingProducts, setSourcingProducts] = useState<Product[]>(PRODUCTS);
  const [sourcingLoading, setSourcingLoading] = useState(false);
  const [selectedSupplierFilter, setSelectedSupplierFilter] = useState<string>("all");
  const [sourcingSearch, setSourcingSearch] = useState("");
  const [calcUnits, setCalcUnits] = useState<{ [productId: string]: number }>({
    neckfan: 20,
    uvbundle: 10,
    towel: 30,
    powerbank: 15,
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editCostPrice, setEditCostPrice] = useState<number>(0);
  const [editRetailPrice, setEditRetailPrice] = useState<number>(0);
  const [sourcingMessage, setSourcingMessage] = useState<string>("");

  // Client Switcher State
  const [clients, setClients] = useState<any[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [newClientModal, setNewClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientCity, setNewClientCity] = useState("Sea Point, Cape Town");

  // Promotional Subscribers State
  const [subscribers, setSubscribers] = useState<PromotionalSubscriber[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [subSearch, setSubSearch] = useState("");
  const [copiedEmails, setCopiedEmails] = useState(false);

  // Orders Dispatch State
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [dispatchUpdating, setDispatchUpdating] = useState<string | null>(null);
  const [copiedOrderPhone, setCopiedOrderPhone] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchClients();
      fetchSubscribers();
      fetchOrders();
      fetchSourcingProducts();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleVerifyPin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pinInput.trim()) return;

    setIsVerifying(true);
    setPinError("");

    try {
      const resp = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput.trim() }),
      });
      const data = await resp.json();

      if (resp.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("capesun_admin_auth", "true");
        setPinInput("");
        setPinError("");
        fetchClients();
        fetchSubscribers();
        fetchOrders();
      } else {
        setPinError("Access denied. Invalid administrative PIN.");
        setPinInput("");
      }
    } catch (err) {
      // Fallback verification if offline
      if (pinInput.trim() === "12021") {
        setIsAuthenticated(true);
        sessionStorage.setItem("capesun_admin_auth", "true");
        setPinInput("");
        setPinError("");
      } else {
        setPinError("Access denied. Invalid administrative PIN.");
        setPinInput("");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLockPortal = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("capesun_admin_auth");
    setPinInput("");
  };

  const fetchClients = async () => {
    setClientsLoading(true);
    try {
      const resp = await fetch("/api/admin/clients");
      if (resp.ok) {
        const data = await resp.json();
        setClients(data.clients || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClientsLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    setSubscribersLoading(true);
    try {
      const resp = await fetch("/api/admin/promotions/subscribers");
      if (resp.ok) {
        const data = await resp.json();
        setSubscribers(data.subscribers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubscribersLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const resp = await fetch("/api/orders/all");
      if (resp.ok) {
        const data = await resp.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientEmail) return;

    try {
      const resp = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newClientName,
          email: newClientEmail,
          phone: newClientPhone,
          city: newClientCity,
          loyaltyPoints: 150,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setClients((prev) => [data.client, ...prev]);
        setNewClientModal(false);
        setNewClientName("");
        setNewClientEmail("");
        setNewClientPhone("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSourcingProducts = async () => {
    setSourcingLoading(true);
    try {
      const resp = await fetch("/api/products");
      if (resp.ok) {
        const data = await resp.json();
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setSourcingProducts(data.products);
          return;
        }
      }
      setSourcingProducts(PRODUCTS);
    } catch (err) {
      setSourcingProducts(PRODUCTS);
    } finally {
      setSourcingLoading(false);
    }
  };

  const handleStartPriceEdit = (p: Product) => {
    setEditingProductId(p.id);
    setEditRetailPrice(p.price);
    setEditCostPrice(p.supplierCostPrice || Math.round(p.price * 0.5));
  };

  const handleSavePriceEdit = async (id: string) => {
    try {
      const resp = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: editRetailPrice,
          supplierCostPrice: editCostPrice,
        }),
      });
      if (resp.ok) {
        setSourcingMessage("Sourcing pricing updated successfully!");
        fetchSourcingProducts();
        setTimeout(() => setSourcingMessage(""), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEditingProductId(null);
    }
  };

  const handleResetSourcing = async () => {
    try {
      const resp = await fetch("/api/products/reset", { method: "POST" });
      if (resp.ok) {
        setSourcingMessage("Reset to verified Bob Shop & Perfect Dealz defaults!");
        fetchSourcingProducts();
        setTimeout(() => setSourcingMessage(""), 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCalcUnit = (productId: string, qty: number) => {
    setCalcUnits((prev) => ({
      ...prev,
      [productId]: Math.max(1, qty),
    }));
  };

  const handleUpdateOrderStatus = async (orderCode: string, newStatus: string) => {
    setDispatchUpdating(orderCode);
    try {
      const resp = await fetch("/api/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode, newStatus }),
      });
      if (resp.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDispatchUpdating(null);
    }
  };

  const handleCopyEmails = () => {
    const emailList = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emailList);
    setCopiedEmails(true);
    setTimeout(() => setCopiedEmails(false), 2500);
  };

  const handleExportCsv = () => {
    const headers = "ID,Full Name,Email,Phone,Source,Subscribed At,Status\n";
    const rows = subscribers
      .map(
        (s) =>
          `"${s.id}","${s.fullName}","${s.email}","${s.phone || ""}","${s.source}","${s.subscribedAt}","${s.active ? "Active" : "Unsubscribed"}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `CapeSunCo_Promotional_Subscribers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div
        className={`w-full max-w-6xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col max-h-[92vh] transition-all ${
          isDarkMode
            ? "bg-[#0B132B] border-slate-700 text-slate-100"
            : "bg-white border-zinc-200 text-[#2C3E50]"
        }`}
      >
        {/* ======================================================== */}
        {/* UN-AUTHENTICATED: PIN GATE (PIN 12021 HIDDEN FROM USERS) */}
        {/* ======================================================== */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 max-w-md mx-auto w-full my-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 shadow-inner">
              <Lock size={32} />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-slate-500/10 text-xs font-bold uppercase tracking-wider">
                Restricted Staff Zone
              </span>
              <h2 className="text-2xl font-black tracking-tight">Staff &amp; Operations Portal</h2>
              <p className="text-xs opacity-75">
                Authorized access only. Enter your 5-digit store security PIN to manage clients, daily reports,
                promotional databases, and sensitive operations.
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={5}
                  value={pinInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setPinInput(val);
                    if (val.length === 5) {
                      // Trigger validation
                      setTimeout(() => {
                        if (val === "12021") {
                          setIsAuthenticated(true);
                          sessionStorage.setItem("capesun_admin_auth", "true");
                          setPinInput("");
                          setPinError("");
                        } else {
                          setPinError("Access denied. Invalid administrative PIN.");
                        }
                      }, 200);
                    }
                  }}
                  placeholder="•••••"
                  autoFocus
                  className={`w-full px-4 py-3.5 text-center text-2xl font-mono tracking-[0.5em] rounded-2xl border transition focus:outline-none focus:ring-2 focus:ring-[#F9CA24] ${
                    isDarkMode
                      ? "bg-[#1C2541] border-slate-700 text-white"
                      : "bg-slate-50 border-zinc-300 text-black"
                  }`}
                />
              </div>

              {pinError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-xs font-bold flex items-center justify-center gap-1.5 animate-shake">
                  <AlertTriangle size={14} />
                  <span>{pinError}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying || pinInput.length < 5}
                  className="flex-1 py-3 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-xs shadow-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Unlock size={14} />
                  <span>{isVerifying ? "Verifying..." : "Unlock Portal"}</span>
                </button>
              </div>
            </form>

            <div className="text-[11px] opacity-60">
              Cape Sun Co • Cape Town Operations &amp; Distribution Terminal
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* AUTHENTICATED ADMIN CONSOLE                              */
          /* ======================================================== */
          <>
            {/* Header */}
            <div
              className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 ${
                isDarkMode ? "border-slate-700 bg-[#1C2541]" : "border-zinc-200 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black tracking-tight">Staff Operations &amp; Admin Hub</h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                      PIN Verified
                    </span>
                  </div>
                  <div className="text-xs opacity-70 flex items-center gap-2 mt-0.5">
                    <span>
                      Active View Persona:{" "}
                      <strong className="text-amber-500">
                        {currentUser ? currentUser.fullName : "Guest Visitor Mode (Logged Out)"}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLockPortal}
                  className="px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
                  title="Lock Admin Session"
                >
                  <Lock size={13} />
                  <span>Lock Portal</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div
              className={`px-6 py-2 border-b flex items-center gap-2 overflow-x-auto text-xs font-bold scrollbar-none ${
                isDarkMode ? "border-slate-700 bg-[#0B132B]" : "border-zinc-200 bg-white"
              }`}
            >
              <button
                onClick={() => setActiveTab("suppliers")}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "suppliers"
                    ? "bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-black"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 opacity-80"
                }`}
              >
                <Package size={14} />
                <span>Suppliers &amp; Closest Sourcing ({sourcingProducts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("clients")}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "clients"
                    ? "bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-black"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 opacity-80"
                }`}
              >
                <Users size={14} />
                <span>Client Switcher &amp; Accounts ({clients.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("promotions")}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "promotions"
                    ? "bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-black"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 opacity-80"
                }`}
              >
                <Mail size={14} />
                <span>Promotional Email Leads ({subscribers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-black"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 opacity-80"
                }`}
              >
                <Truck size={14} />
                <span>Courier &amp; WhatsApp Dispatch ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "analytics"
                    ? "bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-black"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 opacity-80"
                }`}
              >
                <BarChart3 size={14} />
                <span>Live Analytics Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("reports")}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "reports"
                    ? "bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-black"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 opacity-80"
                }`}
              >
                <FileSpreadsheet size={14} />
                <span>Automated Daily Reports</span>
              </button>

              <button
                onClick={() => setActiveTab("storage")}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "storage"
                    ? "bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-black"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 opacity-80"
                }`}
              >
                <Cloud size={14} />
                <span>Cloud Storage Vault</span>
              </button>

              <button
                onClick={() => setActiveTab("safeguards")}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "safeguards"
                    ? "bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-black"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 opacity-80"
                }`}
              >
                <Percent size={14} />
                <span>Points &amp; Discount Safeguards</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* ======================================================== */}
              {/* TAB 0: SUPPLIERS & CLOSEST SOURCING (Bob Shop / Perfect Dealz) */}
              {/* ======================================================== */}
              {activeTab === "suppliers" && (
                <div className="space-y-6">
                  {/* Top Heading & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider">
                          Verified Local Sourcing
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] uppercase tracking-wider">
                          Bob Shop &amp; Perfect Dealz SA
                        </span>
                      </div>
                      <h3 className="text-xl font-black mt-1">Local Suppliers &amp; Closest Sourcing Catalog</h3>
                      <p className="text-xs opacity-75 mt-0.5">
                        Verified South African wholesale &amp; marketplace sources. Sourced to deliver the lowest cost, quickest local dispatch (2-3 days), and healthy 50%+ profit margins.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={fetchSourcingProducts}
                        disabled={sourcingLoading}
                        className="px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        title="Refresh sourcing prices"
                      >
                        <RefreshCw size={13} className={sourcingLoading ? "animate-spin" : ""} />
                        <span>Refresh Sourcing</span>
                      </button>

                      <button
                        onClick={handleResetSourcing}
                        className="px-3.5 py-1.5 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black text-xs font-bold hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                        title="Reset to verified supplier defaults"
                      >
                        <ShieldCheck size={13} />
                        <span>Reset Sourcing Defaults</span>
                      </button>
                    </div>
                  </div>

                  {/* Sourcing feedback alert */}
                  {sourcingMessage && (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between animate-fade-in">
                      <div className="flex items-center gap-2">
                        <Check size={15} />
                        <span>{sourcingMessage}</span>
                      </div>
                      <button onClick={() => setSourcingMessage("")} className="hover:opacity-75">
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {/* Strategic Sourcing Summary Banner */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <div className="text-[11px] font-bold opacity-70 uppercase tracking-wider flex items-center gap-1.5">
                        <Tag size={12} className="text-amber-500" />
                        <span>Sourced Products</span>
                      </div>
                      <div className="text-2xl font-black mt-1 text-[#0A3D62] dark:text-[#F9CA24]">
                        {sourcingProducts.length} Items
                      </div>
                      <div className="text-[10px] opacity-75 mt-0.5">All 100% locally stocked in SA</div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <div className="text-[11px] font-bold opacity-70 uppercase tracking-wider flex items-center gap-1.5">
                        <DollarSign size={12} className="text-emerald-500" />
                        <span>Avg Wholesale Cost</span>
                      </div>
                      <div className="text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400">
                        R
                        {Math.round(
                          sourcingProducts.reduce((sum, p) => sum + (p.supplierCostPrice || p.price * 0.5), 0) /
                            (sourcingProducts.length || 1)
                        )}
                      </div>
                      <div className="text-[10px] opacity-75 mt-0.5">Lowest cost per unit in SA</div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <div className="text-[11px] font-bold opacity-70 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp size={12} className="text-blue-500" />
                        <span>Avg Profit Margin</span>
                      </div>
                      <div className="text-2xl font-black mt-1 text-blue-600 dark:text-blue-400">
                        {Math.round(
                          sourcingProducts.reduce((sum, p) => {
                            const cost = p.supplierCostPrice || p.price * 0.5;
                            return sum + ((p.price - cost) / p.price) * 100;
                          }, 0) / (sourcingProducts.length || 1)
                        )}
                        %
                      </div>
                      <div className="text-[10px] opacity-75 mt-0.5">High retail gross yield</div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <div className="text-[11px] font-bold opacity-70 uppercase tracking-wider flex items-center gap-1.5">
                        <Truck size={12} className="text-purple-500" />
                        <span>Local SA Dispatch</span>
                      </div>
                      <div className="text-2xl font-black mt-1 text-purple-600 dark:text-purple-400">
                        2 - 3 Days
                      </div>
                      <div className="text-[10px] opacity-75 mt-0.5">JHB / CT warehouse hubs</div>
                    </div>
                  </div>

                  {/* Sourcing Strategy Note */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="text-amber-500 shrink-0 mt-0.5" size={17} />
                      <div>
                        <span className="font-extrabold text-amber-800 dark:text-amber-300">
                          Why "Closest &amp; Cheapest" Local Sourcing?
                        </span>
                        <p className="opacity-80 mt-0.5 leading-relaxed">
                          Rather than waiting 4-6 weeks for uncertain international imports with port duties and exchange-rate fluctuations, Cape Sun Co sources directly through <strong>Bob Shop SA</strong> (Super Electronics) and <strong>Perfect Dealz SA</strong>. Specifically, the <strong>X28 Sovo Solar Powered 20000mAh Power Bank</strong> is listed on Bob Shop at wholesale discount (~R260) with 4 built-in cables, providing our highest margin product!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Filter and Search Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                      {[
                        { id: "all", label: "All Suppliers" },
                        { id: "bobshop", label: "Bob Shop SA" },
                        { id: "perfectdealz", label: "Perfect Dealz SA" },
                      ].map((fil) => (
                        <button
                          key={fil.id}
                          onClick={() => setSelectedSupplierFilter(fil.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                            selectedSupplierFilter === fil.id
                              ? "bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-black"
                              : "border border-slate-200 dark:border-slate-700 hover:border-slate-400"
                          }`}
                        >
                          {fil.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search product or SKU..."
                        value={sourcingSearch}
                        onChange={(e) => setSourcingSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Sourced Products Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sourcingProducts
                      .filter((prod) => {
                        const s = sourcingSearch.toLowerCase();
                        const matchText =
                          prod.title.toLowerCase().includes(s) ||
                          (prod.supplierSku || "").toLowerCase().includes(s) ||
                          (prod.supplierName || "").toLowerCase().includes(s);

                        if (!matchText) return false;
                        if (selectedSupplierFilter === "bobshop") {
                          return (prod.supplierName || "").toLowerCase().includes("bob shop");
                        }
                        if (selectedSupplierFilter === "perfectdealz") {
                          return (prod.supplierName || "").toLowerCase().includes("perfect dealz");
                        }
                        return true;
                      })
                      .map((prod) => {
                        const costPrice = prod.supplierCostPrice || Math.round(prod.price * 0.5);
                        const profit = prod.price - costPrice;
                        const marginPercent = Math.round((profit / prod.price) * 100);
                        const isEditing = editingProductId === prod.id;
                        const currentUnits = calcUnits[prod.id] || 10;
                        const batchCost = costPrice * currentUnits;
                        const batchRevenue = prod.price * currentUnits;
                        const batchProfit = batchRevenue - batchCost;

                        return (
                          <div
                            key={prod.id}
                            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
                          >
                            <div className="space-y-3">
                              {/* Header & Badges */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
                                    {prod.image ? (
                                      <img
                                        src={prod.image}
                                        alt={prod.title}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span>{prod.emoji}</span>
                                    )}
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
                                      {prod.badge || "Closest Sourced"}
                                    </span>
                                    <h4 className="font-extrabold text-sm leading-tight mt-1 line-clamp-1">
                                      {prod.title}
                                    </h4>
                                    <div className="text-[11px] opacity-65 flex items-center gap-2 mt-0.5">
                                      <span>SKU: {prod.supplierSku || `SKU-${prod.id}`}</span>
                                      <span>•</span>
                                      <span>Stock in CT: {prod.stock}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Supplier Link & Verified Source */}
                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs flex items-center justify-between">
                                <div>
                                  <div className="text-[10px] font-extrabold uppercase opacity-60">Verified Supplier Source</div>
                                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                                    <span>{prod.supplierName || "Bob Shop SA / Local"}</span>
                                  </div>
                                </div>
                                {prod.supplierUrl && (
                                  <a
                                    href={prod.supplierUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 rounded-lg bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black text-[11px] font-bold flex items-center gap-1 hover:opacity-90 transition shadow-2xs"
                                  >
                                    <span>View Listing</span>
                                    <ExternalLink size={11} />
                                  </a>
                                )}
                              </div>

                              {/* Pricing & Margins Grid */}
                              {isEditing ? (
                                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3 text-xs">
                                  <div className="font-black text-amber-700 dark:text-amber-400">
                                    Edit Sourced Cost &amp; Retail Price
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[10px] font-bold block mb-1">
                                        Wholesale Cost (ZAR)
                                      </label>
                                      <input
                                        type="number"
                                        value={editCostPrice}
                                        onChange={(e) => setEditCostPrice(Number(e.target.value))}
                                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold block mb-1">
                                        Retail Selling Price (ZAR)
                                      </label>
                                      <input
                                        type="number"
                                        value={editRetailPrice}
                                        onChange={(e) => setEditRetailPrice(Number(e.target.value))}
                                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold"
                                      />
                                    </div>
                                  </div>
                                  <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                    New Margin: +R{editRetailPrice - editCostPrice} per unit (
                                    {editRetailPrice > 0
                                      ? Math.round(((editRetailPrice - editCostPrice) / editRetailPrice) * 100)
                                      : 0}
                                    %)
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleSavePriceEdit(prod.id)}
                                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                                    >
                                      Save Price
                                    </button>
                                    <button
                                      onClick={() => setEditingProductId(null)}
                                      className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                                    <div className="text-[10px] font-bold opacity-60 uppercase">Wholesale Cost</div>
                                    <div className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">
                                      R{costPrice}
                                    </div>
                                  </div>

                                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                                    <div className="text-[10px] font-bold opacity-60 uppercase">Retail Selling</div>
                                    <div className="text-base font-black text-[#0A3D62] dark:text-[#F9CA24] mt-0.5">
                                      R{prod.price}
                                    </div>
                                  </div>

                                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                                      Profit Margin
                                    </div>
                                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                                      +R{profit}{" "}
                                      <span className="text-[10px] font-bold">({marginPercent}%)</span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Special Product Sourcing Specs Summary */}
                              {prod.id === "powerbank" && (
                                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-[11px] space-y-1">
                                  <div className="font-extrabold text-blue-700 dark:text-blue-300">
                                    ⚡ Bob Shop Listing Highlights (Model X28 Sovo):
                                  </div>
                                  <div className="opacity-80">
                                    • Genuine 20000mAh cell with 4 built-in cables (Type-C, iPhone, Micro, USB-A)
                                  </div>
                                  <div className="opacity-80">
                                    • Digital LED battery percentage display (0-100%) &amp; dual emergency torches
                                  </div>
                                  <div className="opacity-80">
                                    • Listed by Super Electronics JHB on Bob Shop (Cost R260, Compare R699)
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Batch Outlay & Profit Calculator */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold flex items-center gap-1 opacity-80">
                                  <Calculator size={13} className="text-amber-500" />
                                  <span>Batch Order Profit Sim:</span>
                                </span>
                                <div className="flex items-center gap-1.5">
                                  {[5, 10, 20, 50].map((qty) => (
                                    <button
                                      key={qty}
                                      onClick={() => handleUpdateCalcUnit(prod.id, qty)}
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                                        currentUnits === qty
                                          ? "bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-black"
                                          : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                                      }`}
                                    >
                                      {qty}u
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] font-mono flex items-center justify-between">
                                <div>
                                  <span className="opacity-60">Outlay ({currentUnits}u): </span>
                                  <strong className="text-slate-800 dark:text-slate-200 font-sans">
                                    R{batchCost.toLocaleString()}
                                  </strong>
                                </div>
                                <div>
                                  <span className="opacity-60">Revenue: </span>
                                  <strong className="text-slate-800 dark:text-slate-200 font-sans">
                                    R{batchRevenue.toLocaleString()}
                                  </strong>
                                </div>
                                <div className="text-emerald-600 dark:text-emerald-400 font-bold font-sans">
                                  Profit: +R{batchProfit.toLocaleString()}
                                </div>
                              </div>

                              {!isEditing && (
                                <button
                                  onClick={() => handleStartPriceEdit(prod)}
                                  className="w-full py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-center transition"
                                >
                                  Edit Sourced Cost &amp; Price
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 1: CLIENT SWITCHER (Switch between client accounts) */}
              {/* ======================================================== */}
              {activeTab === "clients" && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black">Customer Accounts &amp; Session Switcher</h3>
                      <p className="text-xs opacity-75">
                        Switch between individual client accounts to verify personalization, inspect custom order
                        histories, test loyalty points, or reset to clean Guest Mode.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectClient(null);
                          localStorage.removeItem("capesun_user");
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          !currentUser
                            ? "bg-emerald-600 text-white shadow-md font-black"
                            : "border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800"
                        }`}
                      >
                        <LogOut size={13} />
                        <span>Reset to Guest Mode (No User)</span>
                      </button>

                      <button
                        onClick={() => setNewClientModal(true)}
                        className="px-3 py-1.5 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black text-xs font-bold hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Plus size={13} />
                        <span>Add New Client</span>
                      </button>
                    </div>
                  </div>

                  {/* Active persona status alert */}
                  <div
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                      currentUser
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200"
                        : "bg-slate-500/10 border-slate-500/30 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} className="text-amber-500 shrink-0" />
                      <span>
                        Currently Viewing Store As:{" "}
                        <strong className="font-extrabold">
                          {currentUser ? `${currentUser.fullName} (${currentUser.email})` : "Guest / Logged-Out Visitor"}
                        </strong>
                      </span>
                    </div>
                    {currentUser && (
                      <span className="text-[11px] font-bold">
                        {currentUser.loyaltyPoints} Sunshine Points • {currentUser.city}
                      </span>
                    )}
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      placeholder="Search clients by name, email, or cellphone..."
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs ${
                        isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-white border-zinc-300"
                      }`}
                    />
                  </div>

                  {/* Client Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clients
                      .filter(
                        (c) =>
                          !clientSearch ||
                          c.fullName.toLowerCase().includes(clientSearch.toLowerCase()) ||
                          c.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
                          (c.phone && c.phone.includes(clientSearch))
                      )
                      .map((client) => {
                        const isActive = currentUser && currentUser.email.toLowerCase() === client.email.toLowerCase();
                        return (
                          <div
                            key={client.id || client.email}
                            className={`p-4 rounded-2xl border transition relative space-y-3 ${
                              isActive
                                ? "ring-2 ring-[#F9CA24] bg-amber-500/5 border-amber-500/40"
                                : isDarkMode
                                ? "bg-[#1C2541]/60 border-slate-700 hover:border-slate-500"
                                : "bg-slate-50 border-zinc-200 hover:border-zinc-300"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold flex items-center justify-center text-sm shadow">
                                  {client.fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <h4 className="font-extrabold text-sm leading-tight flex items-center gap-1.5">
                                    <span>{client.fullName}</span>
                                    {client.role === "admin" && (
                                      <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[9px] font-black uppercase">
                                        Admin
                                      </span>
                                    )}
                                  </h4>
                                  <div className="text-xs opacity-70 truncate max-w-[190px]">{client.email}</div>
                                </div>
                              </div>

                              {isActive ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase flex items-center gap-1">
                                  <Check size={11} /> Active
                                </span>
                              ) : null}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200 dark:border-slate-700/60">
                              <div>
                                <span className="opacity-60 block">Cellphone:</span>
                                <span className="font-semibold">{client.phone || "Not set"}</span>
                              </div>
                              <div>
                                <span className="opacity-60 block">Sunshine Points:</span>
                                <span className="font-bold text-amber-500">{client.loyaltyPoints || 0} pts</span>
                              </div>
                              <div>
                                <span className="opacity-60 block">Location:</span>
                                <span className="font-semibold truncate block">{client.city || "Cape Town"}</span>
                              </div>
                              <div>
                                <span className="opacity-60 block">Past Orders:</span>
                                <span className="font-semibold">{client.totalOrders || 0} orders</span>
                              </div>
                            </div>

                            <div className="pt-2">
                              {isActive ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onSelectClient(null);
                                    localStorage.removeItem("capesun_user");
                                  }}
                                  className="w-full py-2 rounded-xl border border-red-500/30 text-red-500 text-xs font-bold hover:bg-red-500/10 transition cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                  <LogOut size={13} />
                                  <span>Log Out Client (To Guest)</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const fullProfile: UserProfile = {
                                      id: client.id || `usr-${Date.now()}`,
                                      email: client.email,
                                      fullName: client.fullName,
                                      role: client.role || "customer",
                                      phone: client.phone || "+27 82 000 0000",
                                      city: client.city || "Cape Town",
                                      province: client.province || "Western Cape",
                                      address: client.address || "Cape Town",
                                      postalCode: client.postalCode || "8001",
                                      loyaltyPoints: client.loyaltyPoints || 150,
                                      savedPaymentMethod: client.savedPaymentMethod,
                                      preferences: {
                                        climateZone: "Cape Town Metro & Sea Point",
                                        coolingIntensity: "Turbo Extreme (40°C+ Heatwaves)",
                                        familyStatus: "Solo Adventurer",
                                        preferredCategories: ["cooling", "power"],
                                        autoApplyBundleDiscount: true,
                                        receiveHeatwaveAlerts: true,
                                      },
                                      interests: ["Clifton & Camps Bay Beach 🏖️"],
                                      viewedItemsHistory: [],
                                      purchasedProductIds: [],
                                    };
                                    onSelectClient(fullProfile);
                                    localStorage.setItem("capesun_user", JSON.stringify(fullProfile));
                                  }}
                                  className="w-full py-2 rounded-xl bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black text-xs font-extrabold hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                  <LogIn size={13} />
                                  <span>Switch &amp; View as {client.fullName.split(" ")[0]}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: PROMOTIONAL EMAIL LEADS                           */}
              {/* ======================================================== */}
              {activeTab === "promotions" && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black">Promotional Email Database</h3>
                      <p className="text-xs opacity-75">
                        Customer emails collected automatically during account creation, guest checkout opt-ins, and
                        summer promotion alerts.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyEmails}
                        className="px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedEmails ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        <span>{copiedEmails ? "Copied All Emails!" : "Copy Email List"}</span>
                      </button>

                      <button
                        onClick={handleExportCsv}
                        className="px-3 py-1.5 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black text-xs font-bold hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Download size={13} />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary metric card */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                      <div className="text-xs opacity-70">Total Subscribers</div>
                      <div className="text-2xl font-black text-amber-500">{subscribers.length}</div>
                      <div className="text-[11px] opacity-60">Opted in for promotional drops</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                      <div className="text-xs opacity-70">Active Opt-In Rate</div>
                      <div className="text-2xl font-black text-emerald-500">100%</div>
                      <div className="text-[11px] opacity-60">Verified POPIA compliant opt-in</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30">
                      <div className="text-xs opacity-70">Next Promo Campaign</div>
                      <div className="text-base font-extrabold text-blue-500 mt-1">Cape Town 38°C Heatwave Drop</div>
                      <div className="text-[11px] opacity-60">Includes BREEZE5 &amp; SILVER10 codes</div>
                    </div>
                  </div>

                  {/* Subscribers Table */}
                  <div className="rounded-2xl border overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead
                        className={`border-b ${
                          isDarkMode ? "bg-[#1C2541] border-slate-700 text-slate-300" : "bg-slate-100 border-zinc-200"
                        }`}
                      >
                        <tr>
                          <th className="p-3 font-bold">Customer Name</th>
                          <th className="p-3 font-bold">Email Address</th>
                          <th className="p-3 font-bold">WhatsApp / Cell</th>
                          <th className="p-3 font-bold">Source</th>
                          <th className="p-3 font-bold">Date Subscribed</th>
                          <th className="p-3 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {subscribers.map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-500/5 transition">
                            <td className="p-3 font-bold">{sub.fullName}</td>
                            <td className="p-3 font-mono text-amber-500">{sub.email}</td>
                            <td className="p-3 opacity-80">{sub.phone || "—"}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full bg-slate-500/15 text-[10px] font-bold">
                                {sub.source === "account_creation"
                                  ? "Account Creation"
                                  : sub.source === "checkout_optin"
                                  ? "Checkout Box"
                                  : "Newsletter"}
                              </span>
                            </td>
                            <td className="p-3 opacity-70">
                              {new Date(sub.subscribedAt).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                                Active Subscribed
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: ORDER DISPATCH & COURIER GUY / WHATSAPP CONSOLE   */}
              {/* ======================================================== */}
              {activeTab === "orders" && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black flex items-center gap-2">
                        <span>Courier &amp; WhatsApp Dispatch Console</span>
                        <span className="text-xs bg-[#25D366] text-white px-2 py-0.5 rounded-full font-bold">
                          Admin Only
                        </span>
                      </h3>
                      <p className="text-xs opacity-75">
                        Manage parcel repacking, The Courier Guy waybills, and trigger automated WhatsApp notifications to customers.
                      </p>
                    </div>

                    <button
                      onClick={fetchOrders}
                      className="px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw size={13} className={ordersLoading ? "animate-spin" : ""} />
                      <span>Refresh Orders</span>
                    </button>
                  </div>

                  {/* Official Courier Rates Reference Matrix */}
                  <div
                    className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
                      isDarkMode
                        ? "bg-[#1C2541]/70 border-slate-700 text-slate-200"
                        : "bg-amber-50/80 border-amber-200 text-amber-950"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-extrabold flex items-center gap-1.5 uppercase tracking-wide text-xs">
                        <Truck size={14} className="text-amber-600 dark:text-amber-400" />
                        <span>Official Courier Logistics Tariff Rates (Free Delivery Disabled)</span>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                        Zero Free Shipping Policy
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center pt-1 font-mono">
                      <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                        <div className="text-[10px] uppercase font-sans font-bold opacity-75">Local Cape Town</div>
                        <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">R85</div>
                        <div className="text-[9px] opacity-70">2-3 Working Days</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                        <div className="text-[10px] uppercase font-sans font-bold opacity-75">National SA</div>
                        <div className="text-sm font-black text-[#0A3D62] dark:text-[#F9CA24]">R145</div>
                        <div className="text-[9px] opacity-70">JHB, DBN, PTA 3-4d</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                        <div className="text-[10px] uppercase font-sans font-bold opacity-75">Regional Outlying</div>
                        <div className="text-sm font-black text-purple-600 dark:text-purple-400">R175</div>
                        <div className="text-[9px] opacity-70">Non-metro 3-5d</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                        <div className="text-[10px] uppercase font-sans font-bold opacity-75">Express Overnight</div>
                        <div className="text-sm font-black text-rose-600 dark:text-rose-400">R195</div>
                        <div className="text-[9px] opacity-70">Next Business Day</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
                        <div className="text-[10px] uppercase font-sans font-bold opacity-75">International</div>
                        <div className="text-sm font-black text-amber-600 dark:text-amber-400">R495</div>
                        <div className="text-[9px] opacity-70">DHL Global 4-7d</div>
                      </div>
                    </div>
                  </div>

                  {/* Order List */}
                  <div className="space-y-4">
                    {orders.map((ord) => {
                      const cleanPhone = (ord.customerPhone || "").replace(/[^0-9]/g, "");
                      const intlPhone = cleanPhone.startsWith("0") ? "27" + cleanPhone.slice(1) : cleanPhone;
                      const waybillNo = ord.courier?.waybillNumber || `TCG-ZA-CT${ord.orderCode?.replace(/[^0-9]/g, "") || "48291"}`;
                      const trackingUrl = ord.courier?.trackingUrl || `https://thecourierguy.co.za/tracking?waybill=${waybillNo}`;

                      return (
                        <div
                          key={ord.orderCode}
                          className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 ${
                            isDarkMode ? "bg-[#1C2541]/50 border-slate-700" : "bg-slate-50 border-zinc-200"
                          }`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-extrabold text-sm text-amber-500">{ord.orderCode}</span>
                                <span className="text-xs font-bold">• {ord.customerName}</span>
                                <span className="text-xs opacity-70 font-mono">({ord.customerPhone})</span>
                              </div>
                              <div className="text-xs opacity-80 mt-1">
                                {ord.productTitle} x{ord.quantity} ({ord.color || "Standard"}) • Total: <strong>R{ord.total}</strong> ({ord.paymentMethod})
                              </div>
                              <div className="text-[11px] opacity-75 mt-0.5">
                                📍 <strong>Destination:</strong> {typeof ord.shippingAddress === "string" ? ord.shippingAddress : `${ord.shippingAddress?.street || ""}, ${ord.shippingAddress?.city || ""}, ${ord.shippingAddress?.province || ""}`}
                              </div>
                              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                🚚 <strong>Speed &amp; Rate:</strong> {ord.shippingSpeed || "Cape Town Local Courier (R85)"}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black uppercase">
                                {ord.status?.replace(/_/g, " ") || "Processing"}
                              </span>
                              {onOpenOrderStatus && (
                                <button
                                  onClick={() => onOpenOrderStatus(ord.orderCode)}
                                  className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold hover:opacity-80 transition flex items-center gap-1 cursor-pointer"
                                >
                                  <ExternalLink size={12} />
                                  <span>Track</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Waybill and courier details */}
                          <div className="text-xs p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Truck size={14} className="text-[#0A3D62] dark:text-[#F9CA24]" />
                              <div>
                                <strong>Waybill:</strong> <span className="font-mono">{waybillNo}</span> (The Courier Guy)
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={trackingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold"
                              >
                                <span>Courier Guy Portal</span>
                                <ExternalLink size={11} />
                              </a>
                              <span className="text-emerald-500 font-bold">
                                Est: {ord.courier?.estimatedDelivery || "2-4 Working Days"}
                              </span>
                            </div>
                          </div>

                          {/* Status transition action buttons */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-[11px] font-bold opacity-70">Advance Status:</span>

                            <button
                              onClick={() => handleUpdateOrderStatus(ord.orderCode, "repacking")}
                              disabled={dispatchUpdating === ord.orderCode}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 transition cursor-pointer"
                            >
                              CT Hub Repacking
                            </button>

                            <button
                              onClick={() => handleUpdateOrderStatus(ord.orderCode, "dispatched")}
                              disabled={dispatchUpdating === ord.orderCode}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 transition cursor-pointer"
                            >
                              Hand to Courier Guy
                            </button>

                            <button
                              onClick={() => handleUpdateOrderStatus(ord.orderCode, "out_for_delivery")}
                              disabled={dispatchUpdating === ord.orderCode}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-500/15 text-purple-600 hover:bg-purple-500/25 transition cursor-pointer"
                            >
                              Out for Delivery
                            </button>

                            <button
                              onClick={() => handleUpdateOrderStatus(ord.orderCode, "delivered")}
                              disabled={dispatchUpdating === ord.orderCode}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 transition cursor-pointer"
                            >
                              Mark Delivered
                            </button>
                          </div>

                          {/* STORE OWNER WHATSAPP DISPATCH ACTIONS (ADMIN ONLY) */}
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-[#0A3D62] dark:text-[#F9CA24]">
                              <div className="flex items-center gap-1.5">
                                <MessageCircle size={13} className="text-[#25D366]" />
                                <span>Store Admin WhatsApp Dispatch Notifications (Direct to Client):</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(ord.customerPhone);
                                  setCopiedOrderPhone(ord.orderCode);
                                  setTimeout(() => setCopiedOrderPhone(null), 2000);
                                }}
                                className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 transition flex items-center gap-1 cursor-pointer font-bold"
                              >
                                <Copy size={10} />
                                <span>{copiedOrderPhone === ord.orderCode ? "Copied!" : `Copy Phone: ${ord.customerPhone}`}</span>
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {/* 1. Send Order Packed */}
                              <a
                                href={`https://wa.me/${intlPhone}?text=${encodeURIComponent(
                                  `📦 *Cape Sun Co Update for ${ord.customerName}:*\nHowzit! Your order *${ord.orderCode}* (${ord.productTitle}) is repacked and heat-sealed at our Cape Town hub. Ready for courier collection.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-[#25D366] text-white text-[11px] font-bold flex items-center gap-1.5 hover:brightness-105 transition shadow-xs"
                              >
                                <MessageCircle size={12} />
                                <span>Send "Order Packed"</span>
                              </a>

                              {/* 2. Send Waybill & Tracking */}
                              <a
                                href={`https://wa.me/${intlPhone}?text=${encodeURIComponent(
                                  `🚚 *Cape Sun Co Dispatch Update for ${ord.customerName}:*\nHowzit! Your order *${ord.orderCode}* has been handed to The Courier Guy.\n📦 Waybill: *${waybillNo}*\n🔗 Track: ${trackingUrl}\nEstimated Delivery: ${ord.shippingSpeed || "2-3 Working Days"}. Let us know when it arrives!`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black text-[11px] font-bold flex items-center gap-1.5 hover:opacity-90 transition shadow-xs"
                              >
                                <Send size={12} />
                                <span>Send "Courier Waybill"</span>
                              </a>

                              {/* 3. Send Out for Delivery */}
                              <a
                                href={`https://wa.me/${intlPhone}?text=${encodeURIComponent(
                                  `🛵 *Cape Sun Co Delivery Notice for ${ord.customerName}:*\nHowzit! The Courier Guy driver is out for delivery with parcel *${ord.orderCode}* today. Please ensure someone is available at: ${typeof ord.shippingAddress === "string" ? ord.shippingAddress : `${ord.shippingAddress?.street || ""}, ${ord.shippingAddress?.city || ""}`}. Stay cool!`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-purple-600 text-white text-[11px] font-bold flex items-center gap-1.5 hover:bg-purple-700 transition shadow-xs"
                              >
                                <Truck size={12} />
                                <span>Send "Out for Delivery"</span>
                              </a>

                              {/* 4. Direct WhatsApp Chat */}
                              <a
                                href={`https://wa.me/${intlPhone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-[11px] font-bold flex items-center gap-1.5 transition"
                              >
                                <Phone size={11} />
                                <span>Chat with Client</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB: LIVE ANALYTICS DASHBOARD (CONFIDENTIAL ADMIN ONLY)  */}
              {/* ======================================================== */}
              {activeTab === "analytics" && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={16} className="text-amber-500" />
                      <span className="font-extrabold text-amber-700 dark:text-amber-400">
                        Cape Sun Co Live Store Analytics &amp; Conversion Telemetry
                      </span>
                    </div>
                    <span className="text-[11px] font-bold opacity-80 uppercase tracking-wider bg-amber-500/20 px-2.5 py-0.5 rounded-full text-amber-700 dark:text-amber-300">
                      Store Owner Eyes Only
                    </span>
                  </div>
                  <AnalyticsDashboard isDarkMode={isDarkMode} />
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: AUTOMATED DAILY REPORTS VIEW                     */}
              {/* ======================================================== */}
              {activeTab === "reports" && (
                <div className="space-y-4">
                  <div className="text-xs opacity-75 pb-2 border-b border-slate-200 dark:border-slate-700">
                    Confidential Store Performance Reports: Daily revenues, Capitec settlement breakdown, inventory
                    burn rates, and executive summaries.
                  </div>
                  <DailyReportsView isDarkMode={isDarkMode} />
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 5: CLOUD STORAGE VAULT                              */}
              {/* ======================================================== */}
              {activeTab === "storage" && (
                <div className="space-y-4">
                  <div className="text-xs opacity-75 pb-2 border-b border-slate-200 dark:border-slate-700">
                    Restricted Asset &amp; Document Vault: SABS compliance certs, hi-res product assets, Cape Town
                    dispatch manifests, and customer proof-of-payment receipts.
                  </div>
                  <CloudStorageView isDarkMode={isDarkMode} />
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 6: POINTS & DISCOUNT SAFEGUARDS EXPLANATION         */}
              {/* ======================================================== */}
              {activeTab === "safeguards" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black">Loyalty Rewards &amp; Discount Safeguards</h3>
                    <p className="text-xs opacity-75">
                      Mathematical rules and security ceilings governing Sunshine Points, coupon codes, and store
                      discounts.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm">
                      <ShieldCheck size={18} />
                      <span>Zero 100% Exploit Guarantee</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      <strong>The Rule:</strong> Sunshine Points are earned at{" "}
                      <strong className="text-amber-500">1 point per R10 spent</strong> (e.g. spending R100 earns 10
                      points). Points are strictly reward tokens, <strong>NOT direct percentages</strong> (1 point does{" "}
                      <span className="underline">NOT</span> equal 10% or 1%). Accumulating 100 points redeems as a{" "}
                      <strong className="text-emerald-500">R10 store credit voucher (1 pt = R0.10)</strong>, or unlocks
                      our fixed milestone codes (BREEZE5 for 5%, SILVER10 for 10%, GOLD15 for 15%, SOLAR20 for 20%).
                    </p>
                    <div className="p-3 rounded-xl bg-black/10 dark:bg-white/5 font-mono text-xs space-y-1">
                      <div>• Spend R100 &rarr; Earn 10 Sunshine Points (Worth R1.00 credit)</div>
                      <div>• Spend R499 &rarr; Earn 49 Sunshine Points (Worth R4.90 credit)</div>
                      <div>• 100 Points &rarr; R10.00 discount voucher</div>
                      <div>• Strict Store Ceiling: Maximum discount capped at 20% on any order</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border space-y-2">
                      <h4 className="font-extrabold text-sm">Valid Storewide Tier Promo Codes</h4>
                      <ul className="text-xs space-y-1.5 opacity-85">
                        <li>
                          <code className="font-bold text-amber-500">BREEZE5</code> &rarr; 5% Off Storewide
                        </li>
                        <li>
                          <code className="font-bold text-amber-500">SILVER10</code> or{" "}
                          <code className="font-bold text-amber-500">CAPESUMMER</code> &rarr; 10% Off Storewide
                        </li>
                        <li>
                          <code className="font-bold text-amber-500">GOLD15</code> &rarr; 15% Off Storewide
                        </li>
                        <li>
                          <code className="font-bold text-amber-500">SOLAR20</code> &rarr; 20% Off Storewide (Max VIP Cap)
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl border space-y-2">
                      <h4 className="font-extrabold text-sm">Security Guardrails</h4>
                      <ul className="text-xs space-y-1.5 opacity-85">
                        <li>• Zero R0 checkouts permitted without manual admin override</li>
                        <li>• Automatic bundle discounts (Save R150) require minimum 2 items</li>
                        <li>• Points balance is tied strictly to the customer account profile</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal to add a new client */}
      {newClientModal && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4 ${
              isDarkMode ? "bg-[#0B132B] border-slate-700 text-white" : "bg-white border-zinc-200 text-black"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base">Register New Client Account</h3>
              <button onClick={() => setNewClientModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Johan Botha"
                  className="w-full px-3 py-2 rounded-xl border bg-transparent"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="johan@capetown.co.za"
                  className="w-full px-3 py-2 rounded-xl border bg-transparent"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">WhatsApp Cellphone</label>
                <input
                  type="tel"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="+27 82 123 4567"
                  className="w-full px-3 py-2 rounded-xl border bg-transparent"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">City / Region</label>
                <input
                  type="text"
                  value={newClientCity}
                  onChange={(e) => setNewClientCity(e.target.value)}
                  placeholder="Paarl, Cape Town"
                  className="w-full px-3 py-2 rounded-xl border bg-transparent"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewClientModal(false)}
                  className="flex-1 py-2.5 rounded-full border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black text-xs font-extrabold"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
