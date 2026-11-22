const express = require('express');
const {
  register,
  login,
  sendOtp,
  verifyOtp,
  forgotPasswordOtp,
  resetPassword,
  demoSwitch,
  getMe,
  updateProfile,
  toggleSaveProduct,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password-otp', forgotPasswordOtp);
router.post('/reset-password', resetPassword);
router.post('/demo-switch', demoSwitch);

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/wishlist/:productId', protect, toggleSaveProduct);

module.exports = router;
