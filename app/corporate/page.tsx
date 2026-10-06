'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  User,
  Mail,
  Phone,
  Send,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  Gift,
  ArrowRight,
} from 'lucide-react';
import SubpageShell from '@/components/layout/SubpageShell';

const SANS = "'Poppins', sans-serif";
const MONO = "'Poppins', sans-serif";

const ENQUIRY_TYPES = [
  'Office Pantry & Cafeteria',
  'Corporate Gifting & Hampers',
  'Events, Summits & Offsites',
  'Wholesale & Bulk Orders',
  'Retail & Distribution',
  'Custom Brand Partnership',
];

const ESTIMATED_QUANTITIES = [
  '50 – 150 Cans',
  '150 – 500 Cans',
  '500 – 1,500 Cans',
  '1,500+ Cans (Custom Pallet)',
];

export default function CorporatePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    designation: '',
    city: '',
    enquiryType: ENQUIRY_TYPES[0],
    quantity: ESTIMATED_QUANTITIES[1],
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: clean }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.companyName.trim()) {
      setErrorMessage('Please enter your company or organisation name.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }
    if (formData.phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    const ref = `CORP-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const existing = JSON.parse(localStorage.getItem('rebelive_corporate_enquiries') || '[]');
      existing.push({
        refId: ref,
        date: new Date().toISOString(),
        ...formData,
      });
      localStorage.setItem('rebelive_corporate_enquiries', JSON.stringify(existing));
    } catch {
      // Safe fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setReferenceId(ref);
      setSubmitted(true);
    }, 700);
  };

  return (
    <SubpageShell>
      <div style={{ fontFamily: SANS }} className="space-y-16 sm:space-y-24">
        {/* ── Ambient Background Glow ── */}
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] rounded-full blur-[140px] pointer-events-none -z-10 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
          }}
        />

        {/* ── HEADER HERO SECTION ── */}
        <div className="text-center max-w-4xl mx-auto space-y-5 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/70">
              REBELIVE // CORPORATE ALLOCATIONS
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-[0.95]">
            For Teams That <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
              Never Slow Down.
            </span>
          </h1>

          <p className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Elevate your workplace. Empower better choices. Rebelive is a functional beverage designed around the needs of modern teams, bringing together support for energy, focus, stress and gut health in a zero-added-sugar RTD.
          </p>
        </div>

        {/* ── TWO-COLUMN SECTION: FORM & ENTERPRISE VALUE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT: Enterprise Value & Direct Desk (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-6 shadow-2xl">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block mb-1">
                  ENTERPRISE CAPABILITIES
                </span>
                <h3 className="text-xl font-bold uppercase text-white tracking-wide">
                  WHY REBELIVE FOR THE CORPORATE WORKFORCE?
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wide">
                      TAILOR-MADE FOR THE MODERN WORKFORCE
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Designed around the challenges today's workforce faces, from stress and energy dips to prolonged focus and everyday wellness.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wide">
                      WHEN WELLBEING IMPACTS BUSINESS
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Stress, poor energy and declining wellbeing can translate into lower productivity, absenteeism and a weaker workplace experience.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wide">
                      BETTER CHOICES, BETTER WORKPLACES
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Give employees a functional, zero-added-sugar alternative to the usual sugary beverages and conventional energy options at work.
                    </p>
                  </div>
                </div>
              </div>

            
            </div>
          </div>

          {/* RIGHT: Corporate Enquiry Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl bg-[#0d0d10] border border-white/15 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              {/* Subtle top rim light */}
              <div
                className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[150px] rounded-full blur-[80px] pointer-events-none opacity-25"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.45) 0%, transparent 70%)',
                }}
              />

              {submitted ? (
                /* Submission Success State */
                <div className="py-12 px-4 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                      Enquiry Logged Successfully
                    </h3>
                    <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                      Thank you, <span className="text-white font-medium">{formData.fullName}</span>. Your corporate allocation request for{' '}
                      <span className="text-white font-medium">{formData.companyName}</span> has been received.
                    </p>
                    <div className="inline-block px-4 py-2 mt-2 rounded-xl bg-white/5 border border-white/15 font-mono text-sm tracking-wider text-emerald-300">
                      Reference: {referenceId}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-neutral-400 max-w-md mx-auto text-left space-y-2">
                    <div className="text-white font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      What to expect next:
                    </div>
                    <p>
                      Our enterprise partnerships lead will review your request ({formData.quantity}) and email a tailored volume allocation breakdown and commercial proposal within 24 business hours.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: '',
                          companyName: '',
                          email: '',
                          phone: '',
                          designation: '',
                          city: '',
                          enquiryType: ENQUIRY_TYPES[0],
                          quantity: ESTIMATED_QUANTITIES[1],
                          message: '',
                        });
                      }}
                      className="px-6 py-2.5 rounded-xl border border-white/20 text-xs text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      Submit Another Enquiry
                    </button>
                    <Link
                      href="/shop"
                      className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 cursor-pointer"
                    >
                      Explore Products <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Corporate Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase block mb-1">
                      DIRECT INQUIRY FORM
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-tight">
                      Request A Corporate Quote
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Fill out your requirements below to receive custom enterprise pricing and sample packs.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Row 1: Name & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono tracking-wider text-neutral-400 uppercase mb-2">
                        Contact Person Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={formData.fullName}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, fullName: e.target.value }));
                            if (errorMessage) setErrorMessage(null);
                          }}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono tracking-wider text-neutral-400 uppercase mb-2">
                        Company / Organisation *
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Acme Innovations"
                          value={formData.companyName}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, companyName: e.target.value }));
                            if (errorMessage) setErrorMessage(null);
                          }}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono tracking-wider text-neutral-400 uppercase mb-2">
                        Work Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, email: e.target.value }));
                            if (errorMessage) setErrorMessage(null);
                          }}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono tracking-wider text-neutral-400 uppercase mb-2">
                        Phone Number (10 Digits) *
                      </label>
                      <div className="relative flex">
                        <span className="inline-flex items-center px-3.5 rounded-l-xl bg-white/10 border border-r-0 border-white/15 text-xs text-white/60 font-mono">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          className="w-full px-3.5 py-3 rounded-r-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Designation & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono tracking-wider text-neutral-400 uppercase mb-2">
                        Designation / Role (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Workplace Lead / Founder"
                        value={formData.designation}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, designation: e.target.value }))
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono tracking-wider text-neutral-400 uppercase mb-2">
                        Delivery City / State (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bengaluru, Karnataka"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, city: e.target.value }))
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Enquiry Purpose */}
                  <div>
                    <label className="block text-[11px] font-mono tracking-wider text-neutral-400 uppercase mb-2">
                      Nature of Corporate Requirement
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ENQUIRY_TYPES.map((type) => {
                        const isSelected = formData.enquiryType === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, enquiryType: type }))}
                            className={`text-left text-xs p-3 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-white text-black font-semibold border-white shadow-md'
                                : 'bg-white/5 border-white/10 text-neutral-300 hover:border-white/25 hover:bg-white/[0.08]'
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Estimated Volume */}
                  <div>
                    <label className="block text-[11px] font-mono tracking-wider text-neutral-400 uppercase mb-2">
                      Estimated Cans Required
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {ESTIMATED_QUANTITIES.map((qty) => {
                        const isSelected = formData.quantity === qty;
                        return (
                          <button
                            key={qty}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, quantity: qty }))}
                            className={`text-center text-xs p-3 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-white text-black font-semibold border-white'
                                : 'bg-white/5 border-white/10 text-neutral-300 hover:border-white/25 hover:bg-white/[0.08]'
                            }`}
                          >
                            {qty}
                          </button>
                        );
                      })}
                    </div>
                  </div>


                  {/* Message */}
                  <div>
                    <label className="block text-[11px] font-mono tracking-wider text-neutral-400 uppercase mb-2">
                      Specific Notes &amp; Timelines (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, message: e.target.value }))
                      }
                      placeholder="Specify required delivery dates, custom branding or tasting session request..."
                      className="w-full p-3.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 transition-all resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                 
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Submit Corporate Enquiry
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ── BOTTOM TIER COMPARISON / FAQ HIGHLIGHTS ── */}
        <div className="pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
              CORPORATE SAMPLE KITS
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Get a curated selection of Rebelive delivered to your workplace for your team to experience before placing a larger order.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
              FLEXIBLE BULK ORDERS
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Whether it's your office pantry, employee program or a company-wide event, order according to your team's requirements.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
              PAN-INDIA WORKPLACE SUPPLY
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Reliable delivery for corporate requirements across locations, from one-time orders to recurring workplace supply.
            </p>
          </div>
        </div>
      </div>
    </SubpageShell>
  );
}
