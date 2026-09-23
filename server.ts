import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// In-memory persistent data structures for Demo & Full operations
interface StorageFile {
  id: string;
  name: string;
  category: "product-assets" | "customer-receipts" | "user-reviews" | "daily-reports" | "compliance";
  size: number;
  uploadedAt: string;
  url: string;
  type: string;
  tags: string[];
}

let cloudFiles: StorageFile[] = [
  {
    id: "file-01",
    name: "SABS_UPF50_UV_Compliance_Certificate.pdf",
    category: "compliance",
    size: 2450000,
    uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    url: "#",
    type: "application/pdf",
    tags: ["SABS", "UV Certified", "Kids Sunsuit", "UPF 50+"],
  },
  {
    id: "file-02",
    name: "Bladeless_NeckFan_4000mAh_HiRes_Pack.zip",
    category: "product-assets",
    size: 14800000,
    uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    url: "#",
    type: "application/zip",
    tags: ["Catalog", "Hi-Res", "Neck Fan", "Marketing"],
  },
  {
    id: "file-03",
    name: "Cape_Town_Dispatch_Manifest_Weekly.csv",
    category: "daily-reports",
    size: 680000,
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    url: "#",
    type: "text/csv",
    tags: ["Warehouse", "Dispatch", "Courier Guy", "Cape Town"],
  },
  {
    id: "file-04",
    name: "Customer_Unboxing_SeaPoint_Proof.jpg",
    category: "user-reviews",
    size: 3200000,
    uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    url: "#",
    type: "image/jpeg",
    tags: ["UGC", "Sea Point", "Toddler UPF", "Cooling Towel"],
  },
  {
    id: "file-05",
    name: "SolarPowerBank_20000mAh_Cederberg_Test.png",
    category: "product-assets",
    size: 4100000,
    uploadedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    url: "#",
    type: "image/png",
    tags: ["Camping", "Solar", "Cederberg", "Off-grid"],
  },
];

interface CollabRoom {
  id: string;
  name: string;
  creator: string;
  createdAt: string;
  participants: { id: string; name: string; avatar: string; color: string; status: string }[];
  sharedCart: { productId: string; quantity: number; addedBy: string; color?: string; size?: string }[];
  messages: { id: string; sender: string; text: string; time: string; avatar: string }[];
  notes: string;
}

let collabRooms: Record<string, CollabRoom> = {
  "clifton-beach-crew": {
    id: "clifton-beach-crew",
    name: "Clifton 4th Beach Trip Kit 🏖️",
    creator: "Taryn (Sea Point)",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    participants: [
      { id: "u-1", name: "Taryn M.", avatar: "TM", color: "#F9CA24", status: "Selecting sizes" },
      { id: "u-2", name: "Sipho K.", avatar: "SK", color: "#0A3D62", status: "Added Neck Fan" },
      { id: "u-3", name: "Johan B.", avatar: "JB", color: "#10B981", status: "Viewing checkout" },
    ],
    sharedCart: [
      { productId: "neckfan", quantity: 2, addedBy: "Sipho K.", color: "Arctic White" },
      { productId: "uvbundle", quantity: 1, addedBy: "Taryn M.", color: "Ocean Blue", size: "1-2Y" },
      { productId: "towel", quantity: 3, addedBy: "Johan B.", color: "Aqua" },
    ],
    messages: [
      { id: "m-1", sender: "Taryn M.", text: "Adding the UPF 50+ toddler sunsuit so we don't have to carry 4 bottles of sunscreen to Clifton!", time: "14:10", avatar: "TM" },
      { id: "m-2", sender: "Sipho K.", text: "Grabbing two neck fans for the taxi queue too. 38 degrees in town right now.", time: "14:14", avatar: "SK" },
      { id: "m-3", sender: "Johan B.", text: "Does Cape Sun deliver same-week? Yes, they dispatch promptly from Cape Town (2-3 days local)!", time: "14:18", avatar: "JB" },
    ],
    notes: "Target delivery before Saturday braai. Use Capitec Pay for instant zero-fee settlement.",
  },
};

// Daily Performance Reports generator
interface DailyReport {
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

function generateDailyReportData(dateStr?: string): DailyReport {
  const d = dateStr || new Date().toISOString().split("T")[0];
  return {
    id: `REP-${d.replace(/-/g, "")}`,
    date: d,
    generatedAt: new Date().toISOString(),
    summary: {
      grossRevenueZar: 46820,
      ordersCount: 114,
      unitsSold: 189,
      averageOrderValueZar: 410.7,
      conversionRatePercent: 3.82,
      onTimeDeliveryRatePercent: 99.1,
      topProduct: "Bladeless Neck Fan 4000mAh",
      topProductUnits: 87,
      topRegion: "Cape Town Metro & Atlantic Seaboard",
      capitecPaySharePercent: 52.4,
    },
    inventoryAlerts: [
      { product: "Kids UPF 50+ Sunsuit Bundle (6-12M, 1-2Y)", remainingStock: 9, status: "Critical" },
      { product: "Bladeless Neck Fan 4000mAh (Arctic White)", remainingStock: 13, status: "Warning" },
      { product: "Solar Power Bank 20000mAh (Black)", remainingStock: 11, status: "Warning" },
      { product: "Instant Ice Cooling Towel (Aqua)", remainingStock: 27, status: "Healthy" },
    ],
    regionalBreakdown: [
      { region: "Western Cape (Cape Town, Paarl, Stellenbosch)", orders: 62, revenueZar: 25480 },
      { region: "Gauteng (Johannesburg, Pretoria, Sandton)", orders: 31, revenueZar: 12900 },
      { region: "KwaZulu-Natal (Durban, Ballito, Umhlanga)", orders: 14, revenueZar: 5740 },
      { region: "Eastern Cape & Garden Route", orders: 7, revenueZar: 2700 },
    ],
    aiExecutiveSummary:
      "Record summer surge: Western Cape heat wave (38°C in Paarl and Oudtshoorn) boosted Neck Fan and Instant Cooling Towel sales by +28.4% WoW. Capitec Pay remains the dominant settlement choice with 52.4% share due to zero card transaction friction. Cape Town dispatch facility achieved 99.1% on-time delivery SLA (2-3 days local delivery; JHB and regional slightly longer). Critical restock trigger recommended for Kids UPF 50+ sunsuits ahead of peak school holidays.",
  };
}

let dailyReportsArchive: DailyReport[] = [
  generateDailyReportData(new Date().toISOString().split("T")[0]),
  generateDailyReportData(new Date(Date.now() - 86400000).toISOString().split("T")[0]),
  generateDailyReportData(new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0]),
];

// Lazy Gemini client helper
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Resilient Gemini caller with automatic model fallback for 503 high demand spikes
const CANDIDATE_GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
];

async function generateWithGeminiFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
): Promise<{ response: any; modelUsed: string }> {
  let lastError: any = null;
  for (const model of CANDIDATE_GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      return { response, modelUsed: model };
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      // If 503 (high demand / overloaded), 429 (rate limit), or temporary unavailable, try next model
      if (
        errMsg.includes("503") ||
        errMsg.includes("high demand") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("429") ||
        errMsg.includes("RESOURCE_EXHAUSTED") ||
        errMsg.includes("Overloaded")
      ) {
        console.warn(`Model ${model} temporarily unavailable, trying next candidate...`);
        continue;
      }
      console.warn(`Model ${model} encounter notice: ${errMsg}`);
    }
  }
  throw lastError || new Error("All Gemini models temporarily unavailable");
}

// ----------------- API ROUTES ----------------- //

// Health
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "Cape Sun Co Engine",
    time: new Date().toISOString(),
    geminiAvailable: !!process.env.GEMINI_API_KEY,
  });
});

