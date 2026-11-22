const express = require('express');
const {
  createOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getMyOrders);
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/seller-orders', protect, authorize('seller', 'admin'), getSellerOrders);
router.put('/:id/status', protect, authorize('seller', 'admin'), updateOrderStatus);

module.exports = router;
