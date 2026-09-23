import React, { useState, useEffect } from "react";
import {
  Flame,
  Wind,
  Sun,
  MapPin,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Radio,
} from "lucide-react";
import { Product } from "../types";

export interface WeatherZone {
  id: string;
  name: string;
  temp: number;
  feelsLike: number;
  condition: string;
  uvIndex: number;
  uvLevel: "Moderate" | "Very High" | "Extreme" | "Severe";
  windSpeed: string;
  windDesc: string;
  humidity: number;
  status: "Heatwave Alert" | "Breezy & Sunny" | "Severe Heat" | "Beach Conditions";
  recommendedProduct: {
    id: string;
    name: string;
    emoji: string;
    reason: string;
  };
}

export const CAPE_TOWN_ZONES: WeatherZone[] = [
  {
    id: "seapoint-clifton",
    name: "Cape Town (Sea Point & Clifton)",
    temp: 32,
    feelsLike: 35,
    condition: "Blazing Sun & Ocean Breeze",
    uvIndex: 11,
    uvLevel: "Extreme",
    windSpeed: "24 km/h SW",
    windDesc: "Atlantic Sea Breeze",
    humidity: 48,
    status: "Heatwave Alert",
    recommendedProduct: {
      id: "neckfan",
      name: "Bladeless Neck Fan",
      emoji: "🌀",
      reason: "Twin-turbine hands-free breeze for promenade & Clifton beach",
    },
  },
  {
    id: "paarl-winelands",
    name: "Paarl & Cape Winelands",
    temp: 39,
    feelsLike: 42,
    condition: "Severe Inland Heatwave",
    uvIndex: 12,
    uvLevel: "Severe",
    windSpeed: "12 km/h NE",
    windDesc: "Hot Inland Draft",
    humidity: 28,
    status: "Severe Heat",
    recommendedProduct: {
      id: "towel",
      name: "Instant Ice Cooling Towel",
      emoji: "🧊",
      reason: "Drops skin temperature to 15°C in 3 seconds to prevent heatstroke",
    },
  },
  {
    id: "campsbay",
    name: "Camps Bay & Bakoven",
    temp: 31,
    feelsLike: 34,
    condition: "Full Sun & Clear Skies",
    uvIndex: 11,
    uvLevel: "Extreme",
    windSpeed: "20 km/h SW",
    windDesc: "Fresh Sea Air",
    humidity: 52,
    status: "Beach Conditions",
    recommendedProduct: {
      id: "uvbundle",
      name: "Kids UPF 50+ Sunsuit Set",
      emoji: "👶",
      reason: "Blocks 98.5% UVA/UVB rays without constant sunscreen battles",
    },
  },
  {
    id: "cederberg",
    name: "Cederberg & West Coast Camping",
    temp: 37,
    feelsLike: 39,
    condition: "Dry Heat & Unshaded Sun",
    uvIndex: 11,
    uvLevel: "Extreme",
    windSpeed: "16 km/h NW",
    windDesc: "Mountain Air",
    humidity: 22,
    status: "Heatwave Alert",
    recommendedProduct: {
      id: "powerbank",
      name: "Solar Power Bank 20000mAh",
      emoji: "🔋",
      reason: "Keep fans and devices charged off-grid with 4 built-in cables",
    },
  },
  {
    id: "blouberg",
    name: "Bloubergstrand & Table View",
    temp: 29,
    feelsLike: 31,
    condition: "Sunny with Cape Doctor Wind",
    uvIndex: 10,
    uvLevel: "Very High",
    windSpeed: "32 km/h S",
    windDesc: "The Cape Doctor",
    humidity: 54,
    status: "Breezy & Sunny",
    recommendedProduct: {
      id: "neckfan",
      name: "Bladeless Neck Fan",
      emoji: "🌀",
      reason: "3-speed bladeless airflow that won't tangle long hair in the wind",
    },
  },
];

interface Props {
  variant?: "compact" | "banner" | "badge";
  isDarkMode?: boolean;
  onSelectProduct?: (productId: string) => void;
  className?: string;
}

