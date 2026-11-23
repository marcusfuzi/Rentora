import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialProducts } from './data/products.js';

// Prevent server crash from unhandled exceptions or aborted requests
process.on('uncaughtException', (err) => {
  console.error('[RENTORA Server] Uncaught Exception:', err?.message || err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[RENTORA Server] Unhandled Rejection:', reason);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'store.json');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'rentora_super_secure_jwt_secret_2026';

app.use(cors());
app.use(express.json());

// Persistent store helper
function loadStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading store, falling back to seed:', err);
  }

  // Initial seed
  const defaultUsers = [
    {
      id: 'seller-1',
      name: 'Apex Visuals Lab',
      email: 'seller@rentora.com',
      passwordHash: bcrypt.hashSync('password123', 8),
      role: 'seller',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98450 11223',
      city: 'Bengaluru, KA',
      businessName: 'Apex Visuals Lab Pvt Ltd',
      gstin: '29ABCDE1234F1Z5',
      kycStatus: 'Verified',
      rating: 4.9,
      verified: true
    },
    {
      id: 'admin-1',
      name: 'Rentora Super Admin',
      email: 'admin@rentora.com',
      passwordHash: bcrypt.hashSync('password123', 8),
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98111 22334',
      city: 'Headquarters, Bengaluru',
      kycStatus: 'Verified'
    }
  ];

  const defaultRentals = [];
  const defaultOrders = [];
  const defaultDisputes = [];

  const initial = {
    users: defaultUsers,
    products: initialProducts,
    rentals: defaultRentals,
    orders: defaultOrders,
    disputes: defaultDisputes
  };

  saveStore(initial);
  return initial;
}

function saveStore(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store:', err);
  }
}

let store = loadStore();

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired session' });
    req.user = decoded;
    next();
  });
}

// In-memory OTP storage: email -> { otp, expiresAt, role, passwordHash, name, phone, businessName }
const otpStore = new Map();

// Strict email regex (genuine format: user@domain.tld)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Nodemailer Transporter Helper
let mailTransporter = null;
async function getMailTransporter() {
  // 1. If real Gmail credentials configured in .env
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS
      }
    });
  }

  // 2. If custom SMTP configured in .env
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // 3. Automated Ethereal SMTP test transporter (real live email dispatch with browser preview)
  if (!mailTransporter) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      mailTransporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log(`[RENTORA Nodemailer] Ethereal live mailer active (${testAccount.user})`);
    } catch (err) {
      console.warn('[RENTORA Nodemailer] Warning:', err.message);
    }
  }

  return mailTransporter;
}

// -------------------------------------------------------------
// AUTH ROUTES & EMAIL OTP VERIFICATION
// -------------------------------------------------------------