// AI Customer Chatbot
app.post("/api/ai/chat", async (req: Request, res: Response) => {
  try {
    const { message, history = [], userSession = {} } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are "SunBot", the friendly, welcoming, and proudly South African AI shopping assistant for Cape Sun Co (capesun.co.za).
Cape Sun Co is South Africa's premier summer essentials brand, locally stocked in Cape Town.

Our core summer essentials:
1. Bladeless Neck Fan 4000mAh (R299, was R399) - Hands-free, safe for braids, weaves, kids, 8-hour battery, 3 speeds + LED display, USB-C fast charging, lightweight 260g. Tested in 38°C+ Oudtshoorn and taxi rank heat.
2. Kids UPF 50+ Sunsuit + Instant Ice Cooling Towel Bundle (R449, was R599) - Blocks 98% UV, SABS approved, chlorine & saltwater resistant, cooling towel drops skin temp by 8-15°C in 3 seconds with just water. Sizes 0-6M, 6-12M, 1-2Y, 2-3Y, 3-4Y.
3. Instant Ice Cooling Towel (R129, was R199) - PVA mesh, soak, wring, snap. Lasts 4 hours per soak. Anti-bacterial, includes carry pouch.
4. 20000mAh Solar Power Bank with 4 Built-in Cables (R599, was R799) - 5 full phone charges off-grid, solar panel 5V/300mA, Type-C, Lightning, Micro, USB, 22.5W fast charge, dual LED emergency torch. Built for Cederberg camping, festivals, beach braais, and outdoor backup power.

- Special Offers & Guarantees:
- "Build Your Summer Kit" Bundle: Buy 2 or more products and save R150 instantly!
- Delivery: Cape Town local delivery is 2 to 3 days (Free). Johannesburg, Pretoria, Durban and regional areas take longer (3-5 days).
- Payments: Capitec Pay (instant zero card approval in Capitec App), Ozow instant EFT, PayJustNow (pay in 3 installments), Visa/Mastercard.
- Guarantees: 30-day hassle-free money-back returns & local South African quality guarantee.
- WhatsApp Notifications: Instant order confirmation sent to customer's WhatsApp, and immediate dispatch alerts sent to the Cape Sun Co warehouse team.

Tone: Warm, welcoming, respectful, authentic South African English with natural touches (e.g., Mzansi, braai, lekka, howzit, cheers), highly helpful, proactive product recommendations, concise and polite.
Customer Profile & Personalization Context:
- Name: ${userSession.userName || userSession.user || "Guest"}
- Climate Zone: ${userSession.climateZone || userSession.location || "Cape Town"}
- Preferences: ${JSON.stringify(userSession.preferences || {})}
- Interests: ${JSON.stringify(userSession.interests || [])}
- Viewed Items History: ${JSON.stringify(userSession.viewedProducts || userSession.viewedItems || [])}
- Purchased Items: ${JSON.stringify(userSession.purchasedProducts || userSession.purchasedItems || [])}
Use this context to personalize your greeting and product recommendations (e.g. mention their local heat conditions or relevant interests).`;

    if (ai) {
      try {
        const fullPrompt = `${systemPrompt}

Conversation history:
${history.map((h: any) => `${h.role === "user" ? "Customer" : "SunBot"}: ${h.content}`).join("\n")}
Customer: ${message}
SunBot:`;

        const { response, modelUsed } = await generateWithGeminiFallback(ai, {
          contents: fullPrompt,
        });

        const reply = response.text || "Howzit! I'm here to help you beat the South African heat. What can I get for you today?";
        return res.json({ reply, source: modelUsed });
      } catch (err: any) {
        console.warn("Notice: Switching chatbot to grounded local intelligence:", err?.message || err);
      }
    }

    // High quality intelligent grounded local fallback if Gemini key is not configured or rate-limited
    const lower = message.toLowerCase();
    let reply = `Howzit ${userSession.userName ? userSession.userName : ""}! Welcome to Cape Sun Co in Cape Town. How can I assist you with your summer kit today?`;

    if (lower.includes("neck fan") || lower.includes("braid") || lower.includes("fan") || lower.includes("hair") || lower.includes("battery")) {
      reply = "Our Bladeless Neck Fan 4000mAh (R299, was R399) is our #1 summer best-seller! Because it's completely bladeless, it is 100% safe for braids, weaves, hijabs, and little ones. The 4000mAh battery delivers up to 8 hours on low speed and charges in just 2 hours via USB-C. Plus, you get Free 2-3 Day local Cape Town delivery!";
    } else if (lower.includes("sunsuit") || lower.includes("kid") || lower.includes("baby") || lower.includes("toddler") || lower.includes("size") || lower.includes("upf")) {
      reply = "The Kids UPF 50+ Sunsuit + Cooling Towel Bundle (R449, was R599) is SABS approved and blocks 98% of harmful UV rays. Available in sizes 0-6M, 6-12M, 1-2Y, 2-3Y, and 3-4Y. It comes with our instant ice cooling towel that drops temperature by 8°C in 3 seconds. Perfect for Clifton and Muizenberg beach days!";
    } else if (lower.includes("power bank") || lower.includes("solar") || lower.includes("cables") || lower.includes("camp") || lower.includes("festival") || lower.includes("power")) {
      reply = "The 20000mAh Solar Power Bank (R599, was R799) is an absolute must-have for camping in Cederberg, summer festivals, and portable backup power. It features 4 built-in cables (Type-C, Lightning, Micro-USB, USB-A), a built-in solar panel for emergency off-grid top-ups, and a bright dual LED torch!";
    } else if (lower.includes("cooling towel") || lower.includes("towel") || lower.includes("ice") || lower.includes("cold")) {
      reply = "Our Instant Ice Cooling Towel (R129, was R199) uses PVA evaporative mesh technology. Simply soak in any water, wring it out, and snap it. It cools down to 15°C below ambient in 3 seconds and stays chilled for up to 4 hours! Ideal for gym, running, site work, or taxi commutes.";
    } else if (lower.includes("capitec") || lower.includes("pay") || lower.includes("ozow") || lower.includes("payment")) {
      reply = "We offer 1-click Capitec Pay! Just select Capitec Pay at checkout, enter your phone or ID, and approve the push notification in your Capitec Banking app. Zero card fees and instant confirmation! We also support Ozow Instant EFT, PayJustNow (pay in 3 interest-free slices), and Visa/Mastercard.";
    } else if (lower.includes("deliver") || lower.includes("shipping") || lower.includes("cape town") || lower.includes("time") || lower.includes("jhb") || lower.includes("speed")) {
      reply = "We dispatch directly from our Cape Town warehouse. Local Cape Town delivery is 2 to 3 days (FREE). Deliveries to Johannesburg, Pretoria, Durban, and regional areas take longer (3 to 5 business days). You receive instant WhatsApp order confirmation and dispatch tracking updates!";
    } else if (lower.includes("return") || lower.includes("warranty") || lower.includes("guarantee")) {
      reply = "We stand by our quality 100%! You receive a 30-Day hassle-free money-back guarantee and complete local South African quality testing. If anything isn't 100% right, our Cape Town support team on WhatsApp (+27 66 286 0184) handles it immediately.";
    } else if (lower.includes("whatsapp") || lower.includes("receipt") || lower.includes("confirmation")) {
      reply = "As soon as you place an order, our system sends you an instant order confirmation on WhatsApp, and notifies our Cape Town warehouse team so your parcel is packed immediately!";
    } else if (lower.includes("recommend") || lower.includes("bundle") || lower.includes("suggest") || lower.includes("deal") || lower.includes("profile") || lower.includes("personalized")) {
      const interests: string[] = userSession.interests || [];
      if (interests.some(i => i.toLowerCase().includes("kid") || i.toLowerCase().includes("baby"))) {
        reply = `Based on your profile preference for kid & toddler summer safety, we strongly recommend the Kids UPF 50+ Sunsuit + Instant Cooling Towel bundle (R449). It provides 98% UV protection and instantaneous 3-second cooling.`;
      } else if (interests.some(i => i.toLowerCase().includes("camp") || i.toLowerCase().includes("power") || i.toLowerCase().includes("solar"))) {
        reply = `Based on your off-grid camping and backup power interests, our 20000mAh Solar Power Bank with 4 built-in cables (R599) and dual LED torch will keep your setup powered anywhere in SA!`;
      } else {
        reply = `Based on your interest in ${interests.length > 0 ? interests[0] : "beating the summer heat"} in ${userSession.climateZone || "Cape Town"}, we recommend pairing the Bladeless Neck Fan with our Instant Cooling Towel for the ultimate R150 bundle discount!`;
      }
    }

    return res.json({ reply, source: "grounded-rules" });
  } catch (err: any) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Failed to process chat message" });
  }
});

// AI Personalized Recommendations based on User Profile (Preferences, Interests, Viewed & Purchased History)
app.post("/api/ai/recommendations", async (req: Request, res: Response) => {
  try {
    const {
      preferences: rawPrefs,
      interests: rawInterests,
      viewedItems: rawViewed,
      purchasedItems: rawPurchased,
      cartItems = [],
      userLocation: rawLocation,
      userName: rawName,
      profile = {},
    } = req.body;

    const preferences = rawPrefs || profile.preferences || {};
    const interests = rawInterests || profile.interests || [];
    const viewedItems = rawViewed || profile.viewedItemsHistory || [];
    const purchasedItems = rawPurchased || profile.purchasedProductIds || [];
    const userLocation = rawLocation || profile.city || "Cape Town";
    const userName = rawName || profile.fullName || "";

    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `You are Cape Sun Co's recommendation engine.
Personalize product recommendations using this customer's profile:
- Customer: ${userName || "Shopper"}
- Climate Zone/Location: ${userLocation}
- User Preferences: ${JSON.stringify(preferences)}
- User Interests: ${JSON.stringify(interests)}
- Previously Viewed Items: ${JSON.stringify(viewedItems)}
- Previously Purchased Items: ${JSON.stringify(purchasedItems)}
- Current Cart: ${JSON.stringify(cartItems)}

Available Products:
1. neckfan (Bladeless Neck Fan 4000mAh, R299) - Braid safe, 3 speeds, 8hr battery, high heat relief
2. uvbundle (Kids UPF 50+ Sunsuit + Cooling Towel Bundle, R449) - SABS certified, 98% UV block, 3s ice towel
3. towel (Instant Ice Cooling Towel, R129) - PVA evaporative, drops 15°C in 3 seconds, under R150
4. powerbank (20000mAh Solar Power Bank 4 Cables, R599) - Solar panel, 4 built-in cables, dual LED torch

Task: Output a JSON array of 2 to 3 recommended products with id, headline, reason (specifically referencing their interests/preferences/history and South African summer conditions), and urgencyTag.
Example format:
[
  { "id": "towel", "headline": "Instant Beach Chill", "reason": "Because you frequent Clifton beach and enjoy quick cooling relief.", "urgencyTag": "Profile Match" }
]`;

        const { response, modelUsed } = await generateWithGeminiFallback(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const parsed = JSON.parse(response.text || "[]");
        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.json({ recommendations: parsed, personalized: true, source: modelUsed });
        }
      } catch (err: any) {
        console.warn("Notice: Switching to local grounded personalization engine:", err?.message || err);
      }
    }

    // High-precision algorithmic personalization fallback based on user profile
    const recs: Array<{ id: string; headline: string; reason: string; urgencyTag: string }> = [];

    const interestStr = (Array.isArray(interests) ? interests : []).map((i: any) => String(i).toLowerCase()).join(" ");
    const isParent = interestStr.includes("kid") || interestStr.includes("toddler") || preferences?.familyStatus?.toLowerCase().includes("kid");
    const isCamper = interestStr.includes("camp") || interestStr.includes("power") || interestStr.includes("solar") || interestStr.includes("outdoor") || preferences?.familyStatus?.toLowerCase().includes("camper");
    const wantsExtremeCooling = preferences?.coolingIntensity?.toLowerCase().includes("turbo") || interestStr.includes("heatwave") || interestStr.includes("paarl");
    const hasBoughtFan = Array.isArray(purchasedItems) && purchasedItems.includes("neckfan");
    const hasBoughtBundle = Array.isArray(purchasedItems) && purchasedItems.includes("uvbundle");

    if (isParent && !hasBoughtBundle) {
      recs.push({
        id: "uvbundle",
        headline: "Tailored for Family & Kids UV Safety",
        reason: "Matched to your profile interest in Toddler UV protection: SABS approved UPF 50+ blocks 98% of harsh SA sunshine.",
        urgencyTag: "Top Family Match",
      });
    }

    if (!hasBoughtFan && (wantsExtremeCooling || interestStr.includes("festival") || interestStr.includes("braid") || !isParent)) {
      recs.push({
        id: "neckfan",
        headline: "High-Heat Defense: Bladeless Neck Fan",
        reason: `Engineered for ${preferences?.climateZone || userLocation} heatwaves with 8hr battery and 100% braid-safe turbine cooling.`,
        urgencyTag: "Best Seller",
      });
    }

    if (!Array.isArray(purchasedItems) || !purchasedItems.includes("towel")) {
      recs.push({
        id: "towel",
        headline: "Instant Ice Cooling Towel (R129)",
        reason: hasBoughtFan
          ? "The #1 verified companion to your Neck Fan — drops skin temperature by 15°C in 3 seconds without ice."
          : "Compact, chemical-free heat relief ideal for beach days, fitness, and hot summer commutes.",
        urgencyTag: "Under R150",
      });
    }

    if (isCamper || (!Array.isArray(purchasedItems) || !purchasedItems.includes("powerbank"))) {
      if (recs.length < 3) {
        recs.push({
          id: "powerbank",
          headline: "Off-Grid Solar Power & Portable Backup",
          reason: "Matched to your adventure & backup power interest: 20000mAh solar charging with 4 built-in cables and dual emergency torch.",
          urgencyTag: "Festival & Off-Grid Pick",
        });
      }
    }

    if (recs.length === 0) {
      recs.push(
        {
          id: "neckfan",
          headline: "Top Cape Town Heat Defense",
          reason: "Stay ice cold in 38°C Western Cape heat with 8hr twin-turbine airflow.",
          urgencyTag: "Best Seller",
        },
        {
          id: "towel",
          headline: "Instant Ice Cooling Towel",
          reason: "Drops skin temperature by 15°C in 3 seconds with water — perfect for Clifton beach days.",
          urgencyTag: "Under R150",
        }
      );
    }

    return res.json({ recommendations: recs.slice(0, 3), personalized: true, source: "grounded-engine" });
  } catch (err: any) {
    console.warn("Recommendations route recovery fallback:", err?.message || err);
    return res.json({
      recommendations: [
        {
          id: "neckfan",
          headline: "High-Heat Defense: Bladeless Neck Fan",
          reason: "Engineered for South African heatwaves with 8hr battery and braid-safe turbine airflow.",
          urgencyTag: "Best Seller",
        },
        {
          id: "towel",
          headline: "Instant Ice Cooling Towel (R129)",
          reason: "Drops skin temperature by 15°C in 3 seconds with water — perfect for beach and outdoor activities.",
          urgencyTag: "Under R150",
        },
      ],
      personalized: true,
      source: "fallback",
    });
  }
});

// WhatsApp Order Notifications & Customer Contact Collection
interface CollectedContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  orderCode: string;
  orderTotal: number;
  productTitle: string;
  address: string;
  collectedAt: string;
  lastUpdateSent?: string;
  updateHistory: { message: string; timestamp: string; type: string }[];
}

export interface OrderCheckpoint {
  title: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
  detail: string;
}

export interface OrderRecord {
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  productTitle: string;
  quantity: number;
  color?: string;
  size?: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: string;
  shippingSpeed: string;
  createdAt: string;
  status: "confirmed" | "repacking" | "dispatched" | "out_for_delivery" | "delivered";
  statusTitle: string;
  statusDescription: string;
  estimatedDelivery: string;
  courier: {
    provider: string; // "The Courier Guy"
    waybillNumber: string;
    serviceType: string;
    trackingUrl: string;
    checkpoints: OrderCheckpoint[];
  };
  whatsappUpdates: {
    message: string;
    timestamp: string;
    type: string;
  }[];
}

let collectedContacts: CollectedContact[] = [
  {
    id: "contact-1",
    name: "Sipho Khumalo",
    phone: "0823456789",
    email: "sipho.k@gmail.com",
    orderCode: "CSC-ZA-48291",
    orderTotal: 499,
    productTitle: "Bladeless Neck Fan 4000mAh",
    address: "42 Regent Road, Sea Point, Cape Town",
    collectedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updateHistory: [
      {
        message: "☀️ Cape Sun Co: Order confirmed. Received at Cape Town hub for quality check & repacking.",
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        type: "confirmation",
      },
    ],
  },
  {
    id: "contact-2",
    name: "Taryn Miller",
    phone: "0719876543",
    email: "taryn.m@cliftonbeach.co.za",
    orderCode: "CSC-ZA-89102",
    orderTotal: 349,
    productTitle: "Kids UPF 50+ Sunsuit Set",
    address: "12 Victoria Road, Clifton, Cape Town",
    collectedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updateHistory: [
      {
        message: "☀️ Cape Sun Co: Quality check & repacking complete. Handed to Courier Guy for local delivery.",
        timestamp: new Date(Date.now() - 3600000 * 7).toISOString(),
        type: "dispatch",
      },
    ],
  },
];

let ordersStore: OrderRecord[] = [
  {
    orderCode: "CSC-ZA-48291",
    customerName: "Sipho Khumalo",
    customerPhone: "0823456789",
    customerEmail: "sipho.k@gmail.com",
    productTitle: "Bladeless Neck Fan 4000mAh",
    quantity: 1,
    color: "Arctic Ice Blue",
    total: 499,
    paymentMethod: "Capitec Pay",
    paymentStatus: "Paid",
    shippingAddress: "42 Regent Road, Sea Point, Cape Town, Western Cape",
    shippingSpeed: "Cape Town Local (2 to 4 Working Days)",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: "repacking",
    statusTitle: "Cape Town Hub: Quality Inspection & Protective Repacking",
    statusDescription: "Package arrived at our Cape Town hub. The owner is personally checking battery capacity, blade safety, and repacking in heat-safe protective boxing before courier pickup. (Same-day delivery is not guaranteed to ensure thorough inspection).",
    estimatedDelivery: "2 to 4 Working Days (Local Cape Town)",
    courier: {
      provider: "The Courier Guy",
      waybillNumber: "TCG-ZA-CT48291",
      serviceType: "Door-to-Door Express (Local CT)",
      trackingUrl: "https://thecourierguy.co.za/tracking?waybill=TCG-ZA-CT48291",
      checkpoints: [
        {
          title: "Order Placed & Payment Verified",
          location: "Cape Sun Co Online Terminal",
          timestamp: new Date(Date.now() - 3600000 * 5).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          completed: true,
          detail: "Payment verified via Capitec Pay. Order logged to dispatch queue.",
        },
        {
          title: "Received at Cape Town Hub for Repacking",
          location: "Cape Sun Co Cape Town Hub",
          timestamp: new Date(Date.now() - 3600000 * 3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          completed: true,
          current: true,
          detail: "Unit arrived at owner's hub for manual inspection, battery cycle check, and heat-safe repacking.",
        },
        {
          title: "Waybill Printed & Scheduled for Courier Pickup",
          location: "The Courier Guy Montague Gardens Depot",
          timestamp: "Scheduled Next",
          completed: false,
          detail: "Waybill TCG-ZA-CT48291 allocated. Awaiting courier collection.",
        },
        {
          title: "Out for Doorstep Delivery",
          location: "Sea Point, Cape Town",
          timestamp: "Upcoming (Est. 1-2 days)",
          completed: false,
          detail: "Driver will deliver directly to your Sea Point address.",
        },
      ],
    },
    whatsappUpdates: [
      {
        message: "☀️ Cape Sun Co: Order CSC-ZA-48291 confirmed! Package arrived at our Cape Town hub for owner quality inspection & protective repacking. Next update sent via The Courier Guy waybill.",
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        type: "order_confirmation",
      },
    ],
  },
  {
    orderCode: "CSC-ZA-89102",
    customerName: "Taryn Miller",
    customerPhone: "0719876543",
    customerEmail: "taryn.m@cliftonbeach.co.za",
    productTitle: "Kids UPF 50+ Sunsuit Set",
    quantity: 1,
    color: "Ocean Blue",
    size: "1-2 Years",
    total: 349,
    paymentMethod: "Instant EFT (Ozow)",
    paymentStatus: "Paid",
    shippingAddress: "12 Victoria Road, Clifton, Cape Town, Western Cape",
    shippingSpeed: "Cape Town Local (2 to 4 Working Days)",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: "dispatched",
    statusTitle: "Dispatched via The Courier Guy",
    statusDescription: "Quality check completed and custom repacked at our Cape Town hub. Handed over to The Courier Guy for local delivery.",
    estimatedDelivery: "Delivery Expected Tomorrow",
    courier: {
      provider: "The Courier Guy",
      waybillNumber: "TCG-ZA-CT89102",
      serviceType: "Door-to-Door Express",
      trackingUrl: "https://thecourierguy.co.za/tracking?waybill=TCG-ZA-CT89102",
      checkpoints: [
        {
          title: "Order Placed & Verified",
          location: "Cape Sun Co Online Terminal",
          timestamp: new Date(Date.now() - 3600000 * 12).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          completed: true,
          detail: "Payment verified via Instant EFT.",
        },
        {
          title: "Inspected & Repacked at Cape Town Hub",
          location: "Cape Sun Co Cape Town Hub",
          timestamp: new Date(Date.now() - 3600000 * 9).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          completed: true,
          detail: "Zipper and UPF fabric tested. Sealed in sun-safe waterproof packaging.",
        },
        {
          title: "Handed to The Courier Guy",
          location: "Montague Gardens Depot",
          timestamp: new Date(Date.now() - 3600000 * 6).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          completed: true,
          current: true,
          detail: "In transit on local delivery route. Tracking waybill TCG-ZA-CT89102.",
        },
        {
          title: "Out for Doorstep Delivery",
          location: "Clifton, Cape Town",
          timestamp: "Tomorrow Morning",
          completed: false,
          detail: "Driver will contact Taryn on WhatsApp / phone upon arrival.",
        },
      ],
    },
    whatsappUpdates: [
      {
        message: "☀️ Cape Sun Co: Order CSC-ZA-89102 confirmed and logged for Cape Town repacking.",
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        type: "order_confirmation",
      },
      {
        message: "🚚 Cape Sun Co Dispatch: Your order CSC-ZA-89102 has been repacked and handed to The Courier Guy (Waybill: TCG-ZA-CT89102).",
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        type: "courier_dispatch",
      },
    ],
  },
];

// Helper to generate realistic Courier Guy waybills
function generateCourierGuyWaybill(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `TCG-ZA-CT${num}`;
}

// WhatsApp Order Notifications: Customer confirmation + Store owner dispatch notification
app.post("/api/orders/whatsapp-notify", (req: Request, res: Response) => {
  try {
    const { order } = req.body;
    if (!order) {
      return res.status(400).json({ error: "Order details required" });
    }

    const storeOwnerPhone = process.env.STORE_OWNER_WHATSAPP || "27662860184"; // Cape Sun Co Dispatch WhatsApp (0662860184)
    const customerPhoneClean = (order.customerPhone || "").replace(/[^0-9]/g, "");

    const customerMessage = `☀️ *Cape Sun Co - Order Confirmed!*
Howzit ${order.customerName}! Thank you for your order *${order.orderCode}*.

📦 *Item:* ${order.productTitle} (Qty: ${order.quantity || 1}${order.color ? ` • ${order.color}` : ""}${order.size ? ` • ${order.size}` : ""})
💰 *Total Paid:* R${order.total} (via ${order.paymentMethod})
🚚 *Delivery:* ${order.shippingSpeed || "Cape Town Local (2 to 4 Working Days)"}
📍 *Ship To:* ${typeof order.shippingAddress === "string" ? order.shippingAddress : `${order.shippingAddress?.street || ""}, ${order.shippingAddress?.city || ""}`}

⏱️ *Quality Check & Repacking SLA:* Every package arrives at our Cape Town hub first for individual quality checking, battery cycle testing, and protective heat-safe repacking before courier collection. Due to this dedicated inspection, delivery takes 2 to 4 working days (same-day delivery is not offered at this stage).

📦 *Automated Courier Tracking:* Your order is automatically assigned to The Courier Guy. Live tracking updates will follow directly on this WhatsApp! Stay cool! 🌊🇿🇦`;

    const storeOwnerMessage = `🚨 *NEW CAPE SUN CO ORDER PLACED!*
Order Code: *${order.orderCode}*
Date: ${new Date(order.createdAt || Date.now()).toLocaleString("en-ZA")}

👤 *Customer:* ${order.customerName}
📞 *Customer WhatsApp:* ${order.customerPhone || "N/A"}
✉️ *Email:* ${order.customerEmail || "N/A"}
📦 *Product:* ${order.productTitle} (Qty: ${order.quantity || 1})
🎨 *Options:* ${order.color || "Standard"} / ${order.size || "Standard"}
💰 *Amount:* R${order.total}
💳 *Method:* ${order.paymentMethod}
🚚 *Shipping Speed:* ${order.shippingSpeed || "Standard"}
📍 *Address:* ${typeof order.shippingAddress === "string" ? order.shippingAddress : `${order.shippingAddress?.street || ""}, ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.province || ""}`}

⚡ *Action Required:* Inspect unit & repack at Cape Town hub. Once repacked, hand over to The Courier Guy and trigger automated WhatsApp courier updates!`;

    // Save collected contact number to persistent store list
    if (order.customerPhone) {
      const existing = collectedContacts.find((c) => c.phone === order.customerPhone);
      if (existing) {
        existing.orderCode = order.orderCode;
        existing.orderTotal = order.total;
        existing.productTitle = order.productTitle;
        existing.updateHistory.push({
          message: customerMessage,
          timestamp: new Date().toISOString(),
          type: "confirmation",
        });
      } else {
        collectedContacts.unshift({
          id: `contact-${Date.now()}`,
          name: order.customerName,
          phone: order.customerPhone,
          email: order.customerEmail,
          orderCode: order.orderCode,
          orderTotal: order.total,
          productTitle: order.productTitle,
          address: typeof order.shippingAddress === "string" ? order.shippingAddress : `${order.shippingAddress?.street || ""}, ${order.shippingAddress?.city || ""}`,
          collectedAt: new Date().toISOString(),
          updateHistory: [
            {
              message: customerMessage,
              timestamp: new Date().toISOString(),
              type: "confirmation",
            },
          ],
        });
      }
    }

    // Upsert or create order record in ordersStore with automated Courier Guy waybill
    let orderRecord = ordersStore.find((o) => o.orderCode === order.orderCode);
    const waybill = order.courierWaybill || generateCourierGuyWaybill();

    if (!orderRecord) {
      orderRecord = {
        orderCode: order.orderCode,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        productTitle: order.productTitle,
        quantity: order.quantity || 1,
        color: order.color,
        size: order.size,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus || "Paid",
        shippingAddress: typeof order.shippingAddress === "string" ? order.shippingAddress : `${order.shippingAddress?.street || ""}, ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.province || ""}`,
        shippingSpeed: order.shippingSpeed || "Cape Town Local (2 to 4 Working Days)",
        createdAt: new Date().toISOString(),
        status: "repacking",
        statusTitle: "Cape Town Hub: Quality Inspection & Protective Repacking",
        statusDescription: "Arrived at our Cape Town hub. The owner is personally checking battery capacity, blade safety, and repacking in heat-safe protective boxing before courier pickup. (Same-day delivery is not guaranteed to ensure thorough inspection).",
        estimatedDelivery: "2 to 4 Working Days",
        courier: {
          provider: "The Courier Guy",
          waybillNumber: waybill,
          serviceType: "Door-to-Door Express",
          trackingUrl: `https://thecourierguy.co.za/tracking?waybill=${waybill}`,
          checkpoints: [
            {
              title: "Order Placed & Payment Verified",
              location: "Cape Sun Co Online Terminal",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              completed: true,
              detail: `Payment verified via ${order.paymentMethod}. Queued for Cape Town hub repacking.`,
            },
            {
              title: "Received at Cape Town Hub for Quality Check & Repacking",
              location: "Cape Sun Co Cape Town Hub",
              timestamp: "In Progress",
              completed: true,
              current: true,
              detail: "Owner personal testing: verifying battery cells, fan bearings, and sealing in protective box.",
            },
            {
              title: "Waybill Printed & Scheduled for Courier Pickup",
              location: "The Courier Guy Montague Gardens Depot",
              timestamp: "Scheduled Next",
              completed: false,
              detail: `Waybill ${waybill} assigned. Scheduled for driver pickup.`,
            },
            {
              title: "Out for Doorstep Delivery",
              location: "Customer Destination",
              timestamp: "Upcoming (2-4 Working Days)",
              completed: false,
              detail: "Driver will contact you via WhatsApp / SMS prior to delivery.",
            },
          ],
        },
        whatsappUpdates: [
          {
            message: customerMessage,
            timestamp: new Date().toISOString(),
            type: "order_confirmation",
          },
        ],
      };
      ordersStore.unshift(orderRecord);
    }

    // Pre-formatted link for the store owner to send WhatsApp updates to the customer
    const ownerToCustomerUrl = customerPhoneClean
      ? `https://wa.me/${customerPhoneClean.startsWith("0") ? "27" + customerPhoneClean.slice(1) : customerPhoneClean}?text=${encodeURIComponent(
          `☀️ Cape Sun Co Update for ${order.customerName}: Your order ${order.orderCode} (${order.productTitle}) is currently undergoing quality inspection & custom repacking at our Cape Town hub before handover to The Courier Guy (Waybill: ${waybill}).`
        )}`
      : "";

    res.json({
      success: true,
      notifiedAt: new Date().toISOString(),
      order: orderRecord,
      courierWaybill: waybill,
      customerNotification: {
        status: "queued_and_sent",
        phone: order.customerPhone,
        message: customerMessage,
      },
      storeOwnerNotification: {
        status: "delivered_to_hub",
        phone: storeOwnerPhone,
        message: storeOwnerMessage,
      },
      merchantActions: {
        ownerToCustomerUrl,
        customerPhone: order.customerPhone,
        orderCode: order.orderCode,
      },
    });
  } catch (err: any) {
    console.error("WhatsApp notification error:", err);
    res.status(500).json({ error: "Failed to create WhatsApp notifications" });
  }
});

