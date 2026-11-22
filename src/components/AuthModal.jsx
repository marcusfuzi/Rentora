import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, ShieldCheck, Store, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalInitialTab,
    authModalInitialRole,
    login,
    register
  } = useAuth();

  const [activeTab, setActiveTab] = useState(authModalInitialTab || 'login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState(authModalInitialRole || 'customer'); // 'customer' | 'seller' | 'admin'

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [gstin, setGstin] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleAutofill = (role) => {
    setSelectedRole(role);
    setActiveTab('login');
    if (role === 'customer') {
      setEmail('customer@rentora.com');
      setPassword('password123');
    } else if (role === 'seller') {
      setEmail('seller@rentora.com');
      setPassword('password123');
    } else if (role === 'admin') {
      setEmail('admin@rentora.com');
      setPassword('password123');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        await login(email, password, selectedRole);
      } else {
        await register({
          name,
          email,
          password,
          role: selectedRole,
          businessName,
          gstin,
          phone,
          city
        });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md glass-card rounded-3xl border border-slate-700 bg-[#0b0f19] shadow-2xl overflow-hidden my-6"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1.5px]">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-cyan-400">
                  R
                </div>
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {activeTab === 'login' ? 'Sign In to Rentora' : 'Create Rentora Account'}
                </h3>
                <div className="text-xs text-slate-400">Role-Based Secure Access</div>
              </div>
            </div>
            <button
              onClick={() => setAuthModalOpen(false)}
              className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6">
            {/* Quick 1-Click Demo Accounts */}
            <div className="mb-5 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>1-Click Test Credentials</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAutofill('customer')}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold border border-cyan-500/20"
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => handleAutofill('seller')}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] font-semibold border border-emerald-500/20"
                >
                  Seller
                </button>
                <button
                  type="button"
                  onClick={() => handleAutofill('admin')}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-[11px] font-semibold border border-purple-500/20"
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Role Selector Tabs */}
            <div className="flex gap-1.5 p-1 bg-slate-900 rounded-xl mb-4 border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedRole === 'customer'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('seller')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedRole === 'seller'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400'
                }`}
              >
                Seller
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'text-slate-400'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Tab: Login vs Register */}
            <div className="flex border-b border-slate-800 mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 pb-2.5 transition-colors border-b-2 ${
                  activeTab === 'login' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-500'
                }`}
              >
                Sign In
              </button>
              {selectedRole !== 'admin' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 pb-2.5 transition-colors border-b-2 ${
                    activeTab === 'register' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-500'
                  }`}
                >
                  Register New {selectedRole === 'seller' ? 'Seller' : 'Customer'}
                </button>
              )}
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {activeTab === 'register' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Patel"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'register' && selectedRole === 'seller' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Apex Gadgets Hub"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      GSTIN (Optional)
                    </label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="29ABCDE1234F1Z5"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@rentora.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {activeTab === 'register' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai, KA"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>
                  {isLoading
                    ? 'Authenticating...'
                    : activeTab === 'login'
                    ? `Sign In as ${selectedRole}`
                    : `Register as ${selectedRole}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
