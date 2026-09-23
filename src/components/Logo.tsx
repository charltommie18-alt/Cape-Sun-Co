import React, { useState } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  isDarkMode?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  className = "",
  showText = true,
  isDarkMode = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-11 w-auto",
    lg: "h-16 w-auto",
    xl: "h-24 w-auto",
  };

  if (!imgError) {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <img
          src="/logo.png"
          alt="Cape Sun Co Logo"
          className={`${sizeClasses[size]} object-contain rounded-md drop-shadow-sm`}
          onError={() => setImgError(true)}
        />
        {showText && (
          <div className="hidden sm:flex flex-col leading-tight">
            <span
              className={`font-black tracking-tight text-base font-['Poppins'] ${
                isDarkMode ? "text-white" : "text-[#0A3D62]"
              }`}
            >
              CAPE SUN CO
            </span>
            <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#F9CA24]">
              Cape Town
            </span>
          </div>
        )}
      </div>
    );
  }

  // High-precision SVG Fallback showing Table Mountain, Rising Golden Sun & Compass
  const heights = { sm: 32, md: 44, lg: 64, xl: 96 };
  const h = heights[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={h * 1.3}
        height={h}
        viewBox="0 0 130 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
      >
        {/* Sun rays */}
        <g stroke="#E5A910" strokeWidth="2.5" strokeLinecap="round">
          <line x1="65" y1="28" x2="65" y2="8" />
          <line x1="50" y1="32" x2="38" y2="15" />
          <line x1="80" y1="32" x2="92" y2="15" />
          <line x1="38" y1="38" x2="20" y2="28" />
          <line x1="92" y1="38" x2="110" y2="28" />
          <line x1="28" y1="48" x2="10" y2="44" />
          <line x1="102" y1="48" x2="120" y2="44" />
        </g>
        {/* Sun disc */}
        <circle cx="65" cy="48" r="20" fill="#E5A910" />
        {/* Table Mountain Silhouette */}
        <path
          d="M 12 76 L 30 65 L 42 54 L 88 54 L 100 65 L 118 76 L 122 78 L 8 78 Z"
          fill="#3E2C1C"
        />
        <path
          d="M 38 54 L 92 54 L 88 57 L 42 57 Z"
          fill="#5A432D"
        />
        {/* Base line */}
        <line x1="8" y1="78" x2="122" y2="78" stroke="#1E2A38" strokeWidth="1.5" />
      </svg>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className={`font-black tracking-tight text-base font-['Poppins'] ${
              isDarkMode ? "text-white" : "text-[#0A3D62]"
            }`}
          >
            CAPE SUN CO
          </span>
          <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#F9CA24]">
            Cape Town
          </span>
        </div>
      )}
    </div>
  );
};