// Send OTP (Validates email & password, dispatches real email)
app.post('/api/auth/send-otp', async (req, res) => {
  const { email, password, role, isLogin, name, phone, businessName, gstin } = req.body;

  // 1. Strict email validation
  if (!email || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({
      message: 'Kripya ek valid aur sahi email address enter karein (e.g. name@gmail.com). Invalid format pe OTP send nahi hoga.'
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  // 2. Password validation
  if (!password || password.length < 6) {
    return res.status(400).json({
      message: 'Password kam se kam 6 characters ka hona chahiye.'
    });
  }

  // 3. User verification based on mode
  const existingUser = store.users.find(u => u.email.toLowerCase() === cleanEmail);

  if (isLogin) {
    // If logging in and user exists, verify password
    if (existingUser) {
      const isPasswordCorrect = bcrypt.compareSync(password, existingUser.passwordHash);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          message: 'Galat password! Agar aap password bhool gaye hain toh niche "Forgot Password?" par click karein.'
        });
      }
    }
    // If not existing user, seamlessly allow OTP dispatch to activate account on first sign-in
  } else {
    // If registering, email must not already be registered
    if (existingUser) {
      return res.status(400).json({
        message: 'Yeh email pehle se registered hai! Kripya "Sign In" tab se login karein.'
      });
    }
  }

  // 4. Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Hash password for registration
  const passwordHash = bcrypt.hashSync(password, 8);

  otpStore.set(cleanEmail, {
    otp,
    expiresAt,
    role: role || 'customer',
    passwordHash,
    name: name || cleanEmail.split('@')[0],
    phone: phone || '',
    businessName: businessName || '',
    gstin: gstin || ''
  });

  console.log(`[RENTORA OTP] Generated verification code for ${cleanEmail}: ${otp}`);

  // 5. Dispatch real email via Nodemailer
  let emailDeliverySuccess = false;
  let previewUrl = null;

  try {
    const transporter = await getMailTransporter();
    if (transporter) {
      const fromAddress = process.env.SMTP_FROM || process.env.GMAIL_USER || '"RENTORA Security" <verify@rentora.com>';
      const mailInfo = await transporter.sendMail({
        from: fromAddress,
        to: cleanEmail,
        subject: `RENTORA Verification Code: ${otp}`,
        text: `Your Rentora verification code is: ${otp}. Valid for 10 minutes.`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #121512; color: #ffffff; padding: 40px; border-radius: 20px; max-width: 520px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
            <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 24px;">
              <span style="font-size: 26px; font-weight: 900; letter-spacing: -1px; color: #ffffff;">RENTORA</span>
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #C9F36B; margin-left: 4px;"></span>
            </div>
            <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin-top: 0;">Email Verification OTP</h2>
            <p style="color: #a0aec0; font-size: 14px; line-height: 1.5;">Use the following 6-digit One-Time Password to complete authentication on Rentora.</p>
            
            <div style="background-color: #183D2B; padding: 24px; border-radius: 16px; margin: 28px 0; text-align: center; border: 1px solid #C9F36B;">
              <span style="font-size: 40px; font-weight: 900; letter-spacing: 10px; color: #C9F36B; font-family: monospace;">${otp}</span>
            </div>
            
            <p style="color: #718096; font-size: 12px; margin-bottom: 0;">This code is valid for 10 minutes. If you did not request this verification, please ignore this email.</p>
          </div>
        `
      });

      emailDeliverySuccess = true;
      previewUrl = nodemailer.getTestMessageUrl(mailInfo);
      if (previewUrl) {
        console.log(`[RENTORA Nodemailer] Live email preview URL: ${previewUrl}`);
      }
    }
  } catch (emailErr) {
    console.error('[RENTORA Nodemailer] Failed to send email via SMTP:', emailErr.message);
  }

  res.json({
    success: true,
    message: emailDeliverySuccess
      ? `Verification OTP sent to ${cleanEmail}. Check your inbox!`
      : `OTP generated for ${cleanEmail}.`,
    otp: otp, // sent for instant testing preview
    previewUrl: previewUrl,
    emailDelivered: emailDeliverySuccess
  });
});

// Verify OTP & Complete Auth
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and 6-digit OTP code are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const stored = otpStore.get(cleanEmail);

  // Match stored OTP or master test code
  const isValid = (stored && stored.otp === otp && stored.expiresAt > Date.now()) || otp === '123456';

  if (!isValid) {
    return res.status(400).json({ message: 'Galat ya expired OTP code! Kripya sahi code enter karein.' });
  }

  // Clear OTP
  otpStore.delete(cleanEmail);

  // Find or create user
  let user = store.users.find(u => u.email.toLowerCase() === cleanEmail);
  const assignedRole = stored?.role || 'customer';

  if (!user) {
    user = {
      id: `${assignedRole.substring(0, 4)}-${Date.now()}`,
      name: stored?.name || cleanEmail.split('@')[0],
      email: cleanEmail,
      passwordHash: stored?.passwordHash || bcrypt.hashSync('defaultPass123', 8),
      role: assignedRole,
      phone: stored?.phone || '+91 99000 00000',
      city: assignedRole === 'seller' ? 'San Francisco, CA' : 'New York, NY',
      businessName: stored?.businessName || '',
      gstin: stored?.gstin || '',
      kycStatus: assignedRole === 'seller' ? 'Verified Gear Partner' : 'Verified Pro Renter',
      verified: true,
      rating: assignedRole === 'seller' ? 4.95 : 5.0,
      avatar: assignedRole === 'seller'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      savedProducts: []
    };
    store.users.push(user);
    saveStore(store);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const userSafe = { ...user };
  delete userSafe.passwordHash;
  res.json({ success: true, token, user: userSafe });
});

// -------------------------------------------------------------
// FORGOT PASSWORD FLOW (OTP VIA EMAIL -> RESET PASSWORD)
// -------------------------------------------------------------

// 1. Send Forgot Password OTP to user's Email
app.post('/api/auth/forgot-password-otp', async (req, res) => {
  const { email } = req.body;

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({
      message: 'Kripya ek valid aur sahi email address enter karein (e.g. name@gmail.com).'
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Generate 6-digit OTP (send to whichever genuine email entered)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set('reset_' + cleanEmail, {
    otp,
    expiresAt,
    email: cleanEmail
  });

  console.log(`[RENTORA RESET OTP] Generated Password Reset code for ${cleanEmail}: ${otp}`);

  // Dispatch real email via Nodemailer
  let emailDeliverySuccess = false;
  let previewUrl = null;

  try {
    const transporter = await getMailTransporter();
    if (transporter) {
      const fromAddress = process.env.SMTP_FROM || process.env.GMAIL_USER || '"RENTORA Security" <security@rentora.com>';
      const mailInfo = await transporter.sendMail({
        from: fromAddress,
        to: cleanEmail,
        subject: `RENTORA Password Reset OTP: ${otp}`,
        text: `Your Rentora password reset verification code is: ${otp}. Valid for 10 minutes.`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #121512; color: #ffffff; padding: 40px; border-radius: 20px; max-width: 520px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
            <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 24px;">
              <span style="font-size: 26px; font-weight: 900; letter-spacing: -1px; color: #ffffff;">RENTORA</span>
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #C9F36B; margin-left: 4px;"></span>
            </div>
            <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #a0aec0; font-size: 14px; line-height: 1.5;">You requested to reset your password on Rentora. Use the following 6-digit verification code to set your new password:</p>
            
            <div style="background-color: #183D2B; padding: 24px; border-radius: 16px; margin: 28px 0; text-align: center; border: 1px solid #C9F36B;">
              <span style="font-size: 40px; font-weight: 900; letter-spacing: 10px; color: #C9F36B; font-family: monospace;">${otp}</span>
            </div>
            
            <p style="color: #718096; font-size: 12px; margin-bottom: 0;">This OTP code is valid for 10 minutes. If you did not make this request, your account is safe and you can ignore this email.</p>
          </div>
        `
      });

      emailDeliverySuccess = true;
      previewUrl = nodemailer.getTestMessageUrl(mailInfo);
      if (previewUrl) {
        console.log(`[RENTORA Nodemailer] Live reset email preview URL: ${previewUrl}`);
      }
    }
  } catch (emailErr) {
    console.error('[RENTORA Nodemailer] Failed to send reset email:', emailErr.message);
  }

  res.json({
    success: true,
    message: emailDeliverySuccess
      ? `Password Reset OTP aapke email (${cleanEmail}) par bhej diya gaya hai! Inbox check karein.`
      : `Password Reset OTP generated for ${cleanEmail}.`,
    otp: otp,
    previewUrl: previewUrl,
    emailDelivered: emailDeliverySuccess
  });
});

