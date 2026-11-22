const express = require('express');
const {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  getAllRentals,
  resolveEscalation,
  getSellerVerifications,
  reviewSellerVerification,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/rentals', getAllRentals);
router.put('/rentals/:id/resolve', resolveEscalation);
router.get('/verifications', getSellerVerifications);
router.put('/verifications/:id', reviewSellerVerification);

module.exports = router;
