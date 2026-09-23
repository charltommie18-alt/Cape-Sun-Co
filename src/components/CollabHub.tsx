import React, { useState, useEffect } from "react";
import { CollabRoom, Product, UserProfile } from "../types";
import {
  Users,
  MessageSquare,
  ShoppingBag,
  Plus,
  Share2,
  Check,
  Send,
  Sparkles,
  Zap,
  ArrowRight,
  Info,
} from "lucide-react";
import { PRODUCTS } from "../data/products";

interface Props {
  currentUser: UserProfile | null;
  onOpenIndividualCheckout: (product: Product, color?: string, size?: string) => void;
  isDarkMode: boolean;
}

export const CollabHub: React.FC<Props> = ({
  currentUser,
  onOpenIndividualCheckout,
  isDarkMode,
}) => {
  const [rooms, setRooms] = useState<CollabRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string>("clifton-beach-crew");
  const [activeRoom, setActiveRoom] = useState<CollabRoom | null>(null);
  const [messageText, setMessageText] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<string>("neckfan");

  // Fetch rooms from backend
  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/collaboration/rooms");
      const data = await res.json();
      if (data.rooms) {
        setRooms(data.rooms);
        const current = data.rooms.find((r: CollabRoom) => r.id === activeRoomId) || data.rooms[0];
        setActiveRoom(current);
      }
    } catch (err) {
      console.error("Failed to fetch collab rooms:", err);
    }
  };

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 8000);
    return () => clearInterval(interval);
  }, [activeRoomId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeRoom) return;

    const senderName = currentUser ? currentUser.fullName : "Cape Shopper";
    const senderAvatar = currentUser ? currentUser.fullName.slice(0, 2).toUpperCase() : "CS";

    try {
      const res = await fetch(`/api/collaboration/rooms/${activeRoom.id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: senderName,
          text: messageText.trim(),
          avatar: senderAvatar,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessageText("");
        fetchRooms();
      }
    } catch (err) {
      console.error("Error sending collab message:", err);
    }
  };

  const handleAddToCart = async () => {
    if (!activeRoom) return;
    const prod = PRODUCTS.find((p) => p.id === selectedProductToAdd);
    if (!prod) return;

    try {
      await fetch(`/api/collaboration/rooms/${activeRoom.id}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: prod.id,
          quantity: 1,
          addedBy: currentUser ? currentUser.fullName : "You",
          color: prod.colors[0],
          size: prod.sizes ? prod.sizes[0] : undefined,
        }),
      });
      fetchRooms();
    } catch (err) {
      console.error("Error adding to shared cart:", err);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      const res = await fetch("/api/collaboration/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newRoomName.trim(),
          creatorName: currentUser ? currentUser.fullName : "Cape Shopper",
        }),
      });
      const data = await res.json();
      if (data.room) {
        setNewRoomName("");
        setShowCreateModal(false);
        setActiveRoomId(data.room.id);
        fetchRooms();
      }
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Shared cart calculations
  const sharedItems = (activeRoom?.sharedCart || []).map((item) => {
    const p = PRODUCTS.find((prod) => prod.id === item.productId);
    return {
      ...item,
      product: p,
    };
  });

  const sharedSubtotal = sharedItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );
  const bundleDiscount = sharedItems.length >= 2 ? 150 : 0;
  const sharedTotal = Math.max(0, sharedSubtotal - bundleDiscount);

  return (
    <section id="collab-hub" className="py-12 px-4 md:px-6 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A3D62]/10 dark:bg-[#F9CA24]/20 text-[#0A3D62] dark:text-[#F9CA24] text-xs font-bold uppercase tracking-wider mb-2">
            <Users size={14} /> Real-Time Collaboration Hub
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Group Shopping &amp; Team Orders
          </h2>
          <p className="text-sm opacity-75 max-w-xl mt-1">
            Build beach kits with friends or manage warehouse inventory with staff in real time. Combine carts to
            unlock the <span className="font-bold text-[#F9CA24]">R150 bundle discount</span> together!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyShareLink}
            className={`px-4 py-2 rounded-full border text-xs font-bold flex items-center gap-1.5 transition ${
              copiedLink
                ? "bg-emerald-500 text-white border-emerald-500"
                : "border-slate-300 dark:border-slate-700 hover:border-slate-400"
            }`}
          >
            {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
            {copiedLink ? "Invite Link Copied!" : "Invite Friends / Team"}
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-xs shadow-md hover:opacity-90 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus size={14} /> New Room
          </button>
        </div>
      </div>

      {/* Room Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => {
              setActiveRoomId(room.id);
              setActiveRoom(room);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition ${
              activeRoomId === room.id
                ? "bg-[#0A3D62] text-white border-[#0A3D62] dark:bg-[#F9CA24] dark:text-black dark:border-[#F9CA24] shadow-sm"
                : "bg-white dark:bg-[#1C2541] border-slate-200 dark:border-slate-700 hover:border-slate-400"
            }`}
          >
            {room.name} ({room.participants.length} online)
          </button>
        ))}
      </div>

      {activeRoom && (
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          {/* Left Column: Shared Group Cart & Item Adding */}
          <div
            className={`p-5 md:p-6 rounded-[22px] border ${
              isDarkMode ? "bg-[#1C2541]/70 border-slate-700" : "bg-white border-zinc-200 shadow-sm"
            }`}
          >
            {/* Active Room Title & Participants */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700 mb-5">
              <div>
                <h3 className="font-extrabold text-lg">{activeRoom.name}</h3>
                <div className="text-xs opacity-70">
                  Created by <span className="font-semibold">{activeRoom.creator}</span>
                </div>
              </div>

              {/* Active Participants Avatars */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold opacity-70">Active now:</span>
                <div className="flex -space-x-2">
                  {activeRoom.participants.map((p) => (
                    <div
                      key={p.id}
                      title={`${p.name} - ${p.status}`}
                      style={{ backgroundColor: p.color }}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-black font-extrabold text-xs shadow-sm cursor-pointer"
                    >
                      {p.avatar}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Add Product to Shared Room */}
            <div
              className={`p-4 rounded-xl border mb-5 flex flex-col sm:flex-row items-center justify-between gap-3 ${
                isDarkMode ? "bg-[#0B132B] border-slate-700" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold shrink-0">Add to Group Cart:</span>
                <select
                  value={selectedProductToAdd}
                  onChange={(e) => setSelectedProductToAdd(e.target.value)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none ${
                    isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-white border-zinc-300"
                  }`}
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.emoji} {p.shortTitle} (R{p.price})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full sm:w-auto px-4 py-2 bg-[#F9CA24] text-black font-extrabold text-xs rounded-lg shadow hover:brightness-105 transition flex items-center justify-center gap-1"
              >
                <Plus size={14} /> Add to Shared Kit
              </button>
            </div>

            {/* Shared Cart List */}
            <div className="space-y-3 mb-5">
              <div className="text-xs font-bold uppercase tracking-wider opacity-70">
                Shared Collective Basket ({sharedItems.length} items)
              </div>

              {sharedItems.length === 0 ? (
                <div className="p-8 text-center border border-dashed rounded-xl opacity-60 text-xs">
                  No items in this shared cart yet. Pick a product above to add it!
                </div>
              ) : (
                sharedItems.map((item, idx) => (
                  <div
                    key={`${item.productId}-${idx}`}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                      isDarkMode ? "bg-[#0B132B] border-slate-700" : "bg-white border-zinc-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.product?.emoji}</span>
                      <div>
                        <div className="font-extrabold text-sm">{item.product?.shortTitle}</div>
                        <div className="opacity-70">
                          {item.color} {item.size ? `• ${item.size}` : ""} • Added by{" "}
                          <span className="font-semibold text-[#0A3D62] dark:text-[#F9CA24]">{item.addedBy}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-sm">
                          R{(item.product?.price || 0) * item.quantity}
                        </div>
                        <div className="text-[10px] opacity-60">Qty: {item.quantity}</div>
                      </div>

                      {/* Instant Individual Checkout for this specific item in room */}
                      {item.product && (
                        <button
                          type="button"
                          onClick={() => onOpenIndividualCheckout(item.product!, item.color, item.size)}
                          className="px-3 py-1.5 bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black rounded-lg text-[11px] font-extrabold hover:opacity-90 transition shrink-0"
                        >
                          Checkout My Item
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total & Bundle Savings Meter */}
            <div
              className={`p-4 rounded-xl border space-y-2 text-xs ${
                isDarkMode ? "bg-[#0B132B] border-slate-700" : "bg-slate-50 border-zinc-200"
              }`}
            >
              <div className="flex justify-between">
                <span>Group Subtotal:</span>
                <span className="font-semibold">R{sharedSubtotal}</span>
              </div>
              {bundleDiscount > 0 ? (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Sparkles size={14} /> Shared Kit Bundle Bonus:
                  </span>
                  <span>-R{bundleDiscount}</span>
                </div>
              ) : (
                <div className="text-amber-500 font-medium">
                  Add 1 more item to unlock instant R150 group bundle discount!
                </div>
              )}
              <div className="pt-2 border-t flex justify-between items-baseline font-extrabold text-sm">
                <span>Combined Group Total:</span>
                <span className="text-lg text-[#0A3D62] dark:text-[#F9CA24]">R{sharedTotal}</span>
              </div>
            </div>

            {/* Room Notes */}
            <div className="mt-4 text-xs opacity-75 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl flex items-start gap-2">
              <Info size={16} className="shrink-0 mt-0.5 text-[#F9CA24]" />
              <div>
                <span className="font-bold">Team / Group Note:</span> {activeRoom.notes}
              </div>
            </div>
          </div>

          {/* Right Column: Live Room Chat */}
          <div
            className={`p-5 md:p-6 rounded-[22px] border flex flex-col h-[560px] ${
              isDarkMode ? "bg-[#1C2541]/70 border-slate-700" : "bg-white border-zinc-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 mb-3">
              <div className="flex items-center gap-2 font-extrabold text-sm">
                <MessageSquare size={16} className="text-[#F9CA24]" />
                <span>Live Group Discussion</span>
              </div>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live Channel
              </span>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {activeRoom.messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {msg.avatar}
                  </div>
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] ${
                      msg.sender === (currentUser?.fullName || "You")
                        ? "bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black ml-auto rounded-tr-none"
                        : isDarkMode
                        ? "bg-[#0B132B] border border-slate-700"
                        : "bg-slate-100 border border-slate-200 rounded-tl-none"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-70 mb-1">
                      <span className="font-bold">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type note or ask room members..."
                className={`flex-1 px-3 py-2 rounded-full border text-xs focus:outline-none focus:ring-2 focus:ring-[#F9CA24] ${
                  isDarkMode ? "bg-[#0B132B] border-slate-700 text-white" : "bg-slate-50 border-zinc-300"
                }`}
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black flex items-center justify-center shadow hover:opacity-90 transition shrink-0 cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div
            className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl z-10 ${
              isDarkMode ? "bg-[#0B132B] text-white border border-slate-700" : "bg-white text-[#2C3E50]"
            }`}
          >
            <h3 className="font-extrabold text-base mb-2">Create New Collaborative Room</h3>
            <p className="text-xs opacity-70 mb-4">
              Give your shopping crew or team workspace a name (e.g. Camps Bay Weekend, Braai Gear List).
            </p>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <input
                type="text"
                required
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="e.g. Paarl Family Summer Kit 🌞"
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-slate-50 border-zinc-300"
                }`}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#F9CA24] text-black font-extrabold text-xs shadow"
                >
                  Create &amp; Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
