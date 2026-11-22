import React from 'react';
import { Mail, CheckCircle2, AlertCircle, Info, X, Copy, Sparkles } from 'lucide-react';
import { useRentora } from '../context/RentoraContext';

export default function ToastBanner() {
  const { toasts, removeToast } = useRentora();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-[100] flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isOtp = toast.type === 'otp';
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl p-4 shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-4 flex items-start gap-3.5 ${
              isOtp
                ? 'bg-[#183D2B] text-white border-[#C9F36B]/40 ring-2 ring-[#C9F36B]/30'
                : isSuccess
                ? 'bg-white text-[#121512] border-emerald-500/30 ring-1 ring-emerald-500/20'
                : isError
                ? 'bg-rose-950 text-rose-100 border-rose-500/40'
                : 'bg-[#121512] text-white border-white/10'
            }`}
          >
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {isOtp ? (
                <div className="w-8 h-8 rounded-xl bg-[#C9F36B] text-[#183D2B] flex items-center justify-center font-black">
                  <Mail className="w-4 h-4" />
                </div>
              ) : isSuccess ? (
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : isError ? (
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-mono font-bold tracking-wider uppercase ${isOtp ? 'text-[#C9F36B]' : ''}`}>
                  {toast.title}
                </span>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="opacity-50 hover:opacity-100 transition p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs mt-1 leading-snug opacity-90 font-medium">
                {toast.message}
              </p>

              {/* Special Highlight for OTP Code */}
              {isOtp && toast.code && (
                <div className="mt-2.5 space-y-2">
                  <div className="p-2 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-white/60 font-mono block">6-Digit Verification Code:</span>
                      <span className="text-xl font-mono font-black text-[#C9F36B] tracking-widest">
                        {toast.code}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(toast.code);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#C9F36B] text-[#183D2B] text-[10px] font-bold uppercase flex items-center gap-1 hover:bg-white transition cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>

                  {toast.previewUrl && (
                    <a
                      href={toast.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[11px] text-[#C9F36B] underline font-mono hover:text-white"
                    >
                      Open Live Email in Browser (Nodemailer Ethereal) ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
