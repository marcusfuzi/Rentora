const BaseAdapter = require('./BaseAdapter');

class RelianceDigitalAdapter extends BaseAdapter {
  constructor() {
    super('Reliance Digital', 'reliance', 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg');
  }

  generateProductUrl(productSpec) {
    const query = [
      productSpec.brand,
      productSpec.title || '',
      productSpec.variant?.ram ? `${productSpec.variant.ram}` : '',
      productSpec.variant?.storage ? `${productSpec.variant.storage}` : '',
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    return `https://www.reliancedigital.in/search?q=${encodeURIComponent(query || 'electronics')}`;
  }

  async getProductPrice(productSpec, savedFeed = null) {
    if (savedFeed && savedFeed.reliancePrice && savedFeed.reliancePrice > 0) {
      return this.formatResponse({
        currentPrice: savedFeed.reliancePrice,
        originalPrice: savedFeed.relianceMahiPrice || Math.round(savedFeed.reliancePrice * 1.1),
        shippingCharges: savedFeed.relianceShipping || 0,
        availability: savedFeed.relianceInStock !== false ? 'In Stock (Reliance ResQ)' : 'Limited City Stock',
        productUrl: savedFeed.relianceUrl || this.generateProductUrl(productSpec),
        exactVariant: productSpec.variant || {},
        lastUpdated: savedFeed.lastVerified || new Date(),
        isVerified: true,
        deliveryTime: 'Same Day / Next Day ResQ Delivery',
        rating: 4.4,
      });
    }

    const url = this.generateProductUrl(productSpec);
    return this.formatUnavailable(url, 'Awaiting Reliance Digital network sync');
  }
}

module.exports = RelianceDigitalAdapter;
