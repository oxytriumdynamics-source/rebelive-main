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
          timeoutId = setTimeout(typeNextChar, 28);
        } else {
          setIsComplete(true);
          if (onComplete) {
            timeoutId = setTimeout(() => {
              onComplete();
            }, 140);
          }
        }
      };

      typeNextChar();
    }, 60);

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
      <div className="w-full max-w-4xl px-4 flex flex-col items-center">
        {/* Brand Logo with Ambient Glow and Horizontal Dark & Light Chrome Gradient */}
        <div className="flex flex-col items-center mb-8 sm:mb-10 relative">
          {/* Ambient Radial Backlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] md:w-[720px] h-32 md:h-48 bg-white/[0.08] rounded-full blur-3xl pointer-events-none" />

          {/* Logo container: Sized significantly larger for prominent brand presence */}
          <div
            className="relative w-[300px] h-[64px] min-[420px]:w-[360px] min-[420px]:h-[78px] sm:w-[480px] sm:h-[102px] md:w-[600px] md:h-[128px] lg:w-[680px] lg:h-[145px]"
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

        {/* Wake Fuel Rebel Typing Effect - Types forward from left to right without pushing existing text backward */}
        <div className="h-9 flex items-center justify-center">
          <div className="relative inline-flex items-center">
            {/* Invisible ghost container reserving the full width of the final slogan */}
            <span
              aria-hidden="true"
              className="font-mono text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase font-medium invisible select-none pointer-events-none whitespace-nowrap"
            >
              {typingText}
            </span>

            {/* Visible typed characters anchored to the left of the centered container */}
            <p className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-xs sm:text-sm md:text-base tracking-[0.3em] text-white/90 uppercase font-medium select-none flex items-center whitespace-nowrap m-0 p-0">
              <span>{displayedText}</span>
              <span
                className={`inline-block w-[2px] h-3.5 sm:h-4 md:h-4.5 bg-white ml-1.5 align-middle shadow-[0_0_8px_rgba(255,255,255,0.85)] ${
                  isComplete ? 'animate-pulse' : 'opacity-100'
                }`}
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RebeliveLoader;
