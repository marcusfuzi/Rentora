const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, 'Please provide a review summary'],
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a detailed review'],
      maxlength: 1000,
    },
    rentalOrPurchase: {
      type: String,
      enum: ['rental', 'purchase'],
      default: 'rental',
    },
    verifiedBooking: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting multiple reviews on the exact same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to recalculate product average rating
reviewSchema.statics.getAverageRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    const Product = mongoose.model('Product');
    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        totalReviews: stats[0].totalReviews,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        rating: 4.8,
        totalReviews: 0,
      });
    }
  } catch (err) {
    console.error('Error updating product rating:', err);
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.product);
});

reviewSchema.post('remove', async function () {
  await this.constructor.getAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
