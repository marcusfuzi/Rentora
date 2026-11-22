import React, { useState } from 'react';
import { X, Trash2, ShieldCheck, MapPin, CheckCircle2, ArrowRight, ShoppingBag, Sparkles, Zap } from 'lucide-react';
import { useRentora } from '../context/RentoraContext';
import { formatINR } from '../data/rentoraData';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    calculateSubtotal,
    selectedLocation,
    openRazorpayCheckout
  } = useRentora();

  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [deliveryAddress, setDeliveryAddress] = useState("Flat 402, Sea Green Heights, Bandra West");

  if (!isCartOpen) return null;

  const subtotal = calculateSubtotal();
  const courierFee = subtotal > 0 ? 450 : 0;
  const refundableDeposit = Math.round(subtotal * 0.35);
  const grandTotal = subtotal + courierFee + refundableDeposit;

  const handleProceedRazorpay = () => {
    setIsCartOpen(false);
    openRazorpayCheckout({
      title: "RENTORA Equipment Bag Checkout",
      amount: grandTotal,
      rentalCost: subtotal,
      securityDeposit: refundableDeposit,
      productName: cart[0]?.name || "High-End Production Rig",
      image: cart[0]?.image || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
      durationDays: cart[0]?.durationDays || 3,
      mode: cart[0]?.mode || 'rent'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0D110E] text-[#F5F5EF] shadow-2xl border-l border-white/10 flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 bg-[#141A16] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C9F36B]" />
              <h3 className="font-serif font-bold text-xl text-white tracking-tight">
                RENTAL BAG & CART
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#183D2B] text-[#C9F36B] text-xs font-mono font-bold">
                {cart.length}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <ShoppingBag className="w-12 h-12 mx-auto text-white/20" />
                <p className="text-sm font-mono text-white/50">Your equipment bag is empty.</p>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-[#141A16] rounded-2xl border border-white/10 flex items-center justify-between gap-4 shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono tracking-widest text-[#C9F36B] uppercase block">
                          {item.mode === 'rent' ? `${item.durationDays || 3} Days Lease` : 'Direct Purchase'}
                        </span>
                        <h4 className="text-white text-sm font-bold truncate">
                          {item.name}
                        </h4>
                        <div className="text-xs font-mono font-bold text-white mt-1">
                          {formatINR(item.totalPrice)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-lg hover:bg-rose-500/10 text-white/40 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Delivery Information */}
                <div className="p-4 rounded-2xl bg-[#141A16] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C9F36B]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Courier Handover Details</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-white/50 block mb-1">
                      DELIVERY ADDRESS ({selectedLocation})
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#C9F36B]"
                    />
                  </div>
                </div>

                {/* SafeShield Guarantee */}
                <div className="p-3.5 rounded-xl bg-[#183D2B]/30 border border-[#183D2B] flex items-center gap-2.5 text-xs text-white/80">
                  <ShieldCheck className="w-5 h-5 text-[#C9F36B] shrink-0" />
                  <span>
                    <strong>SafeShield Escrow:</strong> 100% deposit refund within 2 hours of equipment return and hardware inspection.
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Footer & Razorpay Button */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#141A16] border-t border-white/10 space-y-3">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal (Equipment):</span>
                  <span className="text-white">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Refundable Escrow Deposit:</span>
                  <span>{formatINR(refundableDeposit)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>White-Glove Insured Courier:</span>
                  <span className="text-white">{formatINR(courierFee)}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-base font-bold text-white">
                  <span>Total Payable:</span>
                  <span className="text-[#C9F36B]">{formatINR(grandTotal)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedRazorpay}
                className="w-full py-3.5 rounded-xl bg-[#C9F36B] hover:bg-[#b8e854] text-[#0A0D0B] font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#C9F36B]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Pay {formatINR(grandTotal)} via Razorpay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
