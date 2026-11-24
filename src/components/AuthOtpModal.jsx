import React, { useState, useRef, useEffect } from 'react';
import { X, Mail, ShieldCheck, ArrowRight, RotateCw, CheckCircle2, User, Sparkles, Building2, Phone, KeyRound, Lock, Eye, EyeOff, ExternalLink, AlertCircle, ArrowLeft } from 'lucide-react';
import { useRentora } from '../context/RentoraContext';

// Strict email regex: user@domain.tld
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function AuthOtpModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authTab,
    setAuthTab,
    authRole,
    setAuthRole,
    otpSent,
    setOtpSent,
    generatedOtp,
    emailPreviewUrl,
    sendOtp,
    verifyOtp,
    resendOtp,
    resendCooldown,
    pendingAuthData,
    sendForgotPasswordOtp,
    resetPassword,
    addToast
  } = useRentora();

  // Mode: 'login' | 'register' | 'forgot'
  const isLogin = authTab === 'login';
  const isForgot = authTab === 'forgot';

  // Form states (Login / Register)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [gstin, setGstin] = useState('');

  // 6-digit OTP input states (Login / Register)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const digitRefs = useRef([]);

  // Forgot Password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtpDigits, setForgotOtpDigits] = useState(['', '', '', '', '', '']);
  const forgotDigitRefs = useRef([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Error/Status
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      if (!otpSent) {
        setOtpDigits(['', '', '', '', '', '']);
      }
      setForgotOtpSent(false);
      setForgotOtpDigits(['', '', '', '', '', '']);
      setNewPassword('');
      setConfirmNewPassword('');
    }
  }, [isAuthModalOpen, otpSent, authTab]);

  if (!isAuthModalOpen) return null;

  // Handle Login / Register OTP dispatch
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // 1. Strict genuine email check
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMsg('Kripya ek sahi aur valid email address enter karein (jaise name@gmail.com). Sahi email par hi OTP send hoga.');
      return;
    }

    // 2. Strict password check
    if (!password || password.length < 6) {
      setErrorMsg('Password kam se kam 6 characters ka hona zaroori hai.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setErrorMsg('Password aur Confirm Password match nahi kar rahe hain.');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendOtp(trimmedEmail, authRole, {
        password,
        name,
        phone,
        businessName,
        gstin,
        isLogin
      });

      // Focus first digit box after OTP sent
      setTimeout(() => {
        if (digitRefs.current[0]) {
          digitRefs.current[0].focus();
        }
      }, 200);
    } catch (err) {
      setErrorMsg(err.message || 'OTP dispatch me error aaya.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP Digits input handler for Login/Register
  const handleDigitChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6).split('');
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      if (digitRefs.current[Math.min(pasted.length, 5)]) {
        digitRefs.current[Math.min(pasted.length, 5)].focus();
      }
      return;
    }

    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    if (cleaned && index < 5) {
      digitRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData) {
      const newDigits = [...otpDigits];
      pasteData.split('').forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      if (digitRefs.current[Math.min(pasteData.length, 5)]) {
        digitRefs.current[Math.min(pasteData.length, 5)].focus();
      }
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) {
      setErrorMsg('Kripya sabhi 6 digits ka OTP code enter karein.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');
    try {
      const success = await verifyOtp(code);
      if (!success) {
        setErrorMsg('Galat ya expired OTP code! Kripya dobara check karein.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Verification fail ho gaya.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAutoFillOtp = () => {
    if (!generatedOtp) return;
    const digits = generatedOtp.split('');
    setOtpDigits(digits);
    if (digitRefs.current[5]) {
      digitRefs.current[5].focus();
    }
  };

  // -------------------------------------------------------------
  // FORGOT PASSWORD HANDLERS
  // -------------------------------------------------------------
  const handleSendForgotOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const targetEmail = (forgotEmail || email).trim();
    if (!targetEmail || !EMAIL_REGEX.test(targetEmail)) {
      setErrorMsg('Kripya ek valid email enter karein (e.g. name@gmail.com).');
      return;
    }

    setIsForgotSubmitting(true);
    try {
      await sendForgotPasswordOtp(targetEmail);
      setForgotOtpSent(true);
      setSuccessMsg(`Password Reset OTP aapke email (${targetEmail}) par send ho gaya hai!`);
      setTimeout(() => {
        if (forgotDigitRefs.current[0]) {
          forgotDigitRefs.current[0].focus();
        }
      }, 200);
    } catch (err) {
      setErrorMsg(err.message || 'Reset OTP send nahi ho paya.');
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  const handleForgotDigitChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    const newDigits = [...forgotOtpDigits];

    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6).split('');
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setForgotOtpDigits(newDigits);
      if (forgotDigitRefs.current[Math.min(pasted.length, 5)]) {
        forgotDigitRefs.current[Math.min(pasted.length, 5)].focus();
      }
      return;
    }

    newDigits[index] = cleaned;
    setForgotOtpDigits(newDigits);

    if (cleaned && index < 5) {
      forgotDigitRefs.current[index + 1]?.focus();
    }
  };

  const handleForgotAutoFill = () => {
    if (!generatedOtp) return;
    const digits = generatedOtp.split('');
    setForgotOtpDigits(digits);
    if (forgotDigitRefs.current[5]) {
      forgotDigitRefs.current[5].focus();
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const code = forgotOtpDigits.join('');
    if (code.length < 6) {
      setErrorMsg('Kripya sabhi 6 digits ka Reset OTP code enter karein.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Naya password kam se kam 6 characters ka hona chahiye.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('New Password aur Confirm New Password match nahi kar rahe hain.');
      return;
    }

    setIsResetting(true);
    try {
      const targetEmail = (forgotEmail || email).trim();
      await resetPassword(targetEmail, code, newPassword);

      // Pre-fill email and password in login form
      setEmail(targetEmail);
      setPassword(newPassword);
      setAuthTab('login');
      setForgotOtpSent(false);
      setSuccessMsg('Password safalta-purvak badal gaya hai! Ab naye password se Sign In karein (OTP verify hoga).');
    } catch (err) {
      setErrorMsg(err.message || 'Password update nahi ho saka.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      
      {/* Modal Container: High-End Obsidian Dark Card */}
      <div className="relative w-full max-w-lg bg-[#121512] text-white rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-[#C9F36B]/25">
        
        {/* Subtle radial emerald background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#183D2B] rounded-full blur-3xl pointer-events-none opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C9F36B]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="relative z-10 p-6 bg-black/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#183D2B] text-[#C9F36B] font-display font-black text-xl flex items-center justify-center shadow-lg border border-[#C9F36B]/30">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
                  {isForgot
                    ? (forgotOtpSent ? 'Set New Password' : 'Reset Password')
                    : otpSent
                    ? 'Email Verification OTP'
                    : isLogin
                    ? 'Sign In to Rentora'
                    : 'Create Rentora Account'}
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#C9F36B] animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {isForgot
                  ? 'Email OTP Verification ke through Password Badlein'
                  : otpSent
                  ? 'Real Email OTP + Password Authentication'
                  : 'Verified Creative Equipment Marketplace'}
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 p-6 sm:p-8 space-y-5">

          {/* Mode Switcher: Sign In vs Create Account (Hidden during OTP or Forgot flow) */}
          {!otpSent && !isForgot && (
            <div className="flex rounded-2xl bg-white/5 p-1 border border-white/10 text-xs font-bold font-mono">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
                  isLogin
                    ? 'bg-[#183D2B] text-[#C9F36B] shadow-md border border-[#C9F36B]/30 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In (Existing User)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
                  !isLogin
                    ? 'bg-[#183D2B] text-[#C9F36B] shadow-md border border-[#C9F36B]/30 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account (New User)
              </button>
            </div>
          )}

          {/* Role Selector Tabs (Customer vs Seller) */}
          {!otpSent && !isForgot && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block">
                Select Account Role
              </span>
              <div className="grid grid-cols-2 gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setAuthRole('customer')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    authRole === 'customer'
                      ? 'bg-[#183D2B] text-[#C9F36B] shadow-md border border-[#C9F36B]/30 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Customer (Rent & Buy)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthRole('seller')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    authRole === 'seller'
                      ? 'bg-[#183D2B] text-[#C9F36B] shadow-md border border-[#C9F36B]/30 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Seller (List & Monetize)</span>
                </button>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-semibold animate-in fade-in flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-xs text-rose-300 font-semibold animate-in shake flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* FLOW A: FORGOT PASSWORD FLOW                              */}
          {/* ========================================================= */}
          {isForgot ? (
            !forgotOtpSent ? (
              /* Step 1 of Forgot Password: Enter Email */
              <form onSubmit={handleSendForgotOtp} className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#C9F36B] font-bold">
                    <KeyRound className="w-4 h-4" />
                    <span>PASSWORD RESET RECOVERY</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Apna registered email address enter karein. Us email par ek 6-digit One-Time Password (OTP) send kiya jayega jisse aap naya password set kar sakein.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-white block mb-1">
                    Registered Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={forgotEmail || email}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="yourname@gmail.com"
                      className="w-full bg-black/50 border border-white/15 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C9F36B] focus:ring-1 focus:ring-[#C9F36B] transition font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isForgotSubmitting}
                  className="w-full py-4 rounded-full bg-[#183D2B] hover:bg-[#C9F36B] hover:text-[#183D2B] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-50"
                >
                  {isForgotSubmitting ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin text-[#C9F36B]" />
                      <span>Sending Reset OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset OTP to Email</span>
                      <ArrowRight className="w-4 h-4 text-[#C9F36B]" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('login');
                      setErrorMsg('');
                    }}
                    className="text-xs text-slate-400 hover:text-white font-mono flex items-center justify-center gap-1.5 mx-auto transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Password yaad hai? Sign In karein</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2 of Forgot Password: Enter OTP & Set New Password */
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4 animate-in fade-in">
                <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1 text-center">
                  <span className="text-[11px] font-mono text-[#C9F36B] uppercase font-bold block">
                    Reset OTP Sent to:
                  </span>
                  <div className="text-sm font-mono font-bold text-white">{forgotEmail || email}</div>
                  <p className="text-[11px] text-slate-400">
                    Email me aaya 6-digit code enter karein aur naya password banayein.
                  </p>
                </div>

                {/* 6-Digit OTP Box for Reset */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-center block text-slate-400 font-bold">
                    Enter 6-Digit Reset Code:
                  </label>
                  <div className="flex justify-center gap-2">
                    {forgotOtpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (forgotDigitRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleForgotDigitChange(idx, e.target.value)}
                        className="w-10 h-12 text-center font-mono font-black text-xl bg-black/60 border-2 border-white/20 rounded-xl focus:border-[#C9F36B] text-white shadow-inner"
                      />
                    ))}
                  </div>

                  {generatedOtp && (
                    <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                      <span>Code: <strong className="text-[#C9F36B]">{generatedOtp}</strong></span>
                      <button
                        type="button"
                        onClick={handleForgotAutoFill}
                        className="text-[10px] text-[#C9F36B] hover:underline uppercase font-bold"
                      >
                        Auto-Fill Code
                      </button>
                    </div>
                  )}
                </div>

                {/* New Password Input */}
                <div>
                  <label className="text-xs font-bold text-white block mb-1">
                    New Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/50 border border-white/15 rounded-2xl pl-11 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C9F36B] transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password Input */}
                <div>
                  <label className="text-xs font-bold text-white block mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/50 border border-white/15 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C9F36B] transition font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full py-4 rounded-full bg-[#C9F36B] hover:bg-white text-[#183D2B] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50 font-display"
                >
                  {isResetting ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin text-[#183D2B]" />
                      <span>Saving New Password...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#183D2B]" />
                      <span>Set New Password & Proceed to Sign In</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotOtpSent(false);
                      setAuthTab('login');
                    }}
                    className="text-xs text-slate-400 hover:text-white font-mono transition"
                  >
                    Cancel / Back to Sign In
                  </button>
                </div>
              </form>
            )
          ) : !otpSent ? (
            /* ========================================================= */
            /* FLOW B: NORMAL SIGN IN / REGISTER FORM                    */
            /* ========================================================= */
            <form onSubmit={handleSendOtp} className="space-y-4">
              
              {/* Email Input with strict validation */}
              <div>
                <label className="text-xs font-bold text-white block mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder={authRole === 'seller' ? 'partner@studio.com' : 'yourname@gmail.com'}
                    className="w-full bg-black/50 border border-white/15 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C9F36B] focus:ring-1 focus:ring-[#C9F36B] transition font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Sign in karte samay 2FA security ke liye is email par OTP send hoga.
                </span>
              </div>

              {/* Password Input with Show/Hide toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-white">
                    Password *
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('forgot');
                        setForgotEmail(email);
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-[11px] font-mono text-[#C9F36B] hover:underline font-bold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-white/15 rounded-2xl pl-11 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C9F36B] focus:ring-1 focus:ring-[#C9F36B] transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (when creating account) */}
              {!isLogin && (
                <div>
                  <label className="text-xs font-bold text-white block mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/50 border border-white/15 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C9F36B] transition font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Extra details when registering */}
              {!isLogin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C9F36B]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C9F36B]"
                    />
                  </div>
                </div>
              )}

              {/* Seller details */}
              {!isLogin && authRole === 'seller' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Business / Studio Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Apex Visuals Lab"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C9F36B]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Tax / GSTIN (Optional)
                    </label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="e.g. 29ABCDE1234F1Z5"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C9F36B]"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#183D2B] hover:bg-[#C9F36B] hover:text-[#183D2B] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-3 group disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-[#C9F36B]" />
                    <span>Verifying & Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Sign In OTP</span>
                    <ArrowRight className="w-4 h-4 text-[#C9F36B] group-hover:text-[#183D2B] group-hover:translate-x-1 transition duration-300" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ========================================================= */
            /* FLOW C: ENTER 6-DIGIT SIGN IN / REGISTRATION OTP          */
            /* ========================================================= */
            <form onSubmit={handleVerifySubmit} className="space-y-5 animate-in fade-in duration-300">
              
              {/* Delivery notification box */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-[#C9F36B]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>OTP DISPATCHED VIA EMAIL</span>
                </div>
                <p className="text-sm font-mono font-bold text-white">{pendingAuthData.email}</p>
                <p className="text-[11px] text-slate-400">
                  Apne email inbox me 6-digit verification code check karein aur yahan enter karein.
                </p>

                {/* Direct live web preview button if Ethereal / mailer URL available */}
                {emailPreviewUrl && (
                  <div className="pt-2">
                    <a
                      href={emailPreviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C9F36B]/20 hover:bg-[#C9F36B]/30 border border-[#C9F36B]/40 text-[#C9F36B] text-xs font-mono font-bold transition"
                    >
                      <span>Open Real Sent Email in Browser</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* 6 Boxed OTP Digits */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-center block text-slate-400 font-bold">
                  Enter 6-Digit Verification Code:
                </label>
                <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (digitRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-14 sm:w-13 sm:h-16 text-center font-mono font-black text-2xl bg-black/60 border-2 border-white/20 rounded-2xl focus:border-[#C9F36B] focus:ring-2 focus:ring-[#C9F36B]/50 focus:outline-none text-white shadow-inner transition"
                    />
                  ))}
                </div>
              </div>

              {/* Auto-fill Helper Chip */}
              {generatedOtp && (
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-white/80 font-mono">
                    Dispatched Code: <strong className="text-[#C9F36B]">{generatedOtp}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    className="px-3 py-1 bg-[#183D2B] text-[#C9F36B] text-[10px] font-bold uppercase rounded-lg hover:bg-white hover:text-[#183D2B] transition cursor-pointer"
                  >
                    Auto-Fill OTP
                  </button>
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-4 rounded-full bg-[#C9F36B] hover:bg-white text-[#183D2B] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display"
              >
                {isVerifying ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-[#183D2B]" />
                    <span>Verifying Code & Logging In...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#183D2B]" />
                    <span>Verify OTP & Sign In</span>
                  </>
                )}
              </button>

              {/* Resend Timer & Change Email */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => sendOtp(pendingAuthData.email, authRole, pendingAuthData)}
                  disabled={resendCooldown > 0}
                  className={`font-semibold cursor-pointer ${
                    resendCooldown > 0 ? 'opacity-40' : 'text-[#C9F36B] hover:underline'
                  }`}
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP Code'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                  }}
                  className="hover:underline text-slate-400 hover:text-white cursor-pointer"
                >
                  Change Email / Password
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
