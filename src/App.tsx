import React, { useState, useEffect } from "react";
import { Product, CartItem, OrderItem, UserProfile, ViewedItemRecord } from "./types";
import { PRODUCTS } from "./data/products";

// Components
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ProductCatalog } from "./components/ProductCatalog";
import { BundleBuilder } from "./components/BundleBuilder";
import { CollabHub } from "./components/CollabHub";
import { CloudStorageView } from "./components/CloudStorageView";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { DailyReportsView } from "./components/DailyReportsView";
import { TikTokWall } from "./components/TikTokWall";
import { ReviewsSection } from "./components/ReviewsSection";
import { FaqSection } from "./components/FaqSection";
import { Footer } from "./components/Footer";

// Modals & Drawers
import { IndividualCheckoutModal } from "./components/IndividualCheckoutModal";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { AuthPortalModal } from "./components/AuthPortalModal";
import { CartDrawer } from "./components/CartDrawer";
import { OfflineBanner } from "./components/OfflineBanner";
import { HonorBadges } from "./components/HonorBadges";
import { LegalPoliciesModal, LegalPolicyTab } from "./components/LegalPoliciesModal";
import { OrderStatusModal } from "./components/OrderStatusModal";
import { AdminPortalModal } from "./components/AdminPortalModal";

// Floating Chatbot
import { AiCustomerChatbot } from "./components/AiCustomerChatbot";

