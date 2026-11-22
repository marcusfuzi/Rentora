const User = require('../models/User');
const Product = require('../models/Product');
const Rental = require('../models/Rental');
const Order = require('../models/Order');
const SellerVerification = require('../models/SellerVerification');

// @desc    Get Admin platform analytics & metrics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalProducts = await Product.countDocuments();
    const activeRentals = await Rental.countDocuments({ status: 'active' });
    const overdueRentals = await Rental.countDocuments({ status: 'overdue' });
    const escalatedRentals = await Rental.countDocuments({ isEscalatedToAdmin: true });
    const totalOrders = await Order.countDocuments();

    // Calculate platform GMV / Revenue
    const rentalRevenueAgg = await Rental.aggregate([
      { $match: { status: { $in: ['active', 'returned', 'converted_to_purchase', 'return_requested'] } } },
      { $group: { _id: null, total: { $sum: '$totalRentalCost' } } },
    ]);
    const orderRevenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$finalAmountPaid' } } },
    ]);

    const rentalRevenue = rentalRevenueAgg[0]?.total || 0;
    const orderRevenue = orderRevenueAgg[0]?.total || 0;
    const totalGrossVolume = rentalRevenue + orderRevenue;

    // Platform fee cut estimate (10%)
    const platformEarnings = Math.round(totalGrossVolume * 0.1);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCustomers,
        totalSellers,
        totalProducts,
        activeRentals,
        overdueRentals,
        escalatedRentals,
        totalOrders,
        rentalRevenue,
        orderRevenue,
        totalGrossVolume,
        platformEarnings,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all rentals with filtering for overdue & escalations
// @route   GET /api/admin/rentals
// @access  Private (Admin)
exports.getAllRentals = async (req, res, next) => {
  try {
    const { status, escalated } = req.query;
    const query = {};

    if (status) query.status = status;
    if (escalated === 'true') query.isEscalatedToAdmin = true;

    const rentals = await Rental.find(query)
      .populate('product')
      .populate('customer', 'name email phone')
      .populate('seller', 'name email phone sellerDetails')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rentals.length,
      rentals,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Resolve overdue rental or dispute
// @route   PUT /api/admin/rentals/:id/resolve
// @access  Private (Admin)
exports.resolveEscalation = async (req, res, next) => {
  try {
    const { adminNotes, newStatus } = req.body;
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }

    rental.isEscalatedToAdmin = false;
    rental.adminNotes = adminNotes || 'Admin intervention completed and resolved.';
    if (newStatus) rental.status = newStatus;
    await rental.save();

    res.status(200).json({
      success: true,
      message: 'Rental escalation resolved by admin',
      rental,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    List seller verification applications
// @route   GET /api/admin/verifications
// @access  Private (Admin)
exports.getSellerVerifications = async (req, res, next) => {
  try {
    const verifications = await SellerVerification.find()
      .populate('seller', 'name email sellerDetails')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: verifications.length,
      verifications,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Review seller verification
// @route   PUT /api/admin/verifications/:id
// @access  Private (Admin)
exports.reviewSellerVerification = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const verification = await SellerVerification.findById(req.params.id);

    if (!verification) {
      return res.status(404).json({ success: false, message: 'Verification application not found' });
    }

    verification.status = status;
    verification.adminNotes = adminNotes || '';
    verification.reviewedBy = req.user.id;
    verification.reviewedAt = new Date();
    await verification.save();

    if (status === 'verified') {
      await User.findByIdAndUpdate(verification.seller, {
        'sellerDetails.isVerified': true,
      });
    }

    res.status(200).json({
      success: true,
      message: `Seller verification status set to ${status}`,
      verification,
    });
  } catch (err) {
    next(err);
  }
};
