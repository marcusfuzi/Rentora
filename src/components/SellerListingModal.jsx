import React, { useState } from 'react';
import { X, Plus, Upload, ShieldCheck, DollarSign, Image, Tag, ArrowRight, Check } from 'lucide-react';
import { useRentora } from '../context/RentoraContext';

export default function SellerListingModal() {
  const {
    isSellerModalOpen,
    setIsSellerModalOpen,
    addSellerProduct,
    currentUser,
    selectedLocation
  } = useRentora();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Photography');
  const [dailyRate, setDailyRate] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [condition, setCondition] = useState('Pristine / Like-New');
  const [featuresText, setFeaturesText] = useState('Flight-Case Included, Calibrated Optics, Insured');

  const presetImages = [
    { label: "Cinema Camera", url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80" },
    { label: "M3 Workstation", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80" },
    { label: "Gaming Console", url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80" },
    { label: "Laser Optics", url: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80" },
    { label: "Precision Tool", url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80" }
  ];

  if (!isSellerModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !dailyRate) return;

    const features = featuresText.split(',').map(f => f.trim()).filter(Boolean);

    addSellerProduct({
      name,
      category,
      dailyRate,
      buyPrice: buyPrice || (Number(dailyRate) * 35).toString(),
      securityDeposit: securityDeposit || (Number(dailyRate) * 1.5).toString(),
      description: description || `Pristine condition ${category.toLowerCase()} equipment listed by authorized partner.`,
      image: imageUrl || presetImages[0].url,
      features,
      location: selectedLocation,
      condition
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#F5F5EF] text-[#121512] rounded-3xl overflow-hidden shadow-2xl border border-[#183D2B]/15 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#183D2B]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#183D2B] text-[#C9F36B] flex items-center justify-center font-black">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#183D2B]/10 text-[10px] font-mono font-bold uppercase text-[#183D2B]">
                Seller Listing Portal
              </div>
              <h3 className="font-display font-black text-xl text-[#183D2B] tracking-tight">
                List Equipment for Rent or Sale
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsSellerModalOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 text-[#121512]/60 hover:text-[#121512] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-5">
          <div>
            <label className="text-xs font-bold text-[#183D2B] block mb-1">
              Equipment Name & Model *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sony FX3 Cinema Line Full-Frame Rig"
              className="w-full bg-white border border-[#183D2B]/15 rounded-xl px-4 py-2.5 text-sm text-[#121512] focus:outline-none focus:border-[#183D2B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#183D2B] block mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-[#183D2B]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#121512] font-semibold focus:outline-none focus:border-[#183D2B]"
              >
                <option value="Photography">Photography & Cine</option>
                <option value="Work Setup">Work Setup & Computing</option>
                <option value="Gaming">Gaming & Simulation</option>
                <option value="Electronics">Electronics & Optics</option>
                <option value="Tools & Equipment">Tools & Industrial</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#183D2B] block mb-1">
                Hardware Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-white border border-[#183D2B]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#121512] font-semibold focus:outline-none focus:border-[#183D2B]"
              >
                <option value="Pristine / Like-New">Pristine / Like-New (Pelican Case)</option>
                <option value="Certified Production Grade">Certified Production Grade</option>
                <option value="Minor Cosmetic Wear Only">Minor Cosmetic Wear Only</option>
              </select>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-[#183D2B]/10">
            <div>
              <label className="text-[11px] font-bold text-[#183D2B] block mb-1">
                Rental Price ($/day) *
              </label>
              <input
                type="number"
                required
                value={dailyRate}
                onChange={(e) => setDailyRate(e.target.value)}
                placeholder="e.g. 110"
                className="w-full bg-[#F5F5EF] border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#183D2B] block mb-1">
                Selling Price ($)
              </label>
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="e.g. 3899"
                className="w-full bg-[#F5F5EF] border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#183D2B] block mb-1">
                Security Deposit ($)
              </label>
              <input
                type="number"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                placeholder="e.g. 150"
                className="w-full bg-[#F5F5EF] border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold"
              />
            </div>
          </div>

          {/* Image Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#183D2B] block">
              Equipment Photo
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste high-res image URL (or pick quick preset below)"
              className="w-full bg-white border border-[#183D2B]/15 rounded-xl px-4 py-2 text-xs text-[#121512]"
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {presetImages.map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer ${
                    imageUrl === preset.url
                      ? 'bg-[#183D2B] text-[#C9F36B]'
                      : 'bg-[#EAEAE2] hover:bg-slate-200 text-[#121512]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#183D2B] block mb-1">
              Description & Rig Inclusions
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details about what's included in the package..."
              className="w-full bg-white border border-[#183D2B]/15 rounded-xl p-3 text-xs text-[#121512] focus:outline-none focus:border-[#183D2B]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#183D2B] block mb-1">
              Key Features (comma separated)
            </label>
            <input
              type="text"
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              className="w-full bg-white border border-[#183D2B]/15 rounded-xl px-4 py-2 text-xs text-[#121512]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsSellerModalOpen(false)}
              className="px-6 py-3 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-[#183D2B] hover:bg-[#121512] text-white text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Publish Live Listing</span>
              <ArrowRight className="w-4 h-4 text-[#C9F36B]" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
