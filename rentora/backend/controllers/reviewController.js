const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Submit a product review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment, rentalOrPurchase } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if already reviewed
    const existing = await Review.findOne({ product: productId, user: req.user.id });
    if (existing) {
      existing.rating = rating;
      existing.title = title;
      existing.comment = comment;
      existing.rentalOrPurchase = rentalOrPurchase || 'rental';
      await existing.save();

      return res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        review: existing,
      });
    }

    const review = await Review.create({
      product: productId,
      user: req.user.id,
      rating: Number(rating),
      title,
      comment,
      rentalOrPurchase: rentalOrPurchase || 'rental',
      verifiedBooking: true,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};
