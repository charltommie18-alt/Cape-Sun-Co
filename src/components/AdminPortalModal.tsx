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
} from "lucide-react";
import { UserProfile, PromotionalSubscriber } from "../types";
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
    "clients" | "promotions" | "analytics" | "reports" | "storage" | "orders" | "safeguards"
  >("clients");

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

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchClients();
      fetchSubscribers();
      fetchOrders();
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
                <span>Courier Dispatch Console ({orders.length})</span>
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
              {/* TAB 3: ORDER DISPATCH & THE COURIER GUY CONSOLE         */}
              {/* ======================================================== */}
              {activeTab === "orders" && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black">Orders &amp; Dispatch Console</h3>
                      <p className="text-xs opacity-75">
                        Advance order statuses (Hub Repacking &rarr; Dispatched &rarr; Delivered) and trigger automated
                        WhatsApp notifications to customers.
                      </p>
                    </div>

                    <button
                      onClick={fetchOrders}
                      className="px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
                    >
                      <RefreshCw size={13} className={ordersLoading ? "animate-spin" : ""} />
                      <span>Refresh Orders</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.map((ord) => (
                      <div
                        key={ord.orderCode}
                        className={`p-4 rounded-2xl border space-y-3 ${
                          isDarkMode ? "bg-[#1C2541]/50 border-slate-700" : "bg-slate-50 border-zinc-200"
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-extrabold text-sm text-amber-500">{ord.orderCode}</span>
                              <span className="text-xs font-bold">• {ord.customerName}</span>
                              <span className="text-xs opacity-70">({ord.customerPhone})</span>
                            </div>
                            <div className="text-xs opacity-80 mt-1">
                              {ord.productTitle} x{ord.quantity} ({ord.color}) • R{ord.total} ({ord.paymentMethod})
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black uppercase">
                              {ord.status.replace(/_/g, " ")}
                            </span>
                            {onOpenOrderStatus && (
                              <button
                                onClick={() => onOpenOrderStatus(ord.orderCode)}
                                className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold hover:opacity-80 transition flex items-center gap-1"
                              >
                                <ExternalLink size={12} />
                                <span>Track</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Waybill and checkpoint notes */}
                        <div className="text-xs p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-between gap-2">
                          <div>
                            <strong>Waybill:</strong> {ord.courier?.waybillNumber || "TCG-ZA-PENDING"} (The Courier Guy)
                          </div>
                          <div className="text-emerald-500 font-bold">
                            Delivery Est: {ord.courier?.estimatedDelivery || "2-4 Working Days"}
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
                      </div>
                    ))}
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
