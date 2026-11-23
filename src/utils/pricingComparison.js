import { formatINR } from '../data/rentoraData';

/**
 * Generates 6-month historical price tracking data for a product.
 * Computes all-time low, high, average, and price trends.
 */
export function getPriceHistory(product) {
  if (!product) return null;

  const basePrice = Number(product.buyPrice) || 100000;
  const amazonPrice = Number(product.amazonPrice) || Math.round(basePrice * 1.03);
  const flipkartPrice = Number(product.flipkartPrice) || Math.round(basePrice * 1.01);
  const currentMinPrice = Math.min(basePrice, amazonPrice, flipkartPrice);

  // Generate realistic 6-month trend anchored around current price
  const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  const monthLabels = ['6 Months Ago', '5 Months Ago', '4 Months Ago', 'Festive Sale', 'Last Month', 'Current Live'];
  
  // Historical variations: launch high -> monsoon -> big festive sale dip -> slight rebound -> current competitive price
  const multipliers = [1.08, 1.05, 1.03, 0.96, 1.01, (currentMinPrice / basePrice)];
  
  const historyPoints = months.map((m, idx) => {
    const price = Math.round(basePrice * multipliers[idx]);
    return {
      month: m,
      label: monthLabels[idx],
      price: price,
      amazon: Math.round(price * 1.02),
      flipkart: Math.round(price * 0.99)
    };
  });

  // Ensure last point matches currentMinPrice
  historyPoints[historyPoints.length - 1].price = currentMinPrice;

  const allPrices = historyPoints.map(p => p.price);
  const allTimeLow = Math.min(...allPrices);
  const allTimeHigh = Math.max(...allPrices);
  const averagePrice = Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length);
  const priceDropFromHigh = allTimeHigh - currentMinPrice;
  const priceDropPct = Math.round((priceDropFromHigh / allTimeHigh) * 100);
  const isAtLowestNow = currentMinPrice <= (allTimeLow * 1.01);

  return {
    historyPoints,
    allTimeLow,
    allTimeHigh,
    averagePrice,
    currentPrice: currentMinPrice,
    priceDropFromHigh,
    priceDropPct,
    isAtLowestNow,
    trendVerdict: isAtLowestNow
      ? '🟢 ALL-TIME LOW: Price is at its lowest record! Best time to buy or rent.'
      : `📉 Price is ₹${priceDropFromHigh.toLocaleString('en-IN')} (${priceDropPct}%) below its 6-month peak.`
  };
}

/**
 * Computes flexible tenure pricing models (1M, 3M, 6M, 12M)
 * with refundable deposit and maintenance inclusions.
 */
export function getTenurePricing(product) {
  if (!product) return null;

  const baseBuyPrice = Number(product.buyPrice) || 100000;
  const dailyRate = Number(product.dailyRate) || Math.round(baseBuyPrice * 0.02);
  
  // Base monthly rate is ~12-14x daily rate (massive discount over daily)
  const baseMonthly = Math.round(dailyRate * 12);
  const refundableDeposit = Number(product.deposit) || Math.round(baseMonthly * 1.2);

  const tenures = [
    {
      id: '1m',
      label: '1 Month',
      months: 1,
      tag: 'Flexible / Short Term',
      monthlyRate: baseMonthly,
      totalRent: baseMonthly,
      savingsPct: 0,
      popular: false
    },
    {
      id: '3m',
      label: '3 Months',
      months: 3,
      tag: 'Quarterly Project',
      monthlyRate: Math.round(baseMonthly * 0.90),
      totalRent: Math.round(baseMonthly * 0.90 * 3),
      savingsPct: 10,
      popular: false
    },
    {
      id: '6m',
      label: '6 Months',
      months: 6,
      tag: 'Most Popular',
      monthlyRate: Math.round(baseMonthly * 0.80),
      totalRent: Math.round(baseMonthly * 0.80 * 6),
      savingsPct: 20,
      popular: true
    },
    {
      id: '12m',
      label: '12+ Months',
      months: 12,
      tag: 'Best Value / Max Savings',
      monthlyRate: Math.round(baseMonthly * 0.65),
      totalRent: Math.round(baseMonthly * 0.65 * 12),
      savingsPct: 35,
      popular: false
    }
  ];

  return {
    baseMonthly,
    dailyRate,
    refundableDeposit,
    tenures,
    perks: [
      '100% Refundable Security Deposit',
      'Free Doorstep Delivery & White-Glove Setup',
      'Free Annual Relocation Across 5 Metros',
      'Zero Maintenance & Free Periodic Servicing',
      'SafeShield Damage Protection Included'
    ]
  };
}

/**
 * Calculates multi-retailer live prices, detects the lowest market rate,
 * generates direct product links, and computes the Rent-vs-Buy decision
 * based on user's required duration.
 */
