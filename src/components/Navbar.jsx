import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  Search,
  SlidersHorizontal,
  Bell,
  User,
  ShieldCheck,
  ShoppingBag,
  Store,
  Layers,
  ChevronDown,
  LogOut,
  Sparkles,
  Calculator,
  ArrowRightLeft,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, switchRole, logout, openAuth } = useAuth();
  const {
    currentView,
    navigateTo,
    marketplaceSearch,
    setMarketplaceSearch,
    notifications,
    markAllNotificationsRead,
    savedProductIds
  } = useMarketplace();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigateTo('marketplace', { search: marketplaceSearch });
  };

  const handleRoleSelect = (role) => {
    switchRole(role);
    setRoleDropdownOpen(false);
    if (role === 'customer') navigateTo('customer-dashboard');
    else if (role === 'seller') navigateTo('seller-dashboard');
    else if (role === 'admin') navigateTo('admin-dashboard');
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[1.5px] shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                R
              </span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-75" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-wider text-white">RENTORA</span>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-cyan-400/90 font-medium -mt-1">
              Rent Smart • Buy Better
            </div>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md items-center relative"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={marketplaceSearch}
            onChange={(e) => setMarketplaceSearch(e.target.value)}
            placeholder="Search cameras, laptops, PS5, drones..."
            className="w-full pl-10 pr-20 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/50 transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-semibold text-white rounded-lg transition-all"
          >
            Search
          </button>
        </form>

        {/* Navigation Links - Desktop */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => navigateTo('marketplace')}
            className={`transition-colors hover:text-cyan-400 ${
              currentView === 'marketplace' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => navigateTo('calculator')}
            className={`flex items-center gap-1.5 transition-colors hover:text-cyan-400 ${
              currentView === 'calculator' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            <span>Rent vs Buy</span>
          </button>
          <button
            onClick={() => {
              navigateTo('home');
              setTimeout(() => {
                const el = document.getElementById('price-comparison-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="transition-colors hover:text-cyan-400"
          >
            Price Compare
          </button>
          <button
            onClick={() => {
              navigateTo('home');
              setTimeout(() => {
                const el = document.getElementById('try-before-buy-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="transition-colors hover:text-cyan-400 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Try & Buy</span>
          </button>
        </nav>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-cyan-500/50 text-xs font-medium text-slate-200 transition-all shadow-sm"
              title="Switch demo account role"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  user?.role === 'admin'
                    ? 'bg-purple-400 shadow-[0_0_8px_#a855f7]'
                    : user?.role === 'seller'
                    ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                    : 'bg-cyan-400 shadow-[0_0_8px_#00f2fe]'
                }`}
              />
              <span className="capitalize font-semibold text-white">
                {user?.role || 'Guest'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 glass-card rounded-2xl p-2 border border-slate-700 shadow-2xl z-50">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Switch Active Role (Demo)
                </div>
                <div className="py-1 flex flex-col gap-1">
                  <button
                    onClick={() => handleRoleSelect('customer')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      user?.role === 'customer'
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-medium">Customer Portal</div>
                        <div className="text-[10px] text-slate-400">Rent, buy, track orders</div>
                      </div>
                    </div>
                    {user?.role === 'customer' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>

                  <button
                    onClick={() => handleRoleSelect('seller')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      user?.role === 'seller'
                        ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-medium">Seller Portal</div>
                        <div className="text-[10px] text-slate-400">List items, earn, approve</div>
                      </div>
                    </div>
                    {user?.role === 'seller' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>

                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      user?.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="font-medium">Admin Command Center</div>
                        <div className="text-[10px] text-slate-400">Disputes, moderation, GMV</div>
                      </div>
                    </div>
                    {user?.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifDropdownOpen(!notifDropdownOpen);
                if (!notifDropdownOpen && unreadCount > 0) markAllNotificationsRead();
              }}
              className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-slate-600 text-slate-300 transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-[#07090e] font-extrabold text-[10px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl p-3 border border-slate-700 shadow-2xl z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Notifications
                  </span>
                  <span className="text-[10px] text-cyan-400 cursor-pointer" onClick={markAllNotificationsRead}>
                    Mark read
                  </span>
                </div>
                <div className="mt-2 flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl text-xs border ${
                        n.unread
                          ? 'bg-cyan-950/30 border-cyan-500/30 text-slate-200'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-semibold text-white flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-300">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role-specific Dashboard CTA Button */}
          {user?.role === 'seller' ? (
            <button
              onClick={() => navigateTo('seller-dashboard')}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Seller Control</span>
            </button>
          ) : user?.role === 'admin' ? (
            <button
              onClick={() => navigateTo('admin-dashboard')}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Admin Center</span>
            </button>
          ) : (
            <button
              onClick={() => navigateTo('customer-dashboard')}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(0,242,254,0.25)] transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>My Rentals</span>
            </button>
          )}

          {/* User Profile / Auth Button */}
          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
              <button
                onClick={() => {
                  if (user.role === 'seller') navigateTo('seller-dashboard');
                  else if (user.role === 'admin') navigateTo('admin-dashboard');
                  else navigateTo('customer-dashboard');
                }}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors"
                title="Account Settings & Dashboard"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 p-[1px]">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-[7px]"
                  />
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                    <span>{user.name.split(' ')[0]}</span>
                    {user.verified && <ShieldCheck className="w-3 h-3 text-cyan-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">{user.role}</div>
                </div>
              </button>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuth('login')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-600 transition-all"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-[#090d16] p-4 flex flex-col gap-3">
          <form onSubmit={handleSearchSubmit} className="flex relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={marketplaceSearch}
              onChange={(e) => setMarketplaceSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none"
            />
          </form>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                navigateTo('marketplace');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs font-medium text-slate-200"
            >
              Marketplace
            </button>
            <button
              onClick={() => {
                navigateTo('calculator');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs font-medium text-slate-200 flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rent vs Buy</span>
            </button>
            <button
              onClick={() => {
                navigateTo('customer-dashboard');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs font-medium text-slate-200"
            >
              Customer Dashboard
            </button>
            <button
              onClick={() => {
                navigateTo('seller-dashboard');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs font-medium text-slate-200"
            >
              Seller Dashboard
            </button>
            <button
              onClick={() => {
                navigateTo('admin-dashboard');
                setMobileMenuOpen(false);
              }}
              className="col-span-2 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs font-medium text-purple-300"
            >
              Admin Command Center
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
