const dotenv = require('dotenv');
dotenv.config();

const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Rental = require('../models/Rental');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');
const { sampleUsers, sampleProducts } = require('./seedData');

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing previous collections...');
    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Rental.deleteMany(),
      Order.deleteMany(),
      Review.deleteMany(),
      Notification.deleteMany(),
      Payment.deleteMany(),
    ]);

    console.log('[Seeder] Creating sample users...');
    const createdUsers = await User.create(sampleUsers);
    const adminUser = createdUsers.find((u) => u.role === 'admin');
    const sellerUser = createdUsers.find((u) => u.role === 'seller');
    const customerUser = createdUsers.find((u) => u.role === 'customer');

    console.log('[Seeder] Creating sample products for seller...');
    const productsWithSeller = sampleProducts.map((p) => ({
      ...p,
      seller: sellerUser._id,
    }));
    const createdProducts = await Product.create(productsWithSeller);

    // Save one product to customer wishlist
    customerUser.savedProducts.push(createdProducts[0]._id, createdProducts[1]._id);
    await customerUser.save();

    console.log('[Seeder] Creating sample rentals...');
    // 1. Active Rental
    const activeRental = await Rental.create({
      rentalNumber: 'RNT-782190',
      product: createdProducts[0]._id, // Sony Alpha A7 IV
      customer: customerUser._id,
      seller: sellerUser._id,
      startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days left
      durationDays: 10,
      dailyRate: createdProducts[0].rentPricePerDay,
      totalRentalCost: createdProducts[0].rentPricePerDay * 10,
      securityDeposit: createdProducts[0].securityDeposit,
      totalPaid: createdProducts[0].rentPricePerDay * 10 + createdProducts[0].securityDeposit,
      status: 'active',
      tryBeforeYouBuy: true,
      deliveryAddress: customerUser.address,
    });

    // 2. Return Requested Rental
    const returnRequestedRental = await Rental.create({
      rentalNumber: 'RNT-415892',
      product: createdProducts[2]._id, // DJI Drone
      customer: customerUser._id,
      seller: sellerUser._id,
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      durationDays: 6,
      dailyRate: createdProducts[2].rentPricePerDay,
      totalRentalCost: createdProducts[2].rentPricePerDay * 6,
      securityDeposit: createdProducts[2].securityDeposit,
      totalPaid: createdProducts[2].rentPricePerDay * 6 + createdProducts[2].securityDeposit,
      status: 'return_requested',
      actualReturnDate: new Date(),
      tryBeforeYouBuy: true,
      deliveryAddress: customerUser.address,
    });

    // 3. Overdue Rental (to demonstrate admin escalation and late charges)
    const overdueRental = await Rental.create({
      rentalNumber: 'RNT-239401',
      product: createdProducts[3]._id, // PS5 Pro
      customer: customerUser._id,
      seller: sellerUser._id,
      startDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days overdue
      durationDays: 8,
      dailyRate: createdProducts[3].rentPricePerDay,
      totalRentalCost: createdProducts[3].rentPricePerDay * 8,
      securityDeposit: createdProducts[3].securityDeposit,
      totalPaid: createdProducts[3].rentPricePerDay * 8 + createdProducts[3].securityDeposit,
      status: 'overdue',
      lateFeePerDay: 500,
      accumulatedLateFee: 2000,
      isEscalatedToAdmin: true,
      adminNotes: 'Automated Escalation: Rental overdue by 4 days without customer check-in. Alert sent to customer phone.',
      deliveryAddress: customerUser.address,
    });

    // 4. Completed / Returned Rental
    const returnedRental = await Rental.create({
      rentalNumber: 'RNT-109283',
      product: createdProducts[4]._id, // Sennheiser HD800S
      customer: customerUser._id,
      seller: sellerUser._id,
      startDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      durationDays: 7,
      dailyRate: createdProducts[4].rentPricePerDay,
      totalRentalCost: createdProducts[4].rentPricePerDay * 7,
      securityDeposit: createdProducts[4].securityDeposit,
      totalPaid: createdProducts[4].rentPricePerDay * 7 + createdProducts[4].securityDeposit,
      status: 'returned',
      actualReturnDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      conditionOnReturn: 'Excellent',
      damageAssessmentNotes: 'Returned in pristine condition with original box and balanced cables intact.',
      securityDepositRefunded: true,
      depositRefundAmount: createdProducts[4].securityDeposit,
      deliveryAddress: customerUser.address,
    });

    console.log('[Seeder] Creating sample orders...');
    // Outright Purchase
    const boughtProduct = createdProducts[0]; // Samsung Galaxy A36 5G or first product
    const sampleOrder = await Order.create({
      orderNumber: 'ORD-938210',
      customer: customerUser._id,
      seller: sellerUser._id,
      items: [
        {
          product: boughtProduct._id,
          title: boughtProduct.title,
          image: boughtProduct.images[0],
          quantity: 1,
          unitPrice: boughtProduct.buyPrice,
          subtotal: boughtProduct.buyPrice,
        },
      ],
      totalAmount: boughtProduct.buyPrice,
      finalAmountPaid: boughtProduct.buyPrice,
      paymentMethod: 'upi',
      paymentStatus: 'completed',
      orderStatus: 'delivered',
      trackingNumber: 'DELHIVERY-992834192',
      shippingAddress: customerUser.address,
    });

    console.log('[Seeder] Creating sample reviews...');
    await Review.create([
      {
        product: createdProducts[0]._id,
        user: customerUser._id,
        rating: 5,
        title: 'Outstanding camera for 4K video shoot!',
        comment: 'Rented this for a 3-day destination wedding shoot in Udaipur. Autofocus is instantaneous and color science is stellar. Delivery was seamless.',
        rentalOrPurchase: 'rental',
        verifiedBooking: true,
      },
      {
        product: createdProducts[1]._id,
        user: customerUser._id,
        rating: 5,
        title: 'MacBook Pro M3 Max is an absolute render monster',
        comment: 'Rendered an entire 4K Blender architectural sequence in 22 minutes that usually takes 3 hours. Will definitely use Try Before You Buy!',
        rentalOrPurchase: 'rental',
        verifiedBooking: true,
      },
    ]);

    console.log('[Seeder] Creating sample notifications...');
    await Notification.create([
      {
        user: customerUser._id,
        title: 'Rental Booking Confirmed',
        message: `Your booking for "${createdProducts[0].title}" (RNT-782190) is active.`,
        type: 'rental_approved',
        link: '/my-rentals.html',
      },
      {
        user: sellerUser._id,
        title: 'New Rental Request Received',
        message: `Aryan Sharma requested to rent "${createdProducts[0].title}".`,
        type: 'rental_request',
        link: '/seller-dashboard.html',
      },
      {
        user: customerUser._id,
        title: 'Return Overdue Warning',
        message: `Rental #${overdueRental.rentalNumber} is overdue by 4 days. Please initiate return immediately.`,
        type: 'overdue_alert',
        link: '/my-rentals.html',
      },
    ]);

    console.log('✅ [Seeder] Database successfully seeded with rich mock data!');
    console.log('----------------------------------------------------');
    console.log('Test Logins:');
    console.log('  Admin:    admin@rentora.com    / password123');
    console.log('  Seller:   seller@rentora.com   / password123');
    console.log('  Customer: customer@rentora.com / password123');
    console.log('----------------------------------------------------');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ [Seeder Error]:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
