const Product = require('../models/Product');
const PriceAlert = require('../models/PriceAlert');
const priceComparisonEngine = require('../services/priceComparison/PriceComparisonEngine');
const VariantMatcher = require('../services/priceComparison/VariantMatcher');

// @desc    Get Buyhatke-style multi-platform verified price comparison
// @route   GET /api/price-comparison/:productId
// @access  Public
exports.compareProductPrices = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const comparison = await priceComparisonEngine.compare(product);

    res.status(200).json(comparison);
  } catch (err) {
    next(err);
  }
};

// @desc    Search and compare product across platforms with variant isolation
// @route   GET or POST /api/price-comparison/search
// @access  Public
exports.searchAndCompare = async (req, res, next) => {
  try {
    const rawQuery = req.body?.query || req.query?.q || req.query?.query;
    const ram = req.body?.ram || req.query?.ram;
    const storage = req.body?.storage || req.query?.storage;
    const condition = req.body?.condition || req.query?.condition;

    if (!rawQuery || rawQuery.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const cleanQuery = rawQuery.trim();
    const searchRegex = new RegExp(cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    // Find products matching title or brand or model
    const products = await Product.find({
      $or: [
        { title: searchRegex },
        { brand: searchRegex },
        { modelNumber: searchRegex },
      ],
    }).limit(5);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No matching products found for "${cleanQuery}". Supported platforms: Amazon, Flipkart, Croma, Reliance Digital.`,
        supportedPlatforms: ['Amazon', 'Flipkart', 'Croma', 'Reliance Digital', 'Rentora Direct'],
      });
    }

    // Match exact variant if specified
    const targetSpec = {
      ram: ram || null,
      storage: storage || null,
      condition: condition || 'Brand New',
    };

    const targetProduct = products[0];
    const comparison = await priceComparisonEngine.compare(targetProduct);

    res.status(200).json({
      ...comparison,
      searchResultsCount: products.length,
      allMatchingProducts: products.map(p => ({
        id: p._id,
        title: p.title,
        price: p.buyPrice,
        image: p.images?.[0] || '',
        variant: p.variant,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Set price-drop notification alert
// @route   POST /api/price-comparison/alert
// @access  Public
exports.setPriceAlert = async (req, res, next) => {
  try {
    const { productId, email, targetPrice, currentLowestPrice, platformFound } = req.body;

    if (!productId || !email || !targetPrice) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, email address, and target price are required',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const alert = await PriceAlert.create({
      product: productId,
      user: req.user ? req.user._id : null,
      email: email.trim().toLowerCase(),
      targetPrice: Number(targetPrice),
      currentLowestPrice: Number(currentLowestPrice || product.buyPrice),
      platformFound: platformFound || 'Flipkart',
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: `Price drop alert activated! We will notify ${email} the moment the price drops to or below ₹${Number(targetPrice).toLocaleString('en-IN')}.`,
      alert,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Price History for charting
// @route   GET /api/price-comparison/:productId/history
// @access  Public
exports.getPriceHistory = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const comparison = await priceComparisonEngine.compare(product);

    res.status(200).json({
      success: true,
      productId: product._id,
      productTitle: product.title,
      priceHistory: comparison.priceHistory,
    });
  } catch (err) {
    next(err);
  }
};
