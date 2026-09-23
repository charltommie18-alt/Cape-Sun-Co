import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      className={`fixed top-[64px] left-0 right-0 z-40 px-4 py-2 text-xs font-bold transition-colors flex items-center justify-between shadow-md ${
        isOnline
          ? "bg-emerald-600 text-white"
          : "bg-amber-500 text-black border-b border-amber-600"
      }`}
    >
      <div className="mx-auto max-w-[1280px] w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi size={16} />
              <span>Back Online! Your Cape Sun Co changes have been synced with Cape Town Hub.</span>
            </>
          ) : (
            <>
              <WifiOff size={16} />
              <span>
                Offline / Low Connectivity Mode Active • Browsing cached summer catalog. Any orders or cart items will sync automatically.
              </span>
            </>
          )}
        </div>

        {!isOnline && (
          <button
            onClick={() => window.location.reload()}
            className="px-2.5 py-1 bg-black text-white text-[11px] rounded font-extrabold flex items-center gap-1 hover:opacity-85"
          >
            <RefreshCw size={12} /> Check Signal
          </button>
        )}
      </div>
    </div>
  );
};
