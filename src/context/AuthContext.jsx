import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('rentora_token') || null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState('login'); // 'login' | 'register'
  const [authModalInitialRole, setAuthModalInitialRole] = useState('customer'); // 'customer' | 'seller'

  useEffect(() => {
    async function initUser() {
      if (token) {
        try {
          const data = await api.getMe();
          setUser(data.user);
        } catch (err) {
          console.warn('Session expired or invalid:', err);
          setUser(null);
          setToken(null);
          localStorage.removeItem('rentora_token');
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    }

    initUser();
  }, [token]);

  const login = async (email, password, role) => {
    const data = await api.login(email, password, role);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('rentora_token', data.token);
    setAuthModalOpen(false);
    return data.user;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('rentora_token', data.token);
    setAuthModalOpen(false);
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('rentora_token');
  };

  const switchRole = async (targetRole) => {
    setLoading(true);
    try {
      const data = await api.demoSwitchRole(targetRole);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('rentora_token', data.token);
      return data.user;
    } catch (err) {
      console.error('Switch role failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAuth = (tab = 'login', role = 'customer') => {
    setAuthModalInitialTab(tab);
    setAuthModalInitialRole(role);
    setAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        login,
        register,
        logout,
        switchRole,
        authModalOpen,
        setAuthModalOpen,
        authModalInitialTab,
        authModalInitialRole,
        openAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
