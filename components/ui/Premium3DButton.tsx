'use client';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { HoverRollText } from './HoverRollText';

/**
 * Sparkle icon (4-point star), matches the reference button.
 */
export function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0c.7 3.9 1.4 6.3 2.9 7.9 1.5 1.5 3.9 2.2 7.1 2.9-3.2.7-5.6 1.4-7.1 2.9-1.5 1.6-2.2 4-2.9 7.9-.7-3.9-1.4-6.3-2.9-7.9C7.6 12.2 5.2 11.5 2 10.8c3.2-.7 5.6-1.4 7.1-2.9C10.6 6.3 11.3 3.9 12 0z" />
    </svg>
  );
}

/**
 * Sparkle pair icon matching the reference (primary star + companion star)
 */
export function SparkleStarsIcon({
  className = '',
  isDark = true,
}: {
  className?: string;
  isDark?: boolean;
}) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className} ${isDark ? 'text-white' : 'text-black/80'}`}>
      <Sparkle className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
      <Sparkle
        className={`w-2 h-2 sm:w-2.5 sm:h-2.5 absolute -bottom-1 -right-1.5 transition-transform duration-300 group-hover:scale-110 ${isDark ? 'text-white/90' : 'text-black/70'
          }`}
      />
    </span>
  );
}

/**
 * Dark theme "Get in Touch" button - mostly black, silver/white gradient
 * text, soft inner glow at the bottom, thin light-catching border.
 */
export function GetInTouchDark({
  onClick,
  className = '',
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative inline-flex items-center gap-3
        rounded-full px-10 py-5
        bg-[radial-gradient(120%_140%_at_50%_115%,#5a5a5a_0%,#1a1a1a_45%,#0a0a0a_75%)]
        border-[0.5px] border-white/15 hover:border-white/25
        shadow-[0_0.5px_0_rgba(255,255,255,0.12)_inset,0_10px_30px_rgba(0,0,0,0.5)]
        transition-all duration-200 ease-out
        hover:scale-[1.02] active:scale-[0.98]
        cursor-pointer select-none
        ${className}
      `}
    >
      <span
        className="
          text-2xl font-semibold tracking-tight
          bg-[linear-gradient(180deg,#ffffff_0%,#dcdcdc_45%,#8f8f8f_100%)]
          bg-clip-text text-transparent
        "
      >
        Get in Touch
      </span>
      <span className="relative flex items-center justify-center text-white">
        <Sparkle className="w-5 h-5" />
        <Sparkle className="w-2.5 h-2.5 absolute -bottom-1.5 -right-2 text-white/90" />
      </span>
    </button>
  );
}

/**
 * Light theme "Get in Touch" button - mostly white, dark charcoal
 * gradient text, soft shadow, thin dark-catching border.
 */
