// High-resolution photography & editorial catalog for RENTORA (in Indian Rupee ₹)

export const formatINR = (amount) => {
  if (amount === undefined || amount === null) return "₹0";
  return "₹" + Number(amount).toLocaleString('en-IN');
};

// Hero Showcase Flagships
export const HERO_PRODUCTS = [
  {
    id: "hero-camera",
    name: "Hasselblad X2D 100C",
    category: "Photography",
    dailyRate: 14500,
    weeklyRate: 85000,
    monthlyRate: 260000,
    buyPrice: 729990,
    amazonPrice: 749990,
    flipkartPrice: 739990,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85",
    accent: "#C9F36B",
    tagline: "100MP Medium Format BSI Sensor",
    specs: ["100MP BSI CMOS Sensor", "16-Bit Color Depth", "1TB Built-In SSD", "7-Stop IBIS"]
  },
  {
    id: "hero-laptop",
    name: "MacBook Pro 16\" M3 Max",
    category: "Work Setup",
    dailyRate: 3800,
    weeklyRate: 22000,
    monthlyRate: 75000,
    buyPrice: 399900,
    amazonPrice: 399900,
    flipkartPrice: 394900,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85",
    accent: "#183D2B",
    tagline: "128GB Unified Memory • 40-Core GPU",
    specs: ["M3 Max 16-Core CPU", "40-Core GPU", "128GB Unified RAM", "2TB High-Speed SSD"]
  },
  {
    id: "hero-gaming",
    name: "PlayStation 5 Pro 2TB",
    category: "Gaming",
    dailyRate: 950,
    weeklyRate: 5500,
    monthlyRate: 18000,
    buyPrice: 79990,
    amazonPrice: 79990,
    flipkartPrice: 78490,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=85",
    accent: "#C9F36B",
    tagline: "PSSR AI Neural Upscaling • 4K 120Hz",
    specs: ["PSSR AI Upscaling", "2TB Ultra SSD", "DualSense Edge Controller", "WiFi 7 Protocol"]
  },
  {
    id: "hero-audio",
    name: "Focal Bathys Hi-Fi ANC",
    category: "Electronics",
    dailyRate: 850,
    weeklyRate: 4900,
    monthlyRate: 15500,
    buyPrice: 69990,
    amazonPrice: 69990,
    flipkartPrice: 67500,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85",
    accent: "#183D2B",
    tagline: "Active Noise Cancellation • 24-bit DAC",
    specs: ["M-shaped Aluminum-Magnesium Domes", "Built-in 24-bit USB-DAC", "Active Noise Cancellation", "30-Hour Battery"]
  }
];

// Pinned horizontal film scroll products (Section 3)
export const STORY_PRODUCTS = [
  {
    id: "story-camera",
    title: "Cinematography & Stills",
    name: "Hasselblad X2D 100C",
    tagline: "The pinnacle of medium format clarity.",
    category: "Photography",
    dailyRate: 14500,
    weeklyRate: 85000,
    buyPrice: 729990,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=85",
    specs: ["100MP BSI CMOS Sensor", "16-Bit Color Depth", "1TB Built-In SSD", "7-Stop IBIS"],
    bgTheme: "#F5F5EF",
    textColor: "#121512",
    accentColor: "#183D2B"
  },
  {
    id: "story-laptop",
    title: "Pro Computing",
    name: "Apple MacBook Pro 16\"",
    tagline: "M3 Max beast for 8K ProRes render on set.",
    category: "Work Setup",
    dailyRate: 3800,
    weeklyRate: 22000,
    buyPrice: 399900,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=85",
    specs: ["M3 Max 16-Core CPU", "40-Core GPU", "128GB Memory", "Liquid Retina XDR"],
    bgTheme: "#183D2B",
    textColor: "#FFFFFF",
    accentColor: "#C9F36B"
  },
  {
    id: "story-gaming",
    title: "Spatial Play",
    name: "PlayStation 5 Pro 2TB",
    tagline: "Uncompromised ray-traced fidelity.",
    category: "Gaming",
    dailyRate: 950,
    weeklyRate: 5500,
    buyPrice: 79990,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1400&q=85",
    specs: ["PSSR Neural Upscaling", "2TB High-Speed SSD", "WiFi 7 Protocol", "DualSense Edge"],
    bgTheme: "#121512",
    textColor: "#FFFFFF",
    accentColor: "#C9F36B"
  },
  {
    id: "story-projector",
    title: "Ultra Short Throw",
    name: "Leica Cine 1 4K Laser",
    tagline: "Bring master-grade projection home for the weekend.",
    category: "Electronics",
    dailyRate: 4500,
    weeklyRate: 26000,
    buyPrice: 489900,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1400&q=85",
    specs: ["Triple RGB Laser Engine", "Dolby Vision & Atmos", "120\" Projection Size", "Summicron Optics"],
    bgTheme: "#183D2B",
    textColor: "#F5F5EF",
    accentColor: "#C9F36B"
  },
  {
    id: "story-tools",
    title: "Master Craftsman",
    name: "Festool Cordless Precision Rig",
    tagline: "German industrial precision for your next project.",
    category: "Tools & Equipment",
    dailyRate: 1200,
    weeklyRate: 7000,
    buyPrice: 145000,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1400&q=85",
    specs: ["Brushless EC-TEC Motor", "Dual 18V Li-Ion Pack", "Dust Extraction HEPA", "Systainer Transport"],
    bgTheme: "#F5F5EF",
    textColor: "#121512",
    accentColor: "#183D2B"
  }
];

