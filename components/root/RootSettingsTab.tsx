'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Users,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  UserX,
  UserCheck,
  Mail,
  Calendar,
  Shield,
  Search,
  UserPlus,
  X,
  Plus,
  Sliders,
  Check,
  Building2,
  Package,
  Boxes,
  BookOpen,
  ShoppingCart,
  Power,
} from 'lucide-react';
import {
  fetchAdminAdmins,
  restrictAdminUser,
  changeAdminPassword,
  createStaffAccount,
  updateStaffAccount,
  fetchAdminSettings,
  updateAdminCheckoutSetting,
  AdminUser,
} from '@/lib/adminApi';
import { formatRebelId } from '@/lib/auth';
import { showAdminToast } from '@/components/root/AdminToaster';

const MONO = "'Poppins', sans-serif";
const SANS = "'Poppins', sans-serif";

const MODULE_OPTIONS = [
  { key: 'orders', label: 'Orders & Logistics', desc: 'Process orders, track consignments, dispatch via Shiprocket' },
  { key: 'products', label: 'Catalog & Inventory', desc: 'Manage products, prices, variants, stock, and coupons' },
  { key: 'blogs', label: 'Blogs & Articles', desc: 'Draft, publish, and edit rich-text blog posts' },
  { key: 'testimonials', label: 'Testimonials', desc: 'Manage customer reviews and spotlight testimonials' },
  { key: 'contact-queries', label: 'Contact Inquiries', desc: 'View and reply to customer contact form inquiries' },
  { key: 'corporate-queries', label: 'Corporate Inquiries', desc: 'Manage bulk and B2B corporate order inquiries' },
];

interface RootSettingsTabProps {
  adminUser: AdminUser | null;
}

