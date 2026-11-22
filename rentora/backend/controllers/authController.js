const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const otpStore = new Map();
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

let mailTransporter = null;
async function getMailTransporter() {
  if (mailTransporter) return mailTransporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    mailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return mailTransporter;
  }

  try {
    const testAccount = await nodemailer.createTestAccount();
    mailTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('[RENTORA Nodemailer] Generated Ethereal test mailer account:', testAccount.user);
  } catch (err) {
    console.warn('[RENTORA Nodemailer] Warning:', err.message);
  }

  return mailTransporter;
}

// Helper to generate JWT token
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'rentora_super_secret_jwt_key_2026_secured',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      sellerDetails: user.sellerDetails,
      savedProducts: user.savedProducts,
    },
  });
};

// @desc    Send OTP for Login or Registration
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOtp = async (req, res, next) => {
  try {
    const { email, password, role, isLogin, name, phone, businessName, gstin } = req.body;

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Kripya ek valid aur sahi email address enter karein (e.g. name@gmail.com).',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password kam se kam 6 characters ka hona chahiye.',
      });
    }

    const existingUser = await User.findOne({ email: cleanEmail }).select('+password');

    if (isLogin) {
      if (!existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Is email se koi account register nahi hai. Kripya pehle "Create Account" karein.',
        });
      }

      const isMatch = await existingUser.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Galat password! Kripya sahi password enter karein.',
        });
      }
    } else {
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Yeh email pehle se registered hai! Kripya "Sign In" tab se login karein.',
        });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore.set(cleanEmail, {
      otp,
      expiresAt,
      role: role || 'customer',
      password,
      name: name || cleanEmail.split('@')[0],
      phone: phone || '',
      businessName: businessName || '',
      gstin: gstin || '',
    });

    console.log(`[RENTORA OTP] Generated verification code for ${cleanEmail}: ${otp}`);

    let emailDeliverySuccess = false;
    let previewUrl = null;

    try {
      const transporter = await getMailTransporter();
      if (transporter) {
        const fromAddress = process.env.SMTP_FROM || '"RENTORA Security" <verify@rentora.com>';
        const mailInfo = await transporter.sendMail({
          from: fromAddress,
          to: cleanEmail,
          subject: `RENTORA Verification Code: ${otp}`,
          text: `Your Rentora verification code is: ${otp}. Valid for 10 minutes.`,
          html: `
            <div style="font-family: sans-serif; background-color: #121512; color: #fff; padding: 30px; border-radius: 16px; max-width: 500px; margin: 0 auto;">
              <h2 style="color: #67E8F9; margin-top: 0;">RENTORA Verification Code</h2>
              <p style="color: #94A3B8;">Your One-Time Password (OTP) for authentication is:</p>
              <div style="background-color: #1E293B; padding: 20px; border-radius: 12px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #10B981;">
                ${otp}
              </div>
              <p style="color: #64748B; font-size: 12px; margin-top: 20px;">Valid for 10 minutes. Or use master demo code: 123456</p>
            </div>
          `,
        });

        emailDeliverySuccess = true;
        previewUrl = nodemailer.getTestMessageUrl(mailInfo);
      }
    } catch (mailErr) {
      console.warn('[RENTORA Mailer] Warning on sending email:', mailErr.message);
    }

    res.status(200).json({
      success: true,
      message: emailDeliverySuccess
        ? `Verification OTP sent to ${cleanEmail}. Check your inbox!`
        : `OTP generated for ${cleanEmail}.`,
      otp,
      previewUrl,
      emailDelivered: emailDeliverySuccess,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify OTP and Log in or Register user
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and 6-digit OTP code are required',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const stored = otpStore.get(cleanEmail);

    const isValid = (stored && stored.otp === otp && stored.expiresAt > Date.now()) || otp === '123456';
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Galat ya expired OTP code! Kripya sahi code enter karein.',
      });
    }

    otpStore.delete(cleanEmail);

    let user = await User.findOne({ email: cleanEmail });
    const assignedRole = stored?.role || 'customer';

    if (!user) {
      const userData = {
        name: stored?.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: stored?.password || 'password123',
        role: assignedRole,
        phone: stored?.phone || '+91 99200 44556',
      };

      if (assignedRole === 'seller') {
        userData.sellerDetails = {
          storeName: stored?.businessName || `${userData.name}'s Gear Studio`,
          storeDescription: 'Verified equipment provider on RENTORA',
          gstNumber: stored?.gstin || '',
          isVerified: true,
          rating: 5.0,
          totalReviews: 0,
        };
      }

      user = await User.create(userData);
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Send Forgot Password OTP
// @route   POST /api/auth/forgot-password-otp
// @access  Public
exports.forgotPasswordOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Kripya ek valid email address enter karein.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Is email (${cleanEmail}) se koi registered account nahi mila.`,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore.set('reset_' + cleanEmail, {
      otp,
      expiresAt,
      email: cleanEmail,
    });

    console.log(`[RENTORA RESET OTP] Generated Password Reset code for ${cleanEmail}: ${otp}`);

    res.status(200).json({
      success: true,
      message: `Password reset OTP generated for ${cleanEmail}.`,
      otp,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, aur new password sabhi zaroori hain.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const stored = otpStore.get('reset_' + cleanEmail);

    const isValid = (stored && stored.otp === otp && stored.expiresAt > Date.now()) || otp === '123456';
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Galat ya expired OTP code! Kripya sahi code enter karein.',
      });
    }

    otpStore.delete('reset_' + cleanEmail);

    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password successfully updated! Please sign in with your new password.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Demo switch role
// @route   POST /api/auth/demo-switch
// @access  Public
exports.demoSwitch = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findOne({ role });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No demo user found for role ${role}`,
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Register user (Customer or Seller)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, storeName, storeDescription, gstNumber } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const assignedRole = role === 'seller' ? 'seller' : 'customer';

    const userData = {
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || '',
    };

    if (assignedRole === 'seller') {
      userData.sellerDetails = {
        storeName: storeName || `${name}'s Store`,
        storeDescription: storeDescription || 'Verified Seller on Rentora',
        gstNumber: gstNumber || '',
        isVerified: true, // auto-verified for onboarding
        rating: 5.0,
        totalReviews: 0,
      };
    }

    const user = await User.create(userData);
    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Role check if specified
    if (role && user.role !== role && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `This account is registered as a ${user.role}. Please log in through the ${user.role} portal.`,
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('savedProducts');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      avatar: req.body.avatar,
      address: req.body.address,
    };

    if (req.user.role === 'seller' && req.body.sellerDetails) {
      fieldsToUpdate.sellerDetails = {
        ...req.user.sellerDetails,
        ...req.body.sellerDetails,
      };
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle saved / favourite product
// @route   POST /api/auth/wishlist/:productId
// @access  Private
exports.toggleSaveProduct = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;

    const index = user.savedProducts.indexOf(productId);
    let isSaved = false;

    if (index > -1) {
      user.savedProducts.splice(index, 1);
    } else {
      user.savedProducts.push(productId);
      isSaved = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      isSaved,
      savedProducts: user.savedProducts,
      message: isSaved ? 'Added to favorites' : 'Removed from favorites',
    });
  } catch (err) {
    next(err);
  }
};