// Full-screen category takeover transitions (Section 4)
export const CATEGORY_TAKEOVERS = [
  {
    id: "photography",
    name: "Photography",
    headline: "MEDIUM FORMAT & CINE",
    subtitle: "Rent Hasselblad and Leica bodies for the shoot that matters.",
    tag: "01 / OPTICAL MASTERY",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=85",
    color: "#183D2B",
    accent: "#C9F36B",
    itemCount: "48 Curated Rigs"
  },
  {
    id: "work-setup",
    name: "Work Setup",
    headline: "EXECUTIVE SUITES",
    subtitle: "Apple M3 Max workstations, studio displays, and portable suites.",
    tag: "02 / REMOTE ELEVATION",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=85",
    color: "#121512",
    accent: "#F5F5EF",
    itemCount: "36 Workstations"
  },
  {
    id: "gaming",
    name: "Gaming",
    headline: "NEXT-GEN IMMERSION",
    subtitle: "Play the weekend release without buying hardware you'll shelf in three weeks.",
    tag: "03 / COMPETITIVE EDGE",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1600&q=85",
    color: "#183D2B",
    accent: "#C9F36B",
    itemCount: "24 Setups"
  },
  {
    id: "electronics",
    name: "Electronics",
    headline: "PURE AUDIO & VISION",
    subtitle: "Audiophile monitors, 4K laser optics, and spatial acoustics on demand.",
    tag: "04 / ACOUSTICS & OPTICS",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=85",
    color: "#121512",
    accent: "#C9F36B",
    itemCount: "32 Audio Kits"
  },
  {
    id: "tools",
    name: "Tools & Equipment",
    headline: "INDUSTRIAL CALIBER",
    subtitle: "Contractor-grade Festool saws, thermal imaging, and carbon rigging.",
    tag: "05 / HEAVY PRECISION",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1600&q=85",
    color: "#183D2B",
    accent: "#C9F36B",
    itemCount: "29 Industrial Kits"
  }
];

