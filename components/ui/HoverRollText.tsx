'use client';
import React from 'react';

interface HoverRollTextProps {
  text: string;
  className?: string;
  textClassName?: string;
  hoverClassName?: string;
  staggerMs?: number;
}

/**
 * High-end kinetic staggered rolling text hover animation.
 * When the parent button/link (.group) is hovered:
 * - Each character smoothly glides up out of view one by one.
 * - A duplicate character rolls up seamlessly from below one by one with ultra-smooth easing.
 * - Text color stays perfectly consistent before, during, and after hover.
 */
export const HoverRollText: React.FC<HoverRollTextProps> = ({
  text,
  className = '',
  textClassName = '',
  hoverClassName = '',
  staggerMs = 32,
}) => {
  const characters = text.split('');

  return (
    <span className={`inline-flex items-center leading-none py-0.5 select-none ${className}`}>
      {characters.map((char, i) => {
        const isSpace = char === ' ';
        return (
          <span
            key={i}
            className="relative inline-flex overflow-hidden"
          >
            {/* Primary character */}
            <span
              className={`inline-block transition-transform duration-[560ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[130%] ${textClassName}`}
              style={{
                transitionDelay: `${i * staggerMs}ms`,
              }}
            >
              {isSpace ? '\u00A0' : char}
            </span>

            {/* Duplicate character coming from down */}
            <span
              aria-hidden="true"
              className={`absolute inset-0 inline-block transition-transform duration-[560ms] ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-[130%] group-hover:translate-y-0 ${textClassName} ${hoverClassName}`}
              style={{
                transitionDelay: `${i * staggerMs}ms`,
              }}
            >
              {isSpace ? '\u00A0' : char}
            </span>
          </span>
        );
      })}
    </span>
  );
};

