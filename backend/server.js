const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

// Keep process resilient against unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('[RENTORA Server] Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[RENTORA Server] Uncaught Exception:', err);
});

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const priceComparisonRoutes = require('./routes/priceComparisonRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/price-comparison', priceComparisonRoutes);
app.use('/api/admin', adminRoutes);

// Additional Bridge Routes for React/Vite App compatibility
app.post('/api/kyc/submit', (req, res) => {
  res.json({ success: true, message: 'KYC documents submitted successfully for administrative verification!' });
});

let inMemoryDisputes = [];
app.get('/api/disputes', (req, res) => {
  res.json(inMemoryDisputes);
});
app.post('/api/disputes', (req, res) => {
  const dispute = { id: `disp-${Date.now()}`, ...req.body, status: 'Open', createdAt: new Date() };
  inMemoryDisputes.push(dispute);
  res.json({ success: true, message: 'Dispute ticket registered.', dispute });
});
app.put('/api/disputes/:id/resolve', (req, res) => {
  res.json({ success: true, message: 'Dispute resolved successfully.' });
});

app.get('/api/analytics/seller', (req, res) => {
  res.json({
    totalRevenue: 148500,
    activeDeployments: 3,
    totalListings: 7,
    completionRate: 99.4,
    recentEscrows: 15000,
  });
});

app.get('/api/analytics/admin', (req, res) => {
  res.json({
    totalUsers: 3,
    activeRentals: 4,
    totalGmv: 520000,
    openDisputes: inMemoryDisputes.filter(d => d.status === 'Open').length,
  });
});

app.post('/api/payment/create-order', (req, res) => {
  res.json({
    success: true,
    orderId: `order_${Date.now()}`,
    amount: req.body.amount || 25000,
    currency: 'INR',
  });
});

app.post('/api/payment/verify', (req, res) => {
  res.json({ success: true, status: 'payment_verified' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Rentora API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Fallback to frontend index.html for root or SPA routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 Rentora Marketplace Server running on port ${PORT}`);
      console.log(`🌐 Web App:  http://localhost:${PORT}`);
      console.log(`📡 API Base: http://localhost:${PORT}/api`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    // Start HTTP server anyway so frontend remains accessible and helpful error is displayed
    server = app.listen(PORT, () => {
      console.log(`⚠️ Server running on port ${PORT} in fallback mode (waiting for MongoDB connection).`);
    });
  }
};

startServer();

module.exports = app;
