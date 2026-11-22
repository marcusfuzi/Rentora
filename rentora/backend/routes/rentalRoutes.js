const express = require('express');
const {
  createRental,
  getMyRentals,
  getSellerRentals,
  updateRentalStatus,
  requestReturn,
  completeReturn,
  convertToPurchase,
} = require('../controllers/rentalController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getMyRentals);
router.post('/', protect, createRental);
router.get('/my-rentals', protect, getMyRentals);
router.get('/seller-rentals', protect, authorize('seller', 'admin'), getSellerRentals);
router.put('/:id/status', protect, authorize('seller', 'admin'), updateRentalStatus);
router.post('/:id/return', protect, requestReturn);
router.post('/:id/extend', protect, (req, res) => res.json({ success: true, message: 'Rental extension requested' }));
router.post('/:id/complete-return', protect, authorize('seller', 'admin'), completeReturn);
router.post('/:id/convert-to-purchase', protect, convertToPurchase);

module.exports = router;
