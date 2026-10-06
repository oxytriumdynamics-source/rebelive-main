'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogIn, LogOut, ChevronDown, ExternalLink, ShieldCheck, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { openCart } from '@/store/slices/cartSlice';
import { soundEngine } from '@/lib/audio';
import { scrollToLenis } from './SmoothScroll';
import { hasIntroLoaded, subscribeIntroLoaded } from '@/lib/introState';
import { animationState, subscribeScrollProgress } from '@/lib/animationState';
import { HoverRollText } from '@/components/ui/HoverRollText';
import { Premium3DButton } from '@/components/ui/Premium3DButton';

interface HeaderProps {
  onOpenContact: () => void;
  onOpenMenu: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isDark?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenContact,
  onOpenMenu,
  soundEnabled,
  onToggleSound,
  isDark = false,
}) => {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isShop = pathname === '/shop' || pathname?.startsWith('/shop/');
  const isProfile = pathname === '/profile';
  const isContact = pathname === '/contact';

  // Completely hide header while initial loading screen is active
  // On home page, starts false on both SSR and client hydration so header is NEVER shown during loading
  const [isIntroComplete, setIsIntroComplete] = useState<boolean>(() => !isHome);

  useEffect(() => {
    if (!isHome) {
      setIsIntroComplete(true);
      return;
    }

    if (hasIntroLoaded()) {
      setIsIntroComplete(true);
      return;
    }

    const handleLoaded = () => setIsIntroComplete(true);
    window.addEventListener('rebelive:introLoaded', handleLoaded);
    const unsubscribe = subscribeIntroLoaded(handleLoaded);

    return () => {
      window.removeEventListener('rebelive:introLoaded', handleLoaded);
      unsubscribe();
    };
  }, [isHome]);

  const authCtx = useAuth();
  const reduxAuth = useAppSelector((s) => s.auth);
  const user = reduxAuth.user || authCtx.user;
  const isAuthenticated = reduxAuth.isAuthenticated || authCtx.isAuthenticated;
  const logoutUser = authCtx.logoutUser;

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s) => s.cart?.items || []);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Mounted guard to ensure identical markup between SSR and initial client hydration
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCartCount = mounted ? totalCartCount : 0;
  const isUserAuthenticated = mounted && isAuthenticated && !!user;

  // Track scroll for transparent dark glassmorphic navbar:
  // On home page: DO NOT shrink or blur until reaching the Statement section (scrollProgress >= 0.43)
  // On other pages: shrink when scrollY > 20
  useEffect(() => {
    if (!isHome) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      let lenisUnsub: (() => void) | null = null;
      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.on === 'function') {
        const onLenis = () => handleScroll();
        lenis.on('scroll', onLenis);
        lenisUnsub = () => lenis.off('scroll', onLenis);
      }

      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (lenisUnsub) lenisUnsub();
      };
    }

    // On Home Page:
    // Statement section starts at scrollProgress >= 0.43 (Section 5: Zero Added Sugar)
    const checkHomeScroll = (progress: number) => {
      const subfooterEl = document.getElementById('home-subfooter');
      const subfooterTop = subfooterEl ? subfooterEl.offsetTop : (typeof window !== 'undefined' ? window.innerHeight : 900);
      const isPastStatementByScroll = typeof window !== 'undefined' && window.scrollY >= subfooterTop - 80;
      const isAtStatementByProgress = progress >= 0.43;

      setIsScrolled(isAtStatementByProgress || isPastStatementByScroll);
    };

    // Initialize immediately
    checkHomeScroll(animationState.scrollProgress);

    const unsubProgress = subscribeScrollProgress((p) => {
      checkHomeScroll(p);
    });

    const handleWindowScroll = () => {
      checkHomeScroll(animationState.scrollProgress);
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    let lenisUnsub: (() => void) | null = null;
    const lenis = (window as any).__lenis;
    if (lenis && typeof lenis.on === 'function') {
      lenis.on('scroll', handleWindowScroll);
      lenisUnsub = () => lenis.off('scroll', handleWindowScroll);
    }

    return () => {
      unsubProgress();
      window.removeEventListener('scroll', handleWindowScroll);
      if (lenisUnsub) lenisUnsub();
    };
  }, [isHome]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollToTop = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      scrollToLenis(0, { duration: 1.2 });
    }
  };

  const userAvatar = user?.avatarUrl || '/brand/panther_white_icon-transparent.png';
  const displayName = user?.firstName || 'Operator';
  const rebelId = user?.id || 'REBEL-0000';
  const personaSlug = user?.preferences?.personalityType?.slug || 'apex';

  return (
    <motion.header
      initial={isHome && !isIntroComplete ? { opacity: 0, y: -25 } : false}
      animate={
        isHome && !isIntroComplete
          ? { opacity: 0, y: -25, pointerEvents: 'none' }
          : { opacity: 1, y: 0, pointerEvents: 'none' }
      }
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-[60] w-full flex justify-center pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled
          ? 'pt-2.5 sm:pt-3.5 px-3 min-[400px]:px-4 sm:px-6 md:px-8'
          : 'pt-0 px-0'
        }`}
    >
      <div
        className={`w-full flex items-center justify-between select-none pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-visible ${isScrolled
            ? `max-w-5xl lg:max-w-6xl xl:max-w-7xl rounded-full border shadow-[0_14px_40px_rgba(0,0,0,0.55)] px-3.5 min-[360px]:px-4 sm:px-6 md:px-8 h-13 sm:h-14 md:h-15 py-1.5 sm:py-2 ${isDark
              ? 'bg-black/60 backdrop-blur-xl backdrop-saturate-180 border-white/15 text-white shadow-[0_14px_36px_rgba(0,0,0,0.7)]'
              : 'bg-white/60 backdrop-blur-xl backdrop-saturate-180 border-black/10 text-black shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
            }`
            : `max-w-full rounded-none border-b border-transparent bg-transparent shadow-none px-3 min-[360px]:px-4 sm:px-8 md:px-10 lg:px-12 h-16 sm:h-20 py-2.5 sm:py-4 md:py-6`
          }`}
      >
        {/* ── Left: Navigation Links (Desktop) or Menu Trigger (Mobile) ── */}
        <div className="flex items-center gap-3 sm:gap-6 pointer-events-auto">
          {/* Mobile Menu Trigger Icon (Visible on mobile & tablet, hidden on lg+) */}
          <button
            onClick={onOpenMenu}
            className={`lg:hidden flex items-center justify-center w-8 h-8 min-[360px]:w-9 min-[360px]:h-9 rounded-full border transition-all duration-200 cursor-pointer active:scale-95 ${isDark
                ? 'border-white/15 bg-white/[0.06] hover:bg-white/15 text-white'
                : 'border-black/15 bg-black/[0.05] hover:bg-black/10 text-black'
              }`}
            aria-label="Open menu"
          >
            <div className="grid grid-cols-2 gap-1 w-3.5 h-3.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white' : 'bg-black'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white' : 'bg-black'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white' : 'bg-black'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white' : 'bg-black'}`} />
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            <Link
              href="/"
              onClick={handleScrollToTop}
              className={`group text-[11px] xl:text-xs font-tech tracking-[0.2em] uppercase transition-all cursor-pointer pb-0.5 ${isHome
                  ? isDark
                    ? 'font-bold text-white border-b-2 border-white'
                    : 'font-bold text-black border-b-2 border-black'
                  : isDark
                    ? 'font-medium text-white/80 hover:text-white border-b-2 border-transparent'
                    : 'font-medium text-black/80 hover:text-black border-b-2 border-transparent'
                }`}
            >
              <HoverRollText text="HOME" />
            </Link>

            <Link
              href="/shop"
              className={`group text-[11px] xl:text-xs font-tech tracking-[0.2em] uppercase transition-all cursor-pointer pb-0.5 ${isShop
                  ? isDark
                    ? 'font-bold text-white border-b-2 border-white'
                    : 'font-bold text-black border-b-2 border-black'
                  : isDark
                    ? 'font-medium text-white/80 hover:text-white border-b-2 border-transparent'
                    : 'font-medium text-black/80 hover:text-black border-b-2 border-transparent'
                }`}
            >
              <HoverRollText text="SHOP" />
            </Link>


          </nav>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+2px)] pointer-events-auto flex flex-col items-center">
          <Link
            href="/"
            onClick={handleScrollToTop}
            className="flex flex-col items-center justify-center cursor-pointer group"
            aria-label="REBELIVE Homepage"
          >
            <div
              className={`relative transition-all duration-500 group-hover:opacity-85 ${isScrolled
                  ? 'w-[105px] min-[360px]:w-[125px] min-[420px]:w-[150px] sm:w-[175px] md:w-[195px] lg:w-[215px] h-[20px] min-[360px]:h-[24px] min-[420px]:h-[28px] sm:h-[34px] md:h-[38px] lg:h-[42px]'
                  : 'w-[120px] min-[360px]:w-[140px] min-[420px]:w-[170px] sm:w-[210px] md:w-[240px] lg:w-[260px] h-[24px] min-[360px]:h-[28px] min-[420px]:h-[34px] sm:h-[42px] md:h-[48px] lg:h-[52px]'
                }`}
            >
              <Image
                src="/brand/REBELIVE Logo Black.png"
                alt="REBELIVE"
                fill
                priority
                sizes="(max-width: 640px) 160px, (max-width: 1024px) 240px, 280px"
                className={`object-contain object-center transition-all duration-500 drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] ${isDark ? 'brightness-0 invert' : ''
                  }`}
              />
            </div>
          </Link>
        </div>

        {/* ── Right: Cart + Auth / Profile + Contact ── */}
        <div className="flex items-center gap-1.5 min-[380px]:gap-2 sm:gap-2.5 md:gap-3 pointer-events-auto">
          {/* Cart Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              dispatch(openCart());
            }}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full border transition-all duration-300 cursor-pointer group active:scale-95 relative ${isDark
                ? 'border-white/15 bg-white/[0.06] hover:bg-white/[0.14] hover:border-white/30 text-white shadow-sm'
                : 'border-black/15 bg-black/[0.04] hover:bg-black/[0.08] hover:border-black/30 text-black shadow-sm'
              }`}
            aria-label={displayCartCount > 0 ? `Open Cart with ${displayCartCount} items` : 'Open Cart'}
            title="Open Cart"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:scale-110" />
              {displayCartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-black animate-pulse sm:hidden" />
              )}
            </div>
            <span className="font-tech text-[10px] sm:text-[11px] font-bold tracking-wider uppercase hidden min-[440px]:inline">
              CART
            </span>
            {displayCartCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-mono font-bold leading-tight ${isDark
                    ? 'bg-white text-black'
                    : 'bg-black text-white'
                  }`}
              >
                {displayCartCount}
              </span>
            )}
          </button>
          {isUserAuthenticated ? (
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 sm:gap-2.5 p-1 sm:pl-1.5 sm:pr-3 py-1 rounded-full border transition-all duration-300 cursor-pointer group shadow-sm ${isDark
                    ? 'border-white/25 bg-white/[0.08] hover:bg-white/[0.16] hover:border-white/50 text-white'
                    : 'border-black/15 bg-white/80 hover:bg-white hover:border-black/30 text-black shadow-[0_2px_10px_rgba(0,0,0,0.06)]'
                  }`}
                aria-label="Operator account menu"
              >
                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-neutral-900 border border-amber-400/60 p-0.5 shadow-sm flex items-center justify-center shrink-0">
                  <Image
                    src={userAvatar}
                    alt={displayName}
                    fill
                    sizes="28px"
                    className="object-cover rounded-full"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-black animate-pulse" />
                </div>

                {/* Name & ID snippet */}
                <div className="hidden sm:flex flex-col items-start text-left">
                  <span className="font-tech text-[10.5px] font-bold tracking-wider uppercase leading-none">
                    {displayName}
                  </span>
                  <span
                    className={`text-[8px] font-mono tracking-widest leading-none mt-0.5 ${isDark ? 'text-amber-400/80' : 'text-amber-600 font-semibold'
                      }`}
                  >
                    {rebelId.replace('REBEL-', '#')}
                  </span>
                </div>

                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 opacity-60 group-hover:opacity-100 ${profileDropdownOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {/* Profile Popover Dropdown */}
              {profileDropdownOpen && (
                <div
                  className={`absolute right-0 top-full mt-2.5 w-64 rounded-2xl p-4 shadow-2xl border backdrop-blur-xl transition-all z-50 animate-in fade-in zoom-in-95 duration-200 ${isDark
                      ? 'bg-[#0c0c0f]/95 border-white/20 text-white shadow-black/80'
                      : 'bg-white/95 border-black/15 text-black shadow-2xl shadow-black/15'
                    }`}
                >
                  {/* Dropdown Header: Avatar, Name, Email, Status */}
                  <div className="flex items-center gap-3 pb-3.5 border-b border-black/10 dark:border-white/10">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-black/90 border-2 border-amber-400/70 p-0.5 shrink-0">
                      <Image
                        src={userAvatar}
                        alt={displayName}
                        fill
                        sizes="40px"
                        className="object-cover rounded-full"
                      />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-tech text-xs font-bold tracking-wider uppercase truncate">
                        {displayName} {user.lastName || ''}
                      </span>
                      <span className="text-[10px] font-mono opacity-60 truncate">
                        {user.email}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[8.5px] font-tech text-amber-500 font-bold uppercase tracking-widest mt-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        REBEL ID VERIFIED
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Links */}
                  <div className="py-2 space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-tech font-bold tracking-wider uppercase transition-colors ${isDark
                          ? 'hover:bg-white/10 text-white/90 hover:text-white'
                          : 'hover:bg-black/5 text-black/80 hover:text-black'
                        }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <User className="w-3.5 h-3.5 text-amber-500" />
                        PROFILE
                      </span>
                    </Link>

                    <Link
                      href="/shop"
                      onClick={() => setProfileDropdownOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-tech font-medium tracking-wider uppercase transition-colors ${isDark
                          ? 'hover:bg-white/10 text-white/90 hover:text-white'
                          : 'hover:bg-black/5 text-black/80 hover:text-black'
                        }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
                        CRATE ALLOCATION
                      </span>
                    </Link>
                  </div>

                  {/* Dropdown Footer: Logout */}
                  <div className="pt-2 border-t border-black/10 dark:border-white/10">
                    <button
                      onClick={async () => {
                        setProfileDropdownOpen(false);
                        await logoutUser();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-tech font-medium tracking-wider uppercase text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <LogOut className="w-3.5 h-3.5" />
                        SIGN OUT
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:block">
              <Premium3DButton
                href="/auth"
                text="LOGIN"
                size="sm"
                theme={isDark ? "white" : "dark"}
                showSparkles={false}
                icon={<LogIn className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />}
                isActive={pathname === '/auth'}
                title="Sign in to your Rebelive operator account"
                className="text-[10.5px] sm:text-xs"
              />
            </div>
          )}

          {/* 3D Glass Pill Contact Button - ONLY visible on desktop (lg+), hidden on mobile & tablet */}
          <div className="hidden lg:block">
            <Premium3DButton
              href={'/contact'}
              text="CONTACT"
              size="xs"
              theme="dark"
              icon={
                <svg
                  className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-white/80 group-hover:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              }
              isActive={isContact}
              className="text-[9.5px] min-[360px]:text-[10px] sm:text-[11px] md:text-xs sm:!px-4 sm:!py-1.8"
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
};