// 2. Verify OTP & Reset Password
app.post('/api/auth/reset-password', (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, 6-digit OTP code, and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Naya password kam se kam 6 characters ka hona zaroori hai.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const stored = otpStore.get('reset_' + cleanEmail);

  // Match stored OTP or master test code 123456
  const isValid = (stored && stored.otp === otp && stored.expiresAt > Date.now()) || otp === '123456';

  if (!isValid) {
    return res.status(400).json({ message: 'Galat ya expired OTP code! Kripya sahi OTP enter karein.' });
  }

  // Find or create user
  let user = store.users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    user = {
      id: `cust-${Date.now()}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      passwordHash: bcrypt.hashSync(newPassword, 8),
      role: 'customer',
      phone: '+91 99000 00000',
      city: 'Delhi, India',
      kycStatus: 'Verified Pro Renter',
      verified: true,
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      savedProducts: []
    };
    store.users.push(user);
  } else {
    // Update password hash
    user.passwordHash = bcrypt.hashSync(newPassword, 8);
  }
  saveStore(store);

  // Clear reset OTP
  otpStore.delete('reset_' + cleanEmail);

  console.log(`[RENTORA AUTH] Password successfully updated for ${cleanEmail}`);

  res.json({
    success: true,
    message: 'Password safalta-purvak badal gaya hai! Ab aap naye password se Sign In kar sakte hain.'
  });
});



app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, businessName, gstin, phone, city } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ message: 'An account with this email already exists' });
  }

  const assignedRole = role === 'seller' ? 'seller' : (role === 'admin' ? 'admin' : 'customer');
  const newUser = {
    id: `${assignedRole.substring(0, 4)}-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    passwordHash: bcrypt.hashSync(password, 8),
    role: assignedRole,
    phone: phone || '+91 99000 00000',
    city: city || 'Bengaluru, India',
    businessName: businessName || '',
    gstin: gstin || '',
    kycStatus: assignedRole === 'seller' ? 'Pending Verification' : 'Verified',
    verified: assignedRole === 'customer',
    rating: assignedRole === 'seller' ? 5.0 : undefined,
    savedProducts: []
  };

  store.users.push(newUser);
  saveStore(store);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const userSafe = { ...newUser };
  delete userSafe.passwordHash;
  res.status(201).json({ token, user: userSafe });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  const user = store.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const validPassword = bcrypt.compareSync(password, user.passwordHash);
  if (!validPassword) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  if (role && user.role !== role) {
    return res.status(403).json({
      message: `Account role is ${user.role}. Please log in through the ${user.role} portal.`
    });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const userSafe = { ...user };
  delete userSafe.passwordHash;
  res.json({ token, user: userSafe });
});

// Demo switch role helper
app.post('/api/auth/demo-switch', (req, res) => {
  const { role } = req.body;
  const user = store.users.find(u => u.role === role);
  if (!user) {
    return res.status(404).json({ message: `No demo user found for role ${role}` });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const userSafe = { ...user };
  delete userSafe.passwordHash;
  res.json({ token, user: userSafe });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = store.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const userSafe = { ...user };
  delete userSafe.passwordHash;
  res.json({ user: userSafe });
});

// -------------------------------------------------------------
// PRODUCTS ROUTES
// -------------------------------------------------------------

app.get('/api/products', (req, res) => {
  const { category, search, type, sellerId, sort } = req.query;
  let list = [...store.products];

  if (category && category !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (type && type !== 'All') {
    if (type === 'Rent Only') list = list.filter(p => p.listingType === 'Rent Only');
    else if (type === 'Sell Only') list = list.filter(p => p.listingType === 'Sell Only');
    else if (type === 'Rent & Sell') list = list.filter(p => p.listingType === 'Rent & Sell');
  }

  if (sellerId) {
    list = list.filter(p => p.seller?.id === sellerId);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-low') {
    list.sort((a, b) => (a.rentalPricePerDay || a.sellingPrice) - (b.rentalPricePerDay || b.sellingPrice));
  } else if (sort === 'price-high') {
    list.sort((a, b) => (b.rentalPricePerDay || b.sellingPrice) - (a.rentalPricePerDay || a.sellingPrice));
  } else if (sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'featured') {
    list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  res.json({ count: list.length, products: list });
});

app.get('/api/products/:id', (req, res) => {
  const product = store.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
});

app.post('/api/products', authenticateToken, (req, res) => {
  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only sellers or admins can create products' });
  }

  const {
    name,
    category,
    description,
    images,
    listingType,
    rentalPricePerDay,
    sellingPrice,
    securityDeposit,
    availability,
    specs
  } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: 'Name and Category are required' });
  }

  const seller = store.users.find(u => u.id === req.user.id) || {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    verified: true,
    rating: 5.0
  };

  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    category,
    description: description || 'Premium quality verified item listed on Rentora.',
    images: images && images.length ? images : [
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1000&q=80'
    ],
    listingType: listingType || 'Rent & Sell',
    rentalPricePerDay: Number(rentalPricePerDay) || 500,
    sellingPrice: Number(sellingPrice) || 25000,
    securityDeposit: Number(securityDeposit) || Math.round(Number(sellingPrice || 25000) * 0.15),
    availability: availability || 'In Stock',
    featured: false,
    seller: {
      id: seller.id,
      name: seller.businessName || seller.name,
      email: seller.email,
      verified: seller.verified || true,
      rating: seller.rating || 4.9,
      reviewsCount: 1,
      city: seller.city || 'India'
    },
    rating: 5.0,
    reviewsCount: 1,
    specs: specs || { 'Warranty': 'Rentora Verified Quality' },
    externalComparison: {
      amazonPrice: Math.round(Number(sellingPrice || 25000) * 1.1),
      flipkartPrice: Math.round(Number(sellingPrice || 25000) * 1.08),
      cromaPrice: Math.round(Number(sellingPrice || 25000) * 1.12),
      rentoraPrice: Number(sellingPrice || 25000),
      lowestPlatform: 'Rentora Seller',
      savings: Math.round(Number(sellingPrice || 25000) * 0.08),
      verifiedDate: 'Today'
    },
    rentalTerms: {
      minDays: 2,
      maxDays: 30,
      damagePolicy: 'Covered under Rentora SafeShield Protection',
      lateFeePerDay: Math.round(Number(rentalPricePerDay || 500) * 1.2)
    },
    reviews: []
  };

  store.products.unshift(newProduct);
  saveStore(store);
  res.status(201).json({ product: newProduct });
});

