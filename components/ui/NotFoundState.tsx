'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RefreshCw, ShoppingBag, ArrowLeft } from 'lucide-react';

interface NotFoundStateProps {
  code?: string;
  badge?: string;
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  actionHref?: string;
  actionLabel?: string;
  showHomeButton?: boolean;
  isEmbedded?: boolean;
}

export const NotFoundState: React.FC<NotFoundStateProps> = ({
  code = '404',
  badge = '404_NOT_FOUND',
  title = 'Oops, the page was not found...',
  description = "It looks like the page you tried to find doesn't exist or isn't named like that.",
  onRetry,
  isRetrying = false,
  actionHref = '/shop',
  actionLabel = 'Explore Shop',
  showHomeButton = true,
  isEmbedded = false,
}) => {
  // If embedded in another page (e.g. catalog failure inside shop), keep within container
  if (isEmbedded) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden select-none">
        {/* Ambient Radial Spotlight */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] rounded-full blur-[140px] pointer-events-none -z-10 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
          }}
        />

        {/* 404 + Can Stack: 404 Big & 70% visible up, Can smaller across lower 30% */}
        <div className="relative w-full flex flex-col items-center justify-center">
          {/* Giant 404 visible with strong gradient */}
          <div className="pointer-events-none select-none z-0 flex items-center justify-center">
            <span
              className="text-[34vw] sm:text-[26vw] md:text-[240px] font-black tracking-tighter leading-[0.85] select-none text-transparent bg-clip-text bg-gradient-to-b from-white/60 via-white/25 to-white/5 font-sans"
              style={{ letterSpacing: '-0.07em' }}
            >
              {code}
            </span>
          </div>

          {/* Small Horizontal Can floating over lower 30% of 404 */}
          <motion.div
            animate={{ y: [-4, 4, -4], rotate: [-1.2, 0.4, -1.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 w-full max-w-[200px] sm:max-w-[280px] md:max-w-[320px] pointer-events-none select-none -mt-12 sm:-mt-16 md:-mt-20 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
          >
            <Image
              src="/brand/blank-can-horizontal.webp"
              alt="Rebelive Blank Can"
              width={800}
              height={320}
              className="w-full h-auto object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="relative z-10 text-center max-w-xl mx-auto space-y-3 px-4 mt-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-normal">
            {description}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                disabled={isRetrying}
                className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{isRetrying ? 'Connecting...' : 'Retry Connection'}</span>
              </button>
            )}

            {showHomeButton && (
              <Link
                href="/"
                className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </Link>
            )}

            {actionHref && (
              <Link
                href={actionHref}
                className="px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-white/70" />
                <span>{actionLabel}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standalone Fullscreen 404 page (Exact match to reference aesthetic)
  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col justify-between overflow-x-hidden overflow-y-auto select-none">
      {/* Ambient background glow spotlight */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[650px] rounded-full blur-[180px] pointer-events-none -z-10 opacity-35"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.06) 45%, transparent 70%)',
        }}
      />

      {/* ── Top Header Bar ── */}
      <header className="w-full px-6 sm:px-12 md:px-16 pt-6 sm:pt-8 flex items-center justify-between z-20 flex-shrink-0">
        <Link
          href="/"
          className="group inline-flex items-center gap-1 focus:outline-none"
        >
          <span className="text-base sm:text-lg font-black tracking-widest text-white uppercase group-hover:opacity-80 transition-opacity font-sans">
            rebelive<sup className="text-[9px] font-sans ml-0.5 tracking-normal opacity-50 font-normal">®</sup>
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs font-mono text-white/40 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1 py-1 px-3 rounded-full hover:bg-white/[0.05]"
        >
          <span>Return to base</span>
          <span className="text-sm">↗</span>
        </Link>
      </header>

      {/* ── Center Stage: Giant 404 (70% visible up) + Small Can + Heading ── */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-8 z-10 w-full max-w-5xl mx-auto my-auto">
        {/* Can + 404 Stack */}
        <div className="relative w-full flex flex-col items-center justify-center">
          {/* Giant 404: Much bigger than can, high visibility gradient */}
          <div className="pointer-events-none select-none z-0 flex items-center justify-center">
            <span
              className="text-[38vw] sm:text-[32vw] md:text-[28vw] lg:text-[340px] font-black tracking-tighter leading-[0.82] select-none font-sans text-transparent bg-clip-text bg-gradient-to-b from-white/65 via-white/25 to-white/5 drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
              style={{ letterSpacing: '-0.07em' }}
            >
              {code}
            </span>
          </div>

          {/* Small Floating Blank Can positioned over the lower 30% of 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [-4, 4, -4],
              rotate: [-1.2, 0.4, -1.2],
            }}
            transition={{
              opacity: { duration: 0.8, ease: 'easeOut' },
              scale: { duration: 0.8, ease: 'easeOut' },
              y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="relative z-10 w-full max-w-[210px] sm:max-w-[290px] md:max-w-[340px] lg:max-w-[380px] mx-auto pointer-events-none select-none -mt-14 sm:-mt-20 md:-mt-28 mb-3 sm:mb-4"
          >
            <Image
              src="/brand/blank-can-horizontal.webp"
              alt="Blank Rebelive Can"
              width={800}
              height={320}
              className="w-full h-auto object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]"
              priority
            />
          </motion.div>
        </div>

        {/* Headline & Description */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-20 text-center max-w-4xl mx-auto space-y-3 sm:space-y-4"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold tracking-tight text-white leading-tight font-sans whitespace-normal sm:whitespace-nowrap">
            {title}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-white/60 font-normal leading-relaxed max-w-lg mx-auto">
            {description}{' '}
            <span className="block sm:inline mt-1 sm:mt-0">
              Try again or return to the{' '}
              <Link
                href="/"
                className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors cursor-pointer"
              >
                homepage
              </Link>
              .
            </span>
          </p>

          {/* Action CTA Buttons */}
          <div className="pt-3 sm:pt-4 flex flex-wrap items-center justify-center gap-3">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                disabled={isRetrying}
                className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{isRetrying ? 'Connecting...' : 'Retry Connection'}</span>
              </button>
            )}

            {showHomeButton && (
              <Link
                href="/"
                className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </Link>
            )}

            {actionHref && (
              <Link
                href={actionHref}
                className="px-6 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 hover:border-white/40 text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-white/70" />
                <span>{actionLabel}</span>
              </Link>
            )}
          </div>
        </motion.div>
      </main>

    </div>
  );
};

export default NotFoundState;
