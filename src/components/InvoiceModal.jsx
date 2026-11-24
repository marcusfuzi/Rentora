import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2, Download, FileText, Building2 } from 'lucide-react';
import { useRentora } from '../context/RentoraContext';
import { formatINR } from '../data/rentoraData';

export default function InvoiceModal() {
  const { invoiceModalData, closeInvoiceModal } = useRentora();

  if (!invoiceModalData) return null;

  const {
    orderId,
    receiptNumber,
    paymentId,
    date,
    customerName,
    email,
    productName,
    mode,
    durationDays,
    amount,
    rentalCost,
    deposit
  } = invoiceModalData;

  const isRent = mode !== 'buy';
  const gstRate = 0.18;
  const taxableRental = Number(rentalCost) || Number(amount);
  const gstAmount = Math.round(taxableRental * (gstRate / (1 + gstRate)));
  const basePrice = taxableRental - gstAmount;
  const depositAmount = Number(deposit) || 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-2xl bg-white text-[#121512] rounded-3xl overflow-hidden shadow-2xl border border-slate-300 max-h-[94vh] flex flex-col font-sans">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 bg-[#183D2B] text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C9F36B]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#C9F36B]">
              Official GST Tax Invoice & Rental Agreement
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#C9F36B] hover:bg-white text-[#183D2B] text-xs font-bold font-mono uppercase flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={closeInvoiceModal}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div id="printable-invoice" className="p-6 sm:p-10 overflow-y-auto space-y-6 text-[#121512]">
          
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-black text-2xl text-[#183D2B] tracking-tight">
                  RENTORA
                </span>
                <span className="w-2 h-2 rounded-full bg-[#C9F36B]" />
              </div>
              <p className="text-[11px] font-mono text-slate-500 mt-1">
                Rentora Technologies Private Limited<br />
                BKC Corporate Hub, Bandra East, Mumbai, MH - 400051<br />
                GSTIN: <strong>27AAACR9281Q1ZU</strong> | State Code: 27 (Maharashtra)
              </p>
            </div>

            <div className="sm:text-right font-mono text-xs space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                Payment Verified (Razorpay)
              </span>
              <div className="text-slate-500 text-[11px]">Invoice No:</div>
              <div className="font-bold text-sm text-[#183D2B]">{receiptNumber || `INV-${orderId}`}</div>
              <div className="text-[11px] text-slate-500">Date: {date || new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          {/* Billed To / Shipped To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Billed To (Customer):</span>
              <div className="font-bold text-sm text-[#121512] mt-0.5">{customerName || 'Verified Renter'}</div>
              <div className="text-slate-600">{email || 'customer@rentora.in'}</div>
              <div className="text-slate-500 text-[11px] mt-1">SafeShield Verified Identity (2FA Authenticated)</div>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Transaction Reference:</span>
              <div className="text-slate-700 mt-0.5">Payment ID: <strong className="text-[#183D2B]">{paymentId}</strong></div>
              <div className="text-slate-700">Order ID: <strong>{orderId}</strong></div>
              <div className="text-slate-500 text-[11px] mt-1">Gateway: Razorpay Automated Settlement</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden font-mono text-xs">
            <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-700 grid grid-cols-12 gap-2">
              <span className="col-span-6">Description</span>
              <span className="col-span-2 text-center">Type</span>
              <span className="col-span-2 text-center">Duration</span>
              <span className="col-span-2 text-right">Amount</span>
            </div>

            <div className="divide-y divide-slate-100 p-2">
              {/* Item 1: Equipment */}
              <div className="px-3 py-3 grid grid-cols-12 gap-2 items-center">
                <div className="col-span-6">
                  <div className="font-bold text-[#121512]">{productName}</div>
                  <div className="text-[10px] text-slate-500">
                    Pro-grade hardware with Pelican case & factory calibration
                  </div>
                </div>
                <div className="col-span-2 text-center uppercase text-[10px] font-bold text-[#183D2B]">
                  {isRent ? 'Lease' : 'Purchase'}
                </div>
                <div className="col-span-2 text-center text-slate-600">
                  {isRent ? `${durationDays || 30} Days` : 'N/A'}
                </div>
                <div className="col-span-2 text-right font-bold text-[#121512]">
                  {formatINR(basePrice)}
                </div>
              </div>

              {/* Item 2: GST */}
              <div className="px-3 py-2 grid grid-cols-12 gap-2 text-slate-600 text-[11px]">
                <div className="col-span-6">GST (18% Integrated Goods & Service Tax)</div>
                <div className="col-span-2 text-center">Tax</div>
                <div className="col-span-2 text-center">-</div>
                <div className="col-span-2 text-right">{formatINR(gstAmount)}</div>
              </div>

              {/* Item 3: Escrow Deposit if rental */}
              {isRent && depositAmount > 0 && (
                <div className="px-3 py-2 grid grid-cols-12 gap-2 text-emerald-800 text-[11px] bg-emerald-50/50">
                  <div className="col-span-6 font-semibold">
                    100% Refundable SafeShield Escrow Deposit
                  </div>
                  <div className="col-span-2 text-center font-bold">Escrow</div>
                  <div className="col-span-2 text-center">-</div>
                  <div className="col-span-2 text-right font-bold">{formatINR(depositAmount)}</div>
                </div>
              )}
            </div>

            {/* Total Footer */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-1.5">
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Equipment Subtotal (incl. 18% GST):</span>
                <span>{formatINR(taxableRental)}</span>
              </div>
              {isRent && (
                <div className="flex justify-between text-emerald-700 text-[11px]">
                  <span>Refundable Escrow Deposit (Held in Trust):</span>
                  <span>{formatINR(depositAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-[#183D2B]">
                <span>Total Amount Paid via Razorpay:</span>
                <span>{formatINR(taxableRental + depositAmount)}</span>
              </div>
            </div>
          </div>

          {/* SafeShield Escrow & Return Guarantee Note */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-950 font-mono">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-[#183D2B]">SafeShield Escrow Return Guarantee</div>
              <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                Your security deposit of <strong>{formatINR(depositAmount)}</strong> is held in an encrypted institutional escrow account. Upon return and standard hardware inspection, 100% of this deposit will be refunded to your source payment method within 2 hours.
              </p>
            </div>
          </div>

          {/* Signoff */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100">
            <span>This is a computer-generated tax invoice and requires no physical signature.</span>
            <span className="font-bold text-[#183D2B]">RENTORA // 2026 Academic Edition</span>
          </div>

        </div>

      </div>
    </div>
  );
}