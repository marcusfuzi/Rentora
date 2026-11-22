import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  RotateCcw,
  ShoppingBag,
  ShieldCheck,
  Heart,
  AlertCircle,
  FileText,
  User,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { api } from '../services/api';
import { formatCurrency, getDaysRemaining, formatDate } from '../utils/helpers';
import ProductCard from '../components/ProductCard';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const {
    products,
    savedProductIds,
    navigateTo,
    setActiveProductModal,
    setActiveDisputeModal,
    addNotification
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState('rentals'); // 'rentals' | 'orders' | 'saved' | 'kyc' | 'disputes'
  const [rentals, setRentals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extension modal state
  const [extendingRental, setExtendingRental] = useState(null);
  const [extraDays, setExtraDays] = useState(3);

  // KYC form simulation
  const [kycSubmitted, setKycSubmitted] = useState(false);
  const [docType, setDocType] = useState('Aadhaar');
  const [docNumber, setDocNumber] = useState('XXXX-XXXX-4892');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [rentData, orderData, dispData] = await Promise.all([
        api.getRentals(),
        api.getOrders(),
        api.getDisputes()
      ]);
      setRentals(rentData.rentals || []);
      setOrders(orderData.orders || []);
      setDisputes(dispData.disputes || []);
    } catch (err) {
      console.error('Failed to load customer dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleReturnRequest = async (rentalId) => {
    try {
      await api.requestReturn(rentalId);
      addNotification({
        title: 'Return Pickup Scheduled',
        message: 'A courier pickup has been scheduled for tomorrow. Security deposit will be refunded upon verification.',
        type: 'info'
      });
      fetchDashboardData();
    } catch (err) {
      alert('Return request failed: ' + err.message);
    }
  };

  const handleConfirmExtend = async () => {
    if (!extendingRental) return;
    try {
      await api.extendRental(extendingRental.id, extraDays);
      addNotification({
        title: 'Rental Extended',
        message: `Extended ${extendingRental.productName} by ${extraDays} days!`,
        type: 'success'
      });
      setExtendingRental(null);
      fetchDashboardData();
    } catch (err) {
      alert('Extension failed: ' + err.message);
    }
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.submitKyc({ docType, docNumber });
      setKycSubmitted(true);
      addNotification({
        title: 'KYC Verified',
        message: 'Your biometric ID credentials have been verified by Rentora Trust & Safety.',
        type: 'success'
      });
    } catch (err) {
      alert('KYC submission failed: ' + err.message);
    }
  };

  const activeRentals = rentals.filter((r) => r.status === 'Active' || r.status === 'Approved');
  const savedProducts = products.filter((p) => savedProductIds.includes(p.id));

  // Check for upcoming return due within 5 days
  const upcomingReturnAlert = activeRentals.find(
    (r) => getDaysRemaining(r.returnDate) >= 0 && getDaysRemaining(r.returnDate) <= 5
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-600 p-[2px]">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name}
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Welcome back, {user?.name?.split(' ')[0] || 'Customer'}
              </h1>
              <ShieldCheck className="w-5 h-5 text-cyan-400" title="Verified Customer" />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Customer Hub • {user?.email} • {user?.city || 'India'}
            </p>
          </div>
        </div>

        {/* Quick Stats Pill Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-3 self-start md:self-auto">
          <div className="bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Active Rentals</div>
            <div className="text-lg font-black text-cyan-400">{activeRentals.length}</div>
          </div>
          <div className="bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Items Bought</div>
            <div className="text-lg font-black text-purple-400">{orders.length}</div>
          </div>
          <div className="bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Escrow Held</div>
            <div className="text-lg font-black text-emerald-400">
              {formatCurrency(activeRentals.reduce((sum, r) => sum + (r.securityDeposit || 0), 0))}
            </div>
          </div>
        </div>
      </div>

      {/* UPCOMING RETURN ALERT BANNER */}
      {upcomingReturnAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-amber-200">
                Upcoming Rental Return Alert: {upcomingReturnAlert.productName}
              </div>
              <div className="text-xs text-amber-300/80 mt-0.5">
                Due date is <strong className="text-white">{formatDate(upcomingReturnAlert.returnDate)}</strong> (
                {getDaysRemaining(upcomingReturnAlert.returnDate)} days remaining). Avoid late charges by requesting a free doorstep courier pickup or extending your rental.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleReturnRequest(upcomingReturnAlert.id)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs shadow-md hover:bg-amber-400 transition-all"
            >
              Request Free Pickup
            </button>
            <button
              onClick={() => setExtendingRental(upcomingReturnAlert)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 text-white border border-slate-700 font-bold text-xs hover:bg-slate-800 transition-all"
            >
              Extend Days
            </button>
          </div>
        </motion.div>
      )}

      {/* Dashboard Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-bold overflow-x-auto">
        {[
          { id: 'rentals', label: `Active Rentals & History (${rentals.length})` },
          { id: 'orders', label: `Purchases (${orders.length})` },
          { id: 'saved', label: `Saved Items (${savedProducts.length})` },
          { id: 'kyc', label: 'Identity & KYC' },
          { id: 'disputes', label: `Support Tickets (${disputes.length})` }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
              activeTab === t.id
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: RENTALS */}
      {activeTab === 'rentals' && (
        <div className="space-y-4">
          {rentals.length > 0 ? (
            rentals.map((rental) => {
              const daysLeft = getDaysRemaining(rental.returnDate);
              const isActive = rental.status === 'Active' || rental.status === 'Approved';

              return (
                <div
                  key={rental.id}
                  className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={rental.productImage}
                      alt={rental.productName}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            rental.status === 'Active'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : rental.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : rental.status === 'Return Requested'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          }`}
                        >
                          {rental.status}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {rental.id}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1">{rental.productName}</h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Duration: {rental.durationDays} days ({formatDate(rental.startDate)} – {formatDate(rental.returnDate)})
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs">
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Security Deposit</div>
                      <div className="font-bold text-cyan-400">{formatCurrency(rental.securityDeposit)}</div>
                      <div className="text-[10px] text-emerald-400">{rental.depositStatus}</div>
                    </div>

                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Rental Charges</div>
                      <div className="font-bold text-white">{formatCurrency(rental.totalRentalAmount)}</div>
                      <div className="text-[10px] text-slate-400">{formatCurrency(rental.rentalPricePerDay)}/day</div>
                    </div>

                    {/* Actions */}
                    {isActive && (
                      <div className="flex sm:flex-col gap-2">
                        <button
                          onClick={() => handleReturnRequest(rental.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs"
                        >
                          Request Return
                        </button>
                        <button
                          onClick={() => setExtendingRental(rental)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs"
                        >
                          Extend Rental
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() =>
                        setActiveDisputeModal({
                          orderId: rental.id,
                          targetType: 'Rental Equipment',
                          name: rental.productName
                        })
                      }
                      className="text-slate-500 hover:text-rose-400 text-[11px] underline"
                    >
                      Report issue
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 glass-card rounded-2xl border border-slate-800">
              <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-white">No active rentals found</div>
              <p className="text-xs text-slate-400 mt-1">Explore our marketplace to rent gear.</p>
              <button
                onClick={() => navigateTo('marketplace')}
                className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-[#07090e] font-bold text-xs"
              >
                Browse Marketplace
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PURCHASES */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="text-[10px] text-slate-500 font-mono">ORDER #{order.id}</div>
                    <h3 className="text-sm font-bold text-white">{order.productName}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">Purchased on {formatDate(order.createdAt)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px]">Amount Paid</div>
                    <div className="text-base font-black text-white">{formatCurrency(order.sellingPrice)}</div>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    {order.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 glass-card rounded-2xl border border-slate-800">
              <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-white">No purchase orders placed yet</div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED WISHLIST */}
      {activeTab === 'saved' && (
        <div>
          {savedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-card rounded-2xl border border-slate-800">
              <Heart className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-white">Your wishlist is empty</div>
              <p className="text-xs text-slate-400 mt-1">Click the heart icon on any product to save it here.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: KYC VERIFICATION */}
      {activeTab === 'kyc' && (
        <div className="max-w-xl glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Customer KYC Verification</h3>
              <div className="text-xs text-slate-400">Government ID & Biometric Verification</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Account Status: Verified Customer (Tier 1 SafeShield Access)</span>
          </div>

          <form onSubmit={handleKycSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Identity Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="Aadhaar">Aadhaar Card (UIDAI)</option>
                <option value="Passport">Passport</option>
                <option value="DrivingLicense">Driving License</option>
                <option value="PAN">PAN Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Document Number / Masked ID
              </label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs"
            >
              Update Verified Identity
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: DISPUTES */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          {disputes.length > 0 ? (
            disputes.map((disp) => (
              <div key={disp.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white text-sm">{disp.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                      disp.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {disp.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{disp.description}</p>
                {disp.resolution && (
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-xs text-emerald-300">
                    <strong>Admin Resolution:</strong> {disp.resolution}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 glass-card rounded-2xl border border-slate-800">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <div className="text-sm font-bold text-white">No active dispute complaints</div>
              <p className="text-xs text-slate-400 mt-1">All your rental orders are running smoothly.</p>
            </div>
          )}
        </div>
      )}

      {/* EXTEND RENTAL MODAL */}
      {extendingRental && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 border border-slate-700 bg-[#0b0f19] max-w-md w-full space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Extend Rental Duration</h3>
              <button onClick={() => setExtendingRental(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300">
              Extending: <strong className="text-white">{extendingRental.productName}</strong>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Select Additional Days to Add
              </label>
              <div className="flex gap-2">
                {[1, 3, 5, 7, 14].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setExtraDays(d)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                      extraDays === d
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    +{d}d
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex justify-between">
              <span className="text-slate-400">Additional Charges:</span>
              <span className="font-bold text-cyan-400">
                {formatCurrency(extraDays * extendingRental.rentalPricePerDay)}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setExtendingRental(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExtend}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs"
              >
                Confirm Extension
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
