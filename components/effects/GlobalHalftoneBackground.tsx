'use client';

import { usePathname } from 'next/navigation';
import HalftoneField from '@/components/persona/HalftoneField';

/**
 * GlobalHalftoneBackground - renders the interactive square-dot hover mesh
 * globally across all pages of the website, except the homepage ("/").
 */
export default function GlobalHalftoneBackground() {
  const pathname = usePathname();

  // Exclude the home page only
  if (pathname === '/') {
    return null;
  }

  return (
    <HalftoneField
      colorRgb="255, 255, 255"
      fixed
      influence={60}
      className="z-0 pointer-events-none"
    />
  );
}
