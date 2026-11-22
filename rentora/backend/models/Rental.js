const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema(
  {
    rentalNumber: {
      type: String,
      unique: true,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1,
    },
    dailyRate: {
      type: Number,
      required: true,
    },
    totalRentalCost: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    totalPaid: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'approved',
        'rejected',
        'active',
        'return_requested',
        'returned',
        'overdue',
        'cancelled',
        'converted_to_purchase',
      ],
      default: 'pending',
    },
    actualReturnDate: {
      type: Date,
    },
    lateFeePerDay: {
      type: Number,
      default: 150,
    },
    accumulatedLateFee: {
      type: Number,
      default: 0,
    },
    securityDepositRefunded: {
      type: Boolean,
      default: false,
    },
    depositRefundAmount: {
      type: Number,
      default: 0,
    },
    conditionOnReturn: {
      type: String,
      enum: ['Not Returned', 'Excellent', 'Good', 'Minor Damage', 'Severe Damage'],
      default: 'Not Returned',
    },
    damageAssessmentNotes: {
      type: String,
      default: '',
    },
    damageDeduction: {
      type: Number,
      default: 0,
    },
    isEscalatedToAdmin: {
      type: Boolean,
      default: false,
    },
    adminNotes: {
      type: String,
      default: '',
    },
    tryBeforeYouBuy: {
      type: Boolean,
      default: false,
    },
    convertedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      phone: String,
    },
  },
  {
    timestamps: true,
  }
);

// Method to recalculate overdue status & late fees
rentalSchema.methods.checkOverdue = function () {
  if (this.status === 'active' || this.status === 'return_requested') {
    const now = new Date();
    if (now > this.endDate) {
      this.status = 'overdue';
      const overdueMillis = now - this.endDate;
      const overdueDays = Math.ceil(overdueMillis / (1000 * 60 * 60 * 24));
      this.accumulatedLateFee = overdueDays * (this.lateFeePerDay || 150);
      if (overdueDays >= 3) {
        this.isEscalatedToAdmin = true;
      }
    }
  }
};

module.exports = mongoose.model('Rental', rentalSchema);
