import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Tag,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/helpers';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function BuyOrderModal() {
  const { activeBuyModal: product, setActiveBuyModal, navigateTo, addNotification } = useMarketplace();
  const { user } = useAuth();

  const [step, setStep] = useState(1); // 1: review & address, 2: simulation, 3: success
  const [address, setAddress] = useState(
    user?.city ? `Flat 402, Sea Green Heights, Bandra West, ${user.city}` : '14th Cross, Indiranagar, Bengaluru 560038'
  );
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  if (!product) return null;

  // If customer already rented this product or has trial credit
  const appliedCredit = product.appliedRentalCredit || 0;
  const finalPrice = Math.max(0, product.sellingPrice - appliedCredit);

  const handleProceed = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      const payload = {
        productId: product.id,
        deliveryAddress: address,
        paymentMethod: paymentMethod === 'card' ? 'Visa Platinum (Simulated)' : 'UPI AutoPay (Simulated)',
        appliedRentalCredit: appliedCredit
      };

      const res = await api.createOrder(payload);

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 }
      });

      setOrderConfirmed(res.order);
      setStep(3);

      addNotification({
        title: 'Purchase Order Placed!',
        message: `Your purchase of ${product.name} for ${formatCurrency(finalPrice)} has been confirmed!`,
        type: 'success'
      });
    } catch (err) {
      alert('Order failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setActiveBuyModal(null);
    setStep(1);
    setOrderConfirmed(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl glass-card rounded-3xl border border-slate-700 bg-[#0b0f19] shadow-2xl overflow-hidden my-6"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  {step === 1 ? 'Complete Purchase Order' : step === 2 ? 'Payment Simulation' : 'Order Placed!'}
                </h2>
                <div className="text-xs text-slate-400">Verified Direct Marketplace Purchase</div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6">
            {step === 1 && (
              <form onSubmit={handleProceed} className="space-y-4">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate">{product.name}</h3>
                    <div className="text-xs text-purple-400 font-semibold mt-0.5">
                      {formatCurrency(product.sellingPrice)}
                    </div>
                  </div>
                </div>

                {appliedCredit > 0 && (
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between text-xs">
                    <span className="text-cyan-300 font-semibold">Try Before You Buy Credit Applied:</span>
                    <span className="font-extrabold text-cyan-400">-{formatCurrency(appliedCredit)}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Shipping & Billing Address
                  </label>
                  <textarea
                    rows="2"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-400 font-medium resize-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Retail Selling Price:</span>
                    <span className="font-semibold text-white">{formatCurrency(product.sellingPrice)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Doorstep Express Delivery:</span>
                    <span className="font-semibold text-emerald-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Applicable GST (18% included):</span>
                    <span className="font-semibold text-slate-400">Included</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-extrabold text-white">
                    <span>Total Amount Payable:</span>
                    <span className="text-gradient-purple">{formatCurrency(finalPrice)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Payment Simulation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Simulated Sandbox Payment: Authorize test transaction of {formatCurrency(finalPrice)}. No real money is deducted.
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Final Charge:</span>
                  <span className="text-2xl font-black text-white">{formatCurrency(finalPrice)}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 p-3 rounded-xl border text-xs font-semibold ${
                      paymentMethod === 'card'
                        ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 p-3 rounded-xl border text-xs font-semibold ${
                      paymentMethod === 'upi'
                        ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    UPI / QR
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg transition-all"
                  >
                    {isProcessing ? 'Confirming Order...' : `Confirm simulated purchase (${formatCurrency(finalPrice)})`}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && orderConfirmed && (
              <div className="space-y-5 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Purchase Confirmed!</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Order Ref: <span className="font-mono text-purple-400 font-bold">{orderConfirmed.id}</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Item:</span>
                    <span className="font-bold text-white">{orderConfirmed.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount Paid:</span>
                    <span className="font-bold text-gradient-purple">{formatCurrency(orderConfirmed.sellingPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="font-semibold text-emerald-400">{orderConfirmed.status}</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      handleClose();
                      navigateTo('customer-dashboard');
                    }}
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs"
                  >
                    Track in Dashboard
                  </button>
                  <button
                    onClick={handleClose}
                    className="py-3 px-6 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xs"
                  >
                    Close
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
