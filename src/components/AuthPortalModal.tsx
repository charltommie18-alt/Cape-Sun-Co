import React, { useState, useEffect } from "react";
import { UserProfile, OrderItem, Product, UserPreferences, ViewedItemRecord } from "../types";
import { PRODUCTS } from "../data/products";
import {
  X,
  User,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Package,
  LogOut,
  CheckCircle,
  Truck,
  Sliders,
  Heart,
  History,
  ShoppingBag,
  ExternalLink,
  Flame,
  Zap,
  Tag,
  Save,
  Check,
  RotateCcw,
  Award,
  MessageCircle,
  Gift,
} from "lucide-react";
import { HonorBadges, CustomerHonorBadgeLevel } from "./HonorBadges";
import { LoyaltyRewards } from "./LoyaltyRewards";

interface Props {
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onClose: () => void;
  orders: OrderItem[];
  isDarkMode: boolean;
  onOpenIndividualCheckout?: (product: Product, color?: string, size?: string) => void;
  onSelectProduct?: (product: Product) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
  onAddToCart?: (product: Product, color?: string, size?: string) => void;
  onAddLoyaltyPoints?: (points: number, reason: string) => void;
  onApplyDiscountCode?: (code: string) => void;
  onOpenOrderStatus?: (orderCode?: string) => void;
}

const AVAILABLE_INTERESTS = [
  "Clifton & Camps Bay Beach 🏖️",
  "Paarl 38°C+ Extreme Heatwaves 🔥",
  "Toddler UPF 50+ UV Safety 👶",
  "Off-grid Camping & Cederberg ⛺",
  "Outdoor & Camping Power ⚡",
  "Taxi Commute & Rank Relief 🚐",
  "Braid & Weave Safe Cooling 🌀",
  "Active Fitness & Running 🏃",
  "Kirstenbosch Concerts & Braais 🍖",
];

const CLIMATE_ZONES = [
  "Cape Town Metro & Sea Point",
  "Atlantic Seaboard (Clifton / Camps Bay)",
  "Paarl & Winelands (Extreme 38°C+)",
  "Gauteng Highveld (Dry Heat 36°C)",
  "Durban & KZN Coast (Subtropical Humidity)",
  "Karoo / Oudtshoorn (Desert 40°C+)",
];

