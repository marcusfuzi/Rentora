const Rental = require('../models/Rental');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');

// Helper to generate unique rental number
const generateRentalNumber = () => {
  return `RNT-${Math.floor(100000 + Math.random() * 900000)}`;
};

// @desc    Submit a rental booking request
// @route   POST /api/rentals
// @access  Private (Customer)
exports.createRental = async (req, res, next) => {
  try {
    const { productId, startDate, endDate, deliveryAddress, tryBeforeYouBuy } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.listingType === 'sell_only') {
      return res.status(400).json({
        success: false,
        message: 'This product is only available for outright purchase, not rental.',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid start and return dates.',
      });
    }

    const durationDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    
    // Calculate total cost using daily rate or weekly/monthly tiers if applicable
    let dailyRate = product.rentPricePerDay || 500;
    let totalRentalCost = dailyRate * durationDays;
    
    // Apply discount tiers if booked for >= 7 days or >= 30 days
    if (durationDays >= 30 && product.rentPricePerMonth) {
      const months = Math.floor(durationDays / 30);
      const remainingDays = durationDays % 30;
      totalRentalCost = months * product.rentPricePerMonth + remainingDays * dailyRate;
    } else if (durationDays >= 7 && product.rentPricePerWeek) {
      const weeks = Math.floor(durationDays / 7);
      const remainingDays = durationDays % 7;
      totalRentalCost = weeks * product.rentPricePerWeek + remainingDays * dailyRate;
    }

    const securityDeposit = product.securityDeposit || Math.round((product.buyPrice || totalRentalCost * 4) * 0.2);
    const totalPaid = totalRentalCost + securityDeposit;

    const rentalNumber = generateRentalNumber();

    const rental = await Rental.create({
      rentalNumber,
      product: product._id,
      customer: req.user.id,
      seller: product.seller,
      startDate: start,
      endDate: end,
      durationDays,
      dailyRate,
      totalRentalCost,
      securityDeposit,
      totalPaid,
      status: 'pending', // Awaits seller approval
      lateFeePerDay: Math.round(dailyRate * 1.25),
      tryBeforeYouBuy: !!tryBeforeYouBuy,
      deliveryAddress: deliveryAddress || req.user.address,
    });

    // Record mock payment transaction
    await Payment.create({
      transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user: req.user.id,
      type: 'rental_payment',
      amount: totalPaid,
      referenceId: rental._id,
      referenceModel: 'Rental',
      status: 'success',
    });

    // Notify seller
    await Notification.create({
      user: product.seller,
      title: 'New Rental Request Received',
      message: `Customer ${req.user.name} requested to rent "${product.title}" for ${durationDays} days.`,
      type: 'rental_request',
      link: '/seller-dashboard.html',
    });

    res.status(201).json({
      success: true,
      message: 'Rental request submitted successfully! Awaiting seller approval.',
      rental,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get customer's rental history & active rentals
// @route   GET /api/rentals/my-rentals
// @access  Private (Customer)
exports.getMyRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.find({ customer: req.user.id })
      .populate('product')
      .populate('seller', 'name email sellerDetails avatar')
      .sort({ createdAt: -1 });

    // Check overdue status on active rentals
    for (const r of rentals) {
      const prevStatus = r.status;
      r.checkOverdue();
      if (r.isModified('status') || r.isModified('accumulatedLateFee')) {
        await r.save();
        if (r.status === 'overdue' && prevStatus !== 'overdue') {
          // Notify customer
          await Notification.create({
            user: r.customer,
            title: 'Rental Return Overdue Alert',
            message: `Your rental ${r.rentalNumber} for "${r.product.title}" is overdue. Please return it to prevent escalating late charges.`,
            type: 'overdue_alert',
            link: '/my-rentals.html',
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      count: rentals.length,
      rentals,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get seller's rental orders & requests
// @route   GET /api/rentals/seller-rentals
// @access  Private (Seller)
exports.getSellerRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.find({ seller: req.user.id })
      .populate('product')
      .populate('customer', 'name email phone avatar address')
      .sort({ createdAt: -1 });

    for (const r of rentals) {
      r.checkOverdue();
      if (r.isModified('status') || r.isModified('accumulatedLateFee')) {
        await r.save();
      }
    }

    res.status(200).json({
      success: true,
      count: rentals.length,
      rentals,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update rental request status (Approve / Reject)
// @route   PUT /api/rentals/:id/status
// @access  Private (Seller/Admin)
exports.updateRentalStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const rental = await Rental.findById(req.params.id)
      .populate('product')
      .populate('customer', 'name email');

    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }

    if (
      rental.seller.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    rental.status = status;
    if (adminNotes) rental.adminNotes = adminNotes;
    await rental.save();

    // Notify customer
    await Notification.create({
      user: rental.customer._id,
      title: `Rental Request ${status.toUpperCase()}`,
      message: `Your rental request for "${rental.product.title}" has been ${status}.`,
      type: status === 'approved' ? 'rental_approved' : 'rental_rejected',
      link: '/my-rentals.html',
    });

    res.status(200).json({
      success: true,
      message: `Rental status updated to ${status}`,
      rental,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Customer initiates rental return
// @route   POST /api/rentals/:id/return
// @access  Private (Customer)
exports.requestReturn = async (req, res, next) => {
  try {
    const rental = await Rental.findById(req.params.id).populate('product');

    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }

    if (rental.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    rental.status = 'return_requested';
    rental.actualReturnDate = new Date();
    await rental.save();

    // Notify seller
    await Notification.create({
      user: rental.seller,
      title: 'Return Initiated by Customer',
      message: `Customer initiated return for rental #${rental.rentalNumber} (${rental.product.title}). Please inspect product upon delivery.`,
      type: 'return_reminder',
      link: '/seller-dashboard.html',
    });

    res.status(200).json({
      success: true,
      message: 'Return initiated! Please pack the product securely for carrier pickup.',
      rental,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Seller completes return inspection and processes deposit refund
// @route   POST /api/rentals/:id/complete-return
// @access  Private (Seller/Admin)
exports.completeReturn = async (req, res, next) => {
  try {
    const { conditionOnReturn, damageAssessmentNotes, damageDeduction } = req.body;
    const rental = await Rental.findById(req.params.id).populate('product');

    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }

    if (
      rental.seller.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    rental.status = 'returned';
    rental.conditionOnReturn = conditionOnReturn || 'Good';
    rental.damageAssessmentNotes = damageAssessmentNotes || 'Product returned in good operational condition.';
    
    const deduction = Number(damageDeduction) || 0;
    rental.damageDeduction = deduction;

    // Calculate final refund = securityDeposit - lateFees - damageDeductions
    const refundAmount = Math.max(0, rental.securityDeposit - (rental.accumulatedLateFee || 0) - deduction);
    rental.depositRefundAmount = refundAmount;
    rental.securityDepositRefunded = true;
    rental.actualReturnDate = new Date();

    await rental.save();

    // Create deposit refund payment record
    if (refundAmount > 0) {
      await Payment.create({
        transactionId: `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        user: rental.customer,
        type: 'security_deposit_refund',
        amount: refundAmount,
        referenceId: rental._id,
        referenceModel: 'Rental',
        status: 'success',
      });
    }

    // Notify customer
    await Notification.create({
      user: rental.customer,
      title: 'Rental Return Completed & Deposit Refunded',
      message: `Inspection for "${rental.product.title}" complete. ₹${refundAmount.toLocaleString('en-IN')} has been refunded to your original payment method.`,
      type: 'payment_success',
      link: '/my-rentals.html',
    });

    res.status(200).json({
      success: true,
      message: 'Return inspection completed and security deposit refund processed.',
      rental,
      refundAmount,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Try-Before-You-Buy: Convert active rental to permanent purchase
// @route   POST /api/rentals/:id/convert-to-purchase
// @access  Private (Customer)
exports.convertToPurchase = async (req, res, next) => {
  try {
    const rental = await Rental.findById(req.params.id).populate('product');

    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }

    if (rental.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (rental.status !== 'active' && rental.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Only active or approved rentals can be converted to purchase.',
      });
    }

    const product = rental.product;
    if (!product.buyPrice || product.buyPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'This product does not have a buying price set.',
      });
    }

    // Rental cost already paid is credited towards purchase!
    // Customer also has their security deposit already held, which can be credited!
    const credit = rental.totalRentalCost + rental.securityDeposit;
    const finalAmountToPay = Math.max(0, product.buyPrice - credit);

    const orderNumber = `ORD-TBYB-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await Order.create({
      orderNumber,
      customer: req.user.id,
      seller: rental.seller,
      items: [
        {
          product: product._id,
          title: product.title,
          image: product.images[0] || '',
          quantity: 1,
          unitPrice: product.buyPrice,
          subtotal: product.buyPrice,
        },
      ],
      totalAmount: product.buyPrice,
      rentalCreditDiscount: credit,
      finalAmountPaid: finalAmountToPay,
      isTryBeforeYouBuyConversion: true,
      sourceRental: rental._id,
      orderStatus: 'delivered', // Customer already has the product!
      paymentStatus: 'completed',
      shippingAddress: rental.deliveryAddress,
    });

    // Mark rental as converted
    rental.status = 'converted_to_purchase';
    rental.convertedOrder = order._id;
    rental.securityDepositRefunded = true; // Absorbed into purchase
    await rental.save();

    // Record payment if additional amount was paid
    if (finalAmountToPay > 0) {
      await Payment.create({
        transactionId: `TXN-BUY-${Date.now()}`,
        user: req.user.id,
        type: 'buy_payment',
        amount: finalAmountToPay,
        referenceId: order._id,
        referenceModel: 'Order',
        status: 'success',
      });
    }

    // Notify seller
    await Notification.create({
      user: rental.seller,
      title: '🎉 Try-Before-You-Buy Conversion!',
      message: `Great news! Customer ${req.user.name} decided to keep and buy "${product.title}" permanently! Order #${orderNumber}`,
      type: 'payment_success',
      link: '/seller-dashboard.html',
    });

    res.status(200).json({
      success: true,
      message: `Congratulations! You now permanently own ${product.title}!`,
      order,
      rental,
    });
  } catch (err) {
    next(err);
  }
};
