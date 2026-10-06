'use client';

import React from 'react';

interface SubpageShellProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

/**
 * Clean subpage wrapper that provides standard layout padding and styling.
 * Header, Footer, and Mobile Menu Drawer are managed globally in AppShell/layout.tsx.
 */
export function SubpageShell({
  children,
  className = '',
  noPadding = false,
}: SubpageShellProps) {
  return (
    <div
      className={`w-full text-white select-none relative ${
        noPadding ? '' : 'pt-24 sm:pt-32 pb-16 px-4 sm:px-8 max-w-7xl mx-auto'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default SubpageShell;
