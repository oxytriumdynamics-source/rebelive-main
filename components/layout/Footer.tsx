'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Product, PRODUCTS } from '../../data/products';



interface FooterProps {
  products?: Product[];
  onSelectFlavor?: (index: number) => void;
  onOpenSpecs?: () => void;
  onOpenContact?: () => void;
}

// Authentic vector icons for WhatsApp, LinkedIn, Instagram, and Facebook
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.276-.1-.477-.15-.678.15-.2.3-.777.98-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.8-1.501-1.788-1.677-2.089-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.588-.493-.509-.678-.518l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.511 1.079 2.912 1.23 3.113c.15.2 2.123 3.242 5.143 4.547.718.311 1.279.497 1.716.636.721.23 1.377.197 1.896.12.578-.087 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.431-.076-.126-.277-.201-.578-.351zM12.004 2C6.48 2 2 6.48 2 12c0 1.944.557 3.76 1.524 5.301L2 22l4.832-1.488C8.307 21.365 10.096 22 12.004 22 17.524 22 22 17.52 22 12s-4.476-10-9.996-10zm0 18.257c-1.684 0-3.245-.516-4.545-1.401l-.326-.222-2.884.888.895-2.809-.244-.344c-.985-1.385-1.508-3.031-1.508-4.769 0-4.662 3.794-8.457 8.612-8.457 4.817 0 8.611 3.795 8.611 8.457 0 4.663-3.794 8.657-8.611 8.657z" />
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

