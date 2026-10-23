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
} from 'lucide-react';
import {
  fetchAdminAdmins,
  restrictAdminUser,
  changeAdminPassword,
  AdminUser,
} from '@/lib/adminApi';
import { formatRebelId } from '@/lib/auth';
import { showAdminToast } from '@/components/root/AdminToaster';

const MONO = "'Poppins', sans-serif";
const SANS = "'Poppins', sans-serif";

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

  const isSuperAdmin = adminUser?.role === 'SUPERADMIN';

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
      showAdminToast('Only Super Admin can restrict or unrestrict users.', 'error', 'Unauthorized');
      return;
    }

    if (targetUser.email === 'oxytriumdynamics@gmail.com') {
      showAdminToast('The master Super Admin account cannot be restricted.', 'error', 'Protected Account');
      return;
    }

    if (targetUser.id === adminUser?.id) {
      showAdminToast('You cannot restrict your own active account.', 'error', 'Action Restricted');
      return;
    }

    const nextState = !targetUser.isRestricted;
    const actionLabel = nextState ? 'restrict' : 'unrestrict';

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
        `User ${targetUser.email} has been ${nextState ? 'restricted' : 'unrestricted'}.`,
        nextState ? 'info' : 'success',
        nextState ? 'Access Restricted' : 'Access Restored'
      );
    } catch (err: any) {
      showAdminToast(err.message || `Failed to ${actionLabel} user`, 'error', 'Update Failed');
    } finally {
      setActionLoadingId(null);
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
      await changeAdminPassword(currentPassword, newPassword);
      setPasswordFeedback({
        type: 'success',
        text: 'Master Super Admin password updated successfully.',
      });
      showAdminToast('Master password updated successfully.', 'success', 'Security Updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to update password';
      setPasswordFeedback({ type: 'error', text: msg });
      showAdminToast(msg, 'error', 'Password Update Failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-[#090909] border border-white/10 text-center space-y-4 max-w-xl mx-auto my-12 animate-in fade-in">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/40">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold uppercase tracking-wider text-white">ACCESS RESTRICTED</h3>
        <p className="text-xs text-white/50 font-mono leading-relaxed">
          The System Settings tab is reserved exclusively for Super Admin authority. Standard Administrator roles have read-only operational privileges.
        </p>
      </div>
    );
  }

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
    <div className="space-y-8 animate-in fade-in duration-200" style={{ fontFamily: SANS }}>
      {/* ─── Top Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-white text-black font-mono font-bold text-xs">
              ROOT
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              SUPER ADMIN SETTINGS & SYSTEM CONTROLS
            </h2>
          </div>
          <p className="text-xs text-white/50 font-mono mt-1">
            Privileged governance for administrator accounts, security credentials, and user restriction enforcement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            SUPERADMIN AUTHORIZED
          </span>
        </div>
      </div>

      {/* ─── Two-Column Layout: Left (Admin Accounts), Right (Password & Policies) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Administrators Directory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#090909] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-white" />
                  ADMINISTRATOR ACCOUNTS DIRECTORY
                </h3>
                <p className="text-[11px] text-white/40 font-mono">
                  All accounts with Administrator or Super Admin privileges
                </p>
              </div>

              {/* Search Admins */}
              <div className="relative sm:w-64">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter admin accounts..."
                  value={searchAdmin}
                  onChange={(e) => setSearchAdmin(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            {/* Administrators Table */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.03] border-b border-white/10 text-[10px] font-mono text-white/50 uppercase tracking-widest">
                    <tr>
                      <th className="py-3 px-4">ADMINISTRATOR</th>
                      <th className="py-3 px-3">ROLE</th>
                      <th className="py-3 px-3">STATUS</th>
                      <th className="py-3 px-3">JOINED</th>
                      <th className="py-3 px-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {isLoadingAdmins ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-white/40">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-white" />
                          <span>Loading administrator accounts...</span>
                        </td>
                      </tr>
                    ) : filteredAdmins.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-white/40">
                          <Users className="w-6 h-6 mx-auto mb-2 opacity-30" />
                          <span>No administrator accounts match the query.</span>
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
                                  {adm.firstName ? adm.firstName.charAt(0).toUpperCase() : 'A'}
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
                              <span
                                className={`inline-block px-2 py-0.5 rounded-md font-mono text-[9px] font-bold uppercase ${
                                  adm.role === 'SUPERADMIN'
                                    ? 'bg-white text-black font-extrabold shadow-xs'
                                    : 'bg-white/10 text-white/90 border border-white/20'
                                }`}
                              >
                                {adm.role}
                              </span>
                            </td>

                            <td className="py-3.5 px-3">
                              {isRestricted ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-white/50 border border-white/20 text-[9px] font-bold uppercase">
                                  <UserX className="w-2.5 h-2.5" />
                                  RESTRICTED
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-white border border-white/20 text-[9px] font-bold uppercase">
                                  <UserCheck className="w-2.5 h-2.5 text-white" />
                                  ACTIVE
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-3 text-[10px] text-white/40">
                              {new Date(adm.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              {isMaster ? (
                                <span className="text-[9px] text-white/40 uppercase tracking-wider font-mono">
                                  Master (Immutable)
                                </span>
                              ) : isSelf ? (
                                <span className="text-[9px] text-white/40 uppercase tracking-wider font-mono">
                                  Current User
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleToggleRestrict(adm)}
                                  disabled={actionLoadingId === adm.id}
                                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                                    isRestricted
                                      ? 'bg-white text-black font-bold hover:bg-neutral-200'
                                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                                  } disabled:opacity-40`}
                                >
                                  {actionLoadingId === adm.id
                                    ? 'Processing...'
                                    : isRestricted
                                    ? 'Lift Restriction'
                                    : 'Restrict User'}
                                </button>
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

            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-white/40">
              <span>Only Super Admin can restrict users or modify authority roles.</span>
              <button
                onClick={loadAdmins}
                className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh List
              </button>
            </div>
          </div>

          {/* Role Hierarchy Specs */}
          <div className="bg-[#090909] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-white" />
              SYSTEM ROLE PERMISSION MATRIX
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <span className="inline-block px-2 py-0.5 rounded bg-white text-black font-bold text-[9px]">
                  SUPER ADMIN (OXyTRIUM DYNAMICS)
                </span>
                <ul className="text-[11px] text-white/70 space-y-1 list-disc list-inside">
                  <li>Full authority to modify own password</li>
                  <li>Promote, reassign, or revoke admin privileges</li>
                  <li>Restrict any user account instantly</li>
                  <li>Authorized to delete catalog products & queries</li>
                  <li>Access to settings and system audit controls</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <span className="inline-block px-2 py-0.5 rounded bg-white/10 text-white font-bold text-[9px] border border-white/20">
                  STANDARD ADMIN
                </span>
                <ul className="text-[11px] text-white/70 space-y-1 list-disc list-inside">
                  <li>Read & operational management of inventory</li>
                  <li>Update order states & Shiprocket tracking</li>
                  <li>Mark inquiries status (Viewed, In Process, Resolved)</li>
                  <li className="text-white/40">Cannot modify master password</li>
                  <li className="text-white/40">Cannot delete products or records</li>
                  <li className="text-white/40">Cannot assign roles or restrict accounts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Super Admin Password Management */}
        <div className="space-y-4">
          <div className="bg-[#090909] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-white" />
                MODIFY SUPER ADMIN PASSWORD
              </h3>
              <p className="text-[11px] text-white/40 font-mono mt-0.5">
                Update master credentials for {adminUser?.email}
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs">
              {/* Current Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/60 uppercase">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-[#121212] border border-white/15 rounded-xl px-3 py-2.5 text-white placeholder-white/30 font-mono focus:outline-none focus:border-white/40 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/60 uppercase">
                  New Password (min 8 chars)
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter strong new password"
                    className="w-full bg-[#121212] border border-white/15 rounded-xl px-3 py-2.5 text-white placeholder-white/30 font-mono focus:outline-none focus:border-white/40 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/60 uppercase">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full bg-[#121212] border border-white/15 rounded-xl px-3 py-2.5 text-white placeholder-white/30 font-mono focus:outline-none focus:border-white/40 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Feedback Alert */}
              {passwordFeedback && (
                <div
                  className={`p-3 rounded-xl font-mono text-xs border ${
                    passwordFeedback.type === 'success'
                      ? 'bg-white/10 border-white text-white'
                      : 'bg-white/5 border-white/30 text-white'
                  }`}
                >
                  <p>{passwordFeedback.text}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50 mt-2 shadow-lg"
              >
                {passwordLoading ? 'SAVING MASTER CREDENTIALS...' : 'UPDATE SUPERADMIN PASSWORD'}
              </button>
            </form>
          </div>

          {/* Quick Notice */}
          <div className="bg-[#090909] border border-white/10 rounded-2xl p-4 text-[11px] font-mono text-white/40 leading-relaxed">
            <span className="text-white font-bold block mb-1">SECURITY NOTICE</span>
            Password updates take effect across all active API sessions. Regular admins are strictly prevented from altering passwords or accessing this settings terminal.
          </div>
        </div>
      </div>
    </div>
  );
}
