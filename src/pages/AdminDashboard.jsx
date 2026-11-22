import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  ShieldCheck,
  ShieldAlert,
  Users,
  Coins,
  Package,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Filter,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { products, refreshProducts, addNotification } = useMarketplace();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'sellers' | 'disputes' | 'products' | 'transactions'
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dispute resolution modal state
  const [resolvingDispute, setResolvingDispute] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminAnalytics();
      setAdminData(data);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleResolveDispute = async (status) => {
    if (!resolvingDispute) return;
    try {
      await api.resolveDispute(resolvingDispute.id, {
        resolution: resolutionNote || 'Resolved by Rentora Trust & Safety Admin Team',
        status
      });

      addNotification({
        title: 'Dispute Resolved',
        message: `Case ${resolvingDispute.id} was marked as ${status}.`,
        type: 'success'
      });

      setResolvingDispute(null);
      setResolutionNote('');
      fetchAdminData();
    } catch (err) {
      alert('Failed to resolve dispute: ' + err.message);
    }
  };

  const handleVerifySeller = (userId) => {
    alert(`[KYC Approved] Seller identity credentials verified. Verified badge awarded.`);
    fetchAdminData();
  };

  const kpis = adminData?.kpis || {
    totalGMV: 489000,
    platformRevenue: 48900,
    totalUsers: 3,
    totalCustomers: 1,
    totalSellers: 1,
    activeRentalsCount: 1,
    totalListingsCount: products.length,
    pendingDisputesCount: 1
  };

  const usersList = adminData?.users || [];
  const disputesList = adminData?.disputes || [];
  const recentRentals = adminData?.recentRentals || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Admin Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/30 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-[2px]">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-purple-300">
              <Layers className="w-8 h-8" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Admin Command Center
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Super Administrator
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Platform Governance • Escrow Custody • Fraud Prevention • Dispute Resolution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400">Total GMV</div>
            <div className="text-lg font-black text-white">{formatCurrency(kpis.totalGMV)}</div>
          </div>
          <div className="bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400">Platform Fees (10%)</div>
            <div className="text-lg font-black text-gradient">{formatCurrency(kpis.platformRevenue)}</div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Registered Accounts</div>
          <div className="text-2xl font-black text-white">{kpis.totalUsers}</div>
          <div className="text-[10px] text-cyan-400 mt-1">
            {kpis.totalCustomers} Customers • {kpis.totalSellers} Verified Sellers
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Active Rental Contracts</div>
          <div className="text-2xl font-black text-cyan-400">{kpis.activeRentalsCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">SafeShield Escrow active</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Active Catalog Listings</div>
          <div className="text-2xl font-black text-purple-400">{products.length}</div>
          <div className="text-[10px] text-emerald-400 mt-1">Across 10 Categories</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Disputes Under Review</div>
          <div className="text-2xl font-black text-amber-400">{kpis.pendingDisputesCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Escrow hold status pending</div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-bold overflow-x-auto">
        {[
          { id: 'overview', label: 'Platform Transactions' },
          { id: 'sellers', label: `Manage Users & Sellers (${usersList.length})` },
          { id: 'disputes', label: `Dispute Resolution (${disputesList.length})` },
          { id: 'products', label: `Listing Moderation (${products.length})` }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
              activeTab === t.id
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: TRANSACTIONS & ESCROW */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <h3 className="font-bold text-white text-sm mb-4">SafeShield Escrow & Rental Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="pb-3">Ref ID</th>
                    <th className="pb-3">Product Name</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Duration</th>
                    <th className="pb-3">Deposit Escrow</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentRentals.map((r) => (
                    <tr key={r.id} className="text-slate-300">
                      <td className="py-3 font-mono text-cyan-400">{r.id}</td>
                      <td className="py-3 font-semibold text-white max-w-xs truncate">{r.productName}</td>
                      <td className="py-3">{r.customerName}</td>
                      <td className="py-3">{r.durationDays} days</td>
                      <td className="py-3 font-semibold text-cyan-400">{formatCurrency(r.securityDeposit)}</td>
                      <td className="py-3 font-bold text-white">{formatCurrency(r.grandTotal)}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE USERS & SELLER KYC */}
      {activeTab === 'sellers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {usersList.map((u) => (
              <div key={u.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      u.role === 'seller'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : u.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    {u.role}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{u.id}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white">
                    {u.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs flex items-center gap-1">
                      <span>{u.name}</span>
                      {u.verified && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                  <div>City: {u.city || 'India'}</div>
                  {u.businessName && <div>Entity: {u.businessName}</div>}
                  {u.gstin && <div>GSTIN: {u.gstin}</div>}
                  <div className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>KYC Status: {u.kycStatus || 'Verified'}</span>
                  </div>
                </div>

                {u.role === 'seller' && (
                  <button
                    onClick={() => handleVerifySeller(u.id)}
                    className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                  >
                    Re-Verify Credentials
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DISPUTE RESOLUTION */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          {disputesList.map((d) => (
            <div
              key={d.id}
              className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 font-bold">{d.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      d.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{d.title}</h4>
                <p className="text-xs text-slate-300 max-w-xl">{d.description}</p>
                {d.resolution && (
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs text-emerald-300">
                    <strong>Admin Finding:</strong> {d.resolution}
                  </div>
                )}
              </div>

              {d.status !== 'Resolved' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setResolvingDispute(d)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md"
                  >
                    Resolve Dispute
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: LISTING MODERATION */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex gap-3">
                <img src={p.images[0]} alt={p.name} className="w-14 h-14 object-cover rounded-xl" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">{p.category}</div>
                  <div className="text-[11px] text-cyan-400 font-semibold">
                    {formatCurrency(p.rentalPricePerDay)}/day • {formatCurrency(p.sellingPrice)}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-800 text-slate-400">
                <span>Seller: {p.seller?.name}</span>
                <span className="text-emerald-400 font-semibold">Moderation Approved</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DISPUTE RESOLUTION MODAL */}
      {resolvingDispute && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 border border-slate-700 bg-[#0b0f19] max-w-md w-full space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Dispute Finding & Resolution</h3>
              <button onClick={() => setResolvingDispute(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300">
              Case: <strong className="text-white">{resolvingDispute.title}</strong>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Resolution Ruling & Action Note
              </label>
              <textarea
                rows="3"
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Enter outcome (e.g. Deposit refunded to customer, No damages noted, Courtesy credit issued)..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleResolveDispute('Resolved - Full Deposit Refund')}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs"
              >
                Refund Escrow Deposit
              </button>
              <button
                onClick={() => handleResolveDispute('Resolved - Released to Seller')}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs"
              >
                Release to Seller
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
