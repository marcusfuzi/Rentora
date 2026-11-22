import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { api } from '../services/api';

export default function DisputeModal() {
  const { activeDisputeModal: disputeData, setActiveDisputeModal, addNotification } = useMarketplace();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!disputeData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    try {
      await api.createDispute({
        orderId: disputeData.orderId || disputeData.targetId || 'Marketplace Item',
        targetType: disputeData.targetType || 'Product / Seller',
        targetId: disputeData.targetId || '',
        title,
        description
      });

      setSubmitted(true);
      addNotification({
        title: 'Dispute Ticket Raised',
        message: 'Your report has been sent to Rentora Trust & Safety. Case assigned for mediation.',
        type: 'warning'
      });
    } catch (err) {
      alert('Error creating dispute: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setActiveDisputeModal(null);
    setSubmitted(false);
    setTitle('');
    setDescription('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg glass-card rounded-3xl border border-slate-700 bg-[#0b0f19] shadow-2xl overflow-hidden my-6"
        >
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Report / Dispute Center</h3>
                <div className="text-xs text-slate-400">Mediation & Fraud Protection Escalation</div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Regarding Target:</span>
                  <strong className="text-white font-semibold">
                    {disputeData.name || disputeData.targetType || 'Rental Item / Transaction'}
                  </strong>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Dispute Reason / Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Item cosmetic wear, Late return dispute, Deposit query..."
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Detailed Explanation & Evidence Summary
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide exact details of what occurred..."
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-rose-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Dispute...' : 'Submit to Admin Review'}</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Dispute Filed Successfully</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Our Trust & Safety administrators have received your complaint and will investigate with all parties. Escrow funds remain frozen until resolved.
                </p>
                <button
                  onClick={handleClose}
                  className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
