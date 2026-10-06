'use client';
import React from 'react';

interface DottedArrowProps {
  direction?: 'left' | 'right';
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DottedChevronIcon: React.FC<{
  direction?: 'left' | 'right';
  className?: string;
}> = ({ direction = 'right', className = '' }) => {
  const isRight = direction === 'right';

  return (
    <svg
      viewBox="0 0 28 28"
      className={`w-6 h-6 sm:w-7 sm:h-7 overflow-visible ${className}`}
      fill="currentColor"
    >
      {/* 5 Dots arranged in chevron formation - sleek & elegant */}
      {isRight ? (
        <g className="chevron-dots-right">
          {/* Top outer dot */}
          <circle
            cx="9"
            cy="5"
            r="1.6"
            className="fill-current opacity-60 group-hover:opacity-90 transition-opacity"
          />
          {/* Mid-upper dot */}
          <circle
            cx="14"
            cy="9.5"
            r="2.0"
            className="fill-current opacity-80 group-hover:opacity-100 transition-opacity"
          />
          {/* TIP DOT (refined tip leading the arrow) */}
          <circle
            cx="19.5"
            cy="14"
            r="2.4"
            className="fill-current opacity-100"
          />
          {/* Mid-lower dot */}
          <circle
            cx="14"
            cy="18.5"
            r="2.0"
            className="fill-current opacity-80 group-hover:opacity-100 transition-opacity"
          />
          {/* Bottom outer dot */}
          <circle
            cx="9"
            cy="23"
            r="1.6"
            className="fill-current opacity-60 group-hover:opacity-90 transition-opacity"
          />
        </g>
      ) : (
        <g className="chevron-dots-left">
          {/* Top outer dot */}
          <circle
            cx="19"
            cy="5"
            r="1.6"
            className="fill-current opacity-60 group-hover:opacity-90 transition-opacity"
          />
          {/* Mid-upper dot */}
          <circle
            cx="14"
            cy="9.5"
            r="2.0"
            className="fill-current opacity-80 group-hover:opacity-100 transition-opacity"
          />
          {/* TIP DOT (refined tip leading the arrow) */}
          <circle
            cx="8.5"
            cy="14"
            r="2.4"
            className="fill-current opacity-100"
          />
          {/* Mid-lower dot */}
          <circle
            cx="14"
            cy="18.5"
            r="2.0"
            className="fill-current opacity-80 group-hover:opacity-100 transition-opacity"
          />
          {/* Bottom outer dot */}
          <circle
            cx="19"
            cy="23"
            r="1.6"
            className="fill-current opacity-60 group-hover:opacity-90 transition-opacity"
          />
        </g>
      )}
    </svg>
  );
};

export const DottedArrowButton: React.FC<DottedArrowProps> = ({
  direction = 'right',
  className = '',
  onClick,
  ariaLabel,
}) => {
  return (
    <button
      onClick={onClick}
      className={`group relative p-1.5 sm:p-2 bg-transparent hover:bg-transparent rounded-full flex items-center justify-center transition-all duration-300 hover:scale-115 active:scale-90 cursor-pointer pointer-events-auto border-0 shadow-none focus:outline-none ${className}`}
      aria-label={ariaLabel || `${direction === 'right' ? 'Next' : 'Previous'} item`}
    >
      {/* Animated Dotted Chevron Icon without any background box */}
      <DottedChevronIcon
        direction={direction}
        className={`transition-transform duration-300 ${
          direction === 'right' ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'
        }`}
      />
    </button>
  );
};
