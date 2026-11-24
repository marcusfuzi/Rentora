import React, { useState } from 'react';
import {
  X,
  User,
  Package,
  Clock,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Building2,
  Plus,
  Sparkles,
  LogOut,
  ArrowUpRight,
  Receipt,
  Bell,
  Trash2,
  Calendar,
  FileText,
  Truck,
  ExternalLink
} from 'lucide-react';
import { useRentora } from '../context/RentoraContext';
import { formatINR } from '../data/rentoraData';

export default function UserDashboardModal() {
  const {
    isDashboardOpen,
    setIsDashboardOpen,
    currentUser,
    logout,
    userRentals,
    userOrders,
    returnRentalItem,
    extendRentalItem,
    priceAlerts,
    removePriceAlert,
    openInvoiceModal,
    setIsSellerModalOpen,
    openComparisonModal
  } = useRentora();

  const [activeTab, setActiveTab] = useState('rentals'); // 'rentals' | 'orders' | 'alerts' | 'inventory'

  if (!isDashboardOpen || !currentUser) return null;

  const isSeller = currentUser.role === 'seller';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-4xl bg-[#F5F5EF] text-[#121512] rounded-3xl overflow-hidden shadow-2xl border border-[#183D2B]/15 max-h-[92vh] flex flex-col">
        
        {/* Top Header Card */}
        <div className="p-6 bg-white border-b border-[#183D2B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#183D2B]/20 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-xl text-[#183D2B] tracking-tight">
                  {currentUser.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#183D2B] text-[#C9F36B] text-[10px] font-mono font-bold uppercase">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {currentUser.email} • {currentUser.city || 'Mumbai, MH'}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{currentUser.kycStatus || 'KYC Verified (SafeShield Escrow Active)'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsDashboardOpen(false);
                setIsSellerModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#183D2B] text-[#C9F36B] text-xs font-bold uppercase flex items-center gap-1.5 hover:bg-[#121512] transition cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List Gear</span>
            </button>

            <button
              onClick={logout}
              className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsDashboardOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100 text-[#121512]/60 hover:text-[#121512] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-4 bg-white border-b border-[#183D2B]/10 flex flex-wrap gap-6 text-xs font-bold font-mono">
          <button
            onClick={() => setActiveTab('rentals')}
            className={`pb-3 relative cursor-pointer ${
              activeTab === 'rentals'
                ? 'text-[#183D2B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#183D2B]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Active Rentals ({userRentals.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 relative cursor-pointer ${
              activeTab === 'orders'
                ? 'text-[#183D2B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#183D2B]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Purchase Orders ({userOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`pb-3 relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'text-[#183D2B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#183D2B]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Price Watch Alerts ({priceAlerts.length})</span>
          </button>

          {isSeller && (
            <button
              onClick={() => setActiveTab('inventory')}
              className={`pb-3 relative cursor-pointer ${
                activeTab === 'inventory'
                  ? 'text-[#183D2B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#183D2B]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Seller Metrics & Inventory
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
          
          {/* ========================================================= */}
          {/* TAB 1: ACTIVE RENTALS                                     */}
          {/* ========================================================= */}
          {activeTab === 'rentals' && (
            <div className="space-y-4">
              {userRentals.map((rental) => {
                const isActive = rental.status.includes('Active') || rental.status.includes('Order Placed');
                return (
                  <div
                    key={rental.id}
                    className="p-5 bg-white rounded-2xl border border-[#183D2B]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <img
                        src={rental.image}
                        alt={rental.productName}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-[#121512]">
                            {rental.productName}
                          </h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                            isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {rental.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 font-mono">
                          Period: {rental.startDate} → <strong className="text-[#183D2B]">{rental.returnDate}</strong> ({rental.durationDays} days)
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono pt-0.5">
                          <span className="text-[#183D2B] font-bold">
                            Rental Fee: {formatINR(rental.totalRentalAmount)}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-emerald-700 font-semibold">
                            Deposit: {formatINR(rental.securityDeposit)} ({rental.depositStatus})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 pt-1">
                          <Truck className="w-3.5 h-3.5 text-[#183D2B]" />
                          <span>{rental.carrier} — Tracking: <strong>{rental.trackingNumber}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap md:flex-col items-stretch md:items-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      {isActive && (
                        <>
                          <button
                            type="button"
                            onClick={() => extendRentalItem(rental.id, 30)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold font-mono transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Extend Lease (+30D)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => returnRentalItem(rental.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#183D2B] hover:bg-[#121512] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 font-mono shadow-sm"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-[#C9F36B]" />
                            <span>Return & Release Escrow</span>
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => openInvoiceModal({
                          orderId: rental.id,
                          receiptNumber: rental.receiptNumber || `RCPT-${rental.trackingNumber}`,
                          paymentId: rental.paymentId || 'pay_verified',
                          date: rental.startDate,
                          customerName: currentUser?.name || 'Verified Renter',
                          email: currentUser?.email || 'customer@rentora.in',
                          productName: rental.productName,
                          mode: 'rent',
                          durationDays: rental.durationDays,
                          amount: Number(rental.totalRentalAmount) + Number(rental.securityDeposit),
                          rentalCost: rental.totalRentalAmount,
                          deposit: rental.securityDeposit
                        })}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5 text-[#183D2B]" />
                        <span>Tax Invoice</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {userRentals.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-sm">
                  No active rentals currently. Browse the marketplace to reserve gear.
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PURCHASE ORDERS                                    */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 bg-white rounded-2xl border border-[#183D2B]/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={order.image}
                      alt={order.productName}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-[#121512]">
                          {order.productName}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">
                        Purchased on {order.purchaseDate} • {order.warranty}
                      </p>
                      <p className="text-xs font-mono font-bold text-[#183D2B]">
                        Outright Purchase: {formatINR(order.price)}
                      </p>
                      <p className="text-[11px] font-mono text-slate-400">
                        Tracking ID: {order.trackingNumber || 'RNT-BUY-8921'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openInvoiceModal({
                      orderId: order.id,
                      receiptNumber: order.receiptNumber || `RCPT-${order.trackingNumber || 'BUY'}`,
                      paymentId: order.paymentId || 'pay_direct_order',
                      date: order.purchaseDate,
                      customerName: currentUser?.name || 'Verified Customer',
                      email: currentUser?.email || 'customer@rentora.in',
                      productName: order.productName,
                      mode: 'buy',
                      durationDays: 0,
                      amount: order.price,
                      rentalCost: order.price,
                      deposit: 0
                    })}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-center"
                  >
                    <Receipt className="w-3.5 h-3.5 text-[#183D2B]" />
                    <span>Tax Invoice</span>
                  </button>
                </div>
              ))}

              {userOrders.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-sm">
                  No outright equipment orders yet.
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: PRICE WATCH ALERTS                                 */}
          {/* ========================================================= */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-mono text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    RENTORA SmartPrice™ monitors Amazon, Flipkart & Croma every 15 minutes.
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded-full font-bold uppercase">
                  Automated Webhook Active
                </span>
              </div>

              {priceAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-5 bg-white rounded-2xl border border-[#183D2B]/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={alert.image}
                      alt={alert.productName}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-[#121512]">
                        {alert.productName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                        <span className="text-slate-500">
                          Target Alert: <strong className="text-emerald-700">{formatINR(alert.targetPrice)}</strong>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">
                          Current Lowest: <strong className="text-[#183D2B]">{formatINR(alert.currentLowest)}</strong> ({alert.store})
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400">
                        Alert sent to: <span className="underline">{alert.email}</span> • Tracking since {alert.createdDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => removePriceAlert(alert.id)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                      title="Delete Price Alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {priceAlerts.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-sm">
                  No price drop alerts active. Click "Compare Amazon & Flipkart" on any product to set your target price alert.
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: SELLER METRICS                                     */}
          {/* ========================================================= */}
          {activeTab === 'inventory' && isSeller && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-[#183D2B] text-white rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono text-[#C9F36B] uppercase block">Total Rental Earnings</span>
                  <div className="text-2xl font-black font-mono">₹1,48,500</div>
                  <span className="text-[10px] text-white/60">Disbursed via automated wire</span>
                </div>

                <div className="p-4 bg-white border border-[#183D2B]/10 rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Active Deployed Rigs</span>
                  <div className="text-2xl font-black font-mono text-[#183D2B]">6 Rigs</div>
                  <span className="text-[10px] text-emerald-700 font-bold">100% Insured under SafeShield</span>
                </div>

                <div className="p-4 bg-white border border-[#183D2B]/10 rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Seller Partner Rating</span>
                  <div className="text-2xl font-black font-mono text-[#183D2B]">4.98 / 5.0</div>
                  <span className="text-[10px] text-slate-500">Based on 140+ verified rentals</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                <span>Want to deploy more idle camera bodies, lenses or computing rigs?</span>
                <button
                  onClick={() => {
                    setIsDashboardOpen(false);
                    setIsSellerModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#183D2B] text-[#C9F36B] font-bold text-xs uppercase cursor-pointer"
                >
                  List New Equipment
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}