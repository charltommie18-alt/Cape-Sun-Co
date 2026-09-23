import { Product } from "../types";
import neckFanImg from "../assets/images/neck_fan_photo_1789945517379.jpg";
import neckFanLifestyleImg from "../assets/images/neck_fan_lifestyle_1789945565435.jpg";
import kidsSunsuitImg from "../assets/images/kids_sunsuit_photo_1789945528754.jpg";
import coolingTowelImg from "../assets/images/cooling_towel_photo_1789945539988.jpg";
import solarPowerbankImg from "../assets/images/solar_powerbank_photo_1789945551692.jpg";
import campingSolarLifestyleImg from "../assets/images/camping_solar_lifestyle_1789945576074.jpg";

export const PRODUCTS: Product[] = [
  {
    id: "neckfan",
    title: "Bladeless Wearable Neck Fan 4000mAh - Dual Turbine 360° Airflow",
    shortTitle: "Bladeless Neck Fan 4000mAh",
    subtitle: "Twin-turbine 360° airflow, braid-safe & 8-hour rechargeable cooling",
    price: 299,
    compare: 399,
    badge: "Best Seller",
    stock: 13,
    rating: 4.9,
    reviewsCount: 428,
    colors: ["Arctic White", "Ocean Blue", "Midnight Black"],
    paystack: "#PAYSTACK_LINK_NECKFAN",
    desc: "Engineered specifically for blistering 38°C Western Cape summers. Features twin 60-blade centrifugal turbines and 48 precision multi-angle air vents that wrap cool air completely around your neck, face, and hairline without any rotating blades. 100% snag-free and safe for braids, weaves, curls, and toddlers. Powered by dual high-density 4000mAh lithium-polymer cells that deliver up to 8 hours of uninterrupted cooling on low, 4.5 hours on medium, and 2.5 hours on turbo. Ergonomic, skin-friendly silicone flex band contours comfortably to any neck size with a lightweight 258g profile and ultra-quiet brushless motor (<28dB).",
    specs: [
      "Battery: 4000mAh Dual Li-Po cell (8h Low, 4.5h Mid, 2.5h Turbo)",
      "Airflow: Twin 60-blade centrifugal turbines with 48 surround vents",
      "Safety: 100% Bladeless & braid-safe - no snagging on curls or weaves",
      "Charging: 5V/2A USB-C fast charging (recharges in ~2 hours)",
      "Weight & Ergonomics: Ultra-light 258g with flexible food-grade silicone band",
      "Acoustics: Low-noise brushless DC motor running under 28dB",
    ],
    emoji: "🌀",
    image: neckFanImg,
    images: [
      neckFanImg,
      neckFanLifestyleImg,
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    ],
    seo: "Bladeless Neck Fan South Africa - Hands Free Personal Fan for Cape Town Summer",
    category: "cooling",
    videoUrl: "/videos/neckfan_demo.mp4",
    videoTitle: "Bladeless Neck Fan Airflow & Twin-Turbine Noise Test",
    videoType: "mp4",
    videoDuration: "0:15 Demo",
  },
  {
    id: "uvbundle",
    title: "Kids UPF 50+ Sunsuit & Instant Ice Cooling Towel Set",
    shortTitle: "Kids UPF 50+ Sunsuit + Cooling Towel",
    subtitle: "Certified UPF 50+ UV swimwear with 3-second instant ice cooling towel",
    price: 449,
    compare: 599,
    badge: "Mom Favourite",
    stock: 9,
    rating: 4.8,
    reviewsCount: 312,
    colors: ["Ocean Blue", "Coral Reef", "Sunny Yellow"],
    sizes: ["0-6M", "6-12M", "1-2Y", "2-3Y", "3-4Y"],
    paystack: "#PAYSTACK_LINK_UVBUNDLE",
    desc: "Complete sun safety and heatstroke defense for sunny beach trips to Clifton, Camps Bay, and Muizenberg. Crafted from certified high-density UPF 50+ Italian lycra blend that physically blocks 98.5% of harmful UVA and UVB radiation, eliminating constant sunscreen reapplication battles. Features a smooth front anti-pinch zipper with an inner protective flap and chin guard for painless dressing. Chlorine and saltwater resistant with 4-way stretch that allows uninhibited play. Bundled with our medical-grade evaporative cooling towel that drops temperature by 8°C–12°C in 3 seconds to soothe flushed toddlers instantly.",
    specs: [
      "Sun Protection: SABS tested UPF 50+ rating (blocks 98.5% UVA/UVB)",
      "Material: 82% quick-dry nylon, 18% spandex composite with 4-way stretch",
      "Comfort: Deep front anti-pinch zip with protective chin guard",
      "Durability: Chlorine, saltwater & sunscreen cream resistant",
      "Cooling Towel: Included PVA evaporative snap-chill towel (30x80cm)",
      "Care: Machine washable, quick drying & anti-chafing flatlock seams",
    ],
    emoji: "👶",
    image: kidsSunsuitImg,
    images: [
      kidsSunsuitImg,
      coolingTowelImg,
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    ],
    seo: "Kids UPF 50+ Sunsuit South Africa - UV Protection Baby Swim Suit",
    category: "sun-protection",
    videoUrl: "/videos/sunsuit_demo.mp4",
    videoTitle: "Kids UPF 50+ Sunsuit Stretch & Cooling Towel Activation Demo",
    videoType: "mp4",
    videoDuration: "0:15 Demo",
  },
  {
    id: "towel",
    title: "Instant Evaporative Ice Cooling Towel (100cm × 30cm) with Carry Pouch",
    shortTitle: "Instant Ice Cooling Towel",
    subtitle: "Soak, wring, snap — drops skin temperature to 15°C in 3 seconds",
    price: 129,
    compare: 199,
    badge: "Under R150",
    stock: 27,
    rating: 4.7,
    reviewsCount: 891,
    colors: ["Aqua", "Lime", "Charcoal", "Pink"],
    paystack: "#PAYSTACK_LINK_TOWEL",
    desc: "Immediate physical heat relief engineered for Sea Point promenade runs, gym workouts, sunny braais, Lion's Head hikes, and beach days. Uses high-density hyper-evaporative honeycomb mesh fabric that draws moisture away from the skin and uses evaporative cooling physics to drop surface temperature to 15°C below ambient without chemicals, gels, or refrigeration. Re-activates in seconds: simply re-wet, wring out, and snap 3 times. Generous 100cm × 30cm length provides comprehensive neck and shoulder coverage. Includes a waterproof silicone travel canister with breathable aeration holes and a sturdy carabiner clip.",
    specs: [
      "Thermal Drop: Cools 15°C below ambient in 3 seconds via physics",
      "Duration: Sustained cooling for up to 3-4 hours per soak",
      "Dimensions: 100cm × 30cm full neck & shoulder wrap span",
      "Composition: 100% chemical-free hyper-evaporative microfibre mesh",
      "Hygiene: Anti-microbial, anti-odor & UPF 50 sun barrier",
      "Packaging: Waterproof silicone canister with aeration vents & carabiner",
    ],
    emoji: "🧊",
    image: coolingTowelImg,
    images: [
      coolingTowelImg,
      neckFanLifestyleImg,
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
    ],
    seo: "Instant Cooling Towel South Africa - Ice Towel for Heat Relief",
    category: "cooling",
    videoUrl: "/videos/towel_demo.mp4",
    videoTitle: "Instant Ice Cooling Towel 3-Second Snap & Chill Test",
    videoType: "mp4",
    videoDuration: "0:15 Demo",
  },
  {
    id: "powerbank",
    title: "20000mAh Solar Power Bank with 4 Built-in Cables & Dual Emergency Torch",
    shortTitle: "Solar Power Bank 20000mAh with 4 Cables",
    subtitle: "20000mAh solar charging with 4 built-in cables & dual high-lumen torch",
    price: 599,
    compare: 799,
    badge: "Festival & Camping Essential",
    stock: 11,
    rating: 4.8,
    reviewsCount: 203,
    colors: ["Black", "Navy"],
    paystack: "#PAYSTACK_LINK_POWERBANK",
    desc: "The ultimate off-grid power station for Cederberg camping, outdoor hikes, beach weekends, and off-grid travel power. Packs an ultra-reliable 20000mAh Grade-A lithium-polymer battery capable of charging a modern smartphone 4.5 to 5.5 times over. Never search for missing cables again: features 4 integrated tangle-free reinforced cables (Type-C, iPhone Lightning, Micro-USB, and USB-A recharge). An integrated monocrystalline solar panel enables emergency solar trickle charging outdoors. Equipped with twin ultra-bright LED spotlights with continuous beam, SOS flash, and emergency strobe modes for nighttime safety.",
    specs: [
      "Capacity: 20000mAh (74Wh) Grade-A Lithium-Polymer (charges phone 5x)",
      "Built-in Cables: USB-C, Lightning, Micro-USB, and USB-A recharge cable",
      "Solar Charging: High-efficiency monocrystalline panel (5V/300mA emergency)",
      "Fast Charging: 22.5W max dual output ports supporting 2.1A fast charge",
      "Lighting: Dual 240-lumen emergency LED torches with Steady, Strobe & SOS",
      "Rugged Shell: Shock-absorbing ABS+PC reinforced casing with rubber corner pads",
    ],
    emoji: "🔋",
    image: solarPowerbankImg,
    images: [
      solarPowerbankImg,
      campingSolarLifestyleImg,
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
    ],
    seo: "Solar Power Bank 20000mAh South Africa - Fast Charge Powerbank for Camping, Festivals, Beach & Travel",
    category: "power",
    videoUrl: "/videos/powerbank_demo.mp4",
    videoTitle: "Solar Power Bank 20000mAh 4-Cable Fast Charging & Flashlight Test",
    videoType: "mp4",
    videoDuration: "0:15 Demo",
  },
];