export const AuthPortalModal: React.FC<Props> = ({
  currentUser,
  onLogin,
  onLogout,
  onClose,
  orders,
  isDarkMode,
  onOpenIndividualCheckout,
  onSelectProduct,
  wishlistIds = [],
  onToggleWishlist,
  onAddToCart,
  onAddLoyaltyPoints,
  onApplyDiscountCode,
  onOpenOrderStatus,
}) => {
  // Auth Form tabs: "signin" | "signup" | "forgot"
  const [authTab, setAuthTab] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Cape Town");
  const [forgotSent, setForgotSent] = useState(false);

  // Profile tabs
  const [profileTab, setProfileTab] = useState<"preferences" | "recommendations" | "loyalty" | "wishlist" | "history" | "orders" | "badges">("preferences");

  // Editable preferences state
  const [climateZone, setClimateZone] = useState<string>("Cape Town Metro & Sea Point");
  const [coolingIntensity, setCoolingIntensity] = useState<"Mild Breeze" | "Standard Chill" | "Turbo Extreme (40°C+ Heatwaves)">("Turbo Extreme (40°C+ Heatwaves)");
  const [familyStatus, setFamilyStatus] = useState<"Solo Adventurer" | "Parent with Kids / Toddlers" | "Outdoor Camper & Hiker" | "Daily Commuter">("Solo Adventurer");
  const [selectedCategories, setSelectedCategories] = useState<("cooling" | "sun-protection" | "power")[]>(["cooling", "power"]);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [autoBundle, setAutoBundle] = useState(true);
  const [heatAlerts, setHeatAlerts] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const prefs = currentUser.preferences || {};
      setClimateZone(prefs.climateZone || currentUser.city || "Cape Town Metro & Sea Point");
      setCoolingIntensity(prefs.coolingIntensity || "Turbo Extreme (40°C+ Heatwaves)");
      setFamilyStatus(prefs.familyStatus || "Solo Adventurer");
      setSelectedCategories(prefs.preferredCategories || ["cooling", "power"]);
      setUserInterests(currentUser.interests || [
        "Clifton & Camps Bay Beach 🏖️",
        "Paarl 38°C+ Extreme Heatwaves 🔥",
        "Braid & Weave Safe Cooling 🌀",
      ]);
      setAutoBundle(prefs.autoApplyBundleDiscount ?? true);
      setHeatAlerts(prefs.receiveHeatwaveAlerts ?? true);
    }
  }, [currentUser]);

  // Demo accounts with complete profile data
  const demoUsers: UserProfile[] = [
    {
      id: "usr-01",
      email: "sipho.k@capetown.co.za",
      fullName: "Sipho Khumalo",
      role: "customer",
      phone: "+27 66 286 0184",
      city: "Cape Town",
      province: "Western Cape",
      address: "42 Regent Road, Sea Point",
      postalCode: "8005",
      loyaltyPoints: 480,
      savedPaymentMethod: "Capitec Pay (***0184)",
      preferences: {
        climateZone: "Cape Town Metro & Sea Point",
        coolingIntensity: "Turbo Extreme (40°C+ Heatwaves)",
        familyStatus: "Solo Adventurer",
        preferredCategories: ["cooling", "power"],
        autoApplyBundleDiscount: true,
        receiveHeatwaveAlerts: true,
      },
      interests: [
        "Clifton & Camps Bay Beach 🏖️",
        "Paarl 38°C+ Extreme Heatwaves 🔥",
        "Braid & Weave Safe Cooling 🌀",
        "Taxi Commute & Rank Relief 🚐",
      ],
      viewedItemsHistory: [
        {
          productId: "neckfan",
          productTitle: "Bladeless Neck Fan 4000mAh",
          productEmoji: "🌀",
          price: 299,
          viewedAt: "10 mins ago",
          viewCount: 5,
        },
        {
          productId: "towel",
          productTitle: "Instant Ice Cooling Towel",
          productEmoji: "🧊",
          price: 129,
          viewedAt: "25 mins ago",
          viewCount: 3,
        },
      ],
      purchasedProductIds: ["neckfan"],
      favoriteProductIds: ["powerbank"],
    },
    {
      id: "usr-02",
      email: "taryn.m@gmail.com",
      fullName: "Taryn Miller (Mom & Clifton Crew)",
      role: "customer",
      phone: "+27 83 234 5678",
      city: "Cape Town",
      province: "Western Cape",
      address: "18 Victoria Road, Clifton",
      postalCode: "8005",
      loyaltyPoints: 620,
      savedPaymentMethod: "Visa (***8842)",
      preferences: {
        climateZone: "Atlantic Seaboard (Clifton / Camps Bay)",
        coolingIntensity: "Standard Chill",
        familyStatus: "Parent with Kids / Toddlers",
        preferredCategories: ["sun-protection", "cooling"],
        autoApplyBundleDiscount: true,
        receiveHeatwaveAlerts: true,
      },
      interests: [
        "Clifton & Camps Bay Beach 🏖️",
        "Toddler UPF 50+ UV Safety 👶",
        "Active Fitness & Running 🏃",
      ],
      viewedItemsHistory: [
        {
          productId: "uvbundle",
          productTitle: "Kids UPF 50+ Sunsuit + Cooling Towel Bundle",
          productEmoji: "👶",
          price: 449,
          viewedAt: "Today, 11:15",
          viewCount: 6,
        },
        {
          productId: "towel",
          productTitle: "Instant Ice Cooling Towel",
          productEmoji: "🧊",
          price: 129,
          viewedAt: "Yesterday",
          viewCount: 2,
        },
      ],
      purchasedProductIds: ["uvbundle"],
      favoriteProductIds: ["towel"],
    },
    {
      id: "usr-admin",
      email: "wade.admin@capesun.co.za",
      fullName: "Wade Adams (Cape Town Operations)",
      role: "admin",
      phone: "+27 21 555 9000",
      city: "Cape Town",
      province: "Western Cape",
      address: "Unit 4, 12 Marconi Rd, Cape Town",
      postalCode: "7441",
      loyaltyPoints: 1250,
      savedPaymentMethod: "Corporate Billing",
      preferences: {
        climateZone: "Paarl & Winelands (Extreme 38°C+)",
        coolingIntensity: "Turbo Extreme (40°C+ Heatwaves)",
        familyStatus: "Outdoor Camper & Hiker",
        preferredCategories: ["power", "cooling"],
        autoApplyBundleDiscount: true,
        receiveHeatwaveAlerts: true,
      },
      interests: [
        "Off-grid Camping & Cederberg ⛺",
        "Outdoor & Camping Power ⚡",
        "Paarl 38°C+ Extreme Heatwaves 🔥",
      ],
      viewedItemsHistory: [
        {
          productId: "powerbank",
          productTitle: "20000mAh Solar Power Bank 4 Cables",
          productEmoji: "🔋",
          price: 599,
          viewedAt: "Today, 08:45",
          viewCount: 4,
        },
      ],
      purchasedProductIds: ["powerbank", "neckfan"],
      favoriteProductIds: ["neckfan"],
    },
  ];

  const handleToggleInterest = (interest: string) => {
    setUserInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleToggleCategory = (cat: "cooling" | "sun-protection" | "power") => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? (prev.length > 1 ? prev.filter((c) => c !== cat) : prev) : [...prev, cat]
    );
  };

  const handleSavePreferences = () => {
    if (!currentUser) return;
    const updatedUser: UserProfile = {
      ...currentUser,
      preferences: {
        climateZone,
        coolingIntensity,
        familyStatus,
        preferredCategories: selectedCategories,
        autoApplyBundleDiscount: autoBundle,
        receiveHeatwaveAlerts: heatAlerts,
      },
      interests: userInterests,
    };
    onLogin(updatedUser);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const found = demoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      onLogin(found);
    } else {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email: email || "customer@capesun.co.za",
        fullName: fullName || "Valued Customer",
        role: "customer",
        phone: phone || "+27 82 000 0000",
        city: city || "Cape Town",
        province: "Western Cape",
        address: "Cape Town Metro",
        postalCode: "8001",
        loyaltyPoints: 100,
        savedPaymentMethod: "Capitec Pay",
        preferences: {
          climateZone: "Cape Town Metro & Sea Point",
          coolingIntensity: "Turbo Extreme (40°C+ Heatwaves)",
          familyStatus: "Solo Adventurer",
          preferredCategories: ["cooling"],
          autoApplyBundleDiscount: true,
          receiveHeatwaveAlerts: true,
        },
        interests: ["Clifton & Camps Bay Beach 🏖️", "Paarl 38°C+ Extreme Heatwaves 🔥"],
        viewedItemsHistory: [],
        purchasedProductIds: [],
      };
      onLogin(newUser);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      fullName,
      role: "customer",
      phone,
      city,
      province: "Western Cape",
      address: `${city} Metro`,
      postalCode: "8001",
      loyaltyPoints: 150,
      savedPaymentMethod: "Capitec Pay",
      preferences: {
        climateZone: city || "Cape Town Metro & Sea Point",
        coolingIntensity: "Turbo Extreme (40°C+ Heatwaves)",
        familyStatus: "Solo Adventurer",
        preferredCategories: ["cooling", "power"],
        autoApplyBundleDiscount: true,
        receiveHeatwaveAlerts: true,
      },
      interests: ["Clifton & Camps Bay Beach 🏖️", "Paarl 38°C+ Extreme Heatwaves 🔥"],
      viewedItemsHistory: [],
      purchasedProductIds: [],
    };

    // Auto-record promotional email subscriber
    try {
      await fetch("/api/promotions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          fullName,
          phone,
          source: "account_creation",
          notes: `Registered from ${city}. 150 Sunshine Points awarded.`,
        }),
      });
    } catch {
      // ignore
    }

    // Register into client accounts list for admin switcher
    try {
      await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          fullName,
          phone,
          city,
          loyaltyPoints: 150,
        }),
      });
    } catch {
      // ignore
    }

    onLogin(newUser);
  };

  // Derive personalized recommendations with strict structure
  const getPersonalizedPicks = (): Array<{ product: Product; reason: string; badge: string }> => {
    if (!currentUser) {
      return PRODUCTS.slice(0, 2).map((p) => ({
        product: p,
        reason: "Cape Town Summer Bestseller",
        badge: "Top Pick",
      }));
    }

    const interestsText = userInterests.join(" ").toLowerCase();
    const isParent =
      familyStatus === "Parent with Kids / Toddlers" ||
      interestsText.includes("kid") ||
      interestsText.includes("toddler") ||
      interestsText.includes("uv");
    const isCamper =
      familyStatus === "Outdoor Camper & Hiker" ||
      interestsText.includes("camp") ||
      interestsText.includes("power") ||
      interestsText.includes("solar");
    const isExtremeHeat =
      coolingIntensity === "Turbo Extreme (40°C+ Heatwaves)" ||
      interestsText.includes("heatwave") ||
      climateZone.includes("Paarl");

    const picks: Array<{ product: Product; reason: string; badge: string }> = [];

    if (isParent) {
      const p = PRODUCTS.find((x) => x.id === "uvbundle");
      if (p) {
        picks.push({
          product: p,
          reason: "Matched to your profile: Toddler UPF 50+ UV Safety & beach days",
          badge: "Family Pick",
        });
      }
    }

    if (isExtremeHeat || picks.length === 0) {
      const p = PRODUCTS.find((x) => x.id === "neckfan");
      if (p) {
        picks.push({
          product: p,
          reason: `Tailored for ${climateZone} heatwaves with Turbo 8hr hands-free breeze`,
          badge: "Extreme Heat Match",
        });
      }
    }

    if (!currentUser.purchasedProductIds?.includes("towel")) {
      const p = PRODUCTS.find((x) => x.id === "towel");
      if (p) {
        picks.push({
          product: p,
          reason: "Instant 3-second ice drop — essential pocket heat relief under R150",
          badge: "Top Companion",
        });
      }
    }

    if (isCamper) {
      const p = PRODUCTS.find((x) => x.id === "powerbank");
      if (p && !picks.some((x) => x.product.id === "powerbank")) {
        picks.push({
          product: p,
          reason: "Matched to off-grid camping & backup power with solar charging",
          badge: "Off-Grid Essential",
        });
      }
    }

    return picks.slice(0, 3);
  };

  const personalizedPicks = getPersonalizedPicks();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div
        className={`relative w-full max-w-3xl my-auto rounded-[24px] shadow-2xl overflow-hidden z-10 transition-colors ${
          isDarkMode ? "bg-[#0B132B] text-slate-100 border border-slate-700" : "bg-white text-[#2C3E50]"
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 flex items-center justify-between border-b ${
            isDarkMode ? "bg-[#1C2541] border-slate-700" : "bg-[#0A3D62] text-white"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#F9CA24] text-black font-extrabold flex items-center justify-center text-sm shadow-sm">
              <ShieldCheck size={18} />
            </span>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#F9CA24]">
                Cape Sun Co • Customer Profile &amp; Intelligence
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                {currentUser ? `${currentUser.fullName}'s Profile` : "Secure Customer Portal"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
          {currentUser ? (
            /* Logged-in Profile Experience */
            <div className="space-y-5">
              {/* User Identity Top Bar */}
              <div
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between sm:items-center gap-3 ${
                  isDarkMode ? "bg-[#1C2541] border-slate-700" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#F9CA24] text-black font-extrabold flex items-center justify-center text-lg shadow-sm">
                    {currentUser.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base">{currentUser.fullName}</h3>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          currentUser.role === "admin"
                            ? "bg-purple-500/20 text-purple-600 dark:text-purple-400"
                            : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {currentUser.role}
                      </span>
                    </div>
                    <div className="text-xs opacity-70 flex flex-wrap items-center gap-2 mt-0.5">
                      <span>{currentUser.email}</span>
                      <span>•</span>
                      <span>{currentUser.phone}</span>
                      <span>•</span>
                      <span className="font-medium text-[#0A3D62] dark:text-[#F9CA24]">
                        {currentUser.preferences?.climateZone || currentUser.city}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setProfileTab("loyalty")}
                    className="text-right hover:opacity-80 transition cursor-pointer group"
                    title="View Loyalty Rewards & Discount Tiers"
                  >
                    <div className="text-[11px] opacity-70 group-hover:text-[#F9CA24] transition">
                      Sunshine Points
                    </div>
                    <div className="text-base font-extrabold text-[#F9CA24] flex items-center justify-end gap-1">
                      <span>{currentUser.loyaltyPoints} pts</span>
                      <Gift size={13} className="text-[#F9CA24]" />
                    </div>
                  </button>
                  <button
                    onClick={onLogout}
                    className="px-3 py-1.5 rounded-full border border-red-300 dark:border-red-800 text-red-500 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950 flex items-center gap-1 transition cursor-pointer"
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              </div>

              {/* Customer Honor Badge Tier Indicator */}
              <div className="pt-1">
                <CustomerHonorBadgeLevel loyaltyPoints={currentUser.loyaltyPoints || 0} isDarkMode={isDarkMode} />
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex border-b border-slate-200 dark:border-slate-700 gap-2 overflow-x-auto scrollbar-none pb-0.5">
                {[
                  { id: "preferences", label: "Preferences & Interests", icon: Sliders },
                  {
                    id: "loyalty",
                    label: `Loyalty & Rewards (${currentUser.loyaltyPoints || 0} pts)`,
                    icon: Gift,
                  },
                  {
                    id: "recommendations",
                    label: `Personalized Recommendations (${personalizedPicks.length})`,
                    icon: Sparkles,
                  },
                  {
                    id: "wishlist",
                    label: `My Wishlist (${(wishlistIds || []).length})`,
                    icon: Heart,
                  },
                  {
                    id: "history",
                    label: `Viewed & Purchased (${currentUser.viewedItemsHistory?.length || 0})`,
                    icon: History,
                  },
                  { id: "orders", label: `Orders & Tracking (${orders.length})`, icon: Package },
                  { id: "badges", label: "Honor Badges & Trust", icon: Award },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setProfileTab(t.id as any)}
                      className={`py-2 px-3 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
                        profileTab === t.id
                          ? "border-[#0A3D62] text-[#0A3D62] dark:border-[#F9CA24] dark:text-[#F9CA24]"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Icon size={14} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: PREFERENCES & INTERESTS */}
              {profileTab === "preferences" && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs flex items-start gap-2.5">
                    <Sparkles size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-amber-800 dark:text-amber-300">
                        Tailor Your Cape Sun Experience:
                      </span>{" "}
                      Your selections below directly drive our AI recommendations, storefront spotlights, and
                      weather-triggered heatwave alerts.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Climate Zone */}
                    <div
                      className={`p-4 rounded-xl border ${
                        isDarkMode ? "bg-[#1C2541]/40 border-slate-700" : "bg-white border-zinc-200"
                      }`}
                    >
                      <label className="block font-bold mb-1.5">South African Climate Zone</label>
                      <select
                        value={climateZone}
                        onChange={(e) => setClimateZone(e.target.value)}
                        className={`w-full p-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-[#F9CA24] ${
                          isDarkMode ? "bg-[#0B132B] border-slate-600 text-white" : "bg-slate-50 border-zinc-300"
                        }`}
                      >
                        {CLIMATE_ZONES.map((zone) => (
                          <option key={zone} value={zone}>
                            {zone}
                          </option>
                        ))}
                      </select>
                      <div className="text-[10px] opacity-60 mt-1">
                        Determines heatwave thresholds and optimal cooling power recommendations.
                      </div>
                    </div>

                    {/* Cooling Intensity */}
                    <div
                      className={`p-4 rounded-xl border ${
                        isDarkMode ? "bg-[#1C2541]/40 border-slate-700" : "bg-white border-zinc-200"
                      }`}
                    >
                      <label className="block font-bold mb-1.5">Preferred Cooling Power</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          "Mild Breeze",
                          "Standard Chill",
                          "Turbo Extreme (40°C+ Heatwaves)",
                        ].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setCoolingIntensity(level as any)}
                            className={`p-1.5 rounded-lg text-[10px] font-bold border transition text-center ${
                              coolingIntensity === level
                                ? "bg-[#0A3D62] text-white border-[#0A3D62] dark:bg-[#F9CA24] dark:text-black dark:border-[#F9CA24]"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-400"
                            }`}
                          >
                            {level.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                      <div className="text-[10px] opacity-60 mt-1">
                        Active Mode: <span className="font-semibold">{coolingIntensity}</span>
                      </div>
                    </div>

                    {/* Shopper / Family Type */}
                    <div
                      className={`p-4 rounded-xl border ${
                        isDarkMode ? "bg-[#1C2541]/40 border-slate-700" : "bg-white border-zinc-200"
                      }`}
                    >
                      <label className="block font-bold mb-1.5">Shopper Lifestyle &amp; Persona</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          "Solo Adventurer",
                          "Parent with Kids / Toddlers",
                          "Outdoor Camper & Hiker",
                          "Daily Commuter",
                        ].map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setFamilyStatus(status as any)}
                            className={`p-2 rounded-lg text-[11px] font-semibold border text-left transition ${
                              familyStatus === status
                                ? "bg-[#0A3D62]/10 border-[#0A3D62] dark:bg-[#F9CA24]/20 dark:border-[#F9CA24] font-bold"
                                : "border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preferred Categories */}
                    <div
                      className={`p-4 rounded-xl border ${
                        isDarkMode ? "bg-[#1C2541]/40 border-slate-700" : "bg-white border-zinc-200"
                      }`}
                    >
                      <label className="block font-bold mb-1.5">Priority Summer Categories</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: "cooling", label: "Turbine Cooling 🌀" },
                          { id: "sun-protection", label: "UPF 50+ UV Guard 👶" },
                          { id: "power", label: "Solar & Portable Power 🔋" },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleToggleCategory(cat.id as any)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition ${
                              selectedCategories.includes(cat.id as any)
                                ? "bg-[#0A3D62] text-white border-[#0A3D62] dark:bg-[#F9CA24] dark:text-black dark:border-[#F9CA24]"
                                : "border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Interests Chips */}
                  <div
                    className={`p-4 rounded-xl border ${
                      isDarkMode ? "bg-[#1C2541]/40 border-slate-700" : "bg-white border-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-extrabold text-xs">
                        Personal Interests &amp; Activities ({userInterests.length} selected)
                      </label>
                      <span className="text-[10px] opacity-60">Click to toggle tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_INTERESTS.map((interest) => {
                        const isSelected = userInterests.includes(interest);
                        return (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => handleToggleInterest(interest)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? "bg-[#0A3D62] text-white border-[#0A3D62] dark:bg-[#F9CA24] dark:text-black dark:border-[#F9CA24] font-bold"
                                : "bg-slate-50 dark:bg-[#0B132B] border-slate-200 dark:border-slate-700 hover:border-slate-400"
                            }`}
                          >
                            {isSelected && <Check size={12} />}
                            <span>{interest}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notification & Savings Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoBundle}
                        onChange={(e) => setAutoBundle(e.target.checked)}
                        className="w-4 h-4 rounded text-[#0A3D62] focus:ring-[#F9CA24]"
                      />
                      <div>
                        <div className="font-bold">Auto-Apply Bundle Savings</div>
                        <div className="text-[10px] opacity-70">Automatically discount R150 on any 2+ items</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={heatAlerts}
                        onChange={(e) => setHeatAlerts(e.target.checked)}
                        className="w-4 h-4 rounded text-[#0A3D62] focus:ring-[#F9CA24]"
                      />
                      <div>
                        <div className="font-bold">38°C Heatwave Alerts</div>
                        <div className="text-[10px] opacity-70">SMS &amp; WhatsApp warnings for your zone</div>
                      </div>
                    </label>
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={handleSavePreferences}
                      className="px-6 py-2.5 bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-xs rounded-full shadow hover:opacity-90 transition flex items-center gap-2 cursor-pointer"
                    >
                      <Save size={14} /> Save Preferences &amp; Refresh Recommendations
                    </button>

                    {saveSuccess && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 animate-fade-in">
                        <CheckCircle size={14} /> Preferences updated and synced!
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: LOYALTY REWARDS & DISCOUNT TIERS */}
              {profileTab === "loyalty" && (
                <LoyaltyRewards
                  loyaltyPoints={currentUser.loyaltyPoints || 0}
                  isDarkMode={isDarkMode}
                  userEmail={currentUser.email}
                  userName={currentUser.fullName}
                  onApplyDiscountCode={onApplyDiscountCode}
                  onSimulateEarn={(points, reason) => {
                    if (onAddLoyaltyPoints) {
                      onAddLoyaltyPoints(points, reason);
                    }
                  }}
                />
              )}

              {/* TAB 2: PERSONALIZED RECOMMENDATIONS */}
              {profileTab === "recommendations" && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-[#0A3D62]/5 dark:bg-[#F9CA24]/10 border border-[#0A3D62]/20 dark:border-[#F9CA24]/30 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-[#0A3D62] dark:text-[#F9CA24]">
                        Tailored for {currentUser.fullName}
                      </div>
                      <div className="opacity-70 text-[11px]">
                        Climate: <span className="font-semibold">{climateZone}</span> • Mode:{" "}
                        <span className="font-semibold">{coolingIntensity}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#F9CA24] text-black font-black px-2 py-0.5 rounded-full uppercase">
                      Cape Town AI Engine
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {personalizedPicks.map(({ product, reason, badge }) => (
                      <div
                        key={product.id}
                        className={`p-4 rounded-2xl border flex flex-col justify-between transition hover:shadow-md ${
                          isDarkMode ? "bg-[#1C2541]/60 border-slate-700" : "bg-white border-zinc-200"
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="bg-[#F9CA24] text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                              {badge}
                            </span>
                            <span className="text-xl">{product.emoji}</span>
                          </div>

                          <h4 className="font-extrabold text-sm leading-snug">{product.title}</h4>
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                            {reason}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-black text-[#0A3D62] dark:text-[#F9CA24]">
                              R{product.price}
                            </div>
                            <div className="text-[10px] line-through opacity-50">R{product.compare}</div>
                          </div>

                          <div className="flex gap-1.5">
                            {onSelectProduct && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onSelectProduct(product);
                                }}
                                className="px-2.5 py-1 rounded-full border border-slate-300 dark:border-slate-600 text-[10px] font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              >
                                Specs
                              </button>
                            )}
                            {onOpenIndividualCheckout && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onOpenIndividualCheckout(product);
                                }}
                                className="px-3 py-1 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black text-[10px] font-extrabold shadow hover:opacity-90 cursor-pointer"
                              >
                                Order Item
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: MY WISHLIST */}
              {profileTab === "wishlist" && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <Heart size={16} className="fill-red-500 text-red-500" /> My Saved Wishlist ({wishlistIds.length})
                      </div>
                      <div className="opacity-75 text-[11px] mt-0.5">
                        Saved essentials. Move to cart in one click or proceed directly to separate individual checkout.
                      </div>
                    </div>
                    <span className="text-[10px] bg-red-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase">
                      2-3 Day CT Delivery
                    </span>
                  </div>

                  {wishlistIds.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl space-y-3">
                      <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center mx-auto text-xl">
                        <Heart size={24} />
                      </div>
                      <div className="font-bold text-sm">Your Wishlist is Empty</div>
                      <p className="text-xs opacity-70 max-w-sm mx-auto">
                        Tap the heart icon on any Cape Sun Co product to save it here for fast ordering or comparison.
                      </p>
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black rounded-full font-bold text-xs hover:opacity-90 transition cursor-pointer"
                      >
                        Browse Summer Essentials
                      </button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {wishlistIds.map((prodId) => {
                        const product = PRODUCTS.find((p) => p.id === prodId);
                        if (!product) return null;
                        return (
                          <div
                            key={product.id}
                            className={`p-4 rounded-2xl border flex flex-col justify-between transition hover:shadow-md ${
                              isDarkMode ? "bg-[#1C2541]/60 border-slate-700" : "bg-white border-zinc-200"
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="bg-[#F9CA24] text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                                  {product.badge}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onToggleWishlist?.(product.id)}
                                  className="w-7 h-7 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center hover:scale-110 transition cursor-pointer"
                                  title="Remove from Wishlist"
                                >
                                  <Heart size={14} className="fill-red-500 text-red-500" />
                                </button>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{product.emoji}</span>
                                <div>
                                  <h4 className="font-extrabold text-sm leading-snug">{product.title}</h4>
                                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                                    ✓ In Stock • Cape Town Hub (2-3 Days)
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                              <div className="flex items-baseline justify-between mb-2.5">
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-base font-black text-[#0A3D62] dark:text-[#F9CA24]">
                                    R{product.price}
                                  </span>
                                  <span className="text-xs line-through opacity-50">R{product.compare}</span>
                                </div>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">
                                  Save R{product.compare - product.price}
                                </span>
                              </div>

                              {/* One-click moving of items to the cart */}
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onAddToCart?.(product);
                                    onToggleWishlist?.(product.id);
                                  }}
                                  className="w-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-xs py-2 px-2 rounded-xl flex items-center justify-center gap-1 shadow hover:opacity-95 transition cursor-pointer"
                                  title="Move item from Wishlist into active Cart"
                                >
                                  <ShoppingBag size={12} />
                                  <span>Move to Cart</span>
                                </button>

                                {onOpenIndividualCheckout && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onClose();
                                      onOpenIndividualCheckout(product);
                                    }}
                                    className="w-full bg-slate-100 dark:bg-slate-800 text-current font-extrabold text-xs py-2 px-2 rounded-xl flex items-center justify-center gap-1 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                                  >
                                    <ExternalLink size={12} />
                                    <span>Checkout</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: VIEWED & PURCHASED HISTORY */}
              {profileTab === "history" && (
                <div className="space-y-6">
                  {/* Previously Viewed Items */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h4 className="font-extrabold text-xs flex items-center gap-1.5">
                        <History size={14} className="text-[#F9CA24]" /> Recently Viewed Essentials (
                        {currentUser.viewedItemsHistory?.length || 0})
                      </h4>
                      <span className="text-[10px] opacity-60">Recorded across active browsing sessions</span>
                    </div>

                    {(!currentUser.viewedItemsHistory || currentUser.viewedItemsHistory.length === 0) ? (
                      <div className="p-6 text-center border border-dashed rounded-xl opacity-60 text-xs">
                        No browsing history recorded yet. Explore items on the store to populate your history!
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {currentUser.viewedItemsHistory.map((item) => {
                          const fullProd = PRODUCTS.find((p) => p.id === item.productId);
                          return (
                            <div
                              key={item.productId}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                                isDarkMode ? "bg-[#1C2541]/40 border-slate-700" : "bg-white border-zinc-200"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-2xl">{item.productEmoji}</span>
                                <div>
                                  <div className="font-bold leading-tight">{item.productTitle}</div>
                                  <div className="opacity-60 text-[10px] mt-0.5">
                                    Viewed {item.viewCount} times • {item.viewedAt}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <div className="font-extrabold text-xs">R{item.price}</div>
                                {fullProd && onOpenIndividualCheckout && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onClose();
                                      onOpenIndividualCheckout(fullProd);
                                    }}
                                    className="mt-1 px-2 py-0.5 rounded bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-bold text-[9px] cursor-pointer"
                                  >
                                    Checkout
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Purchased Items History */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2.5">
                      <h4 className="font-extrabold text-xs flex items-center gap-1.5">
                        <ShoppingBag size={14} className="text-emerald-500" /> Purchased Essentials History (
                        {currentUser.purchasedProductIds?.length || 0})
                      </h4>
                      <span className="text-[10px] opacity-60">Verified Cape Town dispatches (2-3 days local)</span>
                    </div>

                    {(!currentUser.purchasedProductIds || currentUser.purchasedProductIds.length === 0) ? (
                      <div className="p-6 text-center border border-dashed rounded-xl opacity-60 text-xs">
                        No past purchases found for this account. Place an order to unlock re-order discounts!
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {currentUser.purchasedProductIds.map((prodId) => {
                          const prod = PRODUCTS.find((p) => p.id === prodId);
                          if (!prod) return null;
                          return (
                            <div
                              key={prodId}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                                isDarkMode ? "bg-[#1C2541]/40 border-slate-700" : "bg-white border-zinc-200"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                {prod.image ? (
                                  <img
                                    src={prod.image}
                                    alt={prod.title}
                                    referrerPolicy="no-referrer"
                                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                  />
                                ) : (
                                  <span className="text-2xl">{prod.emoji}</span>
                                )}
                                <div>
                                  <div className="font-bold leading-tight">{prod.shortTitle}</div>
                                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] mt-0.5">
                                    ✓ 30-Day Quality Guarantee Active
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <div className="font-extrabold text-xs">R{prod.price}</div>
                                {onOpenIndividualCheckout && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onClose();
                                      onOpenIndividualCheckout(prod);
                                    }}
                                    className="mt-1 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-bold text-[9px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                  >
                                    Re-Order
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: ORDERS & REAL-TIME TRACKING */}
              {profileTab === "orders" && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                      <Package size={16} /> Order History &amp; Dispatch Tracking ({orders.length})
                    </h4>
                    <span className="text-[11px] opacity-70">Courier Guy Cape Town Hub (2-3 Day Delivery)</span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-8 text-center border border-dashed rounded-xl opacity-60 text-xs">
                      No orders placed yet. Select any summer essential to test the dedicated item checkout!
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-72 overflow-y-auto">
                      {orders.map((ord) => (
                        <div
                          key={ord.id}
                          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                            isDarkMode ? "bg-[#1C2541]/40 border-slate-700" : "bg-white border-zinc-200 shadow-sm"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{ord.productEmoji}</span>
                            <div>
                              <div className="font-extrabold text-sm">{ord.productTitle}</div>
                              <div className="opacity-70">
                                Tracking: <span className="font-mono text-[#F9CA24] font-bold">{ord.orderCode}</span> •{" "}
                                {ord.color} • Qty: {ord.quantity}
                              </div>
                              <div className="mt-0.5 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                <Truck size={12} /> {ord.status}
                              </div>
                              <div className="text-[10px] opacity-60 mt-0.5">
                                Destination:{" "}
                                {typeof ord.shippingAddress === "string"
                                  ? ord.shippingAddress
                                  : `${ord.shippingAddress?.street || ""}, ${ord.shippingAddress?.city || ""}`}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0 space-y-1">
                            <div className="font-extrabold text-sm">R{ord.total}</div>
                            <div className="flex flex-col gap-1 items-end">
                              {onOpenOrderStatus && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onClose();
                                    onOpenOrderStatus(ord.orderCode);
                                  }}
                                  className="inline-flex items-center gap-1 text-[10px] bg-[#0A3D62] text-[#F9CA24] dark:bg-[#F9CA24] dark:text-black font-extrabold px-2.5 py-0.5 rounded-full hover:opacity-90 shadow-sm cursor-pointer"
                                >
                                  <Truck size={10} /> Live Courier Status
                                </button>
                              )}
                              <a
                                href={`https://wa.me/27662860184?text=${encodeURIComponent(
                                  `Hi Cape Sun Co Cape Town team! Checking status for order ${ord.orderCode} (${ord.productTitle}) - Total R${ord.total}.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] bg-[#25D366] text-white font-bold px-2 py-0.5 rounded-full hover:opacity-90 shadow-sm"
                              >
                                <MessageCircle size={10} /> Track on WhatsApp
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: HONOR BADGES & TRUST GUARANTEES */}
              {profileTab === "badges" && (
                <div className="space-y-4">
                  <div className="text-xs opacity-75">
                    Cape Sun Co proudly awards Verified Honor Badges to our loyal community, recognizing verified Cape Town orders, sustainable packaging adoption, local community reviews, and heatwave readiness.
                  </div>
                  <HonorBadges isDarkMode={isDarkMode} variant="cards" showTitle={false} />
                </div>
              )}

              {/* Sign Out Action for Logged In Customer */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="text-xs opacity-75">
                  Signed in as <strong>{currentUser.email}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("capesun_user");
                    onLogin(null as any);
                    onClose();
                  }}
                  className="px-4 py-1.5 rounded-full border border-red-500/40 text-red-500 text-xs font-bold hover:bg-red-500/10 transition cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Sign In / Sign Up Form for Logged-out state */
            <div className="space-y-5">
              {/* Tabs */}
              <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setAuthTab("signin")}
                  className={`flex-1 py-2.5 font-bold text-xs border-b-2 text-center transition ${
                    authTab === "signin"
                      ? "border-[#0A3D62] text-[#0A3D62] dark:border-[#F9CA24] dark:text-[#F9CA24]"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab("signup")}
                  className={`flex-1 py-2.5 font-bold text-xs border-b-2 text-center transition ${
                    authTab === "signup"
                      ? "border-[#0A3D62] text-[#0A3D62] dark:border-[#F9CA24] dark:text-[#F9CA24]"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab("forgot")}
                  className={`flex-1 py-2.5 font-bold text-xs border-b-2 text-center transition ${
                    authTab === "forgot"
                      ? "border-[#0A3D62] text-[#0A3D62] dark:border-[#F9CA24] dark:text-[#F9CA24]"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  Reset Password
                </button>
              </div>

              {/* Customer Benefits & Loyalty Welcome Bar */}
              <div
                className={`p-3 rounded-xl border ${
                  isDarkMode ? "bg-[#1C2541]/70 border-slate-700" : "bg-amber-500/10 border-amber-500/30"
                }`}
              >
                <div className="text-xs font-bold mb-1 flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <Sparkles size={14} className="text-[#F9CA24]" /> VIP Customer Account &amp; Sunshine Rewards
                </div>
                <div className="text-[11px] opacity-80 leading-relaxed">
                  Sign in or create your personal account to claim 150 welcome points, track Cape Town courier
                  deliveries, and receive heatwave flash sale promotions.
                </div>
              </div>

              {/* Tab Form */}
              {authTab === "signin" && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Email or Cellphone</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-3 opacity-50" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sipho.k@capetown.co.za or 082 123 4567"
                        className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#F9CA24] ${
                          isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-white border-zinc-300"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-3 opacity-50" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#F9CA24] ${
                          isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-white border-zinc-300"
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-sm rounded-full shadow hover:opacity-90 transition cursor-pointer"
                  >
                    Sign In to Cape Sun Portal
                  </button>
                </form>
              )}

              {authTab === "signup" && (
                <form onSubmit={handleSignUp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Taryn Miller"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-white border-zinc-300"
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="taryn@gmail.com"
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-white border-zinc-300"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Cellphone (WhatsApp)</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="082 123 4567"
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-white border-zinc-300"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">City / Region</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Sea Point, Cape Town"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-white border-zinc-300"
                      }`}
                    />
                  </div>

                  {/* Promotional Email Opt-in Guarantee */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                      />
                      <span className="text-[11px] leading-relaxed opacity-90">
                        <strong>Receive Cape Town Heatwave Alerts &amp; Secret Discounts:</strong> We&apos;ll send you weather advisories, flash discount codes (up to 20%), and beach bundle alerts to your email. Unsubscribe anytime.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#F9CA24] text-black font-extrabold text-sm rounded-full shadow hover:opacity-90 transition cursor-pointer"
                  >
                    Create Account &amp; Claim 150 Sunshine Points
                  </button>
                </form>
              )}

              {authTab === "forgot" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setForgotSent(true);
                  }}
                  className="space-y-4"
                >
                  {forgotSent ? (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2">
                      <CheckCircle size={28} className="mx-auto text-emerald-500" />
                      <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        Password Reset Link Dispatched!
                      </div>
                      <div className="text-xs opacity-80">
                        Check your SMS and inbox for an instant OTP verification link.
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs opacity-70">
                        Enter your registered email address or cellphone number and we will send a secure one-time
                        login PIN.
                      </p>
                      <div>
                        <label className="block text-xs font-bold mb-1">Email or Phone</label>
                        <input
                          type="text"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="082 123 4567 or you@domain.co.za"
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${
                            isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-white border-zinc-300"
                          }`}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-sm rounded-full shadow hover:opacity-90 transition cursor-pointer"
                      >
                        Send Reset PIN
                      </button>
                    </>
                  )}
                </form>
              )}

              {/* Honor Badges & SA Trust Seals */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <HonorBadges isDarkMode={isDarkMode} variant="strip" showTitle={false} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