export function RootSettingsTab({ adminUser }: RootSettingsTabProps) {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);
  const [searchAdmin, setSearchAdmin] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Super Admin Password Change Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Create Staff Account Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffFirstName, setNewStaffFirstName] = useState('');
  const [newStaffLastName, setNewStaffLastName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'ADMIN' | 'TEAM'>('TEAM');
  const [newStaffModules, setNewStaffModules] = useState<string[]>(['orders', 'products']);
  const [isCreatingStaff, setIsCreatingStaff] = useState(false);

  // Edit Permissions Modal State
  const [editStaffUser, setEditStaffUser] = useState<AdminUser | null>(null);
  const [editStaffRole, setEditStaffRole] = useState<'ADMIN' | 'TEAM'>('TEAM');
  const [editStaffModules, setEditStaffModules] = useState<string[]>([]);
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);

  // Store Checkout Control State
  const [checkoutEnabled, setCheckoutEnabled] = useState(true);
  const [pauseMessage, setPauseMessage] = useState('Instant checkout is temporarily paused for maintenance. Please check back shortly.');
  const [checkoutLastUpdated, setCheckoutLastUpdated] = useState<string | null>(null);
  const [checkoutUpdatedBy, setCheckoutUpdatedBy] = useState<string | null>(null);
  const [isLoadingCheckoutSetting, setIsLoadingCheckoutSetting] = useState(true);
  const [isUpdatingCheckout, setIsUpdatingCheckout] = useState(false);
  const [isSavingMessage, setIsSavingMessage] = useState(false);

  const isSuperAdmin = adminUser?.role === 'SUPERADMIN';

  const loadSettings = async () => {
    setIsLoadingCheckoutSetting(true);
    try {
      const data = await fetchAdminSettings();
      if (data?.checkout) {
        setCheckoutEnabled(data.checkout.enabled);
        if (data.checkout.pauseMessage) {
          setPauseMessage(data.checkout.pauseMessage);
        }
        setCheckoutLastUpdated(data.checkout.updatedAt || null);
        setCheckoutUpdatedBy(data.checkout.updatedBy || null);
      }
    } catch (err: any) {
      console.error('Failed to load store checkout settings:', err);
    } finally {
      setIsLoadingCheckoutSetting(false);
    }
  };

  const handleToggleCheckout = async () => {
    const nextState = !checkoutEnabled;
    const actionLabel = nextState ? 'enable (turn ON)' : 'disable (turn OFF)';

    if (
      !confirm(
        `Are you sure you want to ${actionLabel} store checkout?\n\n${
          !nextState
            ? 'Customers will NOT be able to place new orders. A maintenance banner will appear in the cart.'
            : 'Customers will be able to purchase products instantly via Fastrr 1-Click checkout.'
        }`
      )
    ) {
      return;
    }

    setIsUpdatingCheckout(true);
    try {
      const updated = await updateAdminCheckoutSetting(nextState, pauseMessage);
      setCheckoutEnabled(updated.enabled);
      setCheckoutLastUpdated(updated.updatedAt || new Date().toISOString());
      setCheckoutUpdatedBy(updated.updatedBy || adminUser?.email || 'Admin');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('checkout-status-changed', {
            detail: {
              enabled: updated.enabled,
              pauseMessage: updated.pauseMessage || pauseMessage,
            },
          })
        );
      }

      showAdminToast(
        `Store checkout has been ${updated.enabled ? 'activated (accepting orders)' : 'paused (orders stopped)'}.`,
        updated.enabled ? 'success' : 'info',
        updated.enabled ? 'Checkout Online' : 'Checkout Paused'
      );
    } catch (err: any) {
      showAdminToast(err.message || 'Failed to update checkout setting', 'error', 'Action Failed');
    } finally {
      setIsUpdatingCheckout(false);
    }
  };

  const handleSavePauseMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pauseMessage.trim()) {
      showAdminToast('Please provide a valid pause notice message.', 'error', 'Validation Error');
      return;
    }

    setIsSavingMessage(true);
    try {
      const updated = await updateAdminCheckoutSetting(checkoutEnabled, pauseMessage.trim());
      setPauseMessage(updated.pauseMessage || pauseMessage);
      setCheckoutLastUpdated(updated.updatedAt || new Date().toISOString());

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('checkout-status-changed', {
            detail: {
              enabled: updated.enabled,
              pauseMessage: updated.pauseMessage || pauseMessage,
            },
          })
        );
      }

      showAdminToast('Customer pause notice message updated successfully.', 'success', 'Notice Saved');
    } catch (err: any) {
      showAdminToast(err.message || 'Failed to save pause message', 'error', 'Error');
    } finally {
      setIsSavingMessage(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadAdmins = async () => {
    setIsLoadingAdmins(true);
    try {
      const data = await fetchAdminAdmins();
      setAdmins(data);
    } catch (err: any) {
      console.error('Failed to load admin directory:', err);
      showAdminToast(err.message || 'Failed to load administrator accounts', 'error', 'Error');
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      loadAdmins();
    }
  }, [isSuperAdmin]);

  const handleToggleRestrict = async (targetUser: AdminUser) => {
    if (!isSuperAdmin) {
      showAdminToast('Only Super Admin can deactivate or reactivate staff accounts.', 'error', 'Unauthorized');
      return;
    }

    if (targetUser.email === 'oxytriumdynamics@gmail.com') {
      showAdminToast('The master Super Admin account cannot be restricted.', 'error', 'Protected Account');
      return;
    }

    if (targetUser.id === adminUser?.id) {
      showAdminToast('You cannot deactivate your own active account.', 'error', 'Action Restricted');
      return;
    }

    const nextState = !targetUser.isRestricted;
    const actionLabel = nextState ? 'deactivate' : 'reactivate';

    if (!confirm(`Are you sure you want to ${actionLabel} account "${targetUser.email}"?`)) {
      return;
    }

    setActionLoadingId(targetUser.id);
    try {
      const updated = await restrictAdminUser(targetUser.id, nextState);
      setAdmins((prev) =>
        prev.map((a) => (a.id === targetUser.id ? { ...a, isRestricted: updated.isRestricted } : a))
      );
      showAdminToast(
        `Staff account ${targetUser.email} has been ${nextState ? 'deactivated' : 'reactivated'}.`,
        nextState ? 'info' : 'success',
        nextState ? 'Account Deactivated' : 'Account Restored'
      );
    } catch (err: any) {
      showAdminToast(err.message || `Failed to ${actionLabel} user`, 'error', 'Update Failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCreateStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail || !newStaffPassword || !newStaffFirstName) {
      showAdminToast('Please fill all required fields.', 'error', 'Validation Error');
      return;
    }

    if (newStaffPassword.length < 8) {
      showAdminToast('Password must be at least 8 characters.', 'error', 'Validation Error');
      return;
    }

    setIsCreatingStaff(true);
    try {
      const created = await createStaffAccount({
        email: newStaffEmail,
        password: newStaffPassword,
        firstName: newStaffFirstName,
        lastName: newStaffLastName || undefined,
        phone: newStaffPhone || undefined,
        role: newStaffRole,
        assignedModules: newStaffRole === 'TEAM' ? newStaffModules : [],
      });

      showAdminToast(
        `New ${newStaffRole === 'ADMIN' ? 'Administrator' : 'Team Member'} account created: ${created.email}`,
        'success',
        'Staff Account Created'
      );

      setIsCreateModalOpen(false);
      setNewStaffEmail('');
      setNewStaffPassword('');
      setNewStaffFirstName('');
      setNewStaffLastName('');
      setNewStaffPhone('');
      setNewStaffRole('TEAM');
      setNewStaffModules(['orders', 'products']);
      loadAdmins();
    } catch (err: any) {
      showAdminToast(err.message || 'Failed to create staff account', 'error', 'Creation Error');
    } finally {
      setIsCreatingStaff(false);
    }
  };

  const openEditPermissionsModal = (targetUser: AdminUser) => {
    setEditStaffUser(targetUser);
    setEditStaffRole(targetUser.role === 'ADMIN' ? 'ADMIN' : 'TEAM');
    setEditStaffModules(targetUser.assignedModules || ['orders', 'products']);
  };

  const handleSavePermissions = async () => {
    if (!editStaffUser) return;
    setIsSavingPermissions(true);
    try {
      const updated = await updateStaffAccount(editStaffUser.id, {
        role: editStaffRole,
        assignedModules: editStaffRole === 'TEAM' ? editStaffModules : [],
      });

      setAdmins((prev) =>
        prev.map((a) => (a.id === editStaffUser.id ? { ...a, role: updated.role, assignedModules: updated.assignedModules } : a))
      );
      showAdminToast(`Permissions updated for ${editStaffUser.email}`, 'success', 'Permissions Saved');
      setEditStaffUser(null);
    } catch (err: any) {
      showAdminToast(err.message || 'Failed to update staff permissions', 'error', 'Error');
    } finally {
      setIsSavingPermissions(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (!isSuperAdmin) {
      setPasswordFeedback({ type: 'error', text: 'Only Super Admin is authorized to change passwords.' });
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordFeedback({ type: 'error', text: 'All password fields are required.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordFeedback({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await changeAdminPassword(currentPassword, newPassword);
      setPasswordFeedback({ type: 'success', text: res.message || 'Password updated successfully.' });
      showAdminToast('Password updated successfully.', 'success', 'Password Changed');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg = err.message || 'Failed to update password. Verify your current password.';
      setPasswordFeedback({ type: 'error', text: msg });
      showAdminToast(msg, 'error', 'Password Error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const filteredAdmins = admins.filter((a) => {
    const q = searchAdmin.toLowerCase();
    return (
      a.email.toLowerCase().includes(q) ||
      (a.firstName && a.firstName.toLowerCase().includes(q)) ||
      (a.lastName && a.lastName.toLowerCase().includes(q)) ||
      a.role.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ fontFamily: SANS }} className="space-y-8 animate-in fade-in duration-200">
      {/* ─── Top Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d8ac52] animate-pulse" />
            <h2 className="text-xl font-bold uppercase tracking-tight text-white">
              OWNERSHIP, ROLES & ACCESS CONTROL
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-1 max-w-2xl font-mono">
            Super Admin (Owner) holds exclusive authority over accounts, credentials, role assignments,
            and traceable audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
              checkoutEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${checkoutEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            CHECKOUT: {checkoutEnabled ? 'ONLINE' : 'PAUSED'}
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-[#d8ac52]/20 border border-[#d8ac52]/40 text-[#d8ac52] font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d8ac52]" />
            SUPER ADMIN (OWNER) CONSOLE
          </span>
        </div>
      </div>

      {/* ─── Role Hierarchy Explainer Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#121212] border border-[#d8ac52]/30 rounded-2xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#d8ac52]/20 text-[#d8ac52] font-bold">
              1. SUPER ADMIN (OWNER)
            </span>
            <ShieldCheck className="w-4 h-4 text-[#d8ac52]" />
          </div>
          <p className="text-xs text-white/80 font-medium">Complete Unrestricted Access</p>
          <ul className="text-[11px] text-white/50 space-y-1 list-disc list-inside">
            <li>Exclusive control over credentials & passwords</li>
            <li>Create, edit, deactivate Admin & Team accounts</li>
            <li>Assign and revoke module permissions</li>
            <li>Inspect complete traceable activity log</li>
          </ul>
        </div>

        <div className="bg-[#121212] border border-white/15 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-white font-bold">
              2. ADMINISTRATOR
            </span>
            <Sliders className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs text-white/80 font-medium">Full Operational Management</p>
          <ul className="text-[11px] text-white/50 space-y-1 list-disc list-inside">
            <li>Manages day-to-day business operations</li>
            <li>Access to orders, catalog, blogs, inquiries</li>
            <li>Cannot modify credentials or user roles</li>
            <li>All actions logged & visible to Super Admin</li>
          </ul>
        </div>

        <div className="bg-[#121212] border border-emerald-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
              3. TEAM MEMBER
            </span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs text-white/80 font-medium">Scoped Module Responsibilities</p>
          <ul className="text-[11px] text-white/50 space-y-1 list-disc list-inside">
            <li>Access strictly limited to assigned modules</li>
            <li>Executes specific day-to-day tasks</li>
            <li>No access to settings or user directory</li>
            <li>All actions logged & visible to Super Admin</li>
          </ul>
        </div>
      </div>

      {/* ─── Two-Column Layout: Left (Staff Directory), Right (Password & Credentials) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Staff Directory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#090909] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-white" />
                  STAFF ACCOUNTS & ROLE ASSIGNMENTS
                </h3>
                <p className="text-[11px] text-white/40 font-mono">
                  All Super Admins, Administrators, and Team Members with console access
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Search */}
                <div className="relative sm:w-48">
                  <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search staff..."
                    value={searchAdmin}
                    onChange={(e) => setSearchAdmin(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-white/30"
                  />
                </div>

                {/* Create Staff Account Button */}
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </button>
              </div>
            </div>

            {/* Staff Table */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.03] border-b border-white/10 text-[10px] font-mono text-white/50 uppercase tracking-widest">
                    <tr>
                      <th className="py-3 px-4">OPERATOR</th>
                      <th className="py-3 px-3">ROLE & MODULES</th>
                      <th className="py-3 px-3">STATUS</th>
                      <th className="py-3 px-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {isLoadingAdmins ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-white/40">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-white" />
                          <span>Loading staff accounts...</span>
                        </td>
                      </tr>
                    ) : filteredAdmins.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-white/40">
                          <Users className="w-6 h-6 mx-auto mb-2 opacity-30" />
                          <span>No staff accounts match your search.</span>
                        </td>
                      </tr>
                    ) : (
                      filteredAdmins.map((adm) => {
                        const isMaster = adm.email === 'oxytriumdynamics@gmail.com';
                        const isSelf = adm.id === adminUser?.id;
                        const isRestricted = !!adm.isRestricted;

                        return (
                          <tr key={adm.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-4 font-sans">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center font-bold font-mono text-xs text-white shrink-0">
                                  {adm.firstName ? adm.firstName.charAt(0).toUpperCase() : 'S'}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-white block text-xs truncate">
                                      {adm.firstName} {adm.lastName}
                                    </span>
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/80 border border-white/15">
                                      {formatRebelId(adm.id)}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-white/50 font-mono block truncate mt-0.5">
                                    {adm.email}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="space-y-1">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                                    adm.role === 'SUPERADMIN'
                                      ? 'bg-[#d8ac52] text-black font-extrabold shadow-sm'
                                      : adm.role === 'ADMIN'
                                      ? 'bg-white text-black font-bold'
                                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  }`}
                                >
                                  {adm.role === 'SUPERADMIN'
                                    ? 'SUPER ADMIN (OWNER)'
                                    : adm.role === 'ADMIN'
                                    ? 'ADMINISTRATOR'
                                    : 'TEAM MEMBER'}
                                </span>

                                {adm.role === 'TEAM' && (
                                  <div className="text-[10px] text-white/50 font-mono">
                                    {adm.assignedModules && adm.assignedModules.length > 0 ? (
                                      <span>{adm.assignedModules.join(', ')}</span>
                                    ) : (
                                      <span className="text-amber-400">No modules assigned</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-3">
                              {isRestricted ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-white/50 border border-white/20 text-[9px] font-bold uppercase">
                                  <UserX className="w-2.5 h-2.5" />
                                  DEACTIVATED
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-white border border-white/20 text-[9px] font-bold uppercase">
                                  <UserCheck className="w-2.5 h-2.5 text-white" />
                                  ACTIVE
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              {isMaster ? (
                                <span className="text-[9px] text-white/40 uppercase tracking-wider font-mono">
                                  Master Super Admin
                                </span>
                              ) : isSelf ? (
                                <span className="text-[9px] text-white/40 uppercase tracking-wider font-mono">
                                  Current Session
                                </span>
                              ) : (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => openEditPermissionsModal(adm)}
                                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer"
                                  >
                                    Permissions
                                  </button>

                                  <button
                                    onClick={() => handleToggleRestrict(adm)}
                                    disabled={actionLoadingId === adm.id}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                                      isRestricted
                                        ? 'bg-white text-black font-bold hover:bg-neutral-200'
                                        : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10'
                                    } disabled:opacity-40`}
                                  >
                                    {actionLoadingId === adm.id
                                      ? '...'
                                      : isRestricted
                                      ? 'Reactivate'
                                      : 'Deactivate'}
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Master Operations & Security Controls */}
        <div className="space-y-4">
          {/* ─── Store Checkout Control (Kill Switch) ─── */}
          <div className="bg-[#090909] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl relative overflow-hidden">
            {/* Accent glow bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-300 ${
                checkoutEnabled ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />

            <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    checkoutEnabled
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    STORE CHECKOUT
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono">
                    Global 1-Click Fastrr & Storefront Checkout
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={loadSettings}
                disabled={isLoadingCheckoutSetting}
                title="Refresh checkout status"
                className="p-1.5 rounded-lg text-white/40 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCheckoutSetting ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Status & Interactive Switch Banner */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                checkoutEnabled
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-amber-950/20 border-amber-500/30'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        checkoutEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    <span
                      className={`text-xs font-mono font-bold uppercase tracking-wider ${
                        checkoutEnabled ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {checkoutEnabled ? 'CHECKOUT ACTIVE' : 'CHECKOUT PAUSED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60">
                    {checkoutEnabled
                      ? 'Accepting live orders. Shoppers can purchase products instantly.'
                      : 'Orders paused. Shoppers will see a maintenance notice in the crate.'}
                  </p>
                </div>

                {/* Switch Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={checkoutEnabled}
                  disabled={isUpdatingCheckout || isLoadingCheckoutSetting}
                  onClick={handleToggleCheckout}
                  className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                    checkoutEnabled ? 'bg-emerald-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      checkoutEnabled ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Action Button */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-white/40">
                  {checkoutEnabled ? 'Active in cart & store' : 'Disabled store-wide'}
                </span>
                <button
                  type="button"
                  onClick={handleToggleCheckout}
                  disabled={isUpdatingCheckout || isLoadingCheckoutSetting}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                    checkoutEnabled
                      ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-sm font-extrabold'
                  } disabled:opacity-50`}
                >
                  {isUpdatingCheckout ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Power className="w-3.5 h-3.5" />
                  )}
                  <span>{checkoutEnabled ? 'Turn OFF Checkout' : 'Turn ON Checkout'}</span>
                </button>
              </div>
            </div>

            {/* Custom Pause Notice Shown to Customers */}
            <form onSubmit={handleSavePauseMessage} className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 block">
                  PAUSE NOTICE (SHOWN IN CART)
                </label>
                <span className="text-[9px] font-mono text-white/30">Custom customer banner</span>
              </div>

              <textarea
                rows={2}
                value={pauseMessage}
                onChange={(e) => setPauseMessage(e.target.value)}
                placeholder="e.g. Instant checkout is temporarily paused for maintenance. Please check back shortly."
                className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono resize-none"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-white/30 truncate max-w-[190px]">
                  {checkoutLastUpdated ? (
                    <>
                      Updated{' '}
                      {new Date(checkoutLastUpdated).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {checkoutUpdatedBy ? ` by ${checkoutUpdatedBy}` : ''}
                    </>
                  ) : (
                    'Default setting'
                  )}
                </span>
                <button
                  type="submit"
                  disabled={isSavingMessage || isLoadingCheckoutSetting}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                >
                  {isSavingMessage ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  <span>Save Notice</span>
                </button>
              </div>
            </form>
          </div>

          {/* ─── Change Super Admin Password Card ─── */}
          <div className="bg-[#090909] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <KeyRound className="w-4 h-4 text-white" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  CHANGE SUPER ADMIN PASSWORD
                </h3>
                <p className="text-[10px] text-white/40 font-mono">
                  Protected Super Admin credential update
                </p>
              </div>
            </div>

            {passwordFeedback && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 font-mono ${
                  passwordFeedback.type === 'success'
                    ? 'bg-white/5 border-white/20 text-white'
                    : 'bg-white/10 border-white/20 text-white'
                }`}
              >
                {passwordFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-white" />
                )}
                <span>{passwordFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              {/* Current Password */}
              <div className="space-y-1">
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
                    className="w-full bg-[#121212] border border-white/10 rounded-xl py-2 pl-3 pr-9 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 block">
                  NEW PASSWORD (MIN. 8 CHARS)
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl py-2 pl-3 pr-9 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 block">
                  CONFIRM NEW PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl py-2 pl-3 pr-9 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
            </form>
          </div>
        </div>
      </div>

      {/* ─── Create Staff Account Modal ─── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0e0e0e] border border-white/20 rounded-3xl p-6 sm:p-7 text-white space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-white" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    CREATE STAFF ACCOUNT
                  </h3>
                  <p className="text-[10px] font-mono text-white/40">
                    Administrator or Team Member provisioning
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full text-white/50 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaffSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-white/60 block">FIRST NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John"
                    value={newStaffFirstName}
                    onChange={(e) => setNewStaffFirstName(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-white/60 block">LAST NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. Doe"
                    value={newStaffLastName}
                    onChange={(e) => setNewStaffLastName(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-white/60 block">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    placeholder="staff@rebelive.com"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-white/60 block">PHONE NUMBER</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-white/60 block">INITIAL PASSWORD (MIN 8 CHARS) *</label>
                <input
                  type="password"
                  required
                  placeholder="Set secure password"
                  value={newStaffPassword}
                  onChange={(e) => setNewStaffPassword(e.target.value)}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-white/60 block">ACCOUNT ROLE *</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStaffRole('TEAM')}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      newStaffRole === 'TEAM'
                        ? 'bg-emerald-400 text-black font-extrabold shadow-sm'
                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Team Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStaffRole('ADMIN')}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      newStaffRole === 'ADMIN'
                        ? 'bg-white text-black font-extrabold shadow-sm'
                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Administrator
                  </button>
                </div>
              </div>

              {/* Module selection for Team Members */}
              {newStaffRole === 'TEAM' && (
                <div className="space-y-2 p-3 rounded-xl bg-white/[0.03] border border-emerald-500/20">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                    ASSIGN MODULE RESPONSIBILITIES
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {MODULE_OPTIONS.map((m) => {
                      const isChecked = newStaffModules.includes(m.key);
                      return (
                        <label
                          key={m.key}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] font-mono transition-colors cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                              : 'bg-white/[0.02] border-white/10 text-white/50 hover:text-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setNewStaffModules((prev) =>
                                prev.includes(m.key) ? prev.filter((k) => k !== m.key) : [...prev, m.key]
                              );
                            }}
                            className="rounded border-white/20 text-emerald-400 focus:ring-0 cursor-pointer"
                          />
                          <span className="truncate">{m.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingStaff}
                  className="flex-1 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCreatingStaff ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Provision Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Edit Permissions Modal ─── */}
      {editStaffUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0e0e0e] border border-white/20 rounded-3xl p-6 sm:p-7 text-white space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  EDIT STAFF PERMISSIONS
                </h3>
                <p className="text-[10px] font-mono text-white/40">{editStaffUser.email}</p>
              </div>
              <button
                onClick={() => setEditStaffUser(null)}
                className="p-1 rounded-full text-white/50 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-white/60 block">ASSIGN ROLE</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStaffRole('TEAM')}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      editStaffRole === 'TEAM'
                        ? 'bg-emerald-400 text-black font-extrabold'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    Team Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStaffRole('ADMIN')}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      editStaffRole === 'ADMIN'
                        ? 'bg-white text-black font-extrabold'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    Administrator
                  </button>
                </div>
              </div>

              {editStaffRole === 'TEAM' && (
                <div className="space-y-2 p-3 rounded-xl bg-white/[0.03] border border-emerald-500/20">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                    ASSIGN MODULE RESPONSIBILITIES
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {MODULE_OPTIONS.map((m) => {
                      const isChecked = editStaffModules.includes(m.key);
                      return (
                        <label
                          key={m.key}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] font-mono transition-colors cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                              : 'bg-white/[0.02] border-white/10 text-white/50 hover:text-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setEditStaffModules((prev) =>
                                prev.includes(m.key) ? prev.filter((k) => k !== m.key) : [...prev, m.key]
                              );
                            }}
                            className="rounded border-white/20 text-emerald-400 focus:ring-0 cursor-pointer"
                          />
                          <span className="truncate">{m.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditStaffUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  disabled={isSavingPermissions}
                  className="flex-1 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSavingPermissions ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Permissions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
