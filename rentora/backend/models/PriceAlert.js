const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    email: {
      type: String,
      required: [true, 'Please provide an alert destination email'],
      lowercase: true,
      trim: true,
    },
    targetPrice: {
      type: Number,
      required: true,
    },
    currentLowestPrice: {
      type: Number,
      required: true,
    },
    platformFound: {
      type: String,
      default: 'Flipkart',
    },
    status: {
      type: String,
      enum: ['active', 'triggered', 'cancelled'],
      default: 'active',
    },
    lastChecked: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PriceAlert', priceAlertSchema);
