'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, ShoppingBag, Home } from 'lucide-react';

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
}

export const NotFoundState: React.FC<NotFoundStateProps> = ({
  code = '404',
  badge = 'SERVER_DATA_UNAVAILABLE',
  title = 'Page Not Found',
  description = 'We encountered an error retrieving data from the backend servers. The requested item or page does not exist or the service is temporarily unreachable.',
  onRetry,
  isRetrying = false,
  actionHref = '/shop',
  actionLabel = 'Explore Shop',
  showHomeButton = true,
}) => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 relative overflow-hidden select-none">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[140px] pointer-events-none -z-10 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Giant 404 watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 select-none overflow-hidden">
        <span className="text-[130px] sm:text-[220px] md:text-[280px] font-black tracking-tighter text-white/[0.03] leading-none font-mono">
          {code}
        </span>
      </div>

      {/* Central Card */}
      <div className="max-w-md w-full mx-auto text-center p-6 sm:p-8 rounded-3xl bg-[#0a0a0a]/90 border border-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative z-10 space-y-6">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono tracking-widest text-white/60 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>{badge}</span>
        </div>

        {/* Big Code & Title */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase font-mono">
            {code}
          </h1>
          <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white uppercase">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-normal pt-1">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={isRetrying}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Connecting...' : 'Retry Connection'}</span>
            </button>
          )}

          {actionHref && (
            <Link
              href={actionHref}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white/70" />
              <span>{actionLabel}</span>
            </Link>
          )}

          {showHomeButton && actionHref !== '/' && (
            <Link
              href="/"
              className="w-full sm:w-auto px-4 py-3 rounded-xl text-white/60 hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          )}
        </div>

        {/* Micro Security/System note */}
        <div className="pt-2 border-t border-white/5">
          <span className="text-[9.5px] font-mono text-white/30 tracking-wider">
            REBELIVE FUNCTIONAL ARCHITECTURE • CODE_{code}
          </span>
        </div>
      </div>
    </div>
  );
};
