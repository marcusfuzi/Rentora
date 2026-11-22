const mongoose = require('mongoose');

const sellerVerificationSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    documentType: {
      type: String,
      enum: ['GSTIN', 'PAN', 'Trade License', 'Government ID'],
      default: 'GSTIN',
    },
    documentNumber: {
      type: String,
      required: true,
    },
    documentUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    },
    bankAccountName: {
      type: String,
      default: '',
    },
    bankAccountNumber: {
      type: String,
      default: '',
    },
    ifscCode: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SellerVerification', sellerVerificationSchema);