// Rent vs Buy Comparison Profiles (Section 5)
export const RENT_VS_BUY_COMPARISON = [
  {
    id: "hasselblad-x2d",
    name: "Hasselblad X2D 100C",
    tagline: "100MP Medium Format BSI Flagship",
    buyPrice: 729990,
    dailyRate: 14500,
    weeklyRate: 85000,
    monthlyRate: 260000,
    amazonPrice: 749990,
    flipkartPrice: 739990,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85",
    durations: [
      { label: "3-Day Shoot", days: 3, rentCost: 43500, savings: 686490, pct: 94 },
      { label: "1-Week Commercial", days: 7, rentCost: 85000, savings: 644990, pct: 88 },
      { label: "1-Month Production", days: 30, rentCost: 260000, savings: 469990, pct: 64 },
      { label: "3-Month Season", days: 90, rentCost: 720000, savings: 9990, pct: 1 }
    ],
    verdict: "Renting for a 7-day shoot saves you ₹6,44,990 compared to outright purchase, preserving critical business cash flow."
  },
  {
    id: "macbook-m3-max",
    name: "MacBook Pro 16\" M3 Max",
    tagline: "128GB Unified Memory • 40-Core GPU",
    buyPrice: 399900,
    dailyRate: 3800,
    weeklyRate: 22000,
    monthlyRate: 75000,
    amazonPrice: 399900,
    flipkartPrice: 394900,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85",
    durations: [
      { label: "3-Day Sprint", days: 3, rentCost: 11400, savings: 388500, pct: 97 },
      { label: "1-Week Sprint", days: 7, rentCost: 22000, savings: 377900, pct: 94 },
      { label: "1-Month Project", days: 30, rentCost: 75000, savings: 324900, pct: 81 },
      { label: "3-Month Term", days: 90, rentCost: 210000, savings: 189900, pct: 47 }
    ],
    verdict: "Ideal for temporary 8K rendering or iOS build contracts without locking ₹4 Lakhs on a single machine."
  },
  {
    id: "ps5-pro",
    name: "PlayStation 5 Pro 2TB",
    tagline: "PSSR AI Neural Rendering • 4K 120FPS",
    buyPrice: 79990,
    dailyRate: 950,
    weeklyRate: 5500,
    monthlyRate: 18000,
    amazonPrice: 79990,
    flipkartPrice: 78490,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=85",
    durations: [
      { label: "3-Day Weekend", days: 3, rentCost: 2850, savings: 77140, pct: 96 },
      { label: "1-Week Vacation", days: 7, rentCost: 5500, savings: 74490, pct: 93 },
      { label: "1-Month Play", days: 30, rentCost: 18000, savings: 61990, pct: 77 },
      { label: "3-Month Season", days: 90, rentCost: 48000, savings: 31990, pct: 40 }
    ],
    verdict: "Play the latest blockbuster games over the weekend for just ₹2,850 instead of spending ₹80,000 on hardware you will shelf."
  },
  {
    id: "leica-cine-1",
    name: "Leica Cine 1 4K Laser",
    tagline: "Triple RGB Laser • 120\" Projection",
    buyPrice: 489900,
    dailyRate: 4500,
    weeklyRate: 26000,
    monthlyRate: 85000,
    amazonPrice: 499900,
    flipkartPrice: 495000,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=85",
    durations: [
      { label: "3-Day Screening", days: 3, rentCost: 13500, savings: 476400, pct: 97 },
      { label: "1-Week Festival", days: 7, rentCost: 26000, savings: 463900, pct: 95 },
      { label: "1-Month Exhibition", days: 30, rentCost: 85000, savings: 404900, pct: 83 },
      { label: "3-Month Term", days: 90, rentCost: 240000, savings: 249900, pct: 51 }
    ],
    verdict: "Experience private IMAX-level clarity for your special screening at a fraction of outright acquisition cost."
  }
];

