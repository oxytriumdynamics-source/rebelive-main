'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Clock,
  ShieldCheck,
  Check,
} from 'lucide-react';
import SubpageShell from '@/components/layout/SubpageShell';

const SANS = "'Poppins', sans-serif";
const MONO = "'Poppins', sans-serif";

// Brand vector icons
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.276-.1-.477-.15-.678.15-.2.3-.777.98-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.8-1.501-1.788-1.677-2.089-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.588-.493-.509-.678-.518l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.511 1.079 2.912 1.23 3.113c.15.2 2.123 3.242 5.143 4.547.718.311 1.279.497 1.716.636.721.23 1.377.197 1.896.12.578-.087 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.431-.076-.126-.277-.201-.578-.351zM12.004 2C6.48 2 2 6.48 2 12c0 1.944.557 3.76 1.524 5.301L2 22l4.832-1.488C8.307 21.365 10.096 22 12.004 22 17.524 22 22 17.52 22 12s-4.476-10-9.996-10zm0 18.257c-1.684 0-3.245-.516-4.545-1.401l-.326-.222-2.884.888.895-2.809-.244-.344c-.985-1.385-1.508-3.031-1.508-4.769 0-4.662 3.794-8.457 8.612-8.457 4.817 0 8.611 3.795 8.611 8.457 0 4.663-3.794 8.657-8.611 8.657z" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 1 0-.02-3.38 1.69 1.69 0 0 0 .02 3.38zM5.07 18.5h2.77v-8.37H5.07v8.37z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const SERVICES_OPTIONS = [
  'Order & Shipping Support',
  'Product Questions & Support',
  'Bulk & Corporate Orders',
  'Partnerships & Collaborations',
  'Events & Sponsorships',
  'Product Feedback',
  'Other Enquiries',
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    services: [] as string[],
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleService = (service: string) => {
    setFormData((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow up to 10 digits for Indian mobile number
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: val }));
    if (formError) setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Explicit validation for mandatory fields (all mandatory except services/enquiry)
    if (!formData.firstName.trim()) {
      setFormError('Please enter your first name.');
      return;
    }
    if (!formData.lastName.trim()) {
      setFormError('Please enter your last name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      setFormError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!formData.message.trim()) {
      setFormError('Please enter your message.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <>
      <style>{`
        html, body {
          position: static !important;
          overflow: auto !important;
          height: auto !important;
          inset: auto !important;
          overscroll-behavior: auto !important;
        }
      `}</style>

      <SubpageShell>
        <div style={{ fontFamily: SANS }} className="relative min-h-screen text-white overflow-hidden ">

          {/* Ambient center-top backlight glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[500px] rounded-full blur-3xl pointer-events-none -z-10 opacity-15"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
            }}
          />

          {/* ── HEADER / INTRO ── */}
          <div className="relative z-10 pt-4 pb-10 sm:pb-12 px-6 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white capitalize leading-tight drop-shadow-[0_4px_28px_rgba(0,0,0,0.8)]">
              Contact Us
            </h1>

            <p className="mt-3 text-sm sm:text-base font-semibold text-white tracking-wide">
              WE’RE HERE TO HELP.
            </p>

            <p className="mt-2 text-xs sm:text-sm md:text-base text-white/65 max-w-2xl mx-auto leading-relaxed font-light">
              Have a question about Rebelive, your order, our products, or anything else? Send us a message and our team will get back to you.
            </p>
          </div>

          {/* ── MAIN CONTENT GRID ── */}
          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pb-12 sm:pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              
              {/* ──────────────── LEFT: CONTACT FORM ──────────────── */}
              <div className="lg:col-span-7 bg-[#121212]/80 backdrop-blur-xl border border-white/[0.12] rounded-3xl p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative overflow-hidden">
                {/* Subtle top edge specular highlight */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {submitted ? (
                  <div className="py-14 sm:py-20 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mb-5 shadow-[0_0_35px_rgba(255,255,255,0.45)]">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                      Message Dispatched
                    </h2>
                    <p className="text-xs sm:text-sm text-white/70 mt-3 max-w-md leading-relaxed">
                      Thank you, <span className="text-white font-medium">{formData.firstName || 'there'}</span>.
                      Your inquiry has been routed to our India desk. Our team typically responds within 2–4 hours.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            firstName: '',
                            lastName: '',
                            email: '',
                            phone: '',
                            message: '',
                            services: [],
                          });
                        }}
                        className="px-6 py-2.5 rounded-full border border-white/25 text-xs tracking-wider uppercase hover:bg-white/10 text-white font-medium transition-all cursor-pointer active:scale-95"
                      >
                        Send another message
                      </button>

                      <a
                        href="https://wa.me/message/CV56ETMKXMV5M1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs tracking-wider uppercase hover:bg-[#25D366]/30 transition-all cursor-pointer font-medium"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        <span>Chat instantly on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Fields: First name & Last name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-white/90 mb-2">
                          First name <span className="text-white/60">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) => {
                            setFormData({ ...formData, firstName: e.target.value });
                            if (formError) setFormError(null);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-white/15 bg-white/[0.04] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/50 focus:bg-white/[0.07] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white/90 mb-2">
                          Last name <span className="text-white/60">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) => {
                            setFormData({ ...formData, lastName: e.target.value });
                            if (formError) setFormError(null);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-white/15 bg-white/[0.04] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/50 focus:bg-white/[0.07] transition-all"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-xs font-medium text-white/90 mb-2">
                        Email <span className="text-white/60">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (formError) setFormError(null);
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-white/15 bg-white/[0.04] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/50 focus:bg-white/[0.07] transition-all"
                      />
                    </div>

                    {/* Phone Number: ONLY FOR INDIA */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-white/90">
                          Phone number <span className="text-white/60">*</span>
                        </label>
                      </div>

                      <div className="flex rounded-xl border border-white/15 bg-white/[0.04] focus-within:border-white/50 focus-within:bg-white/[0.07] transition-all overflow-hidden">
                        {/* Fixed India Country Prefix */}
                        <div className="flex items-center gap-1.5 px-3.5 py-3 border-r border-white/15 bg-white/[0.05] select-none text-white/90 shrink-0">
                          <span className="text-base leading-none" role="img" aria-label="India flag">
                            🇮🇳
                          </span>
                          <span className="text-xs font-semibold tracking-wider text-white">
                            IN +91
                          </span>
                        </div>

                        {/* Indian 10-digit input */}
                        <input
                          type="tel"
                          required
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          className="w-full px-4 py-3 bg-transparent text-white placeholder:text-white/30 text-sm focus:outline-none tracking-wide"
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-white/40">
                        Enter a 10-digit Indian mobile number for crate dispatch &amp; instant SMS/WhatsApp updates.
                      </p>
                    </div>

                    {/* Message Area */}
                    <div>
                      <label className="block text-xs font-medium text-white/90 mb-2">
                        Message <span className="text-white/60">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Leave us a message..."
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (formError) setFormError(null);
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-white/15 bg-white/[0.04] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/50 focus:bg-white/[0.07] transition-all resize-none"
                      />
                    </div>

                    {/* Services / Inquiry Category Checkboxes (Optional) */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/90" style={{ fontFamily: MONO }}>
                          SELECT YOUR ENQUIRY
                        </label>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">
                          (Optional)
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {SERVICES_OPTIONS.map((service) => {
                          const isChecked = formData.services.includes(service);
                          return (
                            <button
                              type="button"
                              key={service}
                              onClick={() => toggleService(service)}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                                isChecked
                                  ? 'bg-white/10 border-white/40 text-white'
                                  : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.05]'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                                  isChecked
                                    ? 'bg-white border-white text-black'
                                    : 'border-white/30 bg-white/5'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="text-xs font-normal leading-tight">
                                {service}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Validation Error Banner */}
                    {formError && (
                      <div className="p-3.5 rounded-xl bg-white/10 border border-white/25 text-white text-xs flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 sm:py-4 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-sm tracking-wide transition-all duration-200 cursor-pointer shadow-[0_4px_25px_rgba(255,255,255,0.25)] hover:shadow-[0_6px_30px_rgba(255,255,255,0.35)] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send message</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* ──────────────── RIGHT: CONTACT INFO & ALL PLATFORMS ──────────────── */}
              <div className="lg:col-span-5 space-y-9 sm:space-y-10 lg:pl-2">
                
                {/* 1. Chat with us */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <MessageSquare className="w-4 h-4 text-white/80" />
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Chat with us
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-white/55 mb-4">
                    Speak to our friendly team via live chat or direct messaging.
                  </p>

                  <div className="space-y-2.5">
                    {/* Start a live chat (WhatsApp) */}
                    <a
                      href="https://wa.me/message/CV56ETMKXMV5M1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-all cursor-pointer"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Start a live chat</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                    </a>

                    {/* Shoot us an email */}
                    <a
                      href="mailto:support@rebelivedrinks.com"
                      className="group flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-all cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-white/80 shrink-0" />
                      <span>Shoot us an email</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                    </a>

                    {/* Message us on X */}
                    {/* <a
                      href="https://x.com/rebelive"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-all cursor-pointer"
                    >
                      <XIcon className="w-4 h-4 text-white/80 shrink-0" />
                      <span>Message us on X</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                    </a> */}
                  </div>
                </div>

               

          

                {/* 4. ALL PLATFORMS LINKS */}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-semibold" style={{ fontFamily: MONO }}>
                      ALL PLATFORMS
                    </span>
                    <span className="text-[10px] text-white/40">Official channels</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* WhatsApp */}
                    <a
                      href="https://whatsapp.com/channel/0029Vb3HB0Y0G0XdgDS5NL1L"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                        <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                          WhatsApp
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-white/30 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://www.instagram.com/rebelive.official?stkn=aTMyZWJ1N2lqZmht"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
                        <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                          Instagram
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-white/30 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                    </a>

                    {/* LinkedIn */}
                    <a
                      href="https://www.linkedin.com/company/rebelive/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />
                        <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                          LinkedIn
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-white/30 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                    </a>


                    {/* Facebook */}
                    <a
                      href="https://www.facebook.com/share/1cjZ7Lqgbe/?mibextid=wwXIfr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <FacebookIcon className="w-4 h-4 text-[#1877F2]" />
                        <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                          Facebook
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-white/30 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                    </a>

                 
                  </div>
                </div>

          

              </div>

            </div>
          </div>
        </div>
      </SubpageShell>
    </>
  );
}
