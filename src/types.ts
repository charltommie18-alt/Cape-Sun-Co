export interface Product {
  id: string;
  title: string;
  shortTitle: string;
  subtitle?: string;
  price: number;
  compare: number;
  badge: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  colors: string[];
  sizes?: string[];
  paystack: string;
  desc: string;
  specs: string[];
  emoji: string;
  image: string;
  images: string[];
  seo: string;
  category: "cooling" | "sun-protection" | "power";
  videoUrl?: string;
  videoTitle?: string;
  videoType?: "mp4" | "youtube";
  videoDuration?: string;
  supplierName?: string;
  supplierUrl?: string;
  supplierCostPrice?: number;
  supplierSku?: string;
  profitMargin?: number;
  profitMarginPercent?: number;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountType: string;
  accountNumber: string;
  branchCode: string;
  swiftCode: string;
}

export const CAPITEC_BANK_DETAILS: BankDetails = {
  bankName: "Capitec Bank",
  accountName: "Ct Fun",
  accountType: "Entrepreneur Account",
  accountNumber: "2557334258",
  branchCode: "470010",
  swiftCode: "CABLZAJJ",
};

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}


export interface UserPreferences {
  preferredCategories: ("cooling" | "sun-protection" | "power")[];
  climateZone: string;
  coolingIntensity: "Mild Breeze" | "Standard Chill" | "Turbo Extreme (40°C+ Heatwaves)";
  familyStatus: "Solo Adventurer" | "Parent with Kids / Toddlers" | "Outdoor Camper & Hiker" | "Daily Commuter";
  preferredSizes?: string[];
  preferredPaymentMethod?: string;
  autoApplyBundleDiscount: boolean;
  receiveHeatwaveAlerts: boolean;
}

export interface ViewedItemRecord {
  productId: string;
  productTitle: string;
  productEmoji: string;
  price: number;
  viewedAt: string;
  viewCount: number;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: "customer" | "admin" | "staff";
  phone: string;
  city: string;
  province: string;
  address: string;
  postalCode: string;
  loyaltyPoints: number;
  savedPaymentMethod?: string;
  avatarUrl?: string;

  // Preferences & Personalization
  preferences: UserPreferences;
  interests: string[];
  viewedItemsHistory: ViewedItemRecord[];
  purchasedProductIds: string[];
  favoriteProductIds?: string[];
  wishlistIds?: string[];
}

export interface OrderItem {
  id: string;
  orderCode: string;
  productId: string;
  productTitle: string;
  productEmoji: string;
  color: string;
  size?: string;
  quantity: number;
  price: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: "Capitec Pay" | "Ozow Instant EFT" | "PayJustNow" | "Credit/Debit Card";
  paymentStatus: "Paid" | "Pending" | "Failed";
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress:
    | {
        street: string;
        city: string;
        province: string;
        postalCode: string;
      }
    | string;
  shippingSpeed:
    | "Cape Town Local Courier (R85)"
    | "National SA Main Centers (R145)"
    | "Regional SA & Outlying (R175)"
    | "Express Priority Overnight (R195)"
    | "International Courier (R495)"
    | string;
  createdAt: string;
  status: string;
}

export interface CollabParticipant {
  id: string;
  name: string;
  avatar: string;
  color: string;
  status: string;
}

export interface SharedCartItem {
  productId: string;
  quantity: number;
  addedBy: string;
  color?: string;
  size?: string;
}

export interface CollabMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  avatar: string;
}

export interface CollabRoom {
  id: string;
  name: string;
  creator: string;
  createdAt: string;
  participants: CollabParticipant[];
  sharedCart: SharedCartItem[];
  messages: CollabMessage[];
  notes: string;
}

export interface StorageFile {
  id: string;
  name: string;
  category: "product-assets" | "customer-receipts" | "user-reviews" | "daily-reports" | "compliance";
  size: number;
  uploadedAt: string;
  url: string;
  type: string;
  tags: string[];
}

export interface DailyReport {
  id: string;
  date: string;
  generatedAt: string;
  summary: {
    grossRevenueZar: number;
    ordersCount: number;
    unitsSold: number;
    averageOrderValueZar: number;
    conversionRatePercent: number;
    onTimeDeliveryRatePercent: number;
    topProduct: string;
    topProductUnits: number;
    topRegion: string;
    capitecPaySharePercent: number;
  };
  inventoryAlerts: { product: string; remainingStock: number; status: "Critical" | "Warning" | "Healthy" }[];
  regionalBreakdown: { region: string; orders: number; revenueZar: number }[];
  aiExecutiveSummary: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestions?: string[];
  recommendations?: {
    id: string;
    title: string;
    price: number;
    reason: string;
    emoji: string;
  }[];
}

export interface AIRecommendation {
  id: string;
  headline: string;
  reason: string;
  urgencyTag: string;
}

export interface PromotionalSubscriber {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  source: "account_creation" | "checkout_optin" | "newsletter";
  subscribedAt: string;
  active: boolean;
  notes?: string;
}

export interface LoyaltyRuleInfo {
  rateRandPerPoint: number; // e.g. 10 ZAR spent = 1 point
  pointCreditValueZar: number; // e.g. 1 point = 0.10 ZAR credit
  maxDiscountPercentCap: number; // e.g. 20% max discount allowed on any checkout
}
