'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import {
  clearAdminSession,
  fetchAdminDashboard,
  verifyAdminSession,
  isAuthError,
  AdminUser,
  AdminDashboardData,
} from '@/lib/adminApi';
import { AdminLayoutShell, AdminTabId } from '@/components/root/AdminLayoutShell';
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
import { RootActivityLogsTab } from '@/components/root/RootActivityLogsTab';
import { RootSettingsTab } from '@/components/root/RootSettingsTab';
import { AdminToastProvider, showAdminToast } from '@/components/root/AdminToaster';

const VALID_TABS: AdminTabId[] = [
  'overview',
  'orders',
  'products',
  'blogs',
  'testimonials',
  'contact-queries',
  'corporate-queries',
  'users',
  'shiprocket',
  'activity-logs',
  'settings',
];

export default function AdminRootPage() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTabId>('overview');
  const [visitedTabs, setVisitedTabs] = useState<Set<AdminTabId>>(new Set(['overview']));
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Evaluates if a given tab is authorized for the current user's role and assigned modules.
   */
  const isTabPermitted = useCallback((tab: AdminTabId, user: AdminUser | null): boolean => {
    if (!user) return false;
    if (user.role === 'SUPERADMIN') return true;

    // Restricted for Admin & Team
    if (tab === 'settings' || tab === 'activity-logs' || tab === 'users') {
      return false;
    }

    if (user.role === 'ADMIN') return true;

    if (user.role === 'TEAM') {
      if (tab === 'overview') return true;
      const assigned = user.assignedModules || [];
      if (tab === 'shiprocket') return assigned.includes('orders');
      return assigned.includes(tab);
    }

    return false;
  }, []);

  const handleTabChange = useCallback((tab: AdminTabId) => {
    setActiveTab(tab);
    setVisitedTabs((prev) => {
      if (prev.has(tab)) return prev;
      const next = new Set(prev);
      next.add(tab);
      return next;
    });

    if (typeof window !== 'undefined') {
      const url = tab === 'overview' ? '/root' : `/root?tab=${tab}`;
      window.history.pushState({}, '', url);
    }
  }, []);

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
        const urlTab = params.get('tab') as AdminTabId;
        if (urlTab && VALID_TABS.includes(urlTab)) {
          if (isTabPermitted(urlTab, verifiedUser)) {
            setActiveTab(urlTab);
            setVisitedTabs(new Set(['overview', urlTab]));
          } else {
            setActiveTab('overview');
          }
        }
      }

      if (isMounted) setIsInitializing(false);
    };

    const handleSessionExpired = () => {
      setAdminUser(null);
      setDashboardData(null);
      showAdminToast('Session expired. Please re-authenticate.', 'error', 'Session Expired');
    };

    window.addEventListener('admin-session-expired', handleSessionExpired);
    checkSession();

    return () => {
      isMounted = false;
      window.removeEventListener('admin-session-expired', handleSessionExpired);
    };
  }, [isTabPermitted]);

  const loadDashboardData = async (force = false) => {
    try {
      const data = await fetchAdminDashboard(force);
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

  const handleAuthenticated = (user: AdminUser) => {
    setAdminUser(user);
    loadDashboardData(true);
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
        onTabChange={handleTabChange}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search.."
      >
        <div className="w-full">
          {/* Overview Dashboard Tab */}
          {visitedTabs.has('overview') && (
            <div className={activeTab === 'overview' ? 'block animate-in fade-in duration-150' : 'hidden'}>
              <RootOverviewTab
                data={dashboardData}
                userName={adminUser.firstName || 'User'}
                onNavigateTab={(tab) => handleTabChange(tab as AdminTabId)}
              />
            </div>
          )}

          {/* Orders Management */}
          {visitedTabs.has('orders') && (
            <div className={activeTab === 'orders' ? 'block animate-in fade-in duration-150' : 'hidden'}>
              <RootOrdersTab />
            </div>
          )}

          {/* Product Catalog Management */}
          {visitedTabs.has('products') && (
            <div className={activeTab === 'products' ? 'block animate-in fade-in duration-150' : 'hidden'}>
              <RootProductsTab />
            </div>
          )}

          {/* Blogs & Articles */}
          {visitedTabs.has('blogs') && (
            <div className={activeTab === 'blogs' ? 'block animate-in fade-in duration-150' : 'hidden'}>
              <RootBlogsTab />
            </div>
          )}

          {/* Customer Testimonials */}
          {visitedTabs.has('testimonials') && (
            <div className={activeTab === 'testimonials' ? 'block animate-in fade-in duration-150' : 'hidden'}>
              <RootTestimonialsTab />
            </div>
          )}

          {/* Contact Inquiries */}
          {visitedTabs.has('contact-queries') && (
            <div className={activeTab === 'contact-queries' ? 'block animate-in fade-in duration-150' : 'hidden'}>
              <RootContactQueriesTab />
            </div>
          )}

          {/* Corporate / Bulk Inquiries */}
          {visitedTabs.has('corporate-queries') && (
            <div className={activeTab === 'corporate-queries' ? 'block animate-in fade-in duration-150' : 'hidden'}>
              <RootCorporateQueriesTab />
            </div>
          )}

          {/* Logistics & Shiprocket */}
          {visitedTabs.has('shiprocket') && (
            <div className={activeTab === 'shiprocket' ? 'block animate-in fade-in duration-150' : 'hidden'}>
              <RootShiprocketTab />
            </div>
          )}

          {/* User & Access Control (Super Admin Exclusive) */}
          {visitedTabs.has('users') && adminUser.role === 'SUPERADMIN' && (
            <div className={activeTab === 'users' ? 'block animate-in fade-in duration-150' : 'hidden'}>
              <RootUsersTab />
            </div>
          )}

          {/* Activity Logs & Audit Trail (Super Admin Exclusive) */}
          {visitedTabs.has('activity-logs') && adminUser.role === 'SUPERADMIN' && (
            <div className={activeTab === 'activity-logs' ? 'block animate-in fade-in duration-150' : 'hidden'}>
              <RootActivityLogsTab />
            </div>
          )}

          {/* System Settings & Credentials (Super Admin Exclusive) */}
          {visitedTabs.has('settings') && adminUser.role === 'SUPERADMIN' && (
            <div className={activeTab === 'settings' ? 'block animate-in fade-in duration-150' : 'hidden'}>
              <RootSettingsTab adminUser={adminUser} />
            </div>
          )}
        </div>
      </AdminLayoutShell>
    </AdminToastProvider>
  );
}
