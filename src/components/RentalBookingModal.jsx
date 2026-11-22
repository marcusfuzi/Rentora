import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency, calculateDaysBetween } from '../utils/helpers';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function RentalBookingModal() {
  const { activeRentModal: product, setActiveRentModal, navigateTo, addNotification } = useMarketplace();
  const { user } = useAuth();

  // Booking step: 1 (Dates & Address) -> 2 (Simulated Payment) -> 3 (Confirmation Receipt)
  const [step, setStep] = useState(1);

  // Dates
  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0];
  const defaultReturn = new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(tomorrow);
  const [returnDate, setReturnDate] = useState(defaultReturn);
  const [address, setAddress] = useState(
    user?.city ? `Flat 402, Sea Green Heights, Bandra West, ${user.city}` : '14th Cross, Indiranagar, Bengaluru 560038'
  );

  // Payment simulator state
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'wallet'
  const [upiId, setUpiId] = useState('customer@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmedData, setBookingConfirmedData] = useState(null);

  if (!product) return null;

  const durationDays = calculateDaysBetween(startDate, returnDate);
  const dailyRate = product.rentalPricePerDay || 800;
  const rentalTotal = dailyRate * durationDays;
  const securityDeposit = product.securityDeposit || Math.round(product.sellingPrice * 0.15);
  const platformProtectionFee = 199; // SafeShield Insurance
  const grandTotal = rentalTotal + securityDeposit + platformProtectionFee;

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!startDate || !returnDate) return;
    if (new Date(returnDate) <= new Date(startDate)) {
      alert('Return date must be strictly after the start date.');
      return;
    }
    setStep(2);
  };

  const handleExecutePaymentSimulation = async () => {
    setIsProcessing(true);

    try {
      const payload = {
        productId: product.id,
        startDate,
        returnDate,
        durationDays,
        rentalPricePerDay: dailyRate,
        totalRentalAmount: rentalTotal,
        securityDeposit,
        grandTotal,
        deliveryAddress: address,
        paymentMethod:
          paymentMethod === 'upi'
            ? `UPI (${upiId}) - Simulated`
            : paymentMethod === 'card'
            ? 'Visa/MasterCard - Simulated'
            : paymentMethod === 'wallet'
            ? 'Rentora Wallet Escrow'
            : 'NetBanking - Simulated',
        tryBeforeYouBuy: !!product.tryBeforeYouBuy
      };

      const res = await api.createRental(payload);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setBookingConfirmedData(res.rental);
      setStep(3);

      addNotification({
        title: 'Rental Booking Confirmed!',
        message: `Your booking for ${product.name} (${durationDays} days) is confirmed. Seller has received dispatch notification.`,
        type: 'success'
      });
    } catch (err) {
      alert('Error creating booking: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setActiveRentModal(null);
    setStep(1);
    setBookingConfirmedData(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl glass-card rounded-3xl border border-slate-700 bg-[#0b0f19] shadow-2xl overflow-hidden my-6"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  {step === 1 ? 'Configure Rental Duration' : step === 2 ? 'Payment Simulation' : 'Booking Confirmed!'}
                </h2>
                <div className="text-xs text-slate-400">
                  {product.tryBeforeYouBuy ? 'Try Before You Buy • 100% Rental Credit' : 'SafeShield Escrow Protected Rental'}
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Indicator */}
          <div className="px-6 pt-4 flex items-center gap-2">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-cyan-400' : 'bg-slate-800'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-cyan-400' : 'bg-slate-800'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-emerald-400' : 'bg-slate-800'}`} />
          </div>

          {/* Body Content */}
          <div className="p-6">
            {/* STEP 1: Dates & Duration */}
            {step === 1 && (
              <form onSubmit={handleProceedToPayment} className="space-y-5">
                {/* Product Summary Row */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate">{product.name}</h3>
                    <div className="text-xs text-cyan-400 font-semibold mt-0.5">
                      {formatCurrency(dailyRate)} <span className="text-slate-400 font-normal">/day</span>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-slate-400 block">Seller</span>
                    <span className="font-bold text-white">{product.seller?.name || 'Verified Seller'}</span>
                  </div>
                </div>

                {/* Date Selection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Rental Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      min={tomorrow}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      min={startDate || tomorrow}
                      onChange={(e) => setReturnDate(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 font-medium"
                    />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs">
                  <span className="text-slate-300">Total Calculated Duration:</span>
                  <span className="font-extrabold text-cyan-400 text-sm">{durationDays} Days</span>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Delivery & Courier Pickup Address
                  </label>
                  <textarea
                    rows="2"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 font-medium resize-none"
                    placeholder="Enter complete shipping address with pincode..."
                  />
                </div>

                {/* Transparent Financial Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>
                      Rental Charges ({durationDays} days × {formatCurrency(dailyRate)}):
                    </span>
                    <span className="font-semibold text-white">{formatCurrency(rentalTotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center gap-1">
                      <span>SafeShield Escrow Security Deposit:</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    </span>
                    <span className="font-semibold text-cyan-400">{formatCurrency(securityDeposit)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Transit Insurance & Sanitization:</span>
                    <span className="font-semibold text-white">{formatCurrency(platformProtectionFee)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-extrabold text-white">
                    <span>Grand Total (Payable Now):</span>
                    <span className="text-base text-gradient">{formatCurrency(grandTotal)}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1">
                    * The {formatCurrency(securityDeposit)} security deposit is held in escrow and automatically refunded to your original payment method upon verified return inspection.
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Payment Simulation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: Simulated Payment Gateway */}
            {step === 2 && (
              <div className="space-y-5">
                {/* Demo Simulation Notice */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Sandbox Payment Simulator:</strong>
                    <span>
                      This simulates an authorized bank payment. No real credit card or bank funds will be charged.
                    </span>
                  </div>
                </div>

                {/* Amount to Pay */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Total Simulation Amount</div>
                    <div className="text-2xl font-black text-white">{formatCurrency(grandTotal)}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-500/30 font-semibold">
                      SafeShield Escrow
                    </span>
                  </div>
                </div>

                {/* Payment Method Tabs */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / QR', icon: QrCode },
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'wallet', label: 'Wallet', icon: Wallet },
                    { id: 'netbanking', label: 'NetBank', icon: Smartphone }
                  ].map((m) => {
                    const IconComp = m.icon;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                          paymentMethod === m.id
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                        <span className="text-[10px] font-semibold">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Payment Method Details */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-center space-y-3">
                    <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
                      {/* Simulated QR Pattern */}
                      <div className="w-full h-full border-4 border-black flex flex-col items-center justify-center font-mono font-bold text-black text-[9px] text-center">
                        <QrCode className="w-16 h-16 text-black mb-1" />
                        <span>RENTORA PAY</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">Scan via GPay, PhonePe, Paytm or UPI App</div>
                    <div className="relative max-w-xs mx-auto">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white text-center font-medium"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Simulated Card Number</label>
                      <input
                        type="text"
                        readOnly
                        value="4532 •••• •••• 8892 (Demo Sandbox Visa)"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-300 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">Expiry</label>
                        <input
                          type="text"
                          readOnly
                          value="12/28"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-300 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">CVV</label>
                        <input
                          type="text"
                          readOnly
                          value="739"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-300 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'wallet' && (
                  <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs text-center space-y-2">
                    <Wallet className="w-8 h-8 text-cyan-400 mx-auto" />
                    <div className="font-bold text-white">Rentora SafeShield Wallet</div>
                    <div className="text-slate-400">Available Pre-funded Balance: ₹1,50,000</div>
                    <div className="text-emerald-400 text-[11px] font-semibold">Sufficient funds available</div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs space-y-2">
                    <div className="text-slate-400">Select Bank for Simulation:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {['HDFC Bank', 'ICICI Bank', 'SBI NetBanking', 'Axis Bank'].map((b) => (
                        <div key={b} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium text-center">
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Back & Pay Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleExecutePaymentSimulation}
                    disabled={isProcessing}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span>Authorizing Secure Escrow...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Authorize Simulated Payment ({formatCurrency(grandTotal)})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Confirmation Receipt */}
            {step === 3 && bookingConfirmedData && (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">Rental Booking Confirmed!</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Booking ID: <span className="font-mono text-cyan-400 font-bold">{bookingConfirmedData.id}</span>
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2.5 max-w-md mx-auto">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Equipment:</span>
                    <span className="font-bold text-white text-right truncate max-w-[65%]">
                      {bookingConfirmedData.productName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rental Period:</span>
                    <span className="font-semibold text-white">
                      {bookingConfirmedData.startDate} to {bookingConfirmedData.returnDate} ({bookingConfirmedData.durationDays} days)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Security Deposit:</span>
                    <span className="font-semibold text-cyan-400">
                      {formatCurrency(bookingConfirmedData.securityDeposit)} (Escrow Held)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Delivery To:</span>
                    <span className="font-semibold text-slate-300 text-right truncate max-w-[60%]">
                      {bookingConfirmedData.deliveryAddress}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-white">
                    <span>Total Paid (Simulated):</span>
                    <span className="text-gradient">{formatCurrency(bookingConfirmedData.grandTotal)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      handleClose();
                      navigateTo('customer-dashboard');
                    }}
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg transition-all"
                  >
                    View in Customer Dashboard
                  </button>
                  <button
                    onClick={handleClose}
                    className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
