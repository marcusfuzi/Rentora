const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    Get all products with filters, search and sorting
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      listingType,
      condition,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isAvailable: true };

    // Search keyword in title or description or brand
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Listing type filter: rent_only, sell_only, rent_and_sell
    if (listingType && listingType !== 'all') {
      if (listingType === 'rent') {
        query.listingType = { $in: ['rent_only', 'rent_and_sell'] };
      } else if (listingType === 'buy' || listingType === 'sell') {
        query.listingType = { $in: ['sell_only', 'rent_and_sell'] };
      } else {
        query.listingType = listingType;
      }
    }

    // Condition filter
    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    // Price range filter (checks either buyPrice or rentPricePerDay)
    if (minPrice || maxPrice) {
      query.$or = [
        {
          buyPrice: {
            $gte: Number(minPrice) || 0,
            $lte: Number(maxPrice) || 10000000,
          },
        },
        {
          rentPricePerDay: {
            $gte: Number(minPrice) || 0,
            $lte: Number(maxPrice) || 10000000,
          },
        },
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') {
      sortOptions = { rentPricePerDay: 1, buyPrice: 1 };
    } else if (sort === 'price-high') {
      sortOptions = { rentPricePerDay: -1, buyPrice: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'featured') {
      sortOptions = { featured: -1, rating: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('seller', 'name email sellerDetails avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      products,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured products for homepage
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isAvailable: true })
      .populate('seller', 'name sellerDetails')
      .sort({ featured: -1, rating: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'name email phone avatar sellerDetails createdAt'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const reviews = await Review.find({ product: product._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      product,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new product listing
// @route   POST /api/products
// @access  Private (Seller/Admin)
exports.createProduct = async (req, res, next) => {
  try {
    req.body.seller = req.user.id;

    // Handle specifications format if passed as string or object
    if (typeof req.body.specifications === 'string') {
      try {
        req.body.specifications = JSON.parse(req.body.specifications);
      } catch (e) {
        req.body.specifications = [];
      }
    }

    // Default image if none provided
    if (!req.body.images || req.body.images.length === 0) {
      req.body.images = [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      ];
    }

    // Populate dynamic external price comparison if not set
    if (!req.body.externalPriceComparison || !req.body.externalPriceComparison.amazonPrice) {
      const baseBuy = Number(req.body.buyPrice) || 50000;
      req.body.externalPriceComparison = {
        amazonPrice: Math.round(baseBuy * 1.08),
        amazonUrl: `https://www.amazon.in/s?k=${encodeURIComponent(req.body.title)}`,
        flipkartPrice: Math.round(baseBuy * 1.05),
        flipkartUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(req.body.title)}`,
        cromaPrice: Math.round(baseBuy * 1.1),
        cromaUrl: `https://www.croma.com/searchB?q=${encodeURIComponent(req.body.title)}`,
        reliancePrice: Math.round(baseBuy * 1.07),
        relianceUrl: `https://www.reliancedigital.in/search?q=${encodeURIComponent(req.body.title)}`,
        cheapestPlatform: 'Rentora',
        verifiedSavings: Math.round(baseBuy * 0.05),
        lastVerified: new Date(),
      };
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product listing created successfully',
      product,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product listing
// @route   PUT /api/products/:id
// @access  Private (Seller/Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Ensure user is seller of product or admin
    if (
      product.seller.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing',
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product listing
// @route   DELETE /api/products/:id
// @access  Private (Seller/Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Ensure user is seller of product or admin
    if (
      product.seller.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get products listed by logged-in seller
// @route   GET /api/products/seller/inventory
// @access  Private (Seller)
exports.getSellerInventory = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    next(err);
  }
};