export const TESTIMONIALS = [
  {
    name: "Anel - Oudtshoorn",
    text: "38°C in Oudtshoorn and I'm actually cool! Braids safe, battery lasted the whole market day. Totally obsessed.",
    rating: 5,
    product: "Bladeless Neck Fan",
    verified: "Verified Cape Buyer",
  },
  {
    name: "Taryn - Sea Point",
    text: "Finally my toddler wears sun protection without fighting. Cooling towel saved us at Clifton - no sunburn!",
    rating: 5,
    product: "Kids UPF 50+ Bundle",
    verified: "Verified Cape Buyer",
  },
  {
    name: "Johan - Brackenfell",
    text: "Working on site, this towel is a lifesaver. Power bank charged my phone 3 days at Cederberg camp. Legit SA brand.",
    rating: 5,
    product: "Solar Power Bank",
    verified: "Verified Cape Buyer",
  },
  {
    name: "Nomsa - Khayelitsha",
    text: "Taxi to town was hell before. Now I arrive fresh and cool in Salt River. Delivery was 1 day to CT!",
    rating: 5,
    product: "Bladeless Neck Fan",
    verified: "Verified Cape Buyer",
  },
];

export const FAQ_LIST = [
  {
    q: "How long does the neck fan battery last?",
    a: "4000mAh capacity gives 8 hours on low speed, 4.5 hours on medium, and 2.5 hours on turbo. USB-C fast charging charges it to 100% in 2 hours. Rigorously tested in 35°C+ Paarl heat and taxi commutes.",
  },
  {
    q: "Is it safe for braids, weaves & kids?",
    a: "Yes, absolutely! The 100% bladeless turbine design means no external rotating blades touch skin, braids, loose curls, or hijabs. Safe for children 3+ years. Tested and approved with local moms across Cape Town.",
  },
  {
    q: "Do you deliver outside Cape Town? How fast?",
    a: "Local Cape Town dispatch and delivery takes 2 to 3 working days. Deliveries to Johannesburg (JHB), Pretoria, Durban, and regional nationwide areas take slightly longer (3 to 5 working days via Courier Guy). Every order comes with live SMS & WhatsApp tracking.",
  },
  {
    q: "What warranty & returns policy do you offer?",
    a: "We offer 30-day hassle-free returns with a 100% money-back quality guarantee handled locally from our Cape Town warehouse hub. Every product is rigorously tested for South African summer weather conditions before dispatch.",
  },
  {
    q: "How can I pay via Capitec Bank?",
    a: "We support both instant Capitec Pay (approve with 1-click in your Capitec App) and direct bank transfer to our Capitec Entrepreneur Account (Account Name: Ct Fun, Acc: 2557334258, Branch: 470010, Swift: CABLZAJJ).",
  },
  {
    q: "Is the cooling towel really cold without a fridge?",
    a: "Yes! High-performance PVA evaporative mesh technology. Simply soak in any fresh water, wring it out, and snap it 3 times. It drops 8-15°C below ambient in 3 seconds and stays cold for up to 4 hours.",
  },
];