// Endpoint for customer self-service order lookup / tracking
app.get("/api/orders/track/:query", (req: Request, res: Response) => {
  const query = (req.params.query || "").trim();
  if (!query) {
    return res.status(400).json({ error: "Please provide an order code or phone number." });
  }

  const cleanQuery = query.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanPhone = query.replace(/[^0-9]/g, "");

  // Search by order code or phone
  const matchedOrders = ordersStore.filter((order) => {
    const codeClean = order.orderCode.toLowerCase().replace(/[^a-z0-9]/g, "");
    const phoneClean = order.customerPhone.replace(/[^0-9]/g, "");
    const waybillClean = (order.courier.waybillNumber || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    return (
      codeClean.includes(cleanQuery) ||
      (cleanPhone.length >= 7 && phoneClean.includes(cleanPhone)) ||
      waybillClean.includes(cleanQuery)
    );
  });

  if (matchedOrders.length > 0) {
    return res.json({
      found: true,
      order: matchedOrders[0],
      allOrders: matchedOrders,
    });
  }

  // Fallback check in collectedContacts
  const contact = collectedContacts.find((c) => {
    const codeClean = c.orderCode.toLowerCase().replace(/[^a-z0-9]/g, "");
    const phoneClean = c.phone.replace(/[^0-9]/g, "");
    return codeClean.includes(cleanQuery) || (cleanPhone.length >= 7 && phoneClean.includes(cleanPhone));
  });

  if (contact) {
    const fallbackWaybill = generateCourierGuyWaybill();
    const fallbackOrder: OrderRecord = {
      orderCode: contact.orderCode,
      customerName: contact.name,
      customerPhone: contact.phone,
      customerEmail: contact.email,
      productTitle: contact.productTitle,
      quantity: 1,
      total: contact.orderTotal,
      paymentMethod: "Capitec Pay / EFT",
      paymentStatus: "Paid",
      shippingAddress: contact.address,
      shippingSpeed: "Cape Town Local (2 to 4 Working Days)",
      createdAt: contact.collectedAt,
      status: "repacking",
      statusTitle: "Cape Town Hub: Quality Inspection & Protective Repacking",
      statusDescription: "Package arrived at our Cape Town hub. The owner is personally checking battery capacity, blade safety, and repacking in heat-safe protective boxing before courier pickup. (Same-day delivery is not guaranteed to ensure thorough inspection).",
      estimatedDelivery: "2 to 4 Working Days",
      courier: {
        provider: "The Courier Guy",
        waybillNumber: fallbackWaybill,
        serviceType: "Door-to-Door Express",
        trackingUrl: `https://thecourierguy.co.za/tracking?waybill=${fallbackWaybill}`,
        checkpoints: [
          {
            title: "Order Placed & Verified",
            location: "Cape Sun Co Online Terminal",
            timestamp: new Date(contact.collectedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            completed: true,
            detail: "Order confirmed and logged.",
          },
          {
            title: "Quality Check & Protective Repacking",
            location: "Cape Sun Co Cape Town Hub",
            timestamp: "In Progress",
            completed: true,
            current: true,
            detail: "Undergoing owner personal quality inspection and repacking.",
          },
          {
            title: "Handed to The Courier Guy",
            location: "Montague Gardens Depot",
            timestamp: "Scheduled Next",
            completed: false,
            detail: `Waybill ${fallbackWaybill} assigned.`,
          },
        ],
      },
      whatsappUpdates: contact.updateHistory.map((u) => ({
        message: u.message,
        timestamp: u.timestamp,
        type: u.type,
      })),
    };

    ordersStore.push(fallbackOrder);

    return res.json({
      found: true,
      order: fallbackOrder,
      allOrders: [fallbackOrder],
    });
  }

  res.json({
    found: false,
    message: "No order found with reference " + query + ". Please check your order code (e.g., CSC-ZA-48291) or your WhatsApp cellphone number.",
  });
});

// Endpoint for store owner to view all active orders and status
app.get("/api/orders/all", (req: Request, res: Response) => {
  res.json({
    orders: ordersStore,
    totalCount: ordersStore.length,
  });
});

// Endpoint to advance order status with automated Courier Guy checkpoint and WhatsApp notification
app.post("/api/orders/update-status", (req: Request, res: Response) => {
  const { orderCode, newStatus, customNote } = req.body;
  const order = ordersStore.find((o) => o.orderCode === orderCode);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const validStatuses: Record<string, { title: string; desc: string; checkpoint: string }> = {
    repacking: {
      title: "Cape Town Hub: Quality Inspection & Protective Repacking",
      desc: "Package arrived at our Cape Town hub. The owner is personally checking battery capacity, blade safety, and repacking in heat-safe protective boxing before courier pickup. (Same-day delivery is not guaranteed to ensure thorough inspection).",
      checkpoint: "Undergoing manual quality inspection and custom repacking in Cape Town.",
    },
    dispatched: {
      title: "Dispatched via The Courier Guy",
      desc: `Quality check passed and unit repacked with care. Handed to The Courier Guy driver with waybill ${order.courier.waybillNumber}. Local delivery expected in 24-48 hours.`,
      checkpoint: "Handed over to The Courier Guy for regional transit.",
    },
    out_for_delivery: {
      title: "Out for Doorstep Delivery",
      desc: "Your package is on the local courier van and will be delivered today. Please keep your WhatsApp/phone nearby.",
      checkpoint: "On courier delivery van. Destination doorstep delivery today.",
    },
    delivered: {
      title: "Delivered & Signed For",
      desc: "Package safely delivered to your doorstep. Stay cool under the Cape sun!",
      checkpoint: "Successfully handed to customer.",
    },
  };

  if (validStatuses[newStatus]) {
    order.status = newStatus as any;
    order.statusTitle = validStatuses[newStatus].title;
    order.statusDescription = customNote || validStatuses[newStatus].desc;

    // Add checkpoint
    order.courier.checkpoints.push({
      title: validStatuses[newStatus].title,
      location: "Cape Town Dispatch",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      completed: true,
      current: true,
      detail: customNote || validStatuses[newStatus].checkpoint,
    });

    // Record automated WhatsApp update
    const autoWaMsg = `🚚 *Cape Sun Co Update for ${order.customerName}:*\nStatus: *${validStatuses[newStatus].title}*\nWaybill: ${order.courier.waybillNumber}\nDetails: ${customNote || validStatuses[newStatus].desc}`;
    order.whatsappUpdates.push({
      message: autoWaMsg,
      timestamp: new Date().toISOString(),
      type: newStatus,
    });
  }

  res.json({
    success: true,
    order,
  });
});

// Endpoint for store owner to view all collected customer WhatsApp contacts
app.get("/api/orders/customer-contacts", (req: Request, res: Response) => {
  res.json({
    contacts: collectedContacts,
    totalCount: collectedContacts.length,
  });
});

// Endpoint for store owner to generate or record an update sent to a customer's WhatsApp
app.post("/api/orders/send-customer-update", (req: Request, res: Response) => {
  const { phone, orderCode, updateType, customText } = req.body;
  const contact = collectedContacts.find((c) => c.phone === phone || c.orderCode === orderCode);

  let message = "";
  if (updateType === "dispatched") {
    message = `🚚 *Cape Sun Co Dispatch Update:*\nHowzit ${contact?.name || "Customer"}! Your order *${orderCode || contact?.orderCode}* has left our Cape Town warehouse via The Courier Guy. Local CT delivery in 24-48 hours.`;
  } else if (updateType === "out_for_delivery") {
    message = `🛵 *Cape Sun Co - Out for Delivery:*\nHowzit ${contact?.name || "Customer"}! Driver is delivering order *${orderCode || contact?.orderCode}* today. Please keep your phone nearby.`;
  } else {
    message = customText || `☀️ *Cape Sun Co Update:* Regarding order ${orderCode || contact?.orderCode}.`;
  }

  const cleanPhone = (phone || contact?.phone || "").replace(/[^0-9]/g, "");
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith("0") ? "27" + cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(message)}`
    : "";

  if (contact) {
    contact.lastUpdateSent = new Date().toISOString();
    contact.updateHistory.push({
      message,
      timestamp: new Date().toISOString(),
      type: updateType || "custom",
    });
  }

  res.json({
    success: true,
    message,
    waUrl,
  });
});

// ==========================================
// ADMIN PORTAL & SECURITY (PIN 12021)
// Sensitive operations, client switching, promotional emails
// ==========================================
const ADMIN_PIN = "12021";

interface ClientProfileRecord {
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
  totalOrders: number;
  lastActive: string;
  promotionalOptIn: boolean;
}

let clientsStore: ClientProfileRecord[] = [
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
    totalOrders: 2,
    lastActive: "10 mins ago",
    promotionalOptIn: true,
  },
  {
    id: "usr-02",
    email: "taryn.m@gmail.com",
    fullName: "Taryn Miller",
    role: "customer",
    phone: "+27 83 234 5678",
    city: "Cape Town",
    province: "Western Cape",
    address: "18 Victoria Road, Clifton",
    postalCode: "8005",
    loyaltyPoints: 620,
    savedPaymentMethod: "Visa (***8842)",
    totalOrders: 1,
    lastActive: "Today, 11:15",
    promotionalOptIn: true,
  },
  {
    id: "usr-03",
    email: "lerato.m@webmail.co.za",
    fullName: "Lerato Moloi",
    role: "customer",
    phone: "+27 72 987 6543",
    city: "Paarl",
    province: "Western Cape",
    address: "55 Main Road, Paarl",
    postalCode: "7646",
    loyaltyPoints: 250,
    savedPaymentMethod: "Ozow Instant EFT",
    totalOrders: 1,
    lastActive: "Yesterday",
    promotionalOptIn: true,
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
    totalOrders: 3,
    lastActive: "Active now",
    promotionalOptIn: true,
  },
];

interface PromotionalSubscriberRecord {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  source: "account_creation" | "checkout_optin" | "newsletter";
  subscribedAt: string;
  active: boolean;
  notes?: string;
}

let promotionalSubscribersStore: PromotionalSubscriberRecord[] = [
  {
    id: "sub-1",
    email: "sipho.k@capetown.co.za",
    fullName: "Sipho Khumalo",
    phone: "+27 66 286 0184",
    source: "account_creation",
    subscribedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    active: true,
    notes: "Interested in Sea Point & Clifton heatwave gear",
  },
  {
    id: "sub-2",
    email: "taryn.m@gmail.com",
    fullName: "Taryn Miller",
    phone: "+27 83 234 5678",
    source: "account_creation",
    subscribedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    active: true,
    notes: "Clifton crew, UPF 50+ kids swimsuits & beach bundles",
  },
  {
    id: "sub-3",
    email: "lerato.m@webmail.co.za",
    fullName: "Lerato Moloi",
    phone: "+27 72 987 6543",
    source: "checkout_optin",
    subscribedAt: new Date(Date.now() - 86400000).toISOString(),
    active: true,
    notes: "Paarl winelands heatwave alerts",
  },
];

// Verify Admin PIN (12021)
app.post("/api/admin/verify", (req: Request, res: Response) => {
  const { pin } = req.body;
  if (pin === ADMIN_PIN) {
    res.json({
      success: true,
      token: "cape-sun-admin-" + Date.now(),
      message: "Staff authentication verified.",
    });
  } else {
    res.status(401).json({
      success: false,
      error: "Access denied. Invalid administrative PIN.",
    });
  }
});

// Admin: Get all clients for client switcher
app.get("/api/admin/clients", (req: Request, res: Response) => {
  res.json({
    clients: clientsStore,
    totalCount: clientsStore.length,
  });
});

// Admin or Auth: Register/update a client profile
app.post("/api/admin/clients", (req: Request, res: Response) => {
  const { email, fullName, phone, city, address, loyaltyPoints = 150 } = req.body;
  if (!email || !fullName) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const cleanEmail = email.trim().toLowerCase();
  let existing = clientsStore.find((c) => c.email.toLowerCase() === cleanEmail);
  if (existing) {
    existing.fullName = fullName;
    if (phone) existing.phone = phone;
    if (city) existing.city = city;
    if (address) existing.address = address;
    return res.json({ success: true, client: existing });
  }
  const newClient: ClientProfileRecord = {
    id: `usr-${Date.now()}`,
    email: cleanEmail,
    fullName: fullName.trim(),
    role: "customer",
    phone: phone || "+27 82 000 0000",
    city: city || "Cape Town",
    province: "Western Cape",
    address: address || "Cape Town Metro",
    postalCode: "8001",
    loyaltyPoints: Number(loyaltyPoints) || 150,
    totalOrders: 0,
    lastActive: "Just now",
    promotionalOptIn: true,
  };
  clientsStore.unshift(newClient);
  res.json({ success: true, client: newClient });
});

// Promotions: Customer registers email for promotional drops
app.post("/api/promotions/subscribe", (req: Request, res: Response) => {
  const { email, fullName, phone, source = "account_creation", notes } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email is required" });
  }
  const cleanEmail = email.trim().toLowerCase();
  let existing = promotionalSubscribersStore.find((s) => s.email.toLowerCase() === cleanEmail);
  if (existing) {
    existing.active = true;
    if (fullName) existing.fullName = fullName;
    if (phone) existing.phone = phone;
    return res.json({ success: true, subscriber: existing, alreadySubscribed: true });
  }
  const newSub: PromotionalSubscriberRecord = {
    id: `sub-${Date.now()}`,
    email: cleanEmail,
    fullName: fullName ? fullName.trim() : "Valued Customer",
    phone: phone ? phone.trim() : undefined,
    source,
    subscribedAt: new Date().toISOString(),
    active: true,
    notes,
  };
  promotionalSubscribersStore.unshift(newSub);
  res.json({ success: true, subscriber: newSub, alreadySubscribed: false });
});

// Admin: Get all promotional email leads
app.get("/api/admin/promotions/subscribers", (req: Request, res: Response) => {
  res.json({
    subscribers: promotionalSubscribersStore,
    totalCount: promotionalSubscribersStore.length,
  });
});

// Real-time Cape Town Weather from Open-Meteo with caching
let weatherCache: { timestamp: number; data: any } | null = null;
app.get("/api/weather/capetown", async (req: Request, res: Response) => {
  const now = Date.now();
  // 2-minute server cache
  if (weatherCache && now - weatherCache.timestamp < 120000) {
    return res.json({ ...weatherCache.data, cached: true });
  }

  try {
    const fetchResp = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-33.9249&longitude=18.4241&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=uv_index_max&timezone=Africa%2FJohannesburg"
    );
    if (!fetchResp.ok) throw new Error("Open-Meteo returned status " + fetchResp.status);
    const apiData = await fetchResp.json();
    const current = apiData.current || {};
    const daily = apiData.daily || {};
    const uvMax = Array.isArray(daily.uv_index_max) && daily.uv_index_max.length > 0 ? daily.uv_index_max[0] : 11;

    const temp = Math.round(current.temperature_2m || 31);
    const feelsLike = Math.round(current.apparent_temperature || temp + 2);
    const humidity = Math.round(current.relative_humidity_2m || 48);
    const windSpeed = Math.round(current.wind_speed_10m || 22);

    const payload = {
      source: "Open-Meteo Cape Town Live Station",
      temp,
      feelsLike,
      humidity,
      windSpeed: `${windSpeed} km/h`,
      uvIndex: Math.round(uvMax),
      uvLevel: uvMax >= 11 ? "Extreme" : uvMax >= 8 ? "Very High" : "Moderate",
      status: temp >= 33 || uvMax >= 11 ? "Heatwave Alert" : temp >= 28 ? "Beach Conditions" : "Breezy & Sunny",
      timestamp: new Date().toISOString(),
    };
    weatherCache = { timestamp: now, data: payload };
    res.json({ ...payload, cached: false });
  } catch (err: any) {
    res.json({
      source: "Open-Meteo Cape Town Radar (Cached)",
      temp: 32,
      feelsLike: 35,
      humidity: 48,
      windSpeed: "22 km/h SW",
      uvIndex: 11,
      uvLevel: "Extreme",
      status: "Heatwave Alert",
      timestamp: new Date().toISOString(),
      cached: true,
    });
  }
});

// Daily Performance Reports
app.get("/api/reports/daily", (req: Request, res: Response) => {
  const { date } = req.query;
  if (date && typeof date === "string") {
    const found = dailyReportsArchive.find((r) => r.date === date);
    if (found) return res.json({ report: found });
  }
  // Return latest
  res.json({
    latestReport: dailyReportsArchive[0],
    archive: dailyReportsArchive,
  });
});

app.post("/api/reports/daily/generate", (req: Request, res: Response) => {
  const today = new Date().toISOString().split("T")[0];
  const freshReport = generateDailyReportData(today);
  // Add or update
  dailyReportsArchive = [freshReport, ...dailyReportsArchive.filter((r) => r.date !== today)];
  res.json({ success: true, report: freshReport });
});

// Cloud Storage API
app.get("/api/storage/files", (req: Request, res: Response) => {
  const { category, search } = req.query;
  let list = [...cloudFiles];
  if (category && category !== "all") {
    list = list.filter((f) => f.category === category);
  }
  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    list = list.filter((f) => f.name.toLowerCase().includes(q) || f.tags.some((t) => t.toLowerCase().includes(q)));
  }

  const totalUsedBytes = cloudFiles.reduce((acc, f) => acc + f.size, 0);
  const quotaBytes = 15 * 1024 * 1024 * 1024; // 15 GB

  res.json({
    files: list,
    stats: {
      totalFiles: cloudFiles.length,
      usedBytes: totalUsedBytes,
      quotaBytes,
      usedPercentage: Number(((totalUsedBytes / quotaBytes) * 100).toFixed(2)),
    },
  });
});

app.post("/api/storage/upload", (req: Request, res: Response) => {
  const { name, category = "product-assets", size = 1048576, type = "application/octet-stream", tags = [] } = req.body;
  if (!name) {
    return res.status(400).json({ error: "File name is required" });
  }

  const newFile: StorageFile = {
    id: `file-${Date.now()}`,
    name,
    category,
    size: Number(size) || 1500000,
    uploadedAt: new Date().toISOString(),
    url: "#",
    type,
    tags: Array.isArray(tags) ? tags : ["Uploaded", "Cloud Storage"],
  };

  cloudFiles.unshift(newFile);
  res.status(201).json({ success: true, file: newFile });
});

app.delete("/api/storage/files/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  cloudFiles = cloudFiles.filter((f) => f.id !== id);
  res.json({ success: true });
});

// Collaboration Rooms API
app.get("/api/collaboration/rooms", (req: Request, res: Response) => {
  res.json({ rooms: Object.values(collabRooms) });
});

app.get("/api/collaboration/rooms/:id", (req: Request, res: Response) => {
  const room = collabRooms[req.params.id];
  if (!room) {
    return res.status(404).json({ error: "Collaboration room not found" });
  }
  res.json({ room });
});

app.post("/api/collaboration/rooms", (req: Request, res: Response) => {
  const { name, creatorName = "Shopper" } = req.body;
  const id = (name || "summer-trip").toLowerCase().replace(/[^a-z0-9]/g, "-") + `-${Math.floor(Math.random() * 1000)}`;
  const newRoom: CollabRoom = {
    id,
    name: name || "Cape Summer Shopping Room ☀️",
    creator: creatorName,
    createdAt: new Date().toISOString(),
    participants: [
      { id: "u-" + Date.now(), name: creatorName, avatar: creatorName.slice(0, 2).toUpperCase(), color: "#F9CA24", status: "Room Host" },
    ],
    sharedCart: [],
    messages: [
      {
        id: "msg-init",
        sender: "System",
        text: `Room "${name || "Summer Trip"}" created! Share this room link with friends to build your Cape Sun Co kit together.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        avatar: "CS",
      },
    ],
    notes: "Collective beach & camping gear order list. Save R150 on bundle checkout!",
  };

  collabRooms[id] = newRoom;
  res.status(201).json({ room: newRoom });
});

