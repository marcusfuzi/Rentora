import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const MarketplaceContext = createContext();

export function MarketplaceProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active navigation / view state
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'marketplace' | 'calculator' | 'customer-dashboard' | 'seller-dashboard' | 'admin-dashboard'
  const [marketplaceCategory, setMarketplaceCategory] = useState('All');
  const [marketplaceSearch, setMarketplaceSearch] = useState('');

  // Modals
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [activeRentModal, setActiveRentModal] = useState(null);
  const [activeBuyModal, setActiveBuyModal] = useState(null);
  const [activeDisputeModal, setActiveDisputeModal] = useState(null);

  // Saved / Wishlist
  const [savedProductIds, setSavedProductIds] = useState(['prod-1', 'prod-3']);

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Upcoming Return Alert',
      message: 'Sony Alpha A7 IV rental is due in 5 days. You can request a free pickup or extend anytime.',
      time: '1 hour ago',
      type: 'warning',
      unread: true
    },
    {
      id: 'notif-2',
      title: 'Security Deposit Escrow Active',
      message: '₹15,000 security deposit is protected in SafeShield Escrow until item return verification.',
      time: '2 days ago',
      type: 'info',
      unread: false
    }
  ]);

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const data = await api.getProducts(params);
      setProducts(data.products || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleSaveProduct = (productId) => {
    setSavedProductIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const addNotification = (notif) => {
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        time: 'Just now',
        unread: true,
        ...notif
      },
      ...prev
    ]);
  };

  const navigateTo = (view, extra = {}) => {
    setCurrentView(view);
    if (extra.category) setMarketplaceCategory(extra.category);
    if (extra.search !== undefined) setMarketplaceSearch(extra.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        loading,
        error,
        refreshProducts: fetchProducts,
        currentView,
        setCurrentView,
        navigateTo,
        marketplaceCategory,
        setMarketplaceCategory,
        marketplaceSearch,
        setMarketplaceSearch,
        savedProductIds,
        toggleSaveProduct,
        activeProductModal,
        setActiveProductModal,
        activeRentModal,
        setActiveRentModal,
        activeBuyModal,
        setActiveBuyModal,
        activeDisputeModal,
        setActiveDisputeModal,
        notifications,
        markAllNotificationsRead,
        addNotification
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  return useContext(MarketplaceContext);
}