export default function App() {
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("capesun_dark_mode");
    return saved ? JSON.parse(saved) : false;
  });

  // Admin Portal Modal state (PIN: 12021)
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("capesun_dark_mode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Online / Offline state
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // Active view navigation: "shop" | "bundles" | "collab" | "storage" | "analytics" | "reports" | "faq"
  const [activeView, setActiveView] = useState<string>("shop");

  // User state
  const defaultUser: UserProfile = {
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
    wishlistIds: ["neckfan", "powerbank"],
  };

  // User state: starts as null (guest) by default so client profiles (like Sipho) aren't visible to random visitors
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("capesun_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.fullName) {
          return {
            ...defaultUser,
            ...parsed,
            preferences: {
              ...defaultUser.preferences,
              ...(parsed.preferences || {}),
            },
            interests: Array.isArray(parsed.interests) ? parsed.interests : defaultUser.interests,
            viewedItemsHistory: Array.isArray(parsed.viewedItemsHistory)
              ? parsed.viewedItemsHistory
              : defaultUser.viewedItemsHistory,
            purchasedProductIds: Array.isArray(parsed.purchasedProductIds)
              ? parsed.purchasedProductIds
              : defaultUser.purchasedProductIds,
            wishlistIds: Array.isArray(parsed.wishlistIds)
              ? parsed.wishlistIds
              : (Array.isArray(parsed.favoriteProductIds) ? parsed.favoriteProductIds : defaultUser.wishlistIds),
          };
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem("capesun_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("capesun_user");
  };

  // Helper to record viewed product in history
  const recordProductView = (product: Product) => {
    setViewedProducts((prev) => Array.from(new Set([...prev, product.id])));
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const history = prev.viewedItemsHistory || [];
      const existingIdx = history.findIndex((h) => h.productId === product.id);
      let updatedHistory: ViewedItemRecord[];
      if (existingIdx > -1) {
        updatedHistory = history.map((item, idx) =>
          idx === existingIdx
            ? { ...item, viewCount: item.viewCount + 1, viewedAt: "Just now" }
            : item
        );
      } else {
        updatedHistory = [
          {
            productId: product.id,
            productTitle: product.shortTitle || product.title,
            productEmoji: product.emoji,
            price: product.price,
            viewedAt: "Just now",
            viewCount: 1,
          },
          ...history,
        ];
      }
      const updated = {
        ...prev,
        viewedItemsHistory: updatedHistory,
      };
      localStorage.setItem("capesun_user", JSON.stringify(updated));
      return updated;
    });
  };

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("capesun_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("capesun_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product: Product, color?: string, size?: string) => {
    const chosenColor = color || product.colors[0];
    const chosenSize = size || (product.sizes ? product.sizes[0] : undefined);

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === chosenColor &&
          item.selectedSize === chosenSize
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: 1,
            selectedColor: chosenColor,
            selectedSize: chosenSize,
          },
        ];
      }
    });

    // Record product view in profile history & AI recommendations
    recordProductView(product);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Orders state
  const [orders, setOrders] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem("capesun_orders");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "ord-101",
        orderCode: "CPT-8924",
        productId: "neckfan",
        productTitle: "Bladeless Neck Fan 4000mAh",
        productEmoji: "🌬️",
        color: "Ice White",
        quantity: 1,
        total: 349,
        paymentMethod: "Capitec Pay",
        customerName: "Sipho Khumalo",
        customerPhone: "+27 66 286 0184",
        shippingAddress: "42 Regent Road, Sea Point, Cape Town",
        city: "Cape Town",
        status: "Processing in Cape Town Hub (2-3 day local delivery)",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("capesun_orders", JSON.stringify(orders));
  }, [orders]);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("capesun_wishlist");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return defaultUser.wishlistIds || ["neckfan", "powerbank"];
  });

  useEffect(() => {
    localStorage.setItem("capesun_wishlist", JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      // Sync with currentUser profile if active
      setCurrentUser((u) => {
        if (!u) return u;
        const updatedUser = { ...u, wishlistIds: updated };
        localStorage.setItem("capesun_user", JSON.stringify(updatedUser));
        return updatedUser;
      });
      return updated;
    });
  };

  const handleOrderCreated = (order: OrderItem) => {
    setOrders((prev) => [order, ...prev]);
    // Save purchased item to user profile for personalized re-ordering & recommendations
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const updatedPurchases = Array.from(
        new Set([...(prev.purchasedProductIds || []), order.productId])
      );
      const updated = {
        ...prev,
        purchasedProductIds: updatedPurchases,
        loyaltyPoints: (prev.loyaltyPoints || 0) + Math.floor(order.total * 0.1),
      };
      localStorage.setItem("capesun_user", JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddLoyaltyPoints = (points: number) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        loyaltyPoints: (prev.loyaltyPoints || 0) + points,
      };
      localStorage.setItem("capesun_user", JSON.stringify(updated));
      return updated;
    });
  };

  // Track viewed products for personalized AI recommendations
  const [viewedProducts, setViewedProducts] = useState<string[]>(["neckfan", "towel"]);

  // Modals state
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Individual checkout modal (separate checkout page for each individual order item)
  const [individualCheckoutTarget, setIndividualCheckoutTarget] = useState<{
    product: Product;
    color?: string;
    size?: string;
  } | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [legalPolicyModalOpen, setLegalPolicyModalOpen] = useState(false);
  const [legalPolicyTab, setLegalPolicyTab] = useState<LegalPolicyTab>("terms");
  const [orderStatusModalOpen, setOrderStatusModalOpen] = useState(false);
  const [orderStatusQuery, setOrderStatusQuery] = useState("");

  const handleOpenOrderStatus = (orderCodeOrPhone?: string) => {
    if (orderCodeOrPhone && typeof orderCodeOrPhone === "string") {
      setOrderStatusQuery(orderCodeOrPhone);
    } else if (orders.length > 0 && orders[0].orderCode) {
      setOrderStatusQuery(orders[0].orderCode);
    } else {
      setOrderStatusQuery("CSC-ZA-48291");
    }
    setOrderStatusModalOpen(true);
  };

  const handleOpenPolicy = (tab: LegalPolicyTab) => {
    setLegalPolicyTab(tab);
    setLegalPolicyModalOpen(true);
  };

  const handleOpenIndividualCheckout = (product: Product, color?: string, size?: string) => {
    setIndividualCheckoutTarget({
      product,
      color: color || product.colors[0],
      size: size || (product.sizes ? product.sizes[0] : undefined),
    });
    // Add to viewed items and user profile history
    recordProductView(product);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductForModal(product);
    recordProductView(product);
  };

  const handleNavigate = (view: string) => {
    // Restrict sensitive administrative views to the PIN-protected Admin Portal (PIN: 12021)
    if (view === "analytics" || view === "reports" || view === "storage") {
      setAdminModalOpen(true);
      return;
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-['Inter',sans-serif] transition-colors duration-200 ${
        isDarkMode ? "bg-[#080D1D] text-slate-100" : "bg-[#FAFBFD] text-[#2C3E50]"
      }`}
    >
      {/* Offline connectivity warning/recovery banner */}
      <OfflineBanner />

      {/* Main Navbar */}
      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isOnline={isOnline}
        onOpenPolicy={handleOpenPolicy}
        onOpenOrderStatus={handleOpenOrderStatus}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Main App Content Router */}
      <main className="flex-1">
        {activeView === "shop" && (
          <>
            <HeroSection
              onExploreProducts={() => {
                const el = document.getElementById("products-catalog");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              onOpenBundleBuilder={() => handleNavigate("bundles")}
              onOpenIndividualCheckout={(p) => handleOpenIndividualCheckout(p)}
              onOpenCollab={() => handleNavigate("collab")}
              isDarkMode={isDarkMode}
              onToggleWishlist={handleToggleWishlist}
            />

            {/* South African Verified Honor Badges & Guarantees */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <HonorBadges isDarkMode={isDarkMode} variant="banner" showTitle={true} />
            </div>

            <ProductCatalog
              currentUser={currentUser}
              onSelectProduct={handleSelectProduct}
              onOpenIndividualCheckout={handleOpenIndividualCheckout}
              onAddToCart={handleAddToCart}
              isDarkMode={isDarkMode}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
            />

            <BundleBuilder
              onOpenIndividualCheckout={handleOpenIndividualCheckout}
              onAddToCart={handleAddToCart}
              isDarkMode={isDarkMode}
            />

            <TikTokWall
              isDarkMode={isDarkMode}
              onSelectProduct={handleSelectProduct}
              onOpenIndividualCheckout={handleOpenIndividualCheckout}
            />
            <ReviewsSection isDarkMode={isDarkMode} />
            <FaqSection isDarkMode={isDarkMode} />
          </>
        )}

        {activeView === "bundles" && (
          <div className="pt-6">
            <BundleBuilder
              onOpenIndividualCheckout={handleOpenIndividualCheckout}
              onAddToCart={handleAddToCart}
              isDarkMode={isDarkMode}
            />
            <ProductCatalog
              currentUser={currentUser}
              onSelectProduct={handleSelectProduct}
              onOpenIndividualCheckout={handleOpenIndividualCheckout}
              onAddToCart={handleAddToCart}
              isDarkMode={isDarkMode}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
            />
          </div>
        )}

        {activeView === "collab" && (
          <div className="pt-4">
            <CollabHub
              currentUser={currentUser}
              onOpenIndividualCheckout={handleOpenIndividualCheckout}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {activeView === "storage" && (
          <div className="pt-4">
            <CloudStorageView isDarkMode={isDarkMode} />
          </div>
        )}

        {activeView === "analytics" && (
          <div className="pt-4">
            <AnalyticsDashboard isDarkMode={isDarkMode} />
          </div>
        )}

        {activeView === "reports" && (
          <div className="pt-4">
            <DailyReportsView isDarkMode={isDarkMode} />
          </div>
        )}

        {activeView === "faq" && (
          <div className="pt-6">
            <FaqSection isDarkMode={isDarkMode} />
            <ReviewsSection isDarkMode={isDarkMode} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onOpenPolicy={handleOpenPolicy}
        onOpenOrderStatus={handleOpenOrderStatus}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Modals & Dialogs */}

      {/* 1. SEPARATE CHECKOUT PAGE FOR INDIVIDUAL ORDER ITEM */}
      {individualCheckoutTarget && (
        <IndividualCheckoutModal
          product={individualCheckoutTarget.product}
          initialColor={individualCheckoutTarget.color}
          initialSize={individualCheckoutTarget.size}
          onClose={() => setIndividualCheckoutTarget(null)}
          onOrderComplete={handleOrderCreated}
          currentUser={currentUser}
          isDarkMode={isDarkMode}
          onOpenOrderStatus={handleOpenOrderStatus}
        />
      )}

      {/* 2. Product Detail Specs Modal */}
      {selectedProductForModal && (
        <ProductDetailModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
          onAddToCart={(p, c, s) => {
            handleAddToCart(p, c, s);
            setSelectedProductForModal(null);
          }}
          onOpenIndividualCheckout={(p, c, s) => {
            setSelectedProductForModal(null);
            handleOpenIndividualCheckout(p, c, s);
          }}
          isDarkMode={isDarkMode}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* 3. Secure User Authentication Portal */}
      {authModalOpen && (
        <AuthPortalModal
          currentUser={currentUser}
          onLogin={(user) => {
            handleLogin(user);
          }}
          onLogout={handleLogout}
          onClose={() => setAuthModalOpen(false)}
          orders={orders}
          isDarkMode={isDarkMode}
          onOpenIndividualCheckout={(p, c, s) => {
            setAuthModalOpen(false);
            handleOpenIndividualCheckout(p, c, s);
          }}
          onSelectProduct={(p) => {
            setAuthModalOpen(false);
            handleSelectProduct(p);
          }}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onAddLoyaltyPoints={handleAddLoyaltyPoints}
          onOpenOrderStatus={handleOpenOrderStatus}
        />
      )}

      {/* 4. Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onOpenIndividualCheckout={(p, c, s) => {
          setCartDrawerOpen(false);
          handleOpenIndividualCheckout(p, c, s);
        }}
        isDarkMode={isDarkMode}
      />

      {/* 5. AI Customer Chatbot with Personalized Product Recommendations */}
      <AiCustomerChatbot
        currentUser={currentUser}
        viewedItems={viewedProducts}
        cartCount={cartItems.length}
        onOpenIndividualCheckout={handleOpenIndividualCheckout}
        isDarkMode={isDarkMode}
      />

      {/* 6. Comprehensive South African Legal & Regulatory Policies Modal */}
      <LegalPoliciesModal
        isOpen={legalPolicyModalOpen}
        onClose={() => setLegalPolicyModalOpen(false)}
        initialTab={legalPolicyTab}
        isDarkMode={isDarkMode}
      />

      {/* 7. Live Customer Order Status & The Courier Guy Tracking Modal */}
      <OrderStatusModal
        isOpen={orderStatusModalOpen}
        onClose={() => setOrderStatusModalOpen(false)}
        initialQuery={orderStatusQuery}
      />

      {/* 8. Confidential Store Owner & Warehouse Admin Portal (PIN 12021) */}
      <AdminPortalModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        currentUser={currentUser}
        onSelectClient={(client) => {
          setCurrentUser(client);
          if (client) {
            localStorage.setItem("capesun_user", JSON.stringify(client));
          } else {
            localStorage.removeItem("capesun_user");
          }
        }}
        isDarkMode={isDarkMode}
        onOpenOrderStatus={handleOpenOrderStatus}
      />
    </div>
  );
}