export const CapeTownWeatherWidget: React.FC<Props> = ({
  variant = "compact",
  isDarkMode = false,
  onSelectProduct,
  className = "",
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>("seapoint-clifton");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [liveWeather, setLiveWeather] = useState<{
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: string;
    uvIndex: number;
    uvLevel: "Moderate" | "Very High" | "Extreme" | "Severe";
    status: "Heatwave Alert" | "Breezy & Sunny" | "Severe Heat" | "Beach Conditions";
    timestamp: string;
    source: string;
  } | null>(null);
  const [isLoadingLive, setIsLoadingLive] = useState(false);

  const fetchLiveWeather = async () => {
    setIsLoadingLive(true);
    try {
      const res = await fetch("/api/weather/capetown");
      if (res.ok) {
        const data = await res.json();
        setLiveWeather({
          temp: data.temp,
          feelsLike: data.feelsLike,
          humidity: data.humidity,
          windSpeed: data.windSpeed,
          uvIndex: data.uvIndex,
          uvLevel: data.uvLevel,
          status: data.status,
          timestamp: data.timestamp,
          source: data.source || "Open-Meteo Cape Town Live Station",
        });
      }
    } catch (err) {
      console.error("Live weather fetch error:", err);
    } finally {
      setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    fetchLiveWeather();
    const timer = setInterval(fetchLiveWeather, 180000);
    return () => clearInterval(timer);
  }, []);

  const baseZone = CAPE_TOWN_ZONES.find((z) => z.id === selectedZoneId) || CAPE_TOWN_ZONES[0];

  const activeZone = React.useMemo(() => {
    if (!liveWeather) return baseZone;
    let temp = liveWeather.temp;
    let feelsLike = liveWeather.feelsLike;
    let windSpeed = liveWeather.windSpeed;
    let uvIndex = liveWeather.uvIndex;

    if (selectedZoneId === "paarl-winelands") {
      temp = Math.max(34, liveWeather.temp + 6);
      feelsLike = temp + 3;
    } else if (selectedZoneId === "blouberg-tableview") {
      temp = Math.max(22, liveWeather.temp - 2);
      feelsLike = temp;
      windSpeed = "35 km/h SE (Cape Doctor)";
    } else if (selectedZoneId === "cederberg-westcoast") {
      temp = Math.max(32, liveWeather.temp + 5);
      feelsLike = temp + 2;
    }

    return {
      ...baseZone,
      temp,
      feelsLike,
      windSpeed,
      uvIndex,
      uvLevel: uvIndex >= 11 ? ("Extreme" as const) : uvIndex >= 8 ? ("Very High" as const) : ("Moderate" as const),
      status: temp >= 33 || uvIndex >= 11 ? ("Heatwave Alert" as const) : ("Beach Conditions" as const),
    };
  }, [baseZone, liveWeather, selectedZoneId]);

  const isExtreme = activeZone.temp >= 35 || activeZone.uvIndex >= 11;

  // COMPACT VARIANT: Designed for the top banner / navbar with high visibility pulse animation
  if (variant === "compact") {
    return (
      <div className={`relative inline-flex items-center text-xs font-semibold ${className}`}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/20 hover:bg-black/30 border border-white/15 transition text-left cursor-pointer group"
          title="Click to switch Cape Town climate zones"
        >
          {/* PULSE ANIMATION RADAR BEACON */}
          <div className="relative flex items-center justify-center w-3 h-3">
            <span
              className={`animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75 ${
                isExtreme ? "bg-amber-400" : "bg-emerald-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isExtreme ? "bg-[#F9CA24]" : "bg-emerald-400"
              }`}
            />
          </div>

          {/* Temperature & Location Text */}
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="font-extrabold text-[#F9CA24] flex items-center gap-0.5">
              <Sun size={13} className="text-[#F9CA24] animate-spin-slow" />
              {activeZone.temp}°C
            </span>
            <span className="opacity-90 font-medium hidden sm:inline">{activeZone.name.split("(")[0]}</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F9CA24] text-[10px] font-black uppercase tracking-wider hidden md:inline">
              UV {activeZone.uvIndex} Extreme
            </span>
            <ChevronDown size={11} className={`opacity-60 transition ${dropdownOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        {/* Dropdown Zone Menu */}
        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDropdownOpen(false)}
            />
            <div
              className={`absolute top-full right-0 sm:left-0 mt-2 w-72 rounded-2xl shadow-2xl border p-3 z-50 transition-all ${
                isDarkMode ? "bg-[#0B132B] border-slate-700 text-white" : "bg-white border-zinc-200 text-[#2C3E50]"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-2 mb-2 border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-500 flex items-center gap-1">
                  <Radio size={12} className="text-amber-500 animate-pulse" /> Live Radar (Open-Meteo)
                </span>
                <button
                  type="button"
                  onClick={fetchLiveWeather}
                  disabled={isLoadingLive}
                  className="px-2 py-0.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1 text-[10px] font-bold opacity-80 cursor-pointer"
                  title="Refresh live Cape Town weather"
                >
                  <RefreshCw size={10} className={isLoadingLive ? "animate-spin" : ""} />
                  <span>{isLoadingLive ? "Updating..." : "Refresh"}</span>
                </button>
              </div>

              <div className="space-y-1 max-h-60 overflow-y-auto">
                {CAPE_TOWN_ZONES.map((zone) => {
                  const isSelected = zone.id === activeZone.id;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => {
                        setSelectedZoneId(zone.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between text-xs cursor-pointer ${
                        isSelected
                          ? "bg-amber-500/15 border border-amber-500/30 font-bold"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent"
                      }`}
                    >
                      <div className="space-y-0.5 truncate pr-2">
                        <div className="font-extrabold truncate">{zone.name}</div>
                        <div className="text-[10px] opacity-70 flex items-center gap-1.5">
                          <span>{zone.condition}</span>
                          <span>•</span>
                          <span className="text-amber-500 font-semibold">UV {zone.uvIndex}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-amber-500">{zone.temp}°C</span>
                        <div className="text-[9px] opacity-60">{zone.windSpeed}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Recommendation snippet */}
              <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1">
                  <Sparkles size={11} /> Recommended for {activeZone.temp}°C:
                </div>
                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-sm">{activeZone.recommendedProduct.emoji}</span>
                    <span className="font-bold truncate text-[11px]">{activeZone.recommendedProduct.name}</span>
                  </div>
                  {onSelectProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        onSelectProduct(activeZone.recommendedProduct.id);
                      }}
                      className="px-2 py-1 rounded bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-[10px] shrink-0 hover:opacity-90 cursor-pointer"
                    >
                      View
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // BANNER / CARD VARIANT: Full visual showcase with animated pulse radar & weather details
  return (
    <div
      className={`rounded-2xl border p-4 md:p-5 relative overflow-hidden transition-all ${
        isDarkMode
          ? "bg-gradient-to-br from-[#1C2541]/90 to-[#0B132B] border-slate-700"
          : "bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-sky-50/50 border-amber-200/80 shadow-sm"
      } ${className}`}
    >
      {/* Background Pulse Heat Ripple Effect */}
      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-amber-400/10 dark:bg-amber-400/5 blur-2xl pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Pulse Radar & Live Temperature */}
        <div className="flex items-start sm:items-center gap-3.5">
          {/* Animated Pulse Beacon Icon */}
          <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 shadow-inner">
            {/* Outer expanding ping ring */}
            <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-amber-400 opacity-60" />
            {/* Secondary pulsing halo */}
            <span className="animate-pulse absolute inline-flex h-11 w-11 rounded-2xl bg-amber-400/20" />
            <Sun size={26} className="relative z-10 text-[#F9CA24] fill-[#F9CA24]/20 animate-spin-slow" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Live Open-Meteo Radar
              </span>
              <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <ShieldAlert size={12} /> {activeZone.status}
              </span>
              <button
                type="button"
                onClick={fetchLiveWeather}
                disabled={isLoadingLive}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition opacity-70 hover:opacity-100"
                title="Refresh live weather station"
              >
                <RefreshCw size={11} className={isLoadingLive ? "animate-spin text-amber-500" : ""} />
              </button>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-amber-500 tracking-tight">
                {activeZone.temp}°C
              </span>
              <span className="text-xs font-semibold opacity-70">
                Feels like <strong className="opacity-100">{activeZone.feelsLike}°C</strong>
              </span>
              <span className="text-xs opacity-50 hidden sm:inline">•</span>
              <span className="text-xs font-medium opacity-80 hidden sm:inline">{activeZone.condition}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Zone Selector & Metrics Chips */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Zone Selector Button */}
          <div className="relative">
            <select
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
              className={`px-3 py-1.5 pr-8 rounded-xl border text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F9CA24] ${
                isDarkMode
                  ? "bg-[#0B132B] border-slate-700 text-white"
                  : "bg-white border-zinc-200 text-[#0A3D62] shadow-sm"
              }`}
            >
              {CAPE_TOWN_ZONES.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  📍 {zone.name} ({zone.temp}°C)
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
          </div>

          {/* UV Meter Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-bold flex items-center gap-1.5">
            <span className="text-amber-500 font-black">UV {activeZone.uvIndex}</span>
            <span className="opacity-70 text-[11px]">({activeZone.uvLevel})</span>
          </div>

          {/* Wind / Sea Breeze */}
          <div className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-bold flex items-center gap-1.5">
            <Wind size={13} className="text-sky-500" />
            <span className="text-[11px]">{activeZone.windSpeed}</span>
          </div>
        </div>
      </div>

      {/* Bottom Cooling Gear Recommendation Bar */}
      <div className="mt-3.5 pt-3 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-base">{activeZone.recommendedProduct.emoji}</span>
          <span className="font-bold">
            Heat Defense: <span className="underline decoration-amber-400 font-extrabold">{activeZone.recommendedProduct.name}</span>
          </span>
          <span className="text-[11px] opacity-75 hidden md:inline">— {activeZone.recommendedProduct.reason}</span>
        </div>

        {onSelectProduct && (
          <button
            type="button"
            onClick={() => onSelectProduct(activeZone.recommendedProduct.id)}
            className="px-3 py-1 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-xs flex items-center gap-1 hover:opacity-90 transition cursor-pointer shadow-sm ml-auto"
          >
            <span>Protect Against {activeZone.temp}°C</span>
            <ArrowRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
};