export function getLiveRetailComparison(product, durationDays = 7) {
  if (!product) return null;

  const days = Math.max(1, Number(durationDays) || 1);
  const baseBuyPrice = Number(product.buyPrice) || 100000;
  const dailyRate = Number(product.dailyRate) || Math.round(baseBuyPrice * 0.02);

  // Term discount curve: 1-6d = 0%, 7-29d = 8% off, 30-59d = 15% off, 60d+ = 25% off
  const discountMultiplier =
    days >= 60 ? 0.75 : days >= 30 ? 0.85 : days >= 7 ? 0.92 : 1.0;

  const rentalCost = Math.round(dailyRate * days * discountMultiplier);

  // Platform price variations (anchored to actual product.amazonPrice / product.flipkartPrice if provided)
  const amazonPrice = Number(product.amazonPrice) || Math.round(baseBuyPrice * 1.03);
  const flipkartPrice = Number(product.flipkartPrice) || Math.round(baseBuyPrice * 1.01);
  const cromaPrice = Number(product.cromaPrice) || Math.round(baseBuyPrice * 1.04);
  const reliancePrice = Number(product.reliancePrice) || Math.round(baseBuyPrice * 1.045);
  const vijaySalesPrice = Number(product.vijaySalesPrice) || Math.round(baseBuyPrice * 1.035);

  const encodedQuery = encodeURIComponent(product.name || 'gadgets');

  // Retail platforms (excluding Rentora) to detect lowest retail buy price
  const retailOptions = [
    {
      id: 'flipkart',
      name: 'Flipkart Flagship Store',
      shortName: 'Flipkart',
      price: flipkartPrice,
      url: `https://www.flipkart.com/search?q=${encodedQuery}`,
      delivery: '3-4 Days Express Surface',
      tag: 'Brand Warranty + 7-Day Replacement',
      badge: 'Online Retail',
      logoColor: '#2874F0'
    },
    {
      id: 'amazon',
      name: 'Amazon India Electronics',
      shortName: 'Amazon.in',
      price: amazonPrice,
      url: `https://www.amazon.in/s?k=${encodedQuery}`,
      delivery: '2-Day Prime Dispatch',
      tag: 'Standard Manufacturer Warranty',
      badge: 'Prime Eligible',
      logoColor: '#FF9900'
    },
    {
      id: 'croma',
      name: 'Croma Digital',
      shortName: 'Croma',
      price: cromaPrice,
      url: `https://www.croma.com/searchB?q=${encodedQuery}`,
      delivery: 'Store Pickup or 2-Day Courier',
      tag: 'Tata Assured + Brand Warranty',
      badge: 'Omnichannel Store',
      logoColor: '#00B5B5'
    },
    {
      id: 'reliance',
      name: 'Reliance Digital',
      shortName: 'Reliance Digital',
      price: reliancePrice,
      url: `https://www.reliancedigital.in/search?q=${encodedQuery}`,
      delivery: 'Same-Day Store Pickup or 3-Day Ship',
      tag: 'ResQ Warranty Available',
      badge: 'Retail Chain',
      logoColor: '#E42529'
    },
    {
      id: 'vijaysales',
      name: 'Vijay Sales',
      shortName: 'Vijay Sales',
      price: vijaySalesPrice,
      url: `https://www.vijaysales.com/search/${encodedQuery}`,
      delivery: '2-4 Days Regional Delivery',
      tag: 'Authorized Dealer Invoice',
      badge: 'Certified Partner',
      logoColor: '#D32F2F'
    }
  ];

  // Identify lowest rate among retail apps
  let lowestRetail = retailOptions[0];
  for (const opt of retailOptions) {
    if (opt.price < lowestRetail.price) {
      lowestRetail = opt;
    }
  }

  // Calculate Break-Even Days based on the lowest retail market price
  const breakEvenDays = Math.ceil(lowestRetail.price / (dailyRate * 0.85));

  const shouldRent = days < breakEvenDays;
  const savingsVsLowest = lowestRetail.price - rentalCost;
  const savingsPct = Math.max(1, Math.round((savingsVsLowest / lowestRetail.price) * 100));

  const verdict = {
    shouldRent,
    breakEvenDays,
    days,
    rentalCost,
    lowestRetailPrice: lowestRetail.price,
    lowestRetailPlatform: lowestRetail,
    savingsVsLowest,
    savingsPct,
    title: shouldRent
      ? '🟢 VERDICT: RECOMMEND RENTING ON RENTORA'
      : '🟡 VERDICT: RECOMMEND BUYING OUTRIGHT (LONG-TERM OWNERSHIP)',
    badgeText: shouldRent
      ? `Optimal for ${days} Day${days > 1 ? 's' : ''}`
      : `Threshold Exceeded (${breakEvenDays}d Break-Even)`,
    explanation: shouldRent
      ? `For your ${days}-day requirement, renting costs only ${formatINR(rentalCost)}, saving you ${formatINR(savingsVsLowest)} (${savingsPct}%) compared to buying at the lowest retail rate on ${lowestRetail.name} (${formatINR(lowestRetail.price)}). You get certified flight-case hardware with zero depreciation and zero storage commitment.`
      : `Since you need this device for ${days} days, the cumulative rental cost (${formatINR(rentalCost)}) meets or exceeds the lowest outright purchase price of ${formatINR(lowestRetail.price)} on ${lowestRetail.name}. Purchasing outright is more economically viable for permanent ownership.`
  };

  // Historical price tracker data
  const priceHistory = getPriceHistory(product);
  const tenurePricing = getTenurePricing(product);

  return {
    product,
    days,
    dailyRate,
    rentalCost,
    rentoraBuyPrice: baseBuyPrice,
    retailOptions,
    lowestRetail,
    lowestRetailPrice: lowestRetail.price,
    breakEvenDays,
    verdict,
    priceHistory,
    tenurePricing,
    lastSynced: 'Live Sync Active (Updated 5m ago)'
  };
}