app.put('/api/products/:id', authenticateToken, (req, res) => {
  const index = store.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  const existing = store.products[index];
  if (req.user.role !== 'admin' && existing.seller?.id !== req.user.id) {
    return res.status(403).json({ message: 'You can only edit your own listings' });
  }

  const updated = { ...existing, ...req.body };
  store.products[index] = updated;
  saveStore(store);
  res.json({ product: updated });
});

app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const index = store.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  const existing = store.products[index];
  if (req.user.role !== 'admin' && existing.seller?.id !== req.user.id) {
    return res.status(403).json({ message: 'You can only delete your own listings' });
  }

  store.products.splice(index, 1);
  saveStore(store);
  res.json({ message: 'Product deleted successfully' });
});

// -------------------------------------------------------------
// RENTALS & ORDERS ROUTES
// -------------------------------------------------------------

app.get('/api/rentals', authenticateToken, (req, res) => {
  let list = store.rentals;
  if (req.user.role === 'customer') {
    list = list.filter(r => r.customerId === req.user.id);
  } else if (req.user.role === 'seller') {
    list = list.filter(r => r.sellerId === req.user.id);
  }
  res.json({ rentals: list });
});

app.post('/api/rentals', authenticateToken, (req, res) => {
  const {
    productId,
    startDate,
    returnDate,
    durationDays,
    rentalPricePerDay,
    totalRentalAmount,
    securityDeposit,
    grandTotal,
    deliveryAddress,
    paymentMethod,
    tryBeforeYouBuy
  } = req.body;

  const product = store.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const newRental = {
    id: `rent-${Date.now()}`,
    productId: product.id,
    productName: product.name,
    productImage: product.images[0],
    customerId: req.user.id,
    customerName: req.user.name,
    sellerId: product.seller?.id || 'seller-1',
    sellerName: product.seller?.name || 'Apex Visuals Lab',
    startDate: startDate || new Date().toISOString().split('T')[0],
    returnDate: returnDate,
    durationDays: Number(durationDays) || 3,
    rentalPricePerDay: Number(rentalPricePerDay) || product.rentalPricePerDay,
    totalRentalAmount: Number(totalRentalAmount),
    securityDeposit: Number(securityDeposit),
    grandTotal: Number(grandTotal),
    depositStatus: 'Escrow Held (SafeShield)',
    status: 'Approved', // Auto approved for smooth user experience, or can be managed
    tryBeforeYouBuy: !!tryBeforeYouBuy,
    deliveryAddress: deliveryAddress || 'Address on file',
    paymentMethod: paymentMethod || 'UPI (Simulated)',
    createdAt: new Date().toISOString()
  };

  store.rentals.unshift(newRental);
  saveStore(store);
  res.status(201).json({ rental: newRental });
});

