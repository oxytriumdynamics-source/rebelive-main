'use client';

import React, { useEffect, useState } from 'react';

export interface RebeliveLoaderProps {
  progress?: number;
  phaseText?: string;
  categoryText?: string;
  subtitle?: string;
  fullScreen?: boolean;
  className?: string;
  onComplete?: () => void;
  typingText?: string;
}

const DEFAULT_SLOGAN = 'WAKE. FUEL. REBEL.';

export const RebeliveLoader: React.FC<RebeliveLoaderProps> = ({
  fullScreen = true,
  className = '',
  onComplete,
  typingText = DEFAULT_SLOGAN,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let charIndex = 0;
    const targetText = typingText;

    // Brief initial beat before typing starts
    const startTimeout = setTimeout(() => {
      const typeNextChar = () => {
        if (charIndex < targetText.length) {
          charIndex++;
          setDisplayedText(targetText.slice(0, charIndex));
          timeoutId = setTimeout(typeNextChar, 55);
        } else {
          setIsComplete(true);
          if (onComplete) {
            timeoutId = setTimeout(() => {
              onComplete();
            }, 380);
          }
        }
      };

      typeNextChar();
    }, 160);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeoutId);
    };
  }, [typingText, onComplete]);

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-[99999] bg-[#000000] flex flex-col items-center justify-center select-none pointer-events-auto'
    : 'w-full min-h-[380px] bg-[#000000] flex flex-col items-center justify-center select-none py-16';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="w-full max-w-md px-6 flex flex-col items-center">
        {/* Brand Logo with Ambient Glow and Horizontal Dark & Light Chrome Gradient */}
        <div className="flex flex-col items-center mb-6 sm:mb-8 relative">
          {/* Subtle Ambient Radial Backlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-24 bg-white/[0.06] rounded-full blur-2xl pointer-events-none" />

          {/* Logo container: Made bigger with metallic dark & light chrome gradient */}
          <div
            className="relative w-[240px] h-[52px] min-[420px]:w-[270px] min-[420px]:h-[58px] sm:w-[300px] sm:h-[64px] md:w-[330px] md:h-[70px]"
          >
            {/* Masked logo letterforms with horizontal dark & light gradient loading animation */}
            <div
              className="absolute inset-0 overflow-hidden animate-chrome-horizontal"
              style={{
                WebkitMaskImage: 'url("/brand/REBELIVE Logo Black.webp")',
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskImage: 'url("/brand/REBELIVE Logo Black.webp")',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
              }}
            />
          </div>
        </div>

        {/* Wake Fuel Rebel Typing Effect */}
        <div className="h-8 flex items-center justify-center">
          <p className="font-mono text-xs sm:text-sm tracking-[0.28em] text-white/90 uppercase font-medium select-none flex items-center">
            <span>{displayedText}</span>
            <span
              className={`inline-block w-[2px] h-3.5 sm:h-4 bg-white ml-1.5 align-middle shadow-[0_0_8px_rgba(255,255,255,0.8)] ${
                isComplete ? 'animate-pulse' : 'opacity-100'
              }`}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default RebeliveLoader;
