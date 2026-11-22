/**
 * BaseAdapter - Abstract class for e-commerce price comparison adapters
 */
class BaseAdapter {
  constructor(platformName, platformId, logoUrl) {
    if (new.target === BaseAdapter) {
      throw new TypeError('Cannot construct BaseAdapter instances directly');
    }
    this.platformName = platformName;
    this.platformId = platformId;
    this.logoUrl = logoUrl || '';
  }

  /**
   * Fetch price and availability for a given product and exact variant specification
   * @param {Object} productSpec - { title, brand, modelNumber, variant: { ram, storage, color, generation, condition } }
   * @returns {Promise<Object>} Formatted platform comparison entry
   */
  async getProductPrice(productSpec) {
    throw new Error('Method getProductPrice() must be implemented by adapter subclass');
  }

  /**
   * Generate valid, direct redirect URL to the platform's product search or specific product page
   * @param {Object} productSpec
   * @returns {String} Full URL
   */
  generateProductUrl(productSpec) {
    throw new Error('Method generateProductUrl() must be implemented by adapter subclass');
  }

  /**
   * Helper to format standardized platform price response
   */
  formatResponse({
    currentPrice,
    originalPrice,
    shippingCharges = 0,
    availability = 'In Stock',
    productUrl,
    exactVariant = {},
    lastUpdated = new Date(),
    isVerified = true,
    deliveryTime = '2-4 Business Days',
    rating = 4.5,
    note = null,
  }) {
    const totalEffectivePrice = (currentPrice && currentPrice > 0) ? (currentPrice + shippingCharges) : 0;
    const discountPercent = (originalPrice && originalPrice > currentPrice && currentPrice > 0)
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

    return {
      platform: this.platformName,
      platformId: this.platformId,
      logoUrl: this.logoUrl,
      currentPrice: currentPrice || null,
      originalPrice: originalPrice || currentPrice || null,
      discountPercent,
      shippingCharges,
      totalEffectivePrice,
      availability: availability || (currentPrice ? 'In Stock' : 'Price unavailable'),
      productUrl: productUrl || this.generateProductUrl({ title: this.platformName }),
      exactVariant,
      lastUpdated,
      isVerified: Boolean(isVerified && currentPrice),
      deliveryTime,
      rating,
      note,
    };
  }

  /**
   * Fallback response when a price is unavailable or could not be verified
   */
  formatUnavailable(productUrl, reason = 'Price unavailable on official partner feed', lastKnown = null) {
    return {
      platform: this.platformName,
      platformId: this.platformId,
      logoUrl: this.logoUrl,
      currentPrice: lastKnown?.price || null,
      originalPrice: null,
      discountPercent: 0,
      shippingCharges: 0,
      totalEffectivePrice: lastKnown?.price || 0,
      availability: 'Price unavailable',
      productUrl: productUrl || '',
      exactVariant: {},
      lastUpdated: lastKnown?.date || new Date(),
      isVerified: false,
      deliveryTime: 'Check platform for live stock',
      rating: 4.2,
      note: reason,
      isLastKnown: Boolean(lastKnown?.price),
    };
  }
}

module.exports = BaseAdapter;