export function GetInTouchLight({
  onClick,
  className = '',
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative inline-flex items-center gap-3
        rounded-full px-10 py-5
        bg-[radial-gradient(120%_140%_at_50%_115%,#e8e8e8_0%,#fbfbfb_45%,#ffffff_75%)]
        border-[0.5px] border-black/10 hover:border-black/20
        shadow-[0_0.5px_0_rgba(0,0,0,0.04)_inset,0_10px_30px_rgba(0,0,0,0.12)]
        transition-all duration-200 ease-out
        hover:scale-[1.02] active:scale-[0.98]
        cursor-pointer select-none
        ${className}
      `}
    >
      <span
        className="
          text-2xl font-semibold tracking-tight
          bg-[linear-gradient(180deg,#1a1a1a_0%,#3a3a3a_45%,#6b6b6b_100%)]
          bg-clip-text text-transparent
        "
      >
        Get in Touch
      </span>
      <span className="relative flex items-center justify-center text-black/80">
        <Sparkle className="w-5 h-5" />
        <Sparkle className="w-2.5 h-2.5 absolute -bottom-1.5 -right-2 text-black/70" />
      </span>
    </button>
  );
}

export function ArrowRightIcon({
  className = '',
  isDark = true,
}: {
  className?: string;
  isDark?: boolean;
}) {
  return (
    <svg
      className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 ${isDark ? 'text-white' : 'text-black'
        } ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

export interface Premium3DButtonProps {
  text: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  theme?: 'dark' | 'white';
  showSparkles?: boolean;
  showArrow?: boolean;
  prefixIcon?: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  disabled?: boolean;
  isActive?: boolean;
}

/**
 * Universal 3D Pill Button supporting both Dark & White Themes:
 * - Uses exact radial gradients, border reflections & inner inset shadows
 * - Kinetic staggered character hover roll with matching metallic gradient
 * - Dual-sparkle constellation, directional arrows, or live status beacon
 * - Sleek, calibrated proportions
 */
export const Premium3DButton: React.FC<Premium3DButtonProps> = ({
  text,
  href,
  onClick,
  className = '',
  theme = 'dark',
  showSparkles = false,
  showArrow = false,
  prefixIcon,
  icon,
  size = 'md',
  type = 'button',
  title,
  disabled = false,
  isActive = false,
}) => {
  const isDark = theme === 'dark';

  // Compact, calibrated size definitions (no longer oversized)
  const sizeStyles = {
    xs: 'px-3 sm:px-3.5 py-1.5 text-[9.5px] sm:text-[10px] gap-1.5',
    sm: 'px-4 sm:px-5 py-1.5 sm:py-1.8 text-[10.5px] sm:text-[11px] gap-2',
    md: 'px-5 sm:px-6 py-2 sm:py-2.2 text-[11px] sm:text-xs gap-2',
    lg: 'px-7 sm:px-8 py-2.8 sm:py-3 text-xs sm:text-sm gap-2.5',
  };

  // Base theme classes with refined, ultra-thin 0.5px hairline borders
  const themeClasses = isDark
    ? `
      bg-[radial-gradient(120%_140%_at_50%_115%,#5a5a5a_0%,#1a1a1a_45%,#0a0a0a_75%)]
      border-[0.5px] border-white/15 hover:border-white/30
      shadow-[0_0.5px_0_rgba(255,255,255,0.08)_inset,0_10px_25px_rgba(0,0,0,0.45)]
      hover:shadow-[0_0.5px_0_rgba(255,255,255,0.15)_inset,0_12px_30px_rgba(0,0,0,0.6)]
    `
    : `
      bg-[radial-gradient(120%_140%_at_50%_115%,#e8e8e8_0%,#fbfbfb_45%,#ffffff_75%)]
      border-[0.5px] border-black/10 hover:border-black/20
      shadow-[0_0.5px_0_rgba(0,0,0,0.04)_inset,0_10px_25px_rgba(0,0,0,0.10)]
      hover:shadow-[0_0.5px_0_rgba(0,0,0,0.06)_inset,0_12px_30px_rgba(0,0,0,0.14)]
    `;

  const activeRing = isActive
    ? isDark
      ? 'ring-[0.5px] ring-white/30'
      : 'ring-[0.5px] ring-black/20'
    : '';

  const textGradient = isDark
    ? 'bg-[linear-gradient(180deg,#ffffff_0%,#dcdcdc_45%,#8f8f8f_100%)] bg-clip-text text-transparent'
    : 'bg-[linear-gradient(180deg,#1a1a1a_0%,#3a3a3a_45%,#6b6b6b_100%)] bg-clip-text text-transparent';

  const sharedClassName = `
    group relative inline-flex items-center justify-center
    rounded-full font-tech tracking-wider uppercase font-semibold
    transition-all duration-200 ease-out
    hover:scale-[1.02] active:scale-[0.98]
    cursor-pointer select-none
    ${sizeStyles[size]}
    ${themeClasses}
    ${activeRing}
    ${className}
  `;

  const innerElements = (
    <>
      {/* Prefix icon (e.g. status dot) */}
      {prefixIcon && (
        <span className="inline-flex items-center">
          {prefixIcon}
        </span>
      )}

      {/* Kinetic rolling text with exact metallic gradient */}
      <span className="font-semibold tracking-tight">
        <HoverRollText text={text} textClassName={textGradient} />
      </span>

      {/* Sparkle pair icon */}
      {showSparkles && (
        <SparkleStarsIcon isDark={isDark} />
      )}

      {/* Arrow icon */}
      {showArrow && (
        <ArrowRightIcon isDark={isDark} />
      )}

      {/* Custom icon */}
      {icon && !showSparkles && !showArrow && (
        <span
          className={`inline-flex items-center transition-transform duration-300 group-hover:translate-x-0.5 ${isDark ? 'text-white' : 'text-black/80'
            }`}
        >
          {icon}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} title={title} className={sharedClassName}>
        {innerElements}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={sharedClassName}
    >
      {innerElements}
    </button>
  );
};

export default GetInTouchDark;