export const FAQS = FAQ_LIST;

export interface TikTokVideoItem {
  id: string;
  name: string;
  views: string;
  text: string;
  badge: string;
  likes: string;
  comments: string;
  videoUrl: string;
  posterEmoji: string;
  productId: string;
  tag: string;
}

export const TIKTOK_VIDEOS: TikTokVideoItem[] = [
  {
    id: "vid-1",
    name: "@taryn_seapoint",
    views: "412k",
    text: "POV: You finally survive taxi rank & Clifton beach without melting 🥵🌀",
    badge: "Trending in Cape Town",
    likes: "24.5k",
    comments: "582",
    videoUrl: "/videos/tiktok_neckfan.mp4",
    posterEmoji: "🌀",
    productId: "neckfan",
    tag: "Bladeless Neck Fan",
  },
  {
    id: "vid-2",
    name: "@anel_oudtshoorn_mom",
    views: "289k",
    text: "My toddler actually keeps this on! UPF 50+ suit + ice cooling towel beach hack 🏖️👶",
    badge: "Mom Viral",
    likes: "18.9k",
    comments: "394",
    videoUrl: "/videos/tiktok_towel.mp4",
    posterEmoji: "👶",
    productId: "uvbundle",
    tag: "Kids UPF 50+ Bundle",
  },
  {
    id: "vid-3",
    name: "@johan_brackenfell",
    views: "198k",
    text: "Cape outdoor test: Solar power bank charged my phone 3 full days in Cederberg 🏕️🔋",
    badge: "Cape Adventure Approved",
    likes: "14.2k",
    comments: "217",
    videoUrl: "/videos/tiktok_powerbank.mp4",
    posterEmoji: "🔋",
    productId: "powerbank",
    tag: "Solar Power Bank 20000mAh",
  },
];
