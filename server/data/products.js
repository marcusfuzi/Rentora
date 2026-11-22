export const initialProducts = [
  {
    id: 'prod-1',
    name: 'Sony Alpha A7 IV Mirrorless Camera (Body)',
    category: 'Cameras',
    description: '33MP full-frame Exmor R back-illuminated CMOS sensor with BIONZ XR processing engine. 4K 60p 10-bit 4:2:2 recording, advanced real-time Eye AF for humans, animals, and birds.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=1000&q=80'
    ],
    listingType: 'Rent & Sell',
    rentalPricePerDay: 1200,
    sellingPrice: 195000,
    securityDeposit: 15000,
    availability: 'In Stock',
    featured: true,
    seller: {
      id: 'seller-1',
      name: 'Apex Visuals Lab',
      email: 'seller@rentora.com',
      verified: true,
      rating: 4.9,
      reviewsCount: 184,
      city: 'Bengaluru, KA'
    },
    rating: 4.9,
    reviewsCount: 88,
    specs: {
      'Sensor': '33MP Full-Frame CMOS',
      'Video': '4K 60p 10-bit 4:2:2',
      'Autofocus': '759 phase-detection points',
      'ISO Range': '100-51200 (Expandable to 204800)',
      'Mount': 'Sony E-Mount',
      'Weight': '658g'
    },
    externalComparison: {
      amazonPrice: 209990,
      flipkartPrice: 204500,
      cromaPrice: 214990,
      rentoraPrice: 195000,
      lowestPlatform: 'Rentora Seller',
      savings: 9500,
      verifiedDate: 'Today'
    },
    rentalTerms: {
      minDays: 2,
      maxDays: 30,
      damagePolicy: 'Covered under Rentora SafeShield (₹500 deductible)',
      lateFeePerDay: 1500
    },
    reviews: [
      { id: 'rev-1', user: 'Rahul Verma', rating: 5, date: '2026-10-18', comment: 'Rented this for a 3-day destination wedding shoot in Udaipur. Flawless condition, sensor was spotless!' },
      { id: 'rev-2', user: 'Pooja Iyer', rating: 5, date: '2026-10-02', comment: 'Used Try Before You Buy. Rented for a week, fell in love, and bought it directly from Apex Visuals. Rent fee was deducted!' }
    ]
  },
  {
    id: 'prod-2',
    name: 'Apple MacBook Pro 16" M3 Max (36GB Unified, 1TB SSD)',
    category: 'Laptops',
    description: 'The apex of mobile computing. 14-core CPU, 30-core GPU, Liquid Retina XDR display with ProMotion 120Hz. Designed for 8K video editing, 3D rendering, and AI model workflows.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80'
    ],
    listingType: 'Rent & Sell',
    rentalPricePerDay: 2200,
    sellingPrice: 319000,
    securityDeposit: 25000,
    availability: 'In Stock',
    featured: true,
    seller: {
      id: 'seller-2',
      name: 'CyberTech Enterprise Pro',
      email: 'cybertech@rentora.com',
      verified: true,
      rating: 4.8,
      reviewsCount: 312,
      city: 'Mumbai, MH'
    },
    rating: 4.9,
    reviewsCount: 142,
    specs: {
      'Processor': 'Apple M3 Max 14-core',
      'Memory': '36GB Unified RAM',
      'Storage': '1TB NVMe Gen4 SSD',
      'Display': '16.2" Liquid Retina XDR (3456x2234)',
      'Battery': 'Up to 22 hours',
      'Weight': '2.16 kg'
    },
    externalComparison: {
      amazonPrice: 349900,
      flipkartPrice: 339990,
      cromaPrice: 349900,
      rentoraPrice: 319000,
      lowestPlatform: 'Rentora Seller',
      savings: 20990,
      verifiedDate: 'Today'
    },
    rentalTerms: {
      minDays: 3,
      maxDays: 60,
      damagePolicy: 'AppleCare+ Active & Rentora Transit Coverage',
      lateFeePerDay: 2500
    },
    reviews: [
      { id: 'rev-3', user: 'Ankit Sharma', rating: 5, date: '2026-10-24', comment: 'Rented for a 10-day render sprint for our game studio. Delivered within 3 hours in Mumbai, factory reset and ready.' }
    ]
  },
  {
    id: 'prod-3',
    name: 'Sony PlayStation 5 Pro Gaming Console Bundle',
    category: 'Gaming Consoles',
    description: 'PlayStation 5 Pro featuring 2TB Ultra-High-Speed SSD, advanced Ray Tracing, 4K 120fps support, and DualSense Edge wireless controller with Pulse 3D Elite wireless headset.',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80'
    ],
    listingType: 'Rent & Sell',
    rentalPricePerDay: 750,
    sellingPrice: 68000,
    securityDeposit: 6000,
    availability: 'In Stock',
    featured: true,
    seller: {
      id: 'seller-1',
      name: 'Apex Visuals Lab',
      email: 'seller@rentora.com',
      verified: true,
      rating: 4.9,
      reviewsCount: 184,
      city: 'Bengaluru, KA'
    },
    rating: 4.8,
    reviewsCount: 95,
    specs: {
      'Storage': '2TB Custom High-Speed SSD',
      'Graphics': 'Enhanced RDNA 3 GPU with PSSR Upscaling',
      'Audio': 'Tempest 3D AudioTech',
      'Bundled Items': 'DualSense Edge + Pulse 3D Elite + 2 Games'
    },
    externalComparison: {
      amazonPrice: 74990,
      flipkartPrice: 72990,
      cromaPrice: 74990,
      rentoraPrice: 68000,
      lowestPlatform: 'Rentora Seller',
      savings: 4990,
      verifiedDate: 'Today'
    },
    rentalTerms: {
      minDays: 2,
      maxDays: 30,
      damagePolicy: 'Hardware warranty included',
      lateFeePerDay: 900
    },
    reviews: [
      { id: 'rev-4', user: 'Vikram Mehta', rating: 5, date: '2026-10-15', comment: 'Rented for Diwali weekend party with college friends. Unbelievable performance and came loaded with Spider-Man 2.' }
    ]
  },
  {
    id: 'prod-4',
    name: 'DJI Mavic 3 Pro Cine Drone Combo',
    category: 'Drones',
    description: 'Triple-camera flagship drone featuring 4/3 CMOS Hasselblad camera, dual tele lenses, Apple ProRes 422 HQ recording, 43-min flight time, and omnidirectional obstacle sensing.',
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80'
    ],
    listingType: 'Rent Only',
    rentalPricePerDay: 3500,
    sellingPrice: 285000,
    securityDeposit: 30000,
    availability: 'In Stock',
    featured: true,
    seller: {
      id: 'seller-3',
      name: 'SkyView Drone Labs',
      email: 'skyview@rentora.com',
      verified: true,
      rating: 4.95,
      reviewsCount: 128,
      city: 'Hyderabad, TS'
    },
    rating: 5.0,
    reviewsCount: 64,
    specs: {
      'Cameras': '4/3 Hasselblad + 70mm Tele + 166mm Tele',
      'Video': 'Apple ProRes 422 HQ 5.1K / 4K 120fps',
      'Flight Time': 'Up to 43 minutes per battery',
      'Transmission': 'DJI O3+ up to 15km range',
      'Includes': 'DJI RC Pro, 3 Batteries, ND Filters set'
    },
    externalComparison: {
      amazonPrice: 310000,
      flipkartPrice: 305000,
      cromaPrice: 315000,
      rentoraPrice: 285000,
      lowestPlatform: 'Rentora Seller',
      savings: 20000,
      verifiedDate: 'Today'
    },
    rentalTerms: {
      minDays: 1,
      maxDays: 14,
      damagePolicy: 'DGCA Certified Pilot requirement or Rentora Drone Insurance mandatory',
      lateFeePerDay: 4000
    },
    reviews: [
      { id: 'rev-5', user: 'Rohan Nambiar', rating: 5, date: '2026-10-10', comment: 'Shot a tourism documentary in Coorg with this beast. Hasselblad color science is unmatched.' }
    ]
  },
  {
    id: 'prod-5',
    name: 'Segway Ninebot KickScooter Max G2 Electric Vehicle',
    category: 'Vehicles',
    description: 'Premium urban commuter e-scooter with hydraulic front & double rear spring suspension, 70km max range, 900W peak power brushless motor, Apple Find My integration, and self-healing tubeless tires.',
    images: [
      'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80'
    ],
    listingType: 'Rent & Sell',
    rentalPricePerDay: 500,
    sellingPrice: 78000,
    securityDeposit: 8000,
    availability: 'In Stock',
    featured: false,
    seller: {
      id: 'seller-2',
      name: 'CyberTech Enterprise Pro',
      email: 'cybertech@rentora.com',
      verified: true,
      rating: 4.8,
      reviewsCount: 312,
      city: 'Bengaluru, KA'
    },
    rating: 4.7,
    reviewsCount: 78,
    specs: {
      'Range': 'Up to 70 km per charge',
      'Max Speed': '35 km/h',
      'Motor': '900W Max Brushless',
      'Brakes': 'Front Drum + Rear Electronic',
      'Features': 'Apple Find My, Turn signals, Traction Control'
    },
    externalComparison: {
      amazonPrice: 85000,
      flipkartPrice: 83500,
      cromaPrice: 86000,
      rentoraPrice: 78000,
      lowestPlatform: 'Rentora Seller',
      savings: 5500,
      verifiedDate: 'Today'
    },
    rentalTerms: {
      minDays: 3,
      maxDays: 90,
      damagePolicy: 'Flat tire assistance included, helmet provided',
      lateFeePerDay: 700
    },
    reviews: [
      { id: 'rev-6', user: 'Neha Kapoor', rating: 5, date: '2026-10-22', comment: 'Rented for 1 month while my car was in the workshop. Saved me tons on cab fares and easily climbed slopes!' }
    ]
  },
  {
    id: 'prod-6',
    name: 'Anker Nebula Capsule 3 Laser 1080p Smart Projector',
    category: 'Projectors',
    description: 'Pocket-sized laser cinema projector with 1080p Laser High Brightness (300 ANSI Lumens), Android TV 11.0 with Netflix official, 52Wh built-in battery for 2.5 hours of movie playback, autofocus & auto keystone.',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1000&q=80'
    ],
    listingType: 'Rent & Sell',
    rentalPricePerDay: 650,
    sellingPrice: 62000,
    securityDeposit: 5000,
    availability: 'In Stock',
    featured: false,
    seller: {
      id: 'seller-1',
      name: 'Apex Visuals Lab',
      email: 'seller@rentora.com',
      verified: true,
      rating: 4.9,
      reviewsCount: 184,
      city: 'Pune, MH'
    },
    rating: 4.8,
    reviewsCount: 52,
    specs: {
      'Resolution': '1920x1080 Full HD Laser',
      'Brightness': '300 ANSI Lumens',
      'Screen Size': 'Up to 120 inches',
      'Sound': '8W Dolby Digital Speaker',
      'Battery': '2.5hr video playback'
    },
    externalComparison: {
      amazonPrice: 69990,
      flipkartPrice: 67990,
      cromaPrice: 71000,
      rentoraPrice: 62000,
      lowestPlatform: 'Rentora Seller',
      savings: 5990,
      verifiedDate: 'Today'
    },
    rentalTerms: {
      minDays: 1,
      maxDays: 14,
      damagePolicy: 'Lens cover and carrying case included',
      lateFeePerDay: 800
    },
    reviews: [
      { id: 'rev-7', user: 'Kunal Singhania', rating: 5, date: '2026-10-28', comment: 'Took this on a camping trip in Rishikesh. Projected movies on the tent wall under the stars, insane clarity.' }
    ]
  },
  {
    id: 'prod-7',
    name: 'Marshall Woburn III Bluetooth Home Audio Speaker',
    category: 'Speakers',
    description: 'Iconic Marshall room-shaking audio with three-way driver system delivering greater low-frequency bass clarity and crisp mid-ranges. HDMI ARC connectivity, Bluetooth 5.2, vintage aesthetic brass accents.',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80'
    ],
    listingType: 'Rent & Sell',
    rentalPricePerDay: 700,
    sellingPrice: 59999,
    securityDeposit: 6000,
    availability: 'In Stock',
    featured: false,
    seller: {
      id: 'seller-2',
      name: 'CyberTech Enterprise Pro',
      email: 'cybertech@rentora.com',
      verified: true,
      rating: 4.8,
      reviewsCount: 312,
      city: 'Delhi NCR'
    },
    rating: 4.9,
    reviewsCount: 110,
    specs: {
      'Power Output': '150W Class D Amplification',
      'Frequency': '35–20,000 Hz',
      'Connectivity': 'Bluetooth 5.2 LE, 3.5mm AUX, RCA, HDMI ARC',
      'Dimensions': '400 x 317 x 203 mm'
    },
    externalComparison: {
      amazonPrice: 66999,
      flipkartPrice: 64990,
      cromaPrice: 66999,
      rentoraPrice: 59999,
      lowestPlatform: 'Rentora Seller',
      savings: 4991,
      verifiedDate: 'Today'
    },
    rentalTerms: {
      minDays: 2,
      maxDays: 21,
      damagePolicy: 'Covered against voltage surge with provided stabilizer',
      lateFeePerDay: 900
    },
    reviews: [
      { id: 'rev-8', user: 'Arjun Das', rating: 5, date: '2026-10-12', comment: 'Rented for housewarming party. Filled a 2000 sq ft hall effortlessly. Sound quality is legendary.' }
    ]
  },
  {
    id: 'prod-8',
    name: 'DeWalt 20V MAX XR 6-Tool Brushless Combo Kit',
    category: 'Tools and Equipment',
    description: 'Heavy duty contractor kit includes DCD805 Hammer Drill, DCF887 Impact Driver, DCS382 Reciprocating Saw, DCS570 Circular Saw, DCS356 Oscillating Multi-Tool, LED Worklight, two 5.0Ah batteries, fast charger and contractor bag.',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&w=1000&q=80'
    ],
    listingType: 'Rent & Sell',
    rentalPricePerDay: 850,
    sellingPrice: 84000,
    securityDeposit: 7500,
    availability: 'In Stock',
    featured: false,
    seller: {
      id: 'seller-4',
      name: 'ProBuild Tool Rental Co.',
      email: 'probuild@rentora.com',
      verified: true,
      rating: 4.85,
      reviewsCount: 92,
      city: 'Chennai, TN'
    },
    rating: 4.8,
    reviewsCount: 46,
    specs: {
      'Voltage': '20V MAX XR Lithium-Ion',
      'Tools Included': '6 Brushless Tools',
      'Batteries': '2x 5.0Ah High Capacity',
      'Warranty': 'Guaranteed maintained & sanitized before dispatch'
    },
    externalComparison: {
      amazonPrice: 92000,
      flipkartPrice: 89500,
      cromaPrice: 94000,
      rentoraPrice: 84000,
      lowestPlatform: 'Rentora Seller',
      savings: 5500,
      verifiedDate: 'Today'
    },
    rentalTerms: {
      minDays: 2,
      maxDays: 45,
      damagePolicy: 'Normal wear-and-tear accepted, blades replaced periodically',
      lateFeePerDay: 1000
    },
    reviews: [
      { id: 'rev-9', user: 'Siddharth Rao', rating: 5, date: '2026-10-08', comment: 'Rented for 5 days to build DIY backyard patio decking. Why buy an ₹84K kit when you can finish the job for ₹4,200!' }
    ]
  },
  {
    id: 'prod-9',
    name: 'Apple Vision Pro (512GB) Spatial Computer',
    category: 'Electronics',
    description: 'Transform how you work, watch, and connect. Dual micro-OLED displays with 23 million pixels, eye tracking, spatial audio, and seamless 3D spatial computing environment running visionOS 2.',
    images: [
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1000&q=80'
    ],
    listingType: 'Rent & Sell',
    rentalPricePerDay: 3800,
    sellingPrice: 385000,
    securityDeposit: 40000,
    availability: 'In Stock',
    featured: true,
    seller: {
      id: 'seller-1',
      name: 'Apex Visuals Lab',
      email: 'seller@rentora.com',
      verified: true,
      rating: 4.9,
      reviewsCount: 184,
      city: 'Bengaluru, KA'
    },
    rating: 4.9,
    reviewsCount: 56,
    specs: {
      'Display': '23M Pixels Dual Micro-OLED',
      'Chips': 'M2 + R1 Real-Time Coprocessor',
      'Storage': '512GB',
      'Input': 'Eyes, Hands, Voice'
    },
    externalComparison: {
      amazonPrice: 420000,
      flipkartPrice: 410000,
      cromaPrice: 425000,
      rentoraPrice: 385000,
      lowestPlatform: 'Rentora Seller',
      savings: 25000,
      verifiedDate: 'Today'
    },
    rentalTerms: {
      minDays: 2,
      maxDays: 14,
      damagePolicy: 'Full AppleCare+ with premium hard carry travel case',
      lateFeePerDay: 4500
    },
    reviews: [
      { id: 'rev-10', user: 'Aditya Sen', rating: 5, date: '2026-10-20', comment: 'Rented for an executive AR/VR demonstration at an investor summit. Blown away!' }
    ]
  },
  {
    id: 'prod-10',
    name: 'Canon EOS R5 Mirrorless Camera with 24-70mm f/2.8L',
    category: 'Cameras',
    description: '45MP Full-Frame CMOS sensor, 8K RAW video recording, 5-axis sensor-shift image stabilization up to 8 stops, Dual Pixel CMOS AF II with 1053 automatic AF zones.',
    images: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80'
    ],
    listingType: 'Rent Only',
    rentalPricePerDay: 1900,
    sellingPrice: 320000,
    securityDeposit: 22000,
    availability: 'In Stock',
    featured: false,
    seller: {
      id: 'seller-1',
      name: 'Apex Visuals Lab',
      email: 'seller@rentora.com',
      verified: true,
      rating: 4.9,
      reviewsCount: 184,
      city: 'Bengaluru, KA'
    },
    rating: 4.9,
    reviewsCount: 68,
    specs: {
      'Sensor': '45MP Full-Frame Dual Pixel',
      'Video': '8K RAW Internal, 4K 120p',
      'Lens': 'Canon RF 24-70mm f/2.8L IS USM',
      'Media': 'CFexpress Type B + SD UHS-II'
    },
    externalComparison: {
      amazonPrice: 335000,
      flipkartPrice: 329000,
      cromaPrice: 340000,
      rentoraPrice: 320000,
      lowestPlatform: 'Rentora Seller',
      savings: 9000,
      verifiedDate: 'Today'
    },
    rentalTerms: {
      minDays: 2,
      maxDays: 30,
      damagePolicy: 'Professional equipment transit insurance included',
      lateFeePerDay: 2200
    },
    reviews: [
      { id: 'rev-11', user: 'Harish Nair', rating: 5, date: '2026-10-14', comment: 'Used for a high-end fashion catalog shoot. Stunning colors and 8K sharpness.' }
    ]
  },
  {
    id: 'prod-11',
    name: 'ASUS ROG Zephyrus G16 OLED Gaming Laptop',
    category: 'Laptops',
    description: 'Intel Core Ultra 9 185H with built-in AI accelerator, NVIDIA GeForce RTX 4080 12GB GPU, 2.5K 240Hz ROG Nebula OLED display with 0.2ms response time, CNC aluminum chassis.',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80'
    ],
    listingType: 'Rent & Sell',
    rentalPricePerDay: 1600,
    sellingPrice: 245000,
    securityDeposit: 18000,
    availability: 'In Stock',
    featured: false,
    seller: {
      id: 'seller-2',
      name: 'CyberTech Enterprise Pro',
      email: 'cybertech@rentora.com',
      verified: true,
      rating: 4.8,
      reviewsCount: 312,
      city: 'Gurugram, HR'
    },
    rating: 4.8,
    reviewsCount: 42,
    specs: {
      'CPU': 'Intel Core Ultra 9 185H',
      'GPU': 'RTX 4080 Laptop GPU 12GB GDDR6',
      'Screen': '16" 2.5K 240Hz OLED G-Sync',
      'RAM & SSD': '32GB LPDDR5X + 2TB NVMe SSD'
    },
    externalComparison: {
      amazonPrice: 269990,
      flipkartPrice: 259990,
      cromaPrice: 269990,
      rentoraPrice: 245000,
      lowestPlatform: 'Rentora Seller',
      savings: 14990,
      verifiedDate: 'Today'
    },
    rentalTerms: {
      minDays: 3,
      maxDays: 45,
      damagePolicy: 'Accidental spill and drop protection included',
      lateFeePerDay: 2000
    },
    reviews: [
      { id: 'rev-12', user: 'Deepak Jha', rating: 5, date: '2026-10-19', comment: 'OLED screen is mindblowing for Cyberpunk 2077 with ray tracing overdrive.' }
    ]
  },
  {
    id: 'prod-12',
    name: 'DJI RS 3 Pro Gimbal Stabilizer Combo',
    category: 'Other Products',
    description: 'Automated axis locks, extended carbon fiber axis arms, 4.5kg tested payload, LiDAR focusing system for manual lenses, and O3 Pro video transmission transmitter.',
    images: [
      'https://images.unsplash.com/photo-1589872583804-031e8c6001a1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=1000&q=80'
    ],
    listingType: 'Rent & Sell',
    rentalPricePerDay: 750,
    sellingPrice: 72000,
    securityDeposit: 6000,
    availability: 'In Stock',
    featured: false,
    seller: {
      id: 'seller-3',
      name: 'SkyView Drone Labs',
      email: 'skyview@rentora.com',
      verified: true,
      rating: 4.95,
      reviewsCount: 128,
      city: 'Hyderabad, TS'
    },
    rating: 4.8,
    reviewsCount: 39,
    specs: {
      'Payload': '4.5 kg (10 lbs)',
      'Material': 'Layered Carbon Fiber Arms',
      'Focusing': 'LiDAR Range Finder support',
      'Battery Life': '12 hours'
    },
    externalComparison: {
      amazonPrice: 79990,
      flipkartPrice: 77500,
      cromaPrice: 81000,
      rentoraPrice: 72000,
      lowestPlatform: 'Rentora Seller',
      savings: 5500,
      verifiedDate: 'Today'
    },
    rentalTerms: {
      minDays: 2,
      maxDays: 20,
      damagePolicy: 'LiDAR unit and follow focus motor calibrated',
      lateFeePerDay: 900
    },
    reviews: [
      { id: 'rev-13', user: 'Viren G.', rating: 5, date: '2026-10-05', comment: 'Automated axis locks make balancing so fast on set. Saved hours.' }
    ]
  }
];
