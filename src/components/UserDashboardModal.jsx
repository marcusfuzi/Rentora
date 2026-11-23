import React, { useState } from 'react';
import { X, User, Package, Clock, ShieldCheck, CheckCircle2, RotateCcw, ArrowRight, Building2, Plus, Sparkles, LogOut, ArrowUpRight } from 'lucide-react';
import { useRentora } from '../context/RentoraContext';

export default function UserDashboardModal() {
  const {
    isDashboardOpen,
    setIsDashboardOpen,
    currentUser,
    logout,
    userRentals,
    userOrders,
    returnRentalItem,
    setIsSellerModalOpen
  } = useRentora();

  const [activeTab, setActiveTab] = useState('rentals'); // 'rentals' | 'orders' | 'inventory'

  if (!isDashboardOpen || !currentUser) return null;

  const isSeller = currentUser.role === 'seller';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-[#F5F5EF] text-[#121512] rounded-3xl overflow-hidden shadow-2xl border border-[#183D2B]/15 max-h-[92vh] flex flex-col">
        
        {/* Top Header Card */}
        <div className="p-6 bg-white border-b border-[#183D2B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
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
                {currentUser.email} • {currentUser.city}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{currentUser.kycStatus || 'KYC Verified (SafeShield Active)'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSeller && (
              <button
                onClick={() => {
                  setIsDashboardOpen(false);
                  setIsSellerModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#183D2B] text-[#C9F36B] text-xs font-bold uppercase flex items-center gap-1.5 hover:bg-[#121512] transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>List Gear</span>
              </button>
            )}

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
        <div className="px-6 pt-4 bg-white border-b border-[#183D2B]/10 flex gap-6 text-xs font-bold">
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
          
          {/* TAB 1: RENTALS */}
          {activeTab === 'rentals' && (
            <div className="space-y-4">
              {userRentals.map((rental) => {
                const isActive = rental.status.includes('Active') || rental.status.includes('Order Placed');
                return (
                  <div
                    key={rental.id}
                    className="p-5 bg-white rounded-2xl border border-[#183D2B]/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={rental.image}
                        alt={rental.productName}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#121512]">
                            {rental.productName}
                          </h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                            isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {rental.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500">
                          Period: {rental.startDate} → <strong>{rental.returnDate}</strong> ({rental.durationDays} days)
                        </p>

                        <div className="flex items-center gap-3 text-xs font-mono">
                          <span className="text-[#183D2B] font-bold">
                            Rental: ${rental.totalRentalAmount}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-emerald-700 font-semibold">
                            Deposit: ${rental.securityDeposit} ({rental.depositStatus})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <span className="text-[11px] font-mono text-slate-400">
                        {rental.carrier}
                      </span>
                      {isActive && (
                        <button
                          onClick={() => returnRentalItem(rental.id)}
                          className="px-4 py-2 rounded-full bg-[#183D2B] hover:bg-[#121512] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-[#C9F36B]" />
                          <span>Return & Release Deposit</span>
                        </button>
                      )}
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

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 bg-white rounded-2xl border border-[#183D2B]/10 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={order.image}
                      alt={order.productName}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#121512]">
                        {order.productName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Delivered on {order.purchaseDate} • {order.warranty}
                      </p>
                      <p className="text-xs font-mono font-bold text-[#183D2B] mt-1">
                        Outright Purchase: ₹{Number(order.price).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                    {order.status}
                  </span>
                </div>
              ))}

              {userOrders.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-sm">
                  No outright equipment orders yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SELLER METRICS */}
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
                  className="px-3.5 py-1.5 rounded-lg bg-[#183D2B] text-[#C9F36B] font-bold text-xs uppercase"
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