export const Footer: React.FC<FooterProps> = ({
  products = PRODUCTS,
  onSelectFlavor,
  onOpenSpecs,
  onOpenContact,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isHomeFooterVisible, setIsHomeFooterVisible] = useState(!isHomePage);
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [h1Height, setH1Height] = useState(150);
  const [isCorporateModalOpen, setIsCorporateModalOpen] = useState(false);

  // On homepage, only show footer when scrolled down past the 100vh initial section spacer
  useEffect(() => {
    if (!isHomePage) {
      setIsHomeFooterVisible(true);
      return;
    }
    const checkHomeScroll = () => {
      setIsHomeFooterVisible(window.scrollY > 40);
    };
    checkHomeScroll();
    window.addEventListener('scroll', checkHomeScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkHomeScroll);
  }, [isHomePage]);

  // Measure exact heading text height and listen to scroll to smoothly cover 30% on full bottom scroll
  useEffect(() => {
    const updateDimensions = () => {
      if (headingRef.current) {
        setH1Height(headingRef.current.offsetHeight);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const distFromBottom = Math.max(0, maxScroll - scrollY);

      // Smooth trigger range: over the last 300px of scrolling to the bottom
      const triggerRange = 300;
      const rawProgress = Math.max(0, Math.min(1, 1 - distFromBottom / triggerRange));
      setScrollProgress(rawProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Zero-latency sync with Lenis smooth scroll if present
    let lenisUnsub: (() => void) | null = null;
    const lenis = (window as any).__lenis;
    if (lenis && typeof lenis.on === 'function') {
      const onLenis = () => handleScroll();
      lenis.on('scroll', onLenis);
      lenisUnsub = () => lenis.off('scroll', onLenis);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('scroll', handleScroll);
      if (lenisUnsub) lenisUnsub();
    };
  }, []);

  // Exactly 35% of the actual H1 text letters is covered on full bottom scroll
  const maxOverlap = Math.round(h1Height * 0.30);
  const overlapY = Math.round(scrollProgress * maxOverlap);

  const handleContactAction = () => {
    if (onOpenContact) {
      onOpenContact();
    } else {
      router.push('/contact');
    }
  };

  const handleFlavorAction = (idx: number) => {
    if (onSelectFlavor) {
      onSelectFlavor(idx);
    } else {
      router.push('/');
    }
  };

  const scrollToTopOrAction = () => {
    if (onOpenContact) {
      onOpenContact();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="main-footer"
      ref={containerRef}
      className="relative w-full text-white z-30 overflow-x-clip transition-opacity duration-200 ease-out"
      style={
        isHomePage
          ? {
            opacity: isHomeFooterVisible ? 1 : 0,
            visibility: isHomeFooterVisible ? 'visible' : 'hidden',
            pointerEvents: isHomeFooterVisible ? 'auto' : 'none',
          }
          : undefined
      }
    >
      {/* ── "WAKE. FUEL. REBEL." SECTION (Replaces white logo) ── */}
      {/* Initially 100% full, uncovered and animated; covered 30% by lower footer on full bottom scroll */}
      <div className="relative w-full flex flex-col items-center justify-center pt-1 pb-0 sm:pt-2 sm:pb-0 z-10 select-none overflow-visible">
        {/* ── Ultra-Smooth Premium White Ambient Backlight Glow System ── */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-visible">
          {/* Core luminous soft aura behind WAKE. FUEL. REBEL. */}
          <div
            className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] sm:w-[1100px] md:w-[1400px] h-[320px] sm:h-[420px] rounded-full blur-[90px] sm:blur-[130px] opacity-75 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.60) 0%, rgba(255, 255, 255, 0.28) 32%, rgba(255, 255, 255, 0.08) 58%, transparent 78%)',
            }}
          />

          {/* Wide atmospheric ambient dispersion plume */}
          <div
            className="absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] sm:w-[1300px] md:w-[1500px] h-[380px] sm:h-[480px] rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.15) 45%, transparent 75%)',
            }}
          />
          {/* Lower spill glow targeting the overlap area */}
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[650px] sm:w-[850px] h-[200px] rounded-full blur-2xl opacity-50 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.25) 40%, transparent 70%)',
            }}
          />
        </div>

        <div className="relative text-center px-2 sm:px-4 max-w-full mx-auto flex flex-col items-center">
          <h1
            ref={headingRef}
            className="text-[11.2vw] sm:text-[9.5vw] md:text-[10.5vw] lg:text-[11vw] xl:text-[11.6vw] 2xl:text-[12.2vw] font-tall font-semibold tracking-normal sm:tracking-wide md:tracking-wider uppercase leading-[0.88] select-none text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400 drop-shadow-[0_20px_45px_rgba(255,255,255,0.22)] whitespace-nowrap transition-transform duration-500 hover:scale-[1.01] flex items-center justify-center gap-1.5 sm:gap-3 md:gap-5 lg:gap-6"
          >
            <span>WAKE .</span>

            <span>FUEL .</span>

            <span>REBEL</span>
          </h1>
        </div>
      </div>

      {/* ── 3. LOWER FOOTER (35% Glass Translucent Overlap) ── */}
      {/* Pulls up by exactly 35% of H1 text height on full bottom scroll, with frosted glass effect */}
      <div
        style={{
          marginTop: `-${overlapY}px`,
          transition: 'margin-top 0.08s ease-out',
        }}
        className="relative z-20 w-full"
      >
        {/* SOCIAL LINKS BAR (Dark gradient at sides, translucent in middle, seamlessly blends to bottom) */}
        <div
          className="w-full backdrop-blur-xl border-t border-neutral-800 relative shadow-[0_-25px_50px_rgba(0,0,0,0.85)]"
          style={{
            background: `
              linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.15) 35%, rgba(0, 0, 0, 0.65) 70%, #000000 100%),
              linear-gradient(to right, #000000 0%, rgba(0, 0, 0, 0.68) 16%, rgba(0, 0, 0, 0.45) 36%, rgba(0, 0, 0, 0.16) 50%, rgba(0, 0, 0, 0.45) 64%, rgba(0 0 0 / 0.57) 84%, #000000 100%)
            `,
          }}
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {/* WhatsApp */}
              <a
                href="https://whatsapp.com/channel/0029Vb3HB0Y0G0XdgDS5NL1L"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-4 sm:py-5 px-5 sm:px-6 hover:bg-white/[0.05] transition-all duration-200 border-b sm:border-b-0 sm:border-r border-neutral-800 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <WhatsAppIcon className="w-5 h-5 sm:w-4 sm:h-4 text-white/80 group-hover:text-white transition-colors" />
                  <span className="text-base sm:text-sm font-sans font-medium text-white/90 group-hover:text-white transition-colors">
                    WhatsApp
                  </span>
                </div>
                <ArrowRight className="w-4.5 h-4.5 sm:w-4 sm:h-4 text-white/40 group-hover:text-white transition-all duration-200 group-hover:translate-x-1" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/rebelive/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-4 sm:py-5 px-5 sm:px-6 hover:bg-white/[0.05] transition-all duration-200 border-b sm:border-b-0 lg:border-r border-neutral-800 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LinkedInIcon className="w-5 h-5 sm:w-4 sm:h-4 text-white/80 group-hover:text-white transition-colors" />
                  <span className="text-base sm:text-sm font-sans font-medium text-white/90 group-hover:text-white transition-colors">
                    LinkedIn
                  </span>
                </div>
                <ArrowRight className="w-4.5 h-4.5 sm:w-4 sm:h-4 text-white/40 group-hover:text-white transition-all duration-200 group-hover:translate-x-1" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/rebelive.official?stkn=aTMyZWJ1N2lqZmht"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-4 sm:py-5 px-5 sm:px-6 hover:bg-white/[0.05] transition-all duration-200 border-b sm:border-b-0 sm:border-r border-neutral-800 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <InstagramIcon className="w-5 h-5 sm:w-4 sm:h-4 text-white/80 group-hover:text-white transition-colors" />
                  <span className="text-base sm:text-sm font-sans font-medium text-white/90 group-hover:text-white transition-colors">
                    Instagram
                  </span>
                </div>
                <ArrowRight className="w-4.5 h-4.5 sm:w-4 sm:h-4 text-white/40 group-hover:text-white transition-all duration-200 group-hover:translate-x-1" />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1cjZ7Lqgbe/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-4 sm:py-5 px-5 sm:px-6 hover:bg-white/[0.05] transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FacebookIcon className="w-5 h-5 sm:w-4 sm:h-4 text-white/80 group-hover:text-white transition-colors" />
                  <span className="text-base sm:text-sm font-sans font-medium text-white/90 group-hover:text-white transition-colors">
                    Facebook
                  </span>
                </div>
                <ArrowRight className="w-4.5 h-4.5 sm:w-4 sm:h-4 text-white/40 group-hover:text-white transition-all duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        {/* MAIN LINKS & FOOTER CONTENT (Pure Solid Black) */}
        <div className="w-full bg-black">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            {/* 4 LINK COLUMNS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 py-14 sm:py-16 border-b border-white/10">
              {/* Column 1: SHOP */}
              <div>
                <h4 className="text-[11px] font-sans font-semibold tracking-[0.2em] text-neutral-500 uppercase mb-5">
                  SHOP
                </h4>
                <ul className="space-y-3 font-sans text-sm">
                  <li>
                    <Link
                      href="/shop/apex"
                      className="text-neutral-400 hover:text-white transition-colors block cursor-pointer"
                    >
                      Apex
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop/aviva"
                      className="text-neutral-400 hover:text-white transition-colors block cursor-pointer"
                    >
                      Aviva
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop/capella"
                      className="text-neutral-400 hover:text-white transition-colors block cursor-pointer"
                    >
                      Capella
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop/variety"
                      className="text-neutral-400 hover:text-white transition-colors block cursor-pointer"
                    >
                      Build Your Own Pack
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: REBELIVE */}
              <div>
                <h4 className="text-[11px] font-sans font-semibold tracking-[0.2em] text-neutral-500 uppercase mb-5">
                  REBELIVE
                </h4>
                <ul className="space-y-3 font-sans text-sm">
                  <li>
                    <Link
                      href="/about"
                      className="text-neutral-400 hover:text-white transition-colors block cursor-pointer"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/story"
                      className="text-neutral-400 hover:text-white transition-colors block cursor-pointer"
                    >
                      Our Story
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/persona"
                      className="text-neutral-400 hover:text-white transition-colors block cursor-pointer"
                    >
                      Rebels Persona
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: SUPPORT */}
              <div>
                <h4 className="text-[11px] font-sans font-semibold tracking-[0.2em] text-neutral-500 uppercase mb-5">
                  SUPPORT
                </h4>
                <ul className="space-y-3 font-sans text-sm">
                  <li>
                    <Link
                      href="/faq"
                      className="text-neutral-400 hover:text-white transition-colors block cursor-pointer"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/track-order"
                      className="text-neutral-400 hover:text-white transition-colors block cursor-pointer"
                    >
                      Track Order
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/corporate"
                      className="text-neutral-400 hover:text-white transition-colors block cursor-pointer"
                    >
                      Corporate
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleContactAction}
                      className="text-neutral-400 hover:text-white transition-colors text-left cursor-pointer block"
                    >
                      Contact Us
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 4: LEGAL */}
              <div>
                <h4 className="text-[11px] font-sans font-semibold tracking-[0.2em] text-neutral-500 uppercase mb-5">
                  LEGAL
                </h4>
                <ul className="space-y-3 font-sans text-sm">
                  <li>
                    <Link
                      href="/privacy"
                      className="text-neutral-400 hover:text-white transition-colors block cursor-pointer"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/refund"
                      className="text-neutral-400 hover:text-white transition-colors block cursor-pointer"
                    >
                      Refund Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shipping"
                      className="text-neutral-400 hover:text-white transition-colors block cursor-pointer"
                    >
                      Shipping Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-neutral-400 hover:text-white transition-colors block cursor-pointer"
                    >
                      Terms &amp; Conditions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* BOTTOM BAR: DYNAMIC COPYRIGHT */}
            <div className="py-7 sm:py-9 flex items-center justify-start text-left">
              <p className="font-sans text-xs sm:text-[13px] text-neutral-400 tracking-wide leading-relaxed">
                Copyright © {new Date().getFullYear()} Rebelive™. Oxytrium Dynamics Private Limited. All rights reserved.
              </p>
            </div>
          </div>

          {/* ── GLASSY BORDER AT BOTTOM OF FOOTER ── */}
          <div className="relative w-full border-t border-white/10 bg-black">
            {/* Luminous gradient hairline */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            {/* Soft glass ambient glow */}
            <div className="absolute inset-x-1/4 -top-[1px] h-[3px] bg-white/30 blur-[2px] pointer-events-none" />
            <div className="h-2 w-full bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
          </div>
        </div>
      </div>


    </footer>
  );
};
