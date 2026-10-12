'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Users,
  Truck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  RefreshCw,
  Search,
  Bell,
  User as UserIcon,
} from 'lucide-react';
import {
  getStoredAdminToken,
  getStoredAdminUser,
  clearAdminSession,
  AdminUser,
} from '@/lib/adminApi';
import { RootAuthGateway } from '@/components/root/RootAuthGateway';

const MONO = "'JetBrains Mono', monospace";
const SANS = "'Poppins', sans-serif";

interface AdminLayoutShellProps {
  activeTab?: 'overview' | 'orders' | 'products' | 'users' | 'shiprocket';
  children: React.ReactNode;
  onTabChange?: (tab: 'overview' | 'orders' | 'products' | 'users' | 'shiprocket') => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

export function AdminLayoutShell({
  activeTab = 'overview',
  children,
  onTabChange,
  searchPlaceholder = 'Search..',
  searchValue,
  onSearchChange,
}: AdminLayoutShellProps) {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState('');

  // Check stored admin session on mount
  useEffect(() => {
    const token = getStoredAdminToken();
    const user = getStoredAdminUser();

    if (token && user) {
      setAdminUser(user);
    }
    setIsInitializing(false);
  }, []);

  const handleAuthenticated = (user: AdminUser) => {
    setAdminUser(user);
  };

  const handleLogout = () => {
    clearAdminSession();
    setAdminUser(null);
    router.push('/root');
  };

  // If initial load checking
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/50 font-mono text-xs">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-white" />
          <span>CHECKING ROOT AUTHORIZATION...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, render 2-Step Login + OTP Gateway
  if (!adminUser) {
    return <RootAuthGateway onAuthenticated={handleAuthenticated} />;
  }

  const NAV_TABS = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, href: '/root' },
    { id: 'orders', label: 'My Tasks / Orders', icon: Package, href: '/root' },
    { id: 'products', label: 'Products / Catalog', icon: Boxes, href: '/root' },
    { id: 'users', label: 'Messages / Users', icon: Users, href: '/root' },
    { id: 'shiprocket', label: 'Notifications / Logistics', icon: Truck, href: '/root' },
  ] as const;

  const handleTabClick = (tabId: 'overview' | 'orders' | 'products' | 'users' | 'shiprocket') => {
    setMobileMenuOpen(false);
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      router.push(`/root?tab=${tabId}`);
    }
  };

  const currentSearch = searchValue !== undefined ? searchValue : internalSearch;
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    } else {
      setInternalSearch(e.target.value);
    }
  };

  return (
    <div style={{ fontFamily: SANS }} className="min-h-screen bg-black text-white flex">
      {/* ─── Mobile Sidebar Overlay Backdrop ─── */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* ─── Fixed Left Sidebar ─── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#090909] border-r border-white/10 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Branding */}
        <div>
          <div className="p-6 pb-5 flex items-center justify-between border-b border-white/5">
            <Link href="/root" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black font-mono text-sm">
                R
              </div>
              <div>
                <h1 className="font-bold text-base tracking-tight text-white leading-tight">
                  Dashboard
                </h1>
                <p className="text-[10px] text-white/40 font-mono tracking-wider">
                  ROOT CONSOLE
                </p>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 md:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs (Arranged vertically on left side) */}
          <nav className="p-4 space-y-1.5">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-3 cursor-pointer text-left ${
                    isActive
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-white/60'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Actions */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono text-white/50 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
            title="Open Public Storefront"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span>Storefront</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono text-white/60 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-3 cursor-pointer text-left"
            title="Log Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content Canvas (Offset for Fixed Sidebar) ─── */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen bg-black w-full">
        {/* Top Utility Bar (Clean Headerless Bar matching screenshot) */}
        <div className="w-full px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 md:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Input Box */}
            <div className="relative w-full max-w-xs">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={currentSearch}
                onChange={handleSearch}
                className="w-full bg-[#111111] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 font-sans focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>

          {/* Right Status / Notification & User Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notification Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
                <span className="hidden sm:inline text-xs font-medium">Notification</span>
                <span className="text-[10px] font-bold bg-white text-black px-1.5 py-0.2 rounded-full">
                  3
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#121212] border border-white/10 rounded-2xl p-3 shadow-2xl z-50 text-xs">
                  <div className="font-bold text-white mb-2 pb-2 border-b border-white/10">
                    Notifications
                  </div>
                  <div className="space-y-2 text-white/70">
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="font-semibold text-white">Consignment Synchronized</p>
                      <p className="text-[10px] text-white/40">Shiprocket dispatch ready</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="font-semibold text-white">Stock Level Update</p>
                      <p className="text-[10px] text-white/40">Inventory reserves synced</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="font-semibold text-white">New Order Placed</p>
                      <p className="text-[10px] text-white/40">Prepaid order confirmed</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar & Name */}
            <div className="flex items-center gap-2.5 px-2 py-1 rounded-xl bg-white/5 border border-white/10">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">
                <UserIcon className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="text-xs font-semibold text-white hidden sm:inline">
                {adminUser.firstName || 'User'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
