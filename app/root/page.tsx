'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import {
  clearAdminSession,
  fetchAdminDashboard,
  verifyAdminSession,
  isAuthError,
  AdminUser,
  AdminDashboardData,
} from '@/lib/adminApi';
import { AdminLayoutShell } from '@/components/root/AdminLayoutShell';
import { RootAuthGateway } from '@/components/root/RootAuthGateway';
import { RootOverviewTab } from '@/components/root/RootOverviewTab';
import { RootOrdersTab } from '@/components/root/RootOrdersTab';
import { RootProductsTab } from '@/components/root/RootProductsTab';
import { RootBlogsTab } from '@/components/root/RootBlogsTab';
import { RootTestimonialsTab } from '@/components/root/RootTestimonialsTab';
import { RootContactQueriesTab } from '@/components/root/RootContactQueriesTab';
import { RootCorporateQueriesTab } from '@/components/root/RootCorporateQueriesTab';
import { RootUsersTab } from '@/components/root/RootUsersTab';
import { RootShiprocketTab } from '@/components/root/RootShiprocketTab';
import { RootSettingsTab } from '@/components/root/RootSettingsTab';
import { AdminToastProvider, showAdminToast } from '@/components/root/AdminToaster';

const MONO = "'JetBrains Mono', monospace";
const SANS = "'Poppins', sans-serif";

export default function AdminRootPage() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'orders'
    | 'products'
    | 'blogs'
    | 'testimonials'
    | 'contact-queries'
    | 'corporate-queries'
    | 'users'
    | 'shiprocket'
    | 'settings'
  >('overview');
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Check stored admin session on mount
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const verifiedUser = await verifyAdminSession();
      if (!isMounted) return;

      if (verifiedUser) {
        setAdminUser(verifiedUser);
        try {
          const data = await fetchAdminDashboard();
          if (isMounted) setDashboardData(data);
        } catch (err: any) {
          if (isAuthError(err)) {
            clearAdminSession();
            if (isMounted) {
              setAdminUser(null);
              setDashboardData(null);
            }
          }
        }
      } else {
        setAdminUser(null);
        setDashboardData(null);
      }

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab') as any;
        if (
          tab &&
          [
            'overview',
            'orders',
            'products',
            'blogs',
            'testimonials',
            'contact-queries',
            'corporate-queries',
            'users',
            'shiprocket',
            'settings',
          ].includes(tab)
        ) {
          if (tab !== 'settings' || verifiedUser?.role === 'SUPERADMIN') {
            setActiveTab(tab);
          }
        }
      }

      if (isMounted) setIsInitializing(false);
    };

    const handleSessionExpired = () => {
      setAdminUser(null);
      setDashboardData(null);
      showAdminToast('Session expired or unauthorized. Please re-authenticate.', 'error', 'Session Expired');
    };

    window.addEventListener('admin-session-expired', handleSessionExpired);
    checkSession();

    return () => {
      isMounted = false;
      window.removeEventListener('admin-session-expired', handleSessionExpired);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await fetchAdminDashboard();
      setDashboardData(data);
    } catch (err: any) {
      if (isAuthError(err)) {
        clearAdminSession();
        setAdminUser(null);
        setDashboardData(null);
      }
      console.error('Error fetching dashboard stats:', err);
    }
  };

  const handleAuthenticated = (user: AdminUser, token: string) => {
    setAdminUser(user);
    loadDashboardData();
    showAdminToast(`Welcome, ${user.firstName || 'Administrator'}! Session active.`, 'success', 'Session Authenticated');
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

  return (
    <AdminToastProvider>
      <AdminLayoutShell
        activeTab={activeTab}
        adminUser={adminUser}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (typeof window !== 'undefined') {
            const url = tab === 'overview' ? '/root' : `/root?tab=${tab}`;
            window.history.pushState({}, '', url);
          }
        }}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search.."
      >
        <div className="w-full">
          {activeTab === 'overview' && (
            <RootOverviewTab
              data={dashboardData}
              userName={adminUser.firstName || 'User'}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                if (typeof window !== 'undefined') {
                  const url = tab === 'overview' ? '/root' : `/root?tab=${tab}`;
                  window.history.pushState({}, '', url);
                }
              }}
            />
          )}
          {activeTab === 'orders' && <RootOrdersTab />}
          {activeTab === 'products' && <RootProductsTab />}
          {activeTab === 'blogs' && <RootBlogsTab />}
          {activeTab === 'testimonials' && <RootTestimonialsTab />}
          {activeTab === 'contact-queries' && <RootContactQueriesTab />}
          {activeTab === 'corporate-queries' && <RootCorporateQueriesTab />}
          {activeTab === 'users' && <RootUsersTab />}
          {activeTab === 'shiprocket' && <RootShiprocketTab />}
          {activeTab === 'settings' && <RootSettingsTab adminUser={adminUser} />}
        </div>
      </AdminLayoutShell>
    </AdminToastProvider>
  );
}
