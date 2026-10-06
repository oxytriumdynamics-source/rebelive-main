import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
  scrollProgress: number; // 0 to 1
  onClickScroll: () => void;
  isDetailMode: boolean;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  scrollProgress,
  onClickScroll,
  isDetailMode
}) => {
  const isHidden = scrollProgress > 0.6;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 transition-all duration-700 ${
        isHidden
          ? 'opacity-0 pointer-events-none'
          : isDetailMode
          ? 'opacity-40 hover:opacity-90 scale-90 pointer-events-auto'
          : 'opacity-90 pointer-events-auto'
      }`}
    >
      <button
        onClick={onClickScroll}
        className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-all cursor-pointer group"
        aria-label="Scroll to discover product details"
      >
        <span className="text-[10px] md:text-[11px] font-tech tracking-[0.25em] uppercase text-white/80 group-hover:text-white transition-colors">
          {isDetailMode ? 'PRODUCT SPECIFICATIONS' : 'SCROLL TO DISCOVER'}
        </span>

        {/* Horizontal Progress Bar matching prompt: ●━━━━━━━━━━━━━━━━━━━━ */}
        <div className="flex items-center gap-1.5 w-44 md:w-56 h-3 px-1">
          {/* Active Dot with reactive position */}
          <div className="relative w-full h-[1px] bg-white/20">
            {/* Progress Fill Line */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-150"
              style={{ width: `${Math.max(4, scrollProgress * 100)}%` }}
            />
            {/* Progress Indicator Node */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#ffffff] transition-all duration-150"
              style={{ left: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
            />
          </div>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-transform group-hover:translate-y-0.5 animate-bounce" />
      </button>
    </div>
  );
};
