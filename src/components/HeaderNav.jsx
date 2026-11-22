import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, MapPin, ArrowUpRight, Menu, X, User, Plus, ShieldCheck, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { useRentora } from '../context/RentoraContext';
import { scrollToSection } from '../utils/smoothScroll';

export default function HeaderNav() {
  const {
    activeMode,
    setActiveMode,
    selectedLocation,
    setSelectedLocation,
    cart,
    setIsCartOpen,
    currentUser,
    openAuthModal,
    logout,
    setIsDashboardOpen,
    setIsSellerModalOpen
  } = useRentora();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdown, setLocationDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: "Product Film", href: "story-scroll" },
    { label: "Categories", href: "categories" },
    { label: "Rent vs Buy", href: "rent-vs-buy" },
    { label: "Marketplace", href: "marketplace" },
    { label: "How It Works", href: "how-it-works" },
  ];

  const locations = [
    "Mumbai, MH",
    "Bengaluru, KA",
    "Delhi NCR",
    "Hyderabad, TS",
    "Pune, MH"
  ];

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      <header className="fixed top-3 sm:top-4 left-0 right-0 z-40 px-3 sm:px-6 transition-all duration-300 select-none">
        <div className={`max-w-7xl mx-auto rounded-full transition-all duration-500 px-4 sm:px-6 py-2.5 sm:py-3 border ${
          scrolled
            ? 'bg-[#F5F5EF]/95 backdrop-blur-2xl border-[#183D2B]/20 shadow-xl shadow-[#183D2B]/5'
            : 'bg-white/90 backdrop-blur-xl border-[#183D2B]/10 shadow-md'
        }`}>
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <div
              onClick={() => handleNavClick('hero')}
              className="cursor-pointer group flex items-baseline gap-1"
            >
              <span className="font-display font-black text-2xl sm:text-3xl text-[#183D2B] tracking-tighter">
                RENTORA
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9F36B] group-hover:scale-150 transition duration-300 shadow-xs" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#121512]/80">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className="hover:text-[#183D2B] transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* City Location Picker */}
              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setLocationDropdown(!locationDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F5EF] hover:bg-slate-200 text-[#121512]/80 text-xs font-mono border border-[#183D2B]/10 transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{selectedLocation}</span>
                  <ChevronDown className="w-3 h-3 text-[#121512]/40" />
                </button>

                {locationDropdown && (
                  <div className="absolute top-full mt-2 left-0 w-48 rounded-2xl bg-white border border-[#183D2B]/15 shadow-2xl p-2 z-50 animate-fade-in font-mono text-xs">
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(loc);
                          setLocationDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl transition ${
                          selectedLocation === loc
                            ? 'bg-[#183D2B] text-[#C9F36B] font-bold'
                            : 'text-[#121512]/80 hover:bg-slate-100'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mode Toggle */}
              <div className="hidden sm:flex items-center bg-[#EAEAE2] p-1 rounded-full border border-[#183D2B]/10 text-xs font-bold shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveMode('rent')}
                  className={`px-3.5 py-1 rounded-full transition cursor-pointer ${
                    activeMode === 'rent'
                      ? 'bg-[#183D2B] text-[#C9F36B] shadow-sm font-black'
                      : 'text-[#121512]/70 hover:text-[#121512]'
                  }`}
                >
                  Rent
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('buy')}
                  className={`px-3.5 py-1 rounded-full transition cursor-pointer ${
                    activeMode === 'buy'
                      ? 'bg-[#183D2B] text-[#C9F36B] shadow-sm font-black'
                      : 'text-[#121512]/70 hover:text-[#121512]'
                  }`}
                >
                  Buy
                </button>
              </div>

              {/* Rental Bag Drawer Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183D2B] hover:bg-[#121512] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C9F36B]" />
                <span className="hidden sm:inline">Rental Bag</span>
                {cart.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#C9F36B] text-[#183D2B] flex items-center justify-center text-[10px] font-mono font-black">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* User Account / OTP Login */}
              {currentUser ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full bg-[#F5F5EF] hover:bg-slate-200 border border-[#183D2B]/15 text-[#121512] transition text-xs font-mono"
                  >
                    <img
                      src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-full object-cover border border-[#183D2B]"
                    />
                    <span className="hidden md:inline font-bold">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  </button>

                  {userDropdown && (
                    <div className="absolute top-full mt-2 right-0 w-56 rounded-2xl bg-white border border-[#183D2B]/15 shadow-2xl p-2 z-50 animate-fade-in font-mono text-xs text-[#121512]">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <div className="font-bold text-[#183D2B]">{currentUser.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          2FA Verified
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdown(false);
                          setIsDashboardOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-emerald-700" />
                        <span>My Rentals & Orders</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdown(false);
                          setIsSellerModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition flex items-center gap-2"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-700" />
                        <span>List Production Gear</span>
                      </button>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdown(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="px-4 py-1.5 rounded-full bg-[#183D2B] hover:bg-[#121512] text-white font-mono text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                >
                  Sign In (OTP)
                </button>
              )}

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-slate-200 transition text-[#183D2B]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden max-w-7xl mx-auto mt-2 p-4 rounded-3xl bg-white border border-[#183D2B]/15 shadow-2xl text-[#121512] space-y-3 font-mono text-xs">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="w-full text-left py-2 px-3 rounded-xl hover:bg-slate-100 hover:text-[#183D2B] transition"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
