import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MARKETPLACE_PRODUCTS } from '../data/rentoraData';
import { api } from '../services/api';

const RentoraContext = createContext();

export function RentoraProvider({ children }) {
  // Mode: Rent or Buy
  const [activeMode, setActiveMode] = useState('rent'); // 'rent' | 'buy'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Mumbai, MH');
  const [rentalDurationUnit, setRentalDurationUnit] = useState('daily'); // 'daily' | 'weekly' | 'monthly'

  // Dynamic Marketplace Products (allows sellers to list items in real-time)
  const [products, setProducts] = useState(MARKETPLACE_PRODUCTS);

  // Cart & Drawer State
  const [cart, setCart] = useState([
    {
      id: "prod-1-rent-demo",
      originalId: "prod-1",
      name: "Hasselblad X2D 100C Cinema Kit",
      category: "Cameras & Photography",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
      mode: "rent",
      durationDays: 3,
      unitPrice: 14500,
      totalPrice: 43500,
      securityDeposit: 35000,
      location: "Mumbai, MH"
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Razorpay Payment Modal State
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState(null);

  const openRazorpayCheckout = (itemOrOrder) => {
    const defaultTotal = cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 43500;
    const defaultDeposit = cart.reduce((sum, item) => sum + (item.securityDeposit || 0), 0) || 35000;
    
    const orderDetails = itemOrOrder || {
      title: "RENTORA SafeShield Equipment Lease",
      amount: defaultTotal + defaultDeposit,
      rentalCost: defaultTotal,
      securityDeposit: defaultDeposit,
      productName: cart[0]?.name || "Hasselblad X2D 100C Cinema Kit",
      image: cart[0]?.image || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
      durationDays: cart[0]?.durationDays || 3,
      mode: cart[0]?.mode || "rent"
    };
    setRazorpayOrder(orderDetails);
    setIsRazorpayModalOpen(true);
  };

  const closeRazorpayCheckout = () => {
    setIsRazorpayModalOpen(false);
  };

  // -------------------------------------------------------------
  // USER AUTH & EMAIL OTP VERIFICATION SYSTEM
  // -------------------------------------------------------------
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rentora_user_session');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default demo logged-in user
    return {
      id: "cust-1",
      name: "Aarav Patel",
      email: "aarav.patel@creatives.io",
      role: "customer", // 'customer' | 'seller' | 'admin'
      phone: "+1 (555) 392-8104",
      city: "New York, NY",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      verified: true,
      kycStatus: "Verified Pro Renter",
      escrowActive: 150
    };
  });

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [authRole, setAuthRole] = useState('customer'); // 'customer' | 'seller' | 'admin'
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [pendingAuthData, setPendingAuthData] = useState({
    email: '',
    name: '',
    phone: '',
    businessName: '',
    gstin: ''
  });
  const [resendCooldown, setResendCooldown] = useState(0);

  // User Dashboard & Seller Modals
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [comparisonProduct, setComparisonProduct] = useState(null);

  // Active Rentals & Orders state (Customer & Seller modules)
  const [userRentals, setUserRentals] = useState([
    {
      id: "rent-101",
      productId: "prod-3",
      productName: "Sony FX6 Cinema Camera",
      category: "Photography",
      image: "https://images.unsplash.com/photo-1589872766859-247097756f9a?auto=format&fit=crop&w=800&q=80",
      sellerName: "Apex Visuals Lab",
      startDate: "2026-11-19",
      returnDate: "2026-11-26",
      durationDays: 7,
      dailyRate: 120,
      totalRentalAmount: 550,
      securityDeposit: 120,
      depositStatus: "Escrow Held (SafeShield)",
      status: "Active (On Set)",
      trackingNumber: "RNT-FEDEX-99201",
      carrier: "FedEx Priority Secure Flight-Case"
    },
    {
      id: "rent-102",
      productId: "prod-4",
      productName: "PlayStation 5 Pro 8K",
      category: "Gaming",
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
      sellerName: "NexGen Gaming Hub",
      startDate: "2026-11-10",
      returnDate: "2026-11-17",
      durationDays: 7,
      dailyRate: 32,
      totalRentalAmount: 140,
      securityDeposit: 50,
      depositStatus: "Refunded to Original Card",
      status: "Completed & Returned",
      trackingNumber: "RNT-DHL-44810",
      carrier: "DHL Express"
    }
  ]);

  const [userOrders, setUserOrders] = useState([
    {
      id: "ord-881",
      productId: "prod-8",
      productName: "Apple Studio Display 27\" 5K",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
      sellerName: "Silicon Studio Gear",
      price: 1599,
      purchaseDate: "2026-11-05",
      status: "Delivered",
      warranty: "1-Yr Apple Care + Rentora Verified Guarantee"
    }
  ]);

  // Toast Notification System
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, ...toast };
    setToasts(prev => [newToast, ...prev]);

    // Auto dismiss after 8s if not dismissed manually
    setTimeout(() => {
      removeToast(id);
    }, 8000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cooldown countdown effect
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const [emailPreviewUrl, setEmailPreviewUrl] = useState(null);

  // Auth Actions
  const openAuthModal = (tab = 'login', role = 'customer') => {
    setAuthTab(tab);
    setAuthRole(role);
    setOtpSent(false);
    setGeneratedOtp('');
    setEmailPreviewUrl(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setOtpSent(false);
    setEmailPreviewUrl(null);
  };

  const sendOtp = async (email, role = 'customer', extraData = {}) => {
    // 1. Strict genuine email validation
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      const errText = 'Kripya ek sahi aur valid email address enter karein (jaise name@gmail.com). Invalid format pe OTP send nahi hoga.';
      addToast({
        type: 'error',
        title: 'Sahi Email Enter Karein',
        message: errText
      });
      throw new Error(errText);
    }

    // 2. Strict password validation
    const password = extraData.password;
    if (!password || password.length < 6) {
      const errText = 'Password kam se kam 6 characters ka hona chahiye.';
      addToast({
        type: 'error',
        title: 'Password Zaroori Hai',
        message: errText
      });
      throw new Error(errText);
    }

    try {
      // Call backend API for real email dispatching
      const res = await api.sendOtp({
        email: email.trim(),
        password: password,
        role: role,
        isLogin: extraData.isLogin,
        name: extraData.name,
        phone: extraData.phone,
        businessName: extraData.businessName,
        gstin: extraData.gstin
      });

      const code = res.otp;
      setGeneratedOtp(code);
      setEmailPreviewUrl(res.previewUrl || null);
      setOtpSent(true);
      setAuthRole(role);
      setPendingAuthData({
        email: email.trim(),
        role,
        password,
        name: extraData.name || email.trim().split('@')[0],
        phone: extraData.phone || '',
        businessName: extraData.businessName || '',
        gstin: extraData.gstin || '',
        previewUrl: res.previewUrl
      });
      setResendCooldown(30);

      addToast({
        type: 'otp',
        title: res.emailDelivered ? 'REAL EMAIL OTP SENT' : 'RENTORA OTP DISPATCHED',
        code: code,
        email: email.trim(),
        previewUrl: res.previewUrl,
        message: res.emailDelivered
          ? `Verification OTP aapke email (${email.trim()}) par bhej diya gaya hai! Inbox check karein.`
          : `Verification code for ${email.trim()} is ${code}. Valid for 10 minutes.`
      });

      return true;
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Authentication Error',
        message: err.message || 'OTP send failed.'
      });
      throw err;
    }
  };

  const verifyOtp = async (inputCode) => {
    if (!inputCode || inputCode.length !== 6) {
      addToast({
        type: 'error',
        title: 'Incomplete Code',
        message: 'Kripya sabhi 6 digits ka OTP enter karein.'
      });
      return false;
    }

    try {
      const res = await api.verifyOtp({
        email: pendingAuthData.email,
        otp: inputCode
      });

      const loggedInUser = res.user;
      setCurrentUser(loggedInUser);
      localStorage.setItem('rentora_user_session', JSON.stringify(loggedInUser));
      if (res.token) {
        localStorage.setItem('rentora_token', res.token);
      }

      setIsAuthModalOpen(false);
      setOtpSent(false);

      try {
        confetti({
          particleCount: 95,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      addToast({
        type: 'success',
        title: 'Account Verified & Logged In',
        message: `Welcome, ${loggedInUser.name}! Signed in as ${loggedInUser.role.toUpperCase()}.`
      });

      return true;
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Verification Failed',
        message: err.message || 'Galat ya expired OTP code entered.'
      });
      return false;
    }
  };

  const sendForgotPasswordOtp = async (email) => {
    const trimmedEmail = email.trim();
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      const errText = 'Kripya ek sahi aur valid email address enter karein (jaise name@gmail.com).';
      addToast({
        type: 'error',
        title: 'Sahi Email Enter Karein',
        message: errText
      });
      throw new Error(errText);
    }

    try {
      const res = await api.forgotPasswordOtp(trimmedEmail);
      setGeneratedOtp(res.otp);
      setEmailPreviewUrl(res.previewUrl || null);
      setPendingAuthData(prev => ({ ...prev, email: trimmedEmail, resetOtp: res.otp }));

      addToast({
        type: 'otp',
        title: res.emailDelivered ? 'PASSWORD RESET OTP SENT' : 'RESET OTP DISPATCHED',
        code: res.otp,
        email: trimmedEmail,
        previewUrl: res.previewUrl,
        message: res.emailDelivered
          ? `Password Reset OTP aapke Gmail (${trimmedEmail}) par bhej diya gaya hai! Inbox check karein.`
          : `Password reset verification code for ${trimmedEmail} is ${res.otp}. Valid for 10 minutes.`
      });

      return res;
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Password Reset Error',
        message: err.message || 'OTP send failed.'
      });
      throw err;
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    if (!otp || otp.length !== 6) {
      const errText = 'Kripya sabhi 6 digits ka Reset OTP code enter karein.';
      addToast({ type: 'error', title: 'Incomplete OTP', message: errText });
      throw new Error(errText);
    }
    if (!newPassword || newPassword.length < 6) {
      const errText = 'Naya password kam se kam 6 characters ka hona chahiye.';
      addToast({ type: 'error', title: 'Invalid Password', message: errText });
      throw new Error(errText);
    }

    try {
      const res = await api.resetPassword({ email: email.trim(), otp, newPassword });
      addToast({
        type: 'success',
        title: 'Password Updated!',
        message: res.message || 'Password successfully updated. Ab aap naye password se Sign In karein.'
      });
      return true;
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Reset Failed',
        message: err.message || 'Password update nahi ho paya.'
      });
      throw err;
    }
  };

  const resendOtp = () => {
    if (resendCooldown > 0) return;
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);
    setResendCooldown(30);

    addToast({
      type: 'otp',
      title: 'NEW OTP DISPATCHED',
      code: newCode,
      email: pendingAuthData.email,
      message: `Your new 6-digit code is ${newCode}.`
    });
  };

  const quickDemoLogin = (role) => {
    let demoUser;
    if (role === 'seller') {
      demoUser = {
        id: 'seller-1',
        name: 'Apex Visuals Lab',
        email: 'seller@rentora.com',
        role: 'seller',
        phone: '+1 (415) 890-1122',
        city: 'San Francisco, CA',
        businessName: 'Apex Visuals Lab Studio Gear',
        gstin: '29ABCDE1234F1Z5',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        verified: true,
        kycStatus: 'Verified Pro Gear Partner',
        rating: 4.98,
        activeListingsCount: 8,
        totalEarnings: 14850
      };
    } else if (role === 'admin') {
      demoUser = {
        id: 'admin-1',
        name: 'Rentora Global Admin',
        email: 'admin@rentora.com',
        role: 'admin',
        phone: '+1 (800) 555-RENT',
        city: 'Rentora Headquarters, NY',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        verified: true,
        kycStatus: 'Executive Admin',
        rating: 5.0
      };
    } else {
      demoUser = {
        id: 'cust-1',
        name: 'Aarav Patel',
        email: 'aarav.patel@creatives.io',
        role: 'customer',
        phone: '+1 (555) 392-8104',
        city: 'New York, NY',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        verified: true,
        kycStatus: 'Verified Pro Renter',
        rating: 4.95,
        escrowActive: 150
      };
    }

    setCurrentUser(demoUser);
    try {
      localStorage.setItem('rentora_user_session', JSON.stringify(demoUser));
    } catch {
      // ignore
    }

    setIsAuthModalOpen(false);
    addToast({
      type: 'success',
      title: 'Demo Switched',
      message: `Active session: ${demoUser.name} (${demoUser.role.toUpperCase()})`
    });
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('rentora_user_session');
    } catch {
      // ignore
    }
    setIsDashboardOpen(false);
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been logged out of Rentora.'
    });
  };

  // Seller Gear Listing Action
  const addSellerProduct = (newProduct) => {
    const formatted = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      category: newProduct.category || 'Photography',
      dailyRate: Number(newProduct.dailyRate) || 80,
      weeklyRate: Math.round((Number(newProduct.dailyRate) || 80) * 4.6),
      monthlyRate: Math.round((Number(newProduct.dailyRate) || 80) * 14),
      buyPrice: Number(newProduct.buyPrice) || 2500,
      rating: 5.0,
      reviews: 1,
      availability: 'Available Today',
      badge: 'Seller Verified Direct',
      location: newProduct.location || selectedLocation,
      image: newProduct.image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      description: newProduct.description || 'Verified pro-grade equipment inspected by authorized seller.',
      features: newProduct.features || ['Factory Calibrated', 'Pelican Air Hardcase Included', 'Full Insurance Coverage'],
      securityDeposit: Number(newProduct.securityDeposit) || 100,
      seller: {
        id: currentUser?.id || 'seller-1',
        name: currentUser?.name || 'Apex Visuals Lab',
        city: currentUser?.city || selectedLocation,
        rating: 5.0,
        verified: true
      },
      externalComparison: {
        rentoraBuyPrice: Number(newProduct.buyPrice) || 2500,
        amazonPrice: Math.round((Number(newProduct.buyPrice) || 2500) * 1.08),
        flipkartPrice: Math.round((Number(newProduct.buyPrice) || 2500) * 1.11),
        cromaPrice: Math.round((Number(newProduct.buyPrice) || 2500) * 1.09),
        savingsVsAmazon: Math.round((Number(newProduct.buyPrice) || 2500) * 0.08),
        cheapestRentora: true
      }
    };

    setProducts(prev => [formatted, ...prev]);
    setIsSellerModalOpen(false);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }

    addToast({
      type: 'success',
      title: 'Equipment Listing Published!',
      message: `${formatted.name} is now live on the RENTORA marketplace for rent and purchase.`
    });
  };

  // Return Rental action
  const returnRentalItem = (rentalId) => {
    setUserRentals(prev =>
      prev.map(item => {
        if (item.id === rentalId) {
          return {
            ...item,
            status: 'Completed & Returned',
            depositStatus: 'Refunded (Escrow Released)'
          };
        }
        return item;
      })
    );

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    addToast({
      type: 'success',
      title: 'Equipment Returned & Escrow Released',
      message: 'Inspection passed. 100% of your security deposit has been released to your card.'
    });
  };

  // Product Detail Modal
  const openProductDetail = (product, mode = 'rent') => {
    setSelectedProduct({ ...product, initialMode: mode });
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  // Comparison Modal
  const openComparisonModal = (product) => {
    setComparisonProduct(product);
    setIsComparisonModalOpen(true);
  };

  const closeComparisonModal = () => {
    setIsComparisonModalOpen(false);
    setComparisonProduct(null);
  };

  // Cart operations
  const addToCart = (product, mode = 'rent', days = 3) => {
    let unitPrice = product.dailyRate;
    let total = unitPrice * days;
    if (mode === 'buy') {
      unitPrice = product.buyPrice;
      total = product.buyPrice;
    }

    const newItem = {
      id: `${product.id}-${mode}-${Date.now()}`,
      originalId: product.id,
      name: product.name,
      category: product.category,
      image: product.image,
      mode: mode,
      durationDays: mode === 'rent' ? days : 1,
      unitPrice: unitPrice,
      totalPrice: total,
      securityDeposit: product.securityDeposit || 100,
      location: selectedLocation
    };

    setCart(prev => [newItem, ...prev]);
    setIsCartOpen(true);

    addToast({
      type: 'success',
      title: 'Added to Bag',
      message: `${product.name} added for ${mode === 'rent' ? `${days} days rental` : 'purchase'}.`
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.totalPrice, 0);
  };

  const triggerCheckoutSuccess = () => {
    setCheckoutComplete(true);
    // Add cart items into user rentals or orders
    cart.forEach(item => {
      if (item.mode === 'rent') {
        const newRental = {
          id: `rent-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          productId: item.originalId,
          productName: item.name,
          category: item.category,
          image: item.image,
          sellerName: "Rentora Certified Fleet",
          startDate: new Date().toISOString().split('T')[0],
          returnDate: new Date(Date.now() + (item.durationDays || 3) * 24 * 3600 * 1000).toISOString().split('T')[0],
          durationDays: item.durationDays,
          dailyRate: item.unitPrice,
          totalRentalAmount: item.totalPrice,
          securityDeposit: item.securityDeposit || 100,
          depositStatus: "Escrow Held (SafeShield)",
          status: "Order Placed & Dispatched",
          trackingNumber: `RNT-EXP-${Math.floor(10000 + Math.random() * 90000)}`,
          carrier: "Rentora White-Glove Courier"
        };
        setUserRentals(prev => [newRental, ...prev]);
      } else {
        const newOrder = {
          id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          productId: item.originalId,
          productName: item.name,
          image: item.image,
          sellerName: "Rentora Verified Direct",
          price: item.totalPrice,
          purchaseDate: new Date().toISOString().split('T')[0],
          status: "Processing Dispatch",
          warranty: "Manufacturer 1-Yr + Rentora Protection"
        };
        setUserOrders(prev => [newOrder, ...prev]);
      }
    });

    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  return (
    <RentoraContext.Provider
      value={{
        activeMode,
        setActiveMode,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedLocation,
        setSelectedLocation,
        rentalDurationUnit,
        setRentalDurationUnit,
        products,
        cart,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        openProductDetail,
        closeProductDetail,
        addToCart,
        removeFromCart,
        calculateSubtotal,
        checkoutComplete,
        setCheckoutComplete,
        triggerCheckoutSuccess,
        // Razorpay Gateway
        isRazorpayModalOpen,
        setIsRazorpayModalOpen,
        razorpayOrder,
        openRazorpayCheckout,
        closeRazorpayCheckout,
        // User Auth & OTP
        currentUser,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authTab,
        setAuthTab,
        authRole,
        setAuthRole,
        otpSent,
        generatedOtp,
        emailPreviewUrl,
        sendOtp,
        verifyOtp,
        sendForgotPasswordOtp,
        resetPassword,
        resendOtp,
        resendCooldown,
        pendingAuthData,
        quickDemoLogin,
        logout,
        // Seller
        isSellerModalOpen,
        setIsSellerModalOpen,
        addSellerProduct,
        // Dashboard
        isDashboardOpen,
        setIsDashboardOpen,
        userRentals,
        userOrders,
        returnRentalItem,
        // Comparison
        isComparisonModalOpen,
        comparisonProduct,
        openComparisonModal,
        closeComparisonModal,
        // Toasts
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </RentoraContext.Provider>
  );
}

export function useRentora() {
  const context = useContext(RentoraContext);
  if (!context) {
    throw new Error('useRentora must be used within a RentoraProvider');
  }
  return context;
}
