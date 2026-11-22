const BaseAdapter = require('./BaseAdapter');

class CromaAdapter extends BaseAdapter {
  constructor() {
    super('Croma Electronics', 'croma', 'https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final_icon/Croma_Logo_acrj95.svg');
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

    return `https://www.croma.com/searchB?q=${encodeURIComponent(query || 'electronics')}`;
  }

  async getProductPrice(productSpec, savedFeed = null) {
    if (savedFeed && savedFeed.cromaPrice && savedFeed.cromaPrice > 0) {
      return this.formatResponse({
        currentPrice: savedFeed.cromaPrice,
        originalPrice: savedFeed.cromaMahiPrice || Math.round(savedFeed.cromaPrice * 1.08),
        shippingCharges: savedFeed.cromaShipping || 0,
        availability: savedFeed.cromaInStock !== false ? 'In Stock (Tata Croma Direct)' : 'Store Pickup Only',
        productUrl: savedFeed.cromaUrl || this.generateProductUrl(productSpec),
        exactVariant: productSpec.variant || {},
        lastUpdated: savedFeed.lastVerified || new Date(),
        isVerified: true,
        deliveryTime: 'Store Pickup or 2-4 Days Delivery',
        rating: 4.4,
      });
    }

    const url = this.generateProductUrl(productSpec);
    return this.formatUnavailable(url, 'Awaiting Croma retail catalog sync');
  }
}

module.exports = CromaAdapter;