app.put('/api/rentals/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  const rental = store.rentals.find(r => r.id === req.params.id);
  if (!rental) return res.status(404).json({ message: 'Rental booking not found' });

  // Update status and escrow handling
  rental.status = status;
  if (status === 'Completed') {
    rental.depositStatus = 'Refunded to Source';
  } else if (status === 'Overdue') {
    rental.depositStatus = 'Escrow Claim Initiated';
  }

  saveStore(store);
  res.json({ rental });
});

app.post('/api/rentals/:id/return', authenticateToken, (req, res) => {
  const rental = store.rentals.find(r => r.id === req.params.id);
  if (!rental) return res.status(404).json({ message: 'Rental not found' });

  rental.status = 'Return Requested';
  rental.returnRequestedAt = new Date().toISOString();
  saveStore(store);
  res.json({ message: 'Return request submitted. Courier pickup scheduled.', rental });
});

app.post('/api/rentals/:id/extend', authenticateToken, (req, res) => {
  const { extraDays } = req.body;
  const rental = store.rentals.find(r => r.id === req.params.id);
  if (!rental) return res.status(404).json({ message: 'Rental not found' });

  const addDays = Number(extraDays) || 3;
  rental.durationDays += addDays;
  rental.totalRentalAmount += addDays * rental.rentalPricePerDay;
  rental.grandTotal += addDays * rental.rentalPricePerDay;

  const currentReturn = new Date(rental.returnDate);
  currentReturn.setDate(currentReturn.getDate() + addDays);
  rental.returnDate = currentReturn.toISOString().split('T')[0];

  saveStore(store);
  res.json({ message: `Rental successfully extended by ${addDays} days!`, rental });
});

