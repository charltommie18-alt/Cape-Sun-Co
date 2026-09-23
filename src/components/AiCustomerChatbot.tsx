import React, { useState, useEffect, useRef } from "react";
import { Product, ChatMessage, UserProfile } from "../types";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  Minimize2,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import { PRODUCTS } from "../data/products";

interface Props {
  currentUser: UserProfile | null;
  viewedItems: string[];
  cartCount: number;
  onOpenIndividualCheckout: (product: Product, color?: string, size?: string) => void;
  isDarkMode: boolean;
}

export const AiCustomerChatbot: React.FC<Props> = ({
  currentUser,
  viewedItems,
  cartCount,
  onOpenIndividualCheckout,
  isDarkMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      role: "assistant",
      content:
        "Howzit! I'm SunBot, your Cape Sun Co AI assistant. ☀️ Whether you need advice on beating the 38°C heat, braid-safe neck fans, toddler sunsuit sizing, or Capitec Pay, ask away!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestions: [
        "Is the neck fan safe for braids?",
        "How fast is Cape Town delivery?",
        "What size for a 2-year old?",
        "How does Capitec Pay work?",
      ],
    },
  ]);

  const [aiRecs, setAiRecs] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Fetch personalized recommendations based on profile, viewed items, and preferences
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await fetch("/api/ai/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userHistory: currentUser ? [currentUser.city, currentUser.province] : ["Cape Town"],
            viewedItems,
            cartItems: cartCount > 0 ? ["neckfan"] : [],
            userLocation: currentUser?.city || "Cape Town",
            profile: currentUser
              ? {
                  fullName: currentUser.fullName,
                  city: currentUser.city,
                  preferences: currentUser.preferences,
                  interests: currentUser.interests,
                  viewedItemsHistory: currentUser.viewedItemsHistory,
                  purchasedProductIds: currentUser.purchasedProductIds,
                }
              : undefined,
          }),
        });
        const data = await res.json();
        if (data.recommendations) {
          setAiRecs(data.recommendations);
        }
      } catch (err) {
        console.warn("Notice: Using local recommendations fallback:", err);
        setAiRecs([
          {
            id: "neckfan",
            headline: "Top Cape Town Heat Defense",
            reason: "Stay ice cold in 38°C Western Cape heat with 8hr twin-turbine airflow.",
            urgencyTag: "Best Seller",
          },
          {
            id: "towel",
            headline: "Instant Ice Cooling Towel (R129)",
            reason: "Drops skin temperature by 15°C in 3 seconds with water — perfect for Clifton beach days.",
            urgencyTag: "Under R150",
          },
        ]);
      }
    };
    fetchRecs();
  }, [viewedItems, currentUser, cartCount]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query.trim(),
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          userSession: {
            user: currentUser ? currentUser.fullName : "Guest",
            location: currentUser?.city || "Cape Town",
            viewedProducts: viewedItems,
            cartCount,
            profile: currentUser
              ? {
                  fullName: currentUser.fullName,
                  preferences: currentUser.preferences,
                  interests: currentUser.interests,
                  viewedItemsHistory: currentUser.viewedItemsHistory,
                  purchasedProductIds: currentUser.purchasedProductIds,
                }
              : undefined,
          },
        }),
      });

      const data = await res.json();
      const reply = data.reply || "Howzit! How else can I help you stay cool this summer?";

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: [
          "Show me the bundle deal",
          "Recommend for camping & outdoor trips",
          "How fast is Cape Town delivery?",
        ],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn("Chatbot connection notice:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content:
            "Howzit! Our server is updating right now. Feel free to browse our products or chat to our team on WhatsApp (+27 66 286 0184).",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "msg-0",
        role: "assistant",
        content: "Chat cleared! What summer gear can I help you choose today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: ["Is the neck fan safe for braids?", "Tell me about the cooling towel"],
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-20 md:right-24 z-40 px-4 py-3 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-xs shadow-xl hover:scale-105 transition flex items-center gap-2 cursor-pointer border border-white/20"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F9CA24] dark:bg-black opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F9CA24] dark:bg-black"></span>
          </span>
          <Bot size={16} />
          <span>Ask SunBot AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 z-50 w-[94vw] sm:w-[420px] h-[590px] rounded-[24px] shadow-2xl flex flex-col overflow-hidden border transition-all duration-200 ${
            isDarkMode ? "bg-[#0B132B] text-slate-100 border-slate-700" : "bg-white text-[#2C3E50] border-zinc-200"
          }`}
        >
          {/* Header */}
          <div
            className={`p-4 flex items-center justify-between border-b ${
              isDarkMode ? "bg-[#1C2541] border-slate-700" : "bg-[#0A3D62] text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F9CA24] text-black font-extrabold flex items-center justify-center text-xs">
                ☀️
              </div>
              <div>
                <div className="font-extrabold text-sm flex items-center gap-1.5 text-white">
                  <span>SunBot AI Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] text-white/80">
                  {currentUser ? (
                    <span>
                      Personalized for {currentUser.fullName.split(" ")[0]} ({currentUser.preferences?.climateZone || currentUser.city})
                    </span>
                  ) : (
                    <span>Cape Town Real-Time AI • 2-3 Day Local Delivery</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Reset Chat"
                className="w-7 h-7 rounded-full hover:bg-white/10 text-white/80 flex items-center justify-center transition"
              >
                <RotateCcw size={13} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-white/10 text-white flex items-center justify-center transition"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* AI Personalized Recommendations Shelf */}
          {aiRecs.length > 0 && (
            <div
              className={`p-2.5 px-3 border-b text-xs flex items-center gap-2 overflow-x-auto scrollbar-none ${
                isDarkMode ? "bg-[#1C2541]/50 border-slate-700" : "bg-amber-50 border-amber-100"
              }`}
            >
              <Sparkles size={14} className="text-[#F9CA24] shrink-0" />
              <span className="font-extrabold text-[11px] shrink-0 text-slate-800 dark:text-slate-200">
                Personalized Picks:
              </span>
              <div className="flex gap-2">
                {aiRecs.slice(0, 3).map((rec: any, idx: number) => {
                  const prod = PRODUCTS.find((p) => p.id === rec.productId);
                  if (!prod) return null;
                  return (
                    <button
                      key={idx}
                      onClick={() => onOpenIndividualCheckout(prod)}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 text-[10px] font-bold hover:border-[#F9CA24] flex items-center gap-1 shrink-0 transition shadow-sm"
                    >
                      <span>{prod.emoji}</span>
                      <span>{prod.shortTitle}</span>
                      <span className="text-emerald-600 font-extrabold">R{prod.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1 opacity-60 text-[10px]">
                  <span>{m.role === "user" ? (currentUser ? currentUser.fullName.split(" ")[0] : "You") : "SunBot AI"}</span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
                </div>

                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-medium rounded-tr-none"
                      : isDarkMode
                      ? "bg-[#1C2541] text-slate-100 rounded-tl-none border border-slate-700"
                      : "bg-slate-100 text-[#2C3E50] rounded-tl-none"
                  }`}
                >
                  {m.content}
                </div>

                {/* Suggestions Pills if available */}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {m.suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(s)}
                        className="px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-black/20 text-[10px] font-medium hover:border-[#0A3D62] dark:hover:border-[#F9CA24] transition text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs opacity-70 p-2">
                <span className="w-2 h-2 rounded-full bg-[#F9CA24] animate-bounce" />
                <span
                  className="w-2 h-2 rounded-full bg-[#F9CA24] animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-[#F9CA24] animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
                <span className="text-[11px] font-medium">SunBot is consulting local weather &amp; inventory...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div
            className={`p-3 border-t ${
              isDarkMode ? "bg-[#1C2541]/80 border-slate-700" : "bg-white border-zinc-200"
            }`}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about 38°C gear, kids UPF, Capitec..."
                className={`flex-1 px-3.5 py-2 rounded-full border text-xs focus:outline-none focus:ring-2 focus:ring-[#F9CA24] ${
                  isDarkMode ? "bg-[#0B132B] border-slate-600 text-white" : "bg-slate-50 border-zinc-300 text-black"
                }`}
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="w-8 h-8 rounded-full bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition cursor-pointer shrink-0"
              >
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
