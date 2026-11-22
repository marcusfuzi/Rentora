const Order = require('../models/Order');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

// @desc    Create new outright purchase order
// @route   POST /api/orders
// @access  Private (Customer)
exports.createOrder = async (req, res, next) => {
  try {
    const { productId, quantity = 1, paymentMethod = 'upi', shippingAddress } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.listingType === 'rent_only') {
      return res.status(400).json({
        success: false,
        message: 'This product is only available for rental.',
      });
    }

    const qty = Math.max(1, Number(quantity));
    const subtotal = product.buyPrice * qty;
    const totalAmount = subtotal;
    const finalAmountPaid = totalAmount;

    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await Order.create({
      orderNumber,
      customer: req.user.id,
      seller: product.seller,
      items: [
        {
          product: product._id,
          title: product.title,
          image: product.images[0] || '',
          quantity: qty,
          unitPrice: product.buyPrice,
          subtotal,
        },
      ],
      totalAmount,
      finalAmountPaid,
      paymentMethod,
      paymentStatus: 'completed',
      orderStatus: 'confirmed',
      shippingAddress: shippingAddress || req.user.address,
    });

    // Record payment
    await Payment.create({
      transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user: req.user.id,
      type: 'buy_payment',
      amount: finalAmountPaid,
      referenceId: order._id,
      referenceModel: 'Order',
      status: 'success',
      paymentMethod,
    });

    // Notify seller
    await Notification.create({
      user: product.seller,
      title: 'New Product Purchase Order!',
      message: `Customer ${req.user.name} placed order #${orderNumber} for ${qty}x "${product.title}" (₹${finalAmountPaid.toLocaleString('en-IN')}).`,
      type: 'order_status',
      link: '/seller-dashboard.html',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get customer purchase history
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('items.product')
      .populate('seller', 'name email sellerDetails')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get seller's orders
// @route   GET /api/orders/seller-orders
// @access  Private (Seller)
exports.getSellerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ seller: req.user.id })
      .populate('items.product')
      .populate('customer', 'name email phone address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order shipping/delivery status
// @route   PUT /api/orders/:id/status
// @access  Private (Seller/Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (
      order.seller.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();

    // Notify customer
    await Notification.create({
      user: order.customer,
      title: `Order Status Updated: ${orderStatus.toUpperCase()}`,
      message: `Your order #${order.orderNumber} is now ${orderStatus}. ${trackingNumber ? `Tracking ID: ${trackingNumber}` : ''}`,
      type: 'order_status',
      link: '/customer-dashboard.html',
    });

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order,
    });
  } catch (err) {
    next(err);
  }
};