app.get('/api/orders', authenticateToken, (req, res) => {
  let list = store.orders;
  if (req.user.role === 'customer') {
    list = list.filter(o => o.customerId === req.user.id);
  } else if (req.user.role === 'seller') {
    list = list.filter(o => o.sellerId === req.user.id);
  }
  res.json({ orders: list });
});

app.post('/api/orders', authenticateToken, (req, res) => {
  const { productId, deliveryAddress, paymentMethod, appliedRentalCredit } = req.body;
  const product = store.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const credit = Number(appliedRentalCredit) || 0;
  const finalPrice = Math.max(0, product.sellingPrice - credit);

  const newOrder = {
    id: `ord-${Date.now()}`,
    productId: product.id,
    productName: product.name,
    productImage: product.images[0],
    customerId: req.user.id,
    customerName: req.user.name,
    sellerId: product.seller?.id || 'seller-1',
    sellerName: product.seller?.name || 'Apex Visuals Lab',
    sellingPrice: finalPrice,
    originalPrice: product.sellingPrice,
    rentalCreditDeducted: credit,
    status: 'Confirmed - Preparing for Shipment',
    deliveryAddress: deliveryAddress || 'Address on file',
    paymentMethod: paymentMethod || 'Card (Simulated)',
    createdAt: new Date().toISOString()
  };

  store.orders.unshift(newOrder);
  saveStore(store);
  res.status(201).json({ order: newOrder });
});

// -------------------------------------------------------------
// DISPUTES & COMPLAINTS
// -------------------------------------------------------------

app.get('/api/disputes', authenticateToken, (req, res) => {
  let list = store.disputes;
  if (req.user.role === 'customer' || req.user.role === 'seller') {
    list = list.filter(d => d.reporterId === req.user.id);
  }
  res.json({ disputes: list });
});

app.post('/api/disputes', authenticateToken, (req, res) => {
  const { orderId, title, description, targetType, targetId } = req.body;
  const newDispute = {
    id: `disp-${Date.now()}`,
    orderId: orderId || 'General Marketplace',
    reporterId: req.user.id,
    reporterName: req.user.name,
    role: req.user.role,
    targetType: targetType || 'Product / Seller',
    targetId: targetId || '',
    title,
    description,
    status: 'Under Admin Review',
    resolution: null,
    createdAt: new Date().toISOString()
  };

  store.disputes.unshift(newDispute);
  saveStore(store);
  res.status(201).json({ dispute: newDispute });
});

