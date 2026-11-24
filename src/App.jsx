import React, { useEffect } from 'react';
import { RentoraProvider } from './context/RentoraContext';
import { initLenis } from './utils/smoothScroll';
import HeaderNav from './components/HeaderNav';
import CategoryQuickNav from './components/CategoryQuickNav';
import CinematicHero from './components/CinematicHero';
import ScrollStoryHorizontal from './components/ScrollStoryHorizontal';
import CategoryTakeovers from './components/CategoryTakeovers';
import RentVsBuySection from './components/RentVsBuySection';
import TrendingMarketplace from './components/TrendingMarketplace';
import HowItWorksPinned from './components/HowItWorksPinned';
import TrustSection from './components/TrustSection';
import FinalCtaSection from './components/FinalCtaSection';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import AuthOtpModal from './components/AuthOtpModal';
import MarketPriceComparisonModal from './components/MarketPriceComparisonModal';
import SellerListingModal from './components/SellerListingModal';
import UserDashboardModal from './components/UserDashboardModal';
import RazorpayModal from './components/RazorpayModal';
import ToastBanner from './components/ToastBanner';

function AppContent() {
  useEffect(() => {
    // Initialize Lenis smooth scroll engine
    const lenis = initLenis();

    return () => {
      if (lenis) {
        lenis.destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5EF] text-[#121512] font-sans antialiased selection:bg-[#C9F36B] selection:text-[#183D2B]">
      {/* Toast Notification Floating Banner (For OTP codes & system alerts) */}
      <ToastBanner />

      {/* Editorial Sticky Navigation */}
      <HeaderNav />

      {/* Main Cinematic Scroll Story Sections */}
      <main className="w-full overflow-hidden">
        {/* 1. Cinematic Hero Section (Cream palette, Flagship switcher, Razorpay) */}
        <CinematicHero />

        {/* 1.1 Category Quick Chips & 4 Core Rental Guarantees Strip */}
        <CategoryQuickNav />

        {/* 2. Scroll-Driven Product Film (Horizontal scrub with manual controls) */}
        <ScrollStoryHorizontal />

        {/* 3. Featured 5 Disciplines & Categories (Clean cream & forest green layout) */}
        <CategoryTakeovers />

        {/* 4. Rent vs Buy Financial Interactive Engine (DON'T BUY BEFORE YOU COMPARE.) */}
        <RentVsBuySection />

        {/* 5. Trending Marketplace Catalog with Real-Time Filters in INR (₹) */}
        <TrendingMarketplace />

        {/* 6. How It Works (01 Find, 02 Duration, 03 Delivery in Forest Green) */}
        <HowItWorksPinned />

        {/* 7. Trust & Verified Statistics Section */}
        <TrustSection />

        {/* 8. Final Cinematic CTA & Academic Project Credits Footer */}
        <FinalCtaSection />
      </main>

      {/* Global Interactive Modals & Drawers */}
      <RazorpayModal />
      <ProductDetailModal />
      <CartDrawer />
      <AuthOtpModal />
      <MarketPriceComparisonModal />
      <SellerListingModal />
      <UserDashboardModal />
    </div>
  );
}

export default function App() {
  return (
    <RentoraProvider>
      <AppContent />
    </RentoraProvider>
  );
}