// Complete Marketplace Catalog in Indian Rupee (₹)
export const MARKETPLACE_PRODUCTS = [
  {
    id: "prod-1",
    name: "Hasselblad X2D 100C Cinema Kit",
    category: "Photography",
    dailyRate: 14500,
    buyPrice: 729990,
    deposit: 35000,
    amazonPrice: 749990,
    flipkartPrice: 739990,
    savingsText: "Save ₹7,15,490 (98%) vs Amazon",
    rating: 4.95,
    reviews: 38,
    location: "Mumbai, MH",
    availability: "Immediate Flight-Case",
    badge: "Cinema Flagship",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85",
    description: "100MP Medium Format BSI sensor with 16-bit color depth and 1TB internal SSD. Flight-ready Pelican case included.",
    specs: ["100MP BSI CMOS", "16-Bit Color Depth", "1TB Built-In SSD", "Pelican Case"]
  },
  {
    id: "prod-2",
    name: "Sony Alpha A7 IV (Body + 24-70mm GM II)",
    category: "Photography",
    dailyRate: 2800,
    buyPrice: 289990,
    deposit: 15000,
    amazonPrice: 294990,
    flipkartPrice: 288500,
    savingsText: "Save ₹2,87,190 vs Amazon",
    rating: 4.9,
    reviews: 84,
    location: "Bengaluru, KA",
    availability: "In Stock",
    badge: "Most Popular",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=85",
    description: "Full-frame hybrid mirrorless camera with S-Cinetone color profile and high-speed autofocus.",
    specs: ["33MP Exmor R", "4K 60p 10-Bit", "S-Cinetone Color", "Dual Card Slots"]
  },
  {
    id: "prod-3",
    name: "Apple MacBook Pro 16\" M3 Max",
    category: "Work Setup",
    dailyRate: 3800,
    buyPrice: 399900,
    deposit: 25000,
    amazonPrice: 399900,
    flipkartPrice: 394900,
    savingsText: "Save ₹3,96,100 on 1-day compute",
    rating: 4.98,
    reviews: 62,
    location: "Bengaluru, KA",
    availability: "Ready to Dispatch",
    badge: "Pro Compute",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=85",
    description: "16-core CPU, 40-core GPU, 128GB unified RAM, and 2TB high-speed SSD for 8K video editing and AI compilation.",
    specs: ["M3 Max 16-Core", "128GB Unified Memory", "2TB Fast Storage", "Liquid Retina XDR"]
  },
  {
    id: "prod-4",
    name: "Sony PlayStation 5 Pro 2TB",
    category: "Gaming",
    dailyRate: 950,
    buyPrice: 79990,
    deposit: 8000,
    amazonPrice: 79990,
    flipkartPrice: 78490,
    savingsText: "Weekend play for only ₹2,850",
    rating: 4.96,
    reviews: 112,
    location: "Mumbai, MH",
    availability: "Available",
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=85",
    description: "PSSR AI Neural Rendering, 2TB custom NVMe SSD, and DualSense Edge wireless controller.",
    specs: ["PSSR AI Upscaling", "2TB Custom NVMe", "DualSense Controller", "8K Output"]
  },
  {
    id: "prod-5",
    name: "Leica Cine 1 4K Ultra Short Throw",
    category: "Electronics",
    dailyRate: 4500,
    buyPrice: 489900,
    deposit: 30000,
    amazonPrice: 499900,
    flipkartPrice: 495000,
    savingsText: "Save ₹4,85,400 on screening",
    rating: 4.92,
    reviews: 19,
    location: "Delhi NCR",
    availability: "Scheduled Courier",
    badge: "Laser Theatre",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1000&q=85",
    description: "Triple RGB laser projection engine producing up to 120-inch 4K images with integrated Dolby Atmos audio.",
    specs: ["Triple RGB Laser", "120\" Projection Size", "Dolby Atmos 50W", "Summicron Optics"]
  },
  {
    id: "prod-6",
    name: "Focal Bathys Hi-Fi Wireless ANC",
    category: "Electronics",
    dailyRate: 850,
    buyPrice: 69990,
    deposit: 7000,
    amazonPrice: 69990,
    flipkartPrice: 67500,
    savingsText: "Audiophile sound for ₹850/day",
    rating: 4.88,
    reviews: 46,
    location: "Bengaluru, KA",
    availability: "In Stock",
    badge: "Hi-Fi Studio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85",
    description: "Active noise cancelling headphones featuring high-fidelity aluminum-magnesium drivers and built-in 24-bit DAC.",
    specs: ["Al-Mg Dome Drivers", "Built-In 24-bit DAC", "Active Noise Cancelling", "30h Playback"]
  },
  {
    id: "prod-7",
    name: "Festool Cordless Precision Saw TSC 55",
    category: "Tools & Equipment",
    dailyRate: 1200,
    buyPrice: 145000,
    deposit: 12000,
    amazonPrice: 149000,
    flipkartPrice: 146500,
    savingsText: "German engineering for your project",
    rating: 4.93,
    reviews: 31,
    location: "Pune, MH",
    availability: "Ready to Dispatch",
    badge: "Craftsman Grade",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=85",
    description: "Precision circular track saw with brushless motor and kickback stop safety technology.",
    specs: ["KickbackStop Safety", "EC-TEC Brushless", "Dust Extraction HEPA", "Systainer Case"]
  }
];

export const TRUST_STATS = [
  { value: "₹4.8 Cr+", label: "Capital Saved by Renters", desc: "Calculated against retail purchase prices" },
  { value: "100%", label: "SafeShield Escrow Refund", desc: "Automated deposit release within 2 hours" },
  { value: "1,200+", label: "Verified Tier-1 Rigs", desc: "Hardware inspection & serial validation" },
  { value: "0.02%", label: "Dispute Rate", desc: "Guaranteed condition & transparent pricing" }
];


// Featured Categories alias for seamless imports
export const FEATURED_CATEGORIES = CATEGORY_TAKEOVERS;

// Pinned How It Works Storytelling Steps
export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Find your gear",
    tagline: "Search by project, shoot, or exact focal length.",
    badge: "01 — DISCOVER",
    desc: "Browse hundreds of verified tier-1 camera packages, Apple M3 workstations, and cinema accessories available across Mumbai, Bengaluru, Delhi NCR, and Pune.",
    metric: "1,200+ Verified Rigs in Stock"
  },
  {
    step: "02",
    title: "Choose your duration",
    tagline: "Pay only for shoot days with flexible tiers.",
    badge: "02 — DURATION",
    desc: "Select 1-day bursts, weekend specials, or 30-day extended productions. Your refundable security deposit is locked safely in SafeShield Escrow.",
    metric: "100% Refundable SafeShield Escrow"
  },
  {
    step: "03",
    title: "Get it delivered",
    tagline: "Pelican flight-cased & pre-calibrated to set.",
    badge: "03 — DISPATCH",
    desc: "Courier delivery straight to your production studio or doorstep. Return seamlessly with prepaid return labels or convert rent to purchase with 1 click.",
    metric: "3-Hour Express Metro Delivery"
  }
];