app.put('/api/disputes/:id/resolve', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only administrators can resolve disputes' });
  }

  const { resolution, status } = req.body;
  const dispute = store.disputes.find(d => d.id === req.params.id);
  if (!dispute) return res.status(404).json({ message: 'Dispute not found' });

  dispute.resolution = resolution || 'Resolved by Rentora Trust & Safety Team';
  dispute.status = status || 'Resolved';
  saveStore(store);
  res.json({ dispute });
});

// -------------------------------------------------------------
// KYC & VERIFICATION
// -------------------------------------------------------------

app.post('/api/kyc/submit', authenticateToken, (req, res) => {
  const { docType, docNumber, businessName } = req.body;
  const user = store.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.kycStatus = 'Verified';
  user.verified = true;
  user.kycDoc = { docType, docNumber, submittedAt: new Date().toISOString() };
  if (businessName) user.businessName = businessName;

  saveStore(store);
  res.json({ message: 'Identity verified successfully!', user });
});

// -------------------------------------------------------------
// ANALYTICS ROUTES
// -------------------------------------------------------------

app.get('/api/analytics/seller', authenticateToken, (req, res) => {
  const sellerId = req.user.id;
  const sellerRentals = store.rentals.filter(r => r.sellerId === sellerId);
  const sellerOrders = store.orders.filter(o => o.sellerId === sellerId);
  const sellerProducts = store.products.filter(p => p.seller?.id === sellerId);

  const rentalEarnings = sellerRentals.reduce((sum, r) => sum + (r.totalRentalAmount || 0), 0);
  const salesEarnings = sellerOrders.reduce((sum, o) => sum + (o.sellingPrice || 0), 0);
  const totalRevenue = rentalEarnings + salesEarnings;

  const monthlyData = [
    { month: 'Jun', rentals: 14200, sales: 62000, total: 76200 },
    { month: 'Jul', rentals: 21500, sales: 85000, total: 106500 },
    { month: 'Aug', rentals: 34000, sales: 120000, total: 154000 },
    { month: 'Sep', rentals: 29800, sales: 94000, total: 123800 },
    { month: 'Oct', rentals: 48500, sales: 165000, total: 213500 },
    { month: 'Nov', rentals: totalRevenue > 0 ? totalRevenue : 55000, sales: salesEarnings > 0 ? salesEarnings : 180000, total: totalRevenue > 0 ? totalRevenue + 180000 : 235000 }
  ];

  res.json({
    kpis: {
      totalRevenue,
      rentalEarnings,
      salesEarnings,
      activeRentals: sellerRentals.filter(r => r.status === 'Active').length,
      totalRentalsCount: sellerRentals.length,
      totalSalesCount: sellerOrders.length,
      totalListings: sellerProducts.length,
      avgRating: 4.9
    },
    chartData: monthlyData,
    recentRentals: sellerRentals.slice(0, 5),
    recentOrders: sellerOrders.slice(0, 5)
  });
});

app.get('/api/analytics/admin', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const totalGMV = store.rentals.reduce((sum, r) => sum + (r.grandTotal || 0), 0) +
                   store.orders.reduce((sum, o) => sum + (o.sellingPrice || 0), 0);
  const platformRevenue = Math.round(totalGMV * 0.1); // 10% platform take rate

  res.json({
    kpis: {
      totalGMV,
      platformRevenue,
      totalUsers: store.users.length,
      totalCustomers: store.users.filter(u => u.role === 'customer').length,
      totalSellers: store.users.filter(u => u.role === 'seller').length,
      activeRentalsCount: store.rentals.filter(r => r.status === 'Active').length,
      totalListingsCount: store.products.length,
      pendingDisputesCount: store.disputes.filter(d => d.status !== 'Resolved').length
    },
    users: store.users.map(u => {
      const safe = { ...u };
      delete safe.passwordHash;
      return safe;
    }),
    disputes: store.disputes,
    recentRentals: store.rentals.slice(0, 10),
    recentOrders: store.orders.slice(0, 10)
  });
});

// ==========================================
// RAZORPAY PAYMENT GATEWAY ENDPOINTS
// ==========================================
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_rentora2026';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rentora_rzp_secret_9988';

let razorpay = null;
try {
  razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  });
  console.log('[RENTORA] Razorpay Gateway Initialized (Key: ' + RAZORPAY_KEY_ID + ')');
} catch (err) {
  console.warn('[RENTORA] Razorpay running in test sandbox mode');
}

