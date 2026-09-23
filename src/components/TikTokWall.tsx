import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Flame, Heart, MessageCircle, ShoppingBag, Eye } from "lucide-react";
import { TIKTOK_VIDEOS } from "../data/products";
import { PRODUCTS } from "../data/products";
import { Product } from "../types";

interface Props {
  isDarkMode: boolean;
  onSelectProduct?: (product: Product) => void;
  onOpenIndividualCheckout?: (product: Product) => void;
}

export const TikTokWall: React.FC<Props> = ({
  isDarkMode,
  onSelectProduct,
  onOpenIndividualCheckout,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const togglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingId === id) {
      video.pause();
      setPlayingId(null);
    } else {
      // Pause any previously playing video
      if (playingId && videoRefs.current[playingId]) {
        videoRefs.current[playingId]?.pause();
      }
      video.play().catch((err) => console.log("Playback interaction required:", err));
      setPlayingId(id);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="community-videos" className="py-12 px-4 md:px-6 max-w-[1280px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame size={14} /> Real South African Video Demos
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            See Cape Sun Co in the Wild
          </h2>
          <p className="text-sm opacity-75 max-w-xl mt-1">
            Real video tests beating 38°C Paarl heatwaves, Clifton 4th beach sessions, taxi ranks, and festival weekends.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold opacity-80">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Tap any card to play real demo video</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TIKTOK_VIDEOS.map((vid) => {
          const product = PRODUCTS.find((p) => p.id === vid.productId);
          const isPlaying = playingId === vid.id;
          const isLiked = !!likedIds[vid.id];

          return (
            <div
              key={vid.id}
              className={`rounded-[24px] border overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col ${
                isDarkMode ? "bg-[#1C2541]/80 border-slate-700" : "bg-white border-zinc-200"
              }`}
            >
              {/* Video Player Box */}
              <div
                onClick={() => togglePlay(vid.id)}
                className="aspect-[9/13] bg-black relative flex flex-col justify-between p-4 text-white overflow-hidden group cursor-pointer"
              >
                {/* Real HTML5 Video */}
                <video
                  ref={(el) => {
                    videoRefs.current[vid.id] = el;
                  }}
                  src={vid.videoUrl}
                  poster={product?.image}
                  muted={isMuted}
                  playsInline
                  loop
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* Dark Vignette Overlay for readable text */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none z-1" />

                {/* Play/Pause Center Action Overlay */}
                <div
                  className={`absolute inset-0 flex items-center justify-center pointer-events-none transition duration-300 z-10 ${
                    isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
                    {isPlaying ? (
                      <Pause size={24} className="text-white fill-white" />
                    ) : (
                      <Play size={24} className="text-[#F9CA24] fill-[#F9CA24] ml-1" />
                    )}
                  </div>
                </div>

                {/* Top Bar: View Count, Audio Toggle, Badge */}
                <div className="relative z-10 flex justify-between items-center text-xs">
                  <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold border border-white/10 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-red-500 animate-pulse" : "bg-white/50"}`} />
                    {isPlaying ? "Playing Video" : `${vid.views} views`}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={toggleMute}
                      title={isMuted ? "Unmute video" : "Mute video"}
                      className="p-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white hover:bg-black/80 transition cursor-pointer"
                    >
                      {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-emerald-400" />}
                    </button>
                    <span className="bg-[#F9CA24] text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      {vid.badge}
                    </span>
                  </div>
                </div>

                {/* Bottom Overlay: Creator, Caption, Stats */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold text-sm text-white drop-shadow-md flex items-center gap-1.5">
                      <span>{vid.name}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">✓ Verified</span>
                    </div>

                    {/* Likes & Comments */}
                    <div className="flex items-center gap-3 text-xs">
                      <button
                        type="button"
                        onClick={(e) => toggleLike(e, vid.id)}
                        className="flex items-center gap-1 text-white hover:text-pink-400 transition cursor-pointer"
                      >
                        <Heart
                          size={14}
                          className={isLiked ? "fill-pink-500 text-pink-500" : "text-white"}
                        />
                        <span className="font-bold text-[11px]">{isLiked ? "Liked" : vid.likes}</span>
                      </button>
                      <span className="flex items-center gap-1 text-white/80">
                        <MessageCircle size={14} />
                        <span className="text-[11px]">{vid.comments}</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-white/90 leading-snug drop-shadow-sm font-medium">
                    {vid.text}
                  </p>

                  <div className="text-[11px] text-[#F9CA24] font-bold">
                    #CapeSunCo #MzansiSummer #LocalTesting
                  </div>
                </div>
              </div>

              {/* Attached Product Quick-Shop Bar */}
              {product && (
                <div className="p-3.5 border-t border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-[#1C2541]/50 flex items-center justify-between gap-2.5">
                  <div
                    onClick={() => onSelectProduct?.(product)}
                    className="flex items-center gap-2.5 cursor-pointer group flex-1 min-w-0"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      ) : (
                        <span className="text-xl flex items-center justify-center h-full">
                          {product.emoji}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate group-hover:text-[#0A3D62] dark:group-hover:text-[#F9CA24] transition">
                        {product.shortTitle}
                      </div>
                      <div className="text-[11px] font-extrabold text-[#0A3D62] dark:text-[#F9CA24]">
                        R{product.price}{" "}
                        <span className="line-through opacity-50 text-[9px]">R{product.compare}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelectProduct?.(product)}
                      title="View product specifications and details"
                      className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer text-slate-700 dark:text-slate-300"
                    >
                      <Eye size={14} />
                    </button>
                    {onOpenIndividualCheckout && (
                      <button
                        type="button"
                        onClick={() => onOpenIndividualCheckout(product)}
                        className="px-3 py-2 bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-[11px] rounded-lg shadow hover:brightness-105 transition flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag size={12} />
                        <span>Order</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
