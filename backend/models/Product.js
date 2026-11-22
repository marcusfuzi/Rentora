const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a product title'],
      trim: true,
      maxlength: [160, 'Title cannot exceed 160 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: [
        'Cameras & Lenses',
        'Laptops & Computers',
        'Gaming & VR',
        'Audio & Headphones',
        'Drones & Action Cams',
        'Smartphones & Tablets',
        'Appliances & Gear',
        'Other'
      ],
    },
    brand: {
      type: String,
      required: [true, 'Please specify the brand'],
      trim: true,
    },
    modelNumber: {
      type: String,
      default: '',
    },
    condition: {
      type: String,
      enum: ['Brand New', 'Like New', 'Gently Used', 'Refurbished'],
      default: 'Like New',
    },
    images: {
      type: [String],
      validate: [arrayLimit, '{PATH} must have at least one image'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listingType: {
      type: String,
      enum: ['rent_only', 'sell_only', 'rent_and_sell'],
      default: 'rent_and_sell',
    },
    buyPrice: {
      type: Number,
      default: 0,
    },
    rentPricePerDay: {
      type: Number,
      default: 0,
    },
    rentPricePerWeek: {
      type: Number,
      default: 0,
    },
    rentPricePerMonth: {
      type: Number,
      default: 0,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    stockQuantity: {
      type: Number,
      default: 1,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    tryBeforeYouBuyEnabled: {
      type: Boolean,
      default: true,
    },
    variant: {
      ram: { type: String, default: '' },
      storage: { type: String, default: '' },
      color: { type: String, default: '' },
      generation: { type: String, default: '' },
      condition: { type: String, default: 'Brand New' },
    },
    asin: { type: String, default: '' },
    flipkartPid: { type: String, default: '' },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    priceHistory: [
      {
        date: { type: String },
        label: { type: String },
        amazon: { type: Number },
        flipkart: { type: Number },
        croma: { type: Number },
        reliance: { type: Number },
        rentora: { type: Number },
      },
    ],
    externalPriceComparison: {
      amazonPrice: { type: Number, default: 0 },
      amazonMahiPrice: { type: Number, default: 0 },
      amazonShipping: { type: Number, default: 0 },
      amazonInStock: { type: Boolean, default: true },
      amazonUrl: { type: String, default: 'https://amazon.in' },
      flipkartPrice: { type: Number, default: 0 },
      flipkartMahiPrice: { type: Number, default: 0 },
      flipkartShipping: { type: Number, default: 0 },
      flipkartInStock: { type: Boolean, default: true },
      flipkartUrl: { type: String, default: 'https://flipkart.com' },
      cromaPrice: { type: Number, default: 0 },
      cromaMahiPrice: { type: Number, default: 0 },
      cromaShipping: { type: Number, default: 0 },
      cromaInStock: { type: Boolean, default: true },
      cromaUrl: { type: String, default: 'https://croma.com' },
      reliancePrice: { type: Number, default: 0 },
      relianceMahiPrice: { type: Number, default: 0 },
      relianceShipping: { type: Number, default: 0 },
      relianceInStock: { type: Boolean, default: true },
      relianceUrl: { type: String, default: 'https://reliancedigital.in' },
      lastVerified: { type: Date, default: Date.now },
      cheapestPlatform: { type: String, default: 'Rentora' },
      verifiedSavings: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length > 0;
}

// Auto-calculate weekly and monthly rental if not provided
productSchema.pre('save', function (next) {
  if (this.rentPricePerDay > 0) {
    if (!this.rentPricePerWeek || this.rentPricePerWeek === 0) {
      // 15% discount for weekly
      this.rentPricePerWeek = Math.round(this.rentPricePerDay * 7 * 0.85);
    }
    if (!this.rentPricePerMonth || this.rentPricePerMonth === 0) {
      // 30% discount for monthly
      this.rentPricePerMonth = Math.round(this.rentPricePerDay * 30 * 0.7);
    }
  }
  if (!this.securityDeposit && this.buyPrice > 0) {
    // 20% security deposit standard
    this.securityDeposit = Math.round(this.buyPrice * 0.2);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
