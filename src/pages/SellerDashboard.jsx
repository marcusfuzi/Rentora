import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Plus,
  Coins,
  TrendingUp,
  Package,
  Calendar,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  Edit2,
  Trash2,
  Image as ImageIcon,
  ShieldCheck,
  X,
  Upload
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function SellerDashboard() {
  const { user } = useAuth();
  const { products, refreshProducts, addNotification } = useMarketplace();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'listings' | 'requests' | 'analytics'
  const [analytics, setAnalytics] = useState(null);
  const [sellerRentals, setSellerRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Product Modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Cameras');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [listingType, setListingType] = useState('Rent & Sell');
  const [rentalPricePerDay, setRentalPricePerDay] = useState(1200);
  const [sellingPrice, setSellingPrice] = useState(180000);
  const [securityDeposit, setSecurityDeposit] = useState(15000);
  const [availability, setAvailability] = useState('In Stock');

  const fetchSellerData = async () => {
    setLoading(true);
    try {
      const [analyticsData, rentalsData] = await Promise.all([
        api.getSellerAnalytics(),
        api.getRentals()
      ]);
      setAnalytics(analyticsData);
      setSellerRentals(rentalsData.rentals || []);
    } catch (err) {
      console.error('Failed to load seller analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, []);

  const sellerProducts = products.filter(
    (p) => p.seller?.id === user?.id || p.seller?.email === user?.email || p.seller?.id === 'seller-1'
  );

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Cameras');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80');
    setListingType('Rent & Sell');
    setRentalPricePerDay(1200);
    setSellingPrice(180000);
    setSecurityDeposit(15000);
    setAvailability('In Stock');
    setProductModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setName(prod.name);
    setCategory(prod.category);
    setDescription(prod.description);
    setImageUrl(prod.images[0] || '');
    setListingType(prod.listingType);
    setRentalPricePerDay(prod.rentalPricePerDay);
    setSellingPrice(prod.sellingPrice);
    setSecurityDeposit(prod.securityDeposit);
    setAvailability(prod.availability);
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        category,
        description,
        images: [imageUrl],
        listingType,
        rentalPricePerDay: Number(rentalPricePerDay),
        sellingPrice: Number(sellingPrice),
        securityDeposit: Number(securityDeposit),
        availability
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        addNotification({
          title: 'Listing Updated',
          message: `${name} has been updated successfully.`,
          type: 'success'
        });
      } else {
        await api.createProduct(payload);
        addNotification({
          title: 'Product Listed',
          message: `${name} is now live in the Rentora Marketplace!`,
          type: 'success'
        });
      }

      setProductModalOpen(false);
      refreshProducts();
      fetchSellerData();
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to remove this listing?')) return;
    try {
      await api.deleteProduct(id);
      addNotification({
        title: 'Listing Removed',
        message: 'Product listing deleted from marketplace.',
        type: 'info'
      });
      refreshProducts();
      fetchSellerData();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleUpdateRentalStatus = async (rentalId, newStatus) => {
    try {
      await api.updateRentalStatus(rentalId, newStatus);
      addNotification({
        title: 'Status Updated',
        message: `Rental marked as ${newStatus}.`,
        type: 'success'
      });
      fetchSellerData();
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  const kpis = analytics?.kpis || {
    totalRevenue: 289700,
    rentalEarnings: 69700,
    salesEarnings: 220000,
    activeRentals: 1,
    totalRentalsCount: 2,
    totalSalesCount: 1,
    totalListings: sellerProducts.length,
    avgRating: 4.9
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Seller Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 p-[2px]">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name}
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {user?.businessName || user?.name || 'Apex Visuals Lab'}
              </h1>
              <ShieldCheck className="w-5 h-5 text-emerald-400" title="Verified Commercial Seller" />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Seller Control Panel • GSTIN: 29ABCDE1234F1Z5 • 4.9★ (184 Reviews)
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product Listing</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Earnings</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{formatCurrency(kpis.totalRevenue)}</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-semibold">
            +18.4% growth this month
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Active Rentals</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{kpis.activeRentals}</div>
          <div className="text-[10px] text-slate-400 mt-1">Equipment deployed with renters</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Live Listings</span>
            <Package className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{sellerProducts.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">Catalog items in marketplace</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Owner Rating</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">4.9 / 5.0</div>
          <div className="text-[10px] text-slate-400 mt-1">Verified renter feedback score</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-bold overflow-x-auto">
        {[
          { id: 'overview', label: 'Revenue & Analytics' },
          { id: 'listings', label: `Manage Listings (${sellerProducts.length})` },
          { id: 'requests', label: `Rental Requests & Orders (${sellerRentals.length})` }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
              activeTab === t.id
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: REVENUE & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white text-base">Monthly Earnings Trajectory</h3>
                <p className="text-xs text-slate-400">Rental revenue vs Direct sales payouts</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Rentals
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  Direct Sales
                </span>
              </div>
            </div>

            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.chartData || []}>
                  <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#475569"
                    fontSize={11}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d121f',
                      border: '1px solid #1e293b',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#fff'
                    }}
                    formatter={(val) => [formatCurrency(val), '']}
                  />
                  <Bar dataKey="rentals" name="Rentals" fill="#00f2fe" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sales" name="Sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Your Marketplace Catalog
            </span>
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellerProducts.map((p) => (
              <div
                key={p.id}
                className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 mb-3 relative">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md">
                      {p.listingType}
                    </span>
                    <span
                      className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.availability === 'In Stock'
                          ? 'bg-emerald-500/80 text-white'
                          : 'bg-amber-500/80 text-white'
                      }`}
                    >
                      {p.availability}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white line-clamp-1">{p.name}</h4>
                  <div className="text-xs text-slate-400 mt-1 flex justify-between">
                    <span>Rent: {formatCurrency(p.rentalPricePerDay)}/day</span>
                    <span>Buy: {formatCurrency(p.sellingPrice)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex gap-2">
                  <button
                    onClick={() => handleOpenEditModal(p)}
                    className="flex-1 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Edit2 className="w-3 h-3 text-cyan-400" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RENTAL REQUESTS & ORDERS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {sellerRentals.length > 0 ? (
            sellerRentals.map((r) => (
              <div
                key={r.id}
                className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={r.productImage}
                    alt={r.productName}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">ID: {r.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                        {r.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-0.5">{r.productName}</h4>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Rented by <strong className="text-slate-200">{r.customerName}</strong> ({r.durationDays} days)
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
                  <div className="text-right sm:pr-4 sm:border-r border-slate-800">
                    <div className="text-slate-400 text-[10px]">Rental Amount</div>
                    <div className="text-sm font-black text-white">{formatCurrency(r.totalRentalAmount)}</div>
                    <div className="text-[10px] text-cyan-400 font-semibold">{r.depositStatus}</div>
                  </div>

                  {/* Seller Status Actions */}
                  <div className="flex items-center gap-1.5">
                    {r.status === 'Approved' && (
                      <button
                        onClick={() => handleUpdateRentalStatus(r.id, 'Active')}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Mark Dispatched</span>
                      </button>
                    )}

                    {r.status === 'Return Requested' && (
                      <button
                        onClick={() => handleUpdateRentalStatus(r.id, 'Completed')}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Inspect & Release Deposit</span>
                      </button>
                    )}

                    {r.status === 'Active' && (
                      <button
                        onClick={() => handleUpdateRentalStatus(r.id, 'Overdue')}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-semibold"
                      >
                        Flag Overdue
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 glass-card rounded-2xl border border-slate-800">
              <Package className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-white">No active requests at the moment</div>
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700 bg-[#0b0f19] max-w-xl w-full my-6 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-black text-white text-lg">
                  {editingProduct ? 'Edit Equipment Listing' : 'List New Equipment'}
                </h3>
                <div className="text-xs text-slate-400">Rentora Commercial Marketplace Catalog</div>
              </div>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Product Name & Model
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sony Alpha A7 IV Body"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                  >
                    {[
                      'Electronics',
                      'Cameras',
                      'Laptops',
                      'Gaming Consoles',
                      'Vehicles',
                      'Projectors',
                      'Speakers',
                      'Drones',
                      'Tools and Equipment',
                      'Other Products'
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Listing Mode
                  </label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                  >
                    <option value="Rent & Sell">Rent & Sell (Both)</option>
                    <option value="Rent Only">Rent Only</option>
                    <option value="Sell Only">Sell Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Rental Price / Day
                  </label>
                  <input
                    type="number"
                    required
                    value={rentalPricePerDay}
                    onChange={(e) => setRentalPricePerDay(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Selling Price
                  </label>
                  <input
                    type="number"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Security Deposit
                  </label>
                  <input
                    type="number"
                    required
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Description & Condition Details
                </label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Include sensor condition, shutter count, accessories included..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="py-3 px-5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm shadow-lg"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Listing to Rentora'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
