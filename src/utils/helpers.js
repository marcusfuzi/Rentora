// Currency Formatter for INR
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Calculate Rent vs Buy Metrics
export function calculateRentVsBuy(dailyRate, purchasePrice, durationDays = 30) {
  const daily = Number(dailyRate) || 0;
  const buy = Number(purchasePrice) || 0;
  const days = Math.max(1, Number(durationDays) || 1);

  const totalRentCost = daily * days;
  const breakEvenDays = daily > 0 ? Math.ceil(buy / daily) : 0;
  const recommendation = totalRentCost < buy ? 'RENT' : 'BUY';
  const savings = Math.abs(buy - totalRentCost);
  const percentageOfPurchase = buy > 0 ? Math.min(100, Math.round((totalRentCost / buy) * 100)) : 0;

  return {
    durationDays: days,
    dailyRate: daily,
    purchasePrice: buy,
    totalRentCost,
    breakEvenDays,
    recommendation,
    savings,
    percentageOfPurchase,
    advice:
      recommendation === 'RENT'
        ? `Renting for ${days} days saves you ${formatCurrency(savings)} compared to outright purchase.`
        : `Breakeven is reached at ${breakEvenDays} days. Purchasing outright is more economical for this duration.`
  };
}

// Date helpers
export function calculateDaysBetween(startDate, endDate) {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function getDaysRemaining(targetDate) {
  if (!targetDate) return 0;
  const target = new Date(targetDate);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Marketplace Categories
export const MARKETPLACE_CATEGORIES = [
  { id: 'All', name: 'All Categories', icon: 'Sparkles', count: 12 },
  { id: 'Electronics', name: 'Electronics', icon: 'Cpu', count: 3 },
  { id: 'Cameras', name: 'Cameras', icon: 'Camera', count: 2 },
  { id: 'Laptops', name: 'Laptops', icon: 'Laptop', count: 2 },
  { id: 'Gaming Consoles', name: 'Gaming Consoles', icon: 'Gamepad2', count: 1 },
  { id: 'Vehicles', name: 'Vehicles', icon: 'Bike', count: 1 },
  { id: 'Projectors', name: 'Projectors', icon: 'Projector', count: 1 },
  { id: 'Speakers', name: 'Speakers', icon: 'Speaker', count: 1 },
  { id: 'Drones', name: 'Drones', icon: 'Plane', count: 1 },
  { id: 'Tools and Equipment', name: 'Tools & Equipment', icon: 'Wrench', count: 1 },
  { id: 'Other Products', name: 'Other Products', icon: 'Package', count: 1 }
];