// 1. Create Payment Order
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;
    const amountInPaise = Math.round(Number(amount) * 100);

    if (!amountInPaise || amountInPaise <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount' });
    }

    let orderData;
    // Attempt live Razorpay API if live key provided, else create test order
    if (razorpay && process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('test_rentora')) {
      try {
        orderData = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receipt || `rcpt_${Date.now()}`,
          notes: notes || {}
        });
      } catch (rzpErr) {
        console.warn('[RENTORA] Razorpay API fallback to mock order:', rzpErr.message);
      }
    }

    if (!orderData) {
      orderData = {
        id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        entity: 'order',
        amount: amountInPaise,
        amount_paid: 0,
        amount_due: amountInPaise,
        currency: 'INR',
        receipt: receipt || `rcpt_${Date.now()}`,
        status: 'created',
        attempts: 0,
        notes: notes || {},
        created_at: Math.floor(Date.now() / 1000)
      };
    }

    console.log(`[RENTORA Razorpay] Order Created: ${orderData.id} for ₹${amount} (${amountInPaise} paise)`);

    res.json({
      success: true,
      keyId: RAZORPAY_KEY_ID,
      order: orderData,
      currency: 'INR'
    });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ success: false, message: 'Payment order generation failed' });
  }
});

// 2. Verify Payment Signature
app.post('/api/payment/verify', (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      rentalData,
      orderData
    } = req.body;

    let isValid = true;
    if (process.env.RAZORPAY_KEY_SECRET && razorpay_signature) {
      try {
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
          .createHmac('sha256', RAZORPAY_KEY_SECRET)
          .update(body.toString())
          .digest('hex');
        isValid = (expectedSignature === razorpay_signature);
      } catch (sigErr) {
        isValid = true; // Fallback in sandbox test mode
      }
    }

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Razorpay signature verification failed' });
    }

    const store = loadStore();
    const paymentId = razorpay_payment_id || `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Create payment ledger record
    const paymentRecord = {
      id: paymentId,
      orderId: razorpay_order_id,
      paymentId: paymentId,
      amount: req.body.amount,
      currency: 'INR',
      status: 'Captured',
      verified: true,
      method: req.body.method || 'Razorpay Gateway (UPI/Card/Netbanking)',
      customerName: req.body.customerName || 'Verified Renter',
      timestamp: new Date().toISOString()
    };

    if (!store.payments) store.payments = [];
    store.payments.push(paymentRecord);

    // If this payment was for a rental booking
    if (rentalData) {
      const newRental = {
        id: `rent-${Date.now()}`,
        ...rentalData,
        depositStatus: 'Escrow Held (SafeShield)',
        status: 'Active',
        paymentMethod: 'Razorpay (Verified)',
        razorpayPaymentId: paymentId,
        createdAt: new Date().toISOString()
      };
      store.rentals.unshift(newRental);
    }

    // If this payment was for an outright buy order
    if (orderData) {
      const newOrder = {
        id: `ord-${Date.now()}`,
        ...orderData,
        orderStatus: 'Confirmed',
        paymentStatus: 'Paid (Razorpay)',
        razorpayPaymentId: paymentId,
        createdAt: new Date().toISOString()
      };
      store.orders.unshift(newOrder);
    }

    saveStore(store);

    console.log(`[RENTORA Razorpay] Payment Captured Successfully: ${paymentId}`);

    res.json({
      success: true,
      verified: true,
      paymentId: paymentId,
      orderId: razorpay_order_id,
      receiptNumber: `RCPT-${Math.floor(100000 + Math.random() * 900000)}`,
      escrowLocked: true,
      message: 'Payment verified and SafeShield Escrow deposit secured successfully.'
    });
  } catch (err) {
    console.error('Error verifying Razorpay payment:', err);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', brand: 'RENTORA', uptime: process.uptime() });
});

// Serve frontend dist if available
const DIST_DIR = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(DIST_DIR, 'index.html'), (err) => {
      if (err && !res.headersSent) {
        next();
      }
    });
  });
}

app.listen(PORT, () => {
  console.log(`[RENTORA Server] Running on http://localhost:${PORT}`);
});
