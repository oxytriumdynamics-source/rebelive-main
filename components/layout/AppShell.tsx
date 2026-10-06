'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import { PRODUCTS } from '@/data/products';
import { soundEngine } from '@/lib/audio';

const MenuDrawer = dynamic(() => import('@/components/ui/MenuDrawer').then((m) => m.MenuDrawer), {
  ssr: false,
});

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Do not show header or footer on authentication pages
  const isAuthPage =
    pathname === '/auth' ||
    pathname?.startsWith('/auth/') ||
    pathname === '/login';

  if (isAuthPage) {
    return (
      <main className="min-h-screen w-full relative z-10 bg-black text-white">
        {children}
      </main>
    );
  }

  // Only hide footer on authentication pages
  const hideFooter = isAuthPage;

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-black text-white select-none">
      {/* ── Fixed Brand Header across all pages ── */}
      <Header
        onOpenContact={() => router.push('/contact')}
        onOpenMenu={() => setIsMenuOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const active = soundEngine.toggleAmbient();
          setSoundEnabled(active);
        }}
        isDark={true}
      />

      {/* ── Main Page Content ── */}
      <main className="flex-1 w-full bg-transparent">
        {children}
      </main>

      {/* ── Fixed Brand Footer across all pages ── */}
      {!hideFooter && <Footer />}

      {/* ── Global Mobile Menu Drawer ── */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        products={PRODUCTS}
        selectedIndex={0}
        onSelectFlavor={() => {}}
        onOpenSpecs={() => {}}
        onOpenOrder={() => router.push('/shop')}
      />
    </div>
  );
}

export default AppShell;
