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
  Quote,
  Building2,
  Mail,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
  BookOpen,
  ScrollText,
} from 'lucide-react';
import {
  clearAdminSession,
  verifyAdminSession,
  changeAdminPassword,
  AdminUser,
} from '@/lib/adminApi';
import { RootAuthGateway } from '@/components/root/RootAuthGateway';
import { AdminToastProvider, showAdminToast } from '@/components/root/AdminToaster';

const MONO = "'Poppins', sans-serif";
const SANS = "'Poppins', sans-serif";

export type AdminTabId =
  | 'overview'
  | 'orders'
  | 'products'
  | 'blogs'
  | 'testimonials'
  | 'contact-queries'
  | 'corporate-queries'
  | 'users'
  | 'shiprocket'
  | 'activity-logs'
  | 'settings';

interface AdminLayoutShellProps {
  activeTab?: AdminTabId;
  children: React.ReactNode;
  onTabChange?: (tab: AdminTabId) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  adminUser?: AdminUser | null;
}

export function AdminLayoutShell({
  activeTab = 'overview',
  children,
  onTabChange,
  searchPlaceholder = 'Search..',
  searchValue,
  onSearchChange,
  adminUser: userProp,
}: AdminLayoutShellProps) {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(userProp || null);
  const [isInitializing, setIsInitializing] = useState(!userProp);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState('');

  // Change Password Modal State
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Sync or check stored admin session on mount
  useEffect(() => {
    if (userProp !== undefined) {
      setAdminUser(userProp);
      setIsInitializing(false);
      return;
    }

    let isMounted = true;

    const checkSession = async () => {
      const verifiedUser = await verifyAdminSession();
      if (!isMounted) return;
      setAdminUser(verifiedUser);
      setIsInitializing(false);
    };

    const handleSessionExpired = () => {
      setAdminUser(null);
      showAdminToast('Session expired or unauthorized. Please re-authenticate.', 'error', 'Session Expired');
    };

    window.addEventListener('admin-session-expired', handleSessionExpired);
    checkSession();

    return () => {
      isMounted = false;
      window.removeEventListener('admin-session-expired', handleSessionExpired);
    };
  }, [userProp]);

  const handleAuthenticated = (user: AdminUser) => {
    setAdminUser(user);
  };

  const handleLogout = () => {
    clearAdminSession();
    setAdminUser(null);
    showAdminToast('Signed out of Admin console.', 'info', 'Session Ended');
    window.location.href = '/root';
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await changeAdminPassword(currentPassword, newPassword);
      setPasswordSuccess(res.message || 'Password updated successfully.');
      showAdminToast('Your administrator password has been updated.', 'success', 'Password Changed');
      setTimeout(() => {
        setPasswordModalOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordSuccess('');
      }, 1500);
    } catch (err: any) {
      const msg = err.message || 'Failed to update password. Please check your current password.';
      setPasswordError(msg);
      showAdminToast(msg, 'error', 'Update Failed');
    } finally {
      setPasswordLoading(false);
    }
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

  const isSuperAdmin = adminUser.role === 'SUPERADMIN';
  const isAdmin = adminUser.role === 'ADMIN';
  const isTeam = adminUser.role === 'TEAM';
  const assigned = Array.isArray(adminUser.assignedModules) ? adminUser.assignedModules : [];

  const ALL_POSSIBLE_TABS: Array<{
    id: AdminTabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    moduleKey?: string;
  }> = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, href: '/root' },
    { id: 'orders', label: 'Orders', icon: Package, href: '/root?tab=orders', moduleKey: 'orders' },
    { id: 'products', label: 'Catalog', icon: Boxes, href: '/root?tab=products', moduleKey: 'products' },
    { id: 'blogs', label: 'Blogs & Articles', icon: BookOpen, href: '/root?tab=blogs', moduleKey: 'blogs' },
    { id: 'testimonials', label: 'Testimonials', icon: Quote, href: '/root?tab=testimonials', moduleKey: 'testimonials' },
    { id: 'contact-queries', label: 'Contact Inquiries', icon: Mail, href: '/root?tab=contact-queries', moduleKey: 'contact-queries' },
    { id: 'corporate-queries', label: 'Corporate Inquiries', icon: Building2, href: '/root?tab=corporate-queries', moduleKey: 'corporate-queries' },
    { id: 'shiprocket', label: 'Logistics', icon: Truck, href: '/root?tab=shiprocket', moduleKey: 'orders' },
  ];

  let NAV_TABS = ALL_POSSIBLE_TABS;

  if (isSuperAdmin) {
    NAV_TABS = [
      ...ALL_POSSIBLE_TABS.slice(0, 7),
      { id: 'users', label: 'Users & Access', icon: Users, href: '/root?tab=users' },
      ALL_POSSIBLE_TABS[7], // shiprocket
      { id: 'activity-logs', label: 'Activity Logs', icon: ScrollText, href: '/root?tab=activity-logs' },
      { id: 'settings', label: 'Settings', icon: SlidersHorizontal, href: '/root?tab=settings' },
    ];
  } else if (isAdmin) {
    NAV_TABS = ALL_POSSIBLE_TABS;
  } else if (isTeam) {
    NAV_TABS = ALL_POSSIBLE_TABS.filter((t) => {
      if (t.id === 'overview') return true;
      if (!t.moduleKey) return false;
      return assigned.includes(t.moduleKey);
    });
  }

  const handleTabClick = (tabId: AdminTabId) => {
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
    <AdminToastProvider>
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
                <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black font-mono text-sm shadow-sm">
                  R
                </div>
                <div>
                  <h1 className="font-bold text-base tracking-tight text-white leading-tight">
                    {NAV_TABS.find((t) => t.id === activeTab)?.label || 'Dashboard'}
                  </h1>
                  <p className="text-[10px] text-white/40 font-mono tracking-wider uppercase">
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

            {/* Navigation Tabs (Arranged vertically on left side matching Image 2) */}
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
              rel="noopener noreferrer"
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
          {/* Top Utility Bar (Fixed Header) */}
          <header className="fixed top-0 right-0 left-0 md:left-64 z-30 h-14 px-4 sm:px-8 border-b border-white/5 bg-black/80 backdrop-blur-md flex items-center justify-between">
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

              {/* User Profile Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">
                    <UserIcon className="w-3.5 h-3.5 text-black" />
                  </div>
                  <div className="flex flex-col text-left hidden sm:flex">
                    <span className="text-xs font-semibold text-white">
                      {adminUser.firstName || 'Admin'}
                    </span>
                    <span className="text-[9px] font-mono text-white/50">
                      {adminUser.role}
                    </span>
                  </div>
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#121212] border border-white/10 rounded-2xl p-3 shadow-2xl z-50 text-xs animate-in fade-in">
                    <div className="pb-3 mb-2 border-b border-white/10">
                      <p className="font-bold text-white">
                        {adminUser.firstName} {adminUser.lastName}
                      </p>
                      <p className="text-[10px] font-mono text-white/50 truncate">
                        {adminUser.email}
                      </p>
                      <div className="mt-1.5">
                        {adminUser.role === 'SUPERADMIN' ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#d8ac52] text-black">
                            SUPER ADMIN (OWNER)
                          </span>
                        ) : adminUser.role === 'ADMIN' ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white text-black">
                            ADMINISTRATOR
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-400 text-black">
                            TEAM MEMBER
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      {adminUser.role === 'SUPERADMIN' && (
                        <button
                          onClick={() => {
                            setProfileMenuOpen(false);
                            setPasswordModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/5 transition-colors cursor-pointer font-mono text-xs"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Change Password</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer font-mono text-xs"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area (Offset for fixed header) */}
          <main className="flex-1 pt-24 sm:pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>

        {/* ─── Change Password Modal ─── */}
        {passwordModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md bg-[#0e0e0e] border border-white/15 rounded-3xl p-6 sm:p-8 text-white space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-5 h-5 text-white" />
                  <div>
                    <h3 className="text-base font-bold uppercase tracking-wider text-white">
                      CHANGE PASSWORD
                    </h3>
                    <p className="text-[10px] font-mono text-white/50">
                      {adminUser.email} ({adminUser.role})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPasswordModalOpen(false);
                    setPasswordError('');
                    setPasswordSuccess('');
                  }}
                  className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {passwordError && (
                <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-white text-xs flex items-center gap-2 font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0 text-white" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/20 text-white text-xs flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 block">
                    CURRENT PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      required
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl py-2.5 pl-3.5 pr-10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 block">
                    NEW PASSWORD (MIN. 8 CHARS)
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      placeholder="Enter new strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl py-2.5 pl-3.5 pr-10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 block">
                    CONFIRM NEW PASSWORD
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordModalOpen(false);
                      setPasswordError('');
                      setPasswordSuccess('');
                    }}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex-1 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {passwordLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Save Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminToastProvider>
  );
}
