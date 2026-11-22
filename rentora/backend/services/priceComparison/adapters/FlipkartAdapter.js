const BaseAdapter = require('./BaseAdapter');

class FlipkartAdapter extends BaseAdapter {
  constructor() {
    super('Flipkart', 'flipkart', 'https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png');
  }

  generateProductUrl(productSpec) {
    if (productSpec.flipkartPid) {
      return `https://www.flipkart.com/product/p/itme?pid=${productSpec.flipkartPid}`;
    }
    const query = [
      productSpec.brand,
      productSpec.title || '',
      productSpec.variant?.ram ? `${productSpec.variant.ram}` : '',
      productSpec.variant?.storage ? `${productSpec.variant.storage}` : '',
      productSpec.variant?.color ? `${productSpec.variant.color}` : '',
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    return `https://www.flipkart.com/search?q=${encodeURIComponent(query || 'electronics')}`;
  }

  async getProductPrice(productSpec, savedFeed = null) {
    if (savedFeed && savedFeed.flipkartPrice && savedFeed.flipkartPrice > 0) {
      return this.formatResponse({
        currentPrice: savedFeed.flipkartPrice,
        originalPrice: savedFeed.flipkartMahiPrice || Math.round(savedFeed.flipkartPrice * 1.12),
        shippingCharges: savedFeed.flipkartShipping || 0,
        availability: savedFeed.flipkartInStock !== false ? 'In Stock (Flipkart Assured)' : 'Out of Stock',
        productUrl: savedFeed.flipkartUrl || this.generateProductUrl(productSpec),
        exactVariant: productSpec.variant || {},
        lastUpdated: savedFeed.lastVerified || new Date(),
        isVerified: true,
        deliveryTime: '2-3 Days SuperCoins Express',
        rating: 4.5,
      });
    }

    const url = this.generateProductUrl(productSpec);
    return this.formatUnavailable(url, 'Awaiting Flipkart authorized feed sync');
  }
}

module.exports = FlipkartAdapter;