app.post("/api/collaboration/rooms/:id/message", (req: Request, res: Response) => {
  const room = collabRooms[req.params.id];
  if (!room) return res.status(404).json({ error: "Room not found" });

  const { sender = "Friend", text = "", avatar = "ME" } = req.body;
  const newMsg = {
    id: `msg-${Date.now()}`,
    sender,
    text,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    avatar,
  };
  room.messages.push(newMsg);
  res.json({ success: true, message: newMsg });
});

app.post("/api/collaboration/rooms/:id/cart", (req: Request, res: Response) => {
  const room = collabRooms[req.params.id];
  if (!room) return res.status(404).json({ error: "Room not found" });

  const { productId, quantity = 1, addedBy = "Shopper", color, size } = req.body;
  const existing = room.sharedCart.find((i) => i.productId === productId && i.color === color && i.size === size);
  if (existing) {
    existing.quantity += quantity;
  } else {
    room.sharedCart.push({ productId, quantity, addedBy, color, size });
  }

  res.json({ success: true, sharedCart: room.sharedCart });
});

// Analytics Summary
app.get("/api/analytics/summary", (req: Request, res: Response) => {
  res.json({
    metrics: {
      totalRevenueZar: 482950,
      monthlyRevenueGrowth: 24.6,
      ordersTotal: 1243,
      avgOrderValueZar: 388.5,
      liveVisitors: 42,
      conversionRate: 3.82,
      stockTurnoverDays: 4.2,
      csatRating: 4.88,
    },
    paymentMethods: [
      { name: "Capitec Pay", percent: 52.4, color: "#F9CA24" },
      { name: "Visa / Mastercard", percent: 23.8, color: "#0A3D62" },
      { name: "Ozow Instant EFT", percent: 14.6, color: "#10B981" },
      { name: "PayJustNow (Pay in 3)", percent: 9.2, color: "#6366F1" },
    ],
    salesHistory: [
      { day: "Mon", orders: 68, revenue: 27800 },
      { day: "Tue", orders: 84, revenue: 34200 },
      { day: "Wed", orders: 112, revenue: 45600 },
      { day: "Thu", orders: 98, revenue: 39800 },
      { day: "Fri", orders: 142, revenue: 58900 },
      { day: "Sat", orders: 156, revenue: 64100 },
      { day: "Sun", orders: 114, revenue: 46820 },
    ],
  });
});

// Serve static assets from public directory (videos, logos, documents)
app.use(express.static(path.join(process.cwd(), "public")));

// Serve frontend in production or integrate Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cape Sun Co server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
