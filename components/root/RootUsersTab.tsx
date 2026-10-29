'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  MapPin,
  X,
  CreditCard,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import {
  fetchAdminUsers,
  updateAdminUser,
  restrictAdminUser,
  deleteAdminUserPermanent,
  getStoredAdminUser,
  AdminUser,
} from '@/lib/adminApi';
import { formatRebelId } from '@/lib/auth';
import { showAdminToast } from '@/components/root/AdminToaster';


const MONO = "'Poppins', sans-serif";

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  if (currentPage > 3) {
    pages.push('ellipsis');
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);
  return pages;
}

export function RootUsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'CUSTOMER' | 'TEAM' | 'ADMIN' | 'SUPERADMIN'>('ALL');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [feedback, setFeedback] = useState('');
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);

  // Super Admin User Deletion
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeletingUser(true);
    try {
      const res = await deleteAdminUserPermanent(userToDelete.id);
      showAdminToast(
        res.message || `User ${userToDelete.email} permanently purged from database`,
        'success',
        'User Purged'
      );
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setUserToDelete(null);
    } catch (err: any) {
      showAdminToast(err.message || 'Failed to delete user account', 'error', 'Delete Failed');
    } finally {
      setIsDeletingUser(false);
    }
  };


  const MODULE_OPTIONS = [
    { key: 'orders', label: 'Orders & Logistics' },
    { key: 'products', label: 'Catalog & Inventory' },
    { key: 'blogs', label: 'Blogs & Articles' },
    { key: 'testimonials', label: 'Testimonials' },
    { key: 'contact-queries', label: 'Contact Inquiries' },
    { key: 'corporate-queries', label: 'Corporate Inquiries' },
  ];

  const loadUsers = async (
    targetPage = page,
    targetSearch = search,
    targetRole = roleFilter,
    targetLimit = limit
  ) => {
    setIsLoading(true);
    try {
      const res = await fetchAdminUsers({
        search: targetSearch.trim() || undefined,
        role: targetRole === 'ALL' ? undefined : targetRole,
        page: targetPage,
        limit: targetLimit,
      });
      setUsers(res.data);
      setTotal(res.total);
      setPage(res.page || targetPage);
      const calculatedPages = Math.max(1, Math.ceil(res.total / targetLimit));
      setTotalPages(res.totalPages || calculatedPages);
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentAdmin(getStoredAdminUser());
    loadUsers(1, '', 'ALL', 15);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page || isLoading) return;
    setPage(newPage);
    loadUsers(newPage, search, roleFilter, limit);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadUsers(1, search, roleFilter, limit);
  };

  const handleClearSearch = () => {
    setSearch('');
    setPage(1);
    loadUsers(1, '', roleFilter, limit);
  };

  const handleRoleFilterChange = (newRole: 'ALL' | 'CUSTOMER' | 'TEAM' | 'ADMIN' | 'SUPERADMIN') => {
    setRoleFilter(newRole);
    setPage(1);
    loadUsers(1, search, newRole, limit);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    loadUsers(1, search, roleFilter, newLimit);
  };

  const handleToggleRestrict = async (userId: string, currentRestricted: boolean) => {
    if (currentAdmin?.role !== 'SUPERADMIN') {
      showAdminToast('Only Super Admin is authorized to restrict accounts.', 'error', 'Permission Denied');
      return;
    }

    if (selectedUser?.email === 'oxytriumdynamics@gmail.com') {
      showAdminToast('The master Super Admin account cannot be restricted.', 'error', 'Protected Account');
      return;
    }

    const nextState = !currentRestricted;
    try {
      const updated = await restrictAdminUser(userId, nextState);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isRestricted: updated.isRestricted } : u)));
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => (prev ? { ...prev, isRestricted: updated.isRestricted } : null));
      }
      showAdminToast(
        `User ${nextState ? 'deactivated' : 'restriction lifted'}.`,
        nextState ? 'info' : 'success',
        nextState ? 'Account Deactivated' : 'Account Restored'
      );
    } catch (err: any) {
      showAdminToast(err.message || 'Error updating user restriction status', 'error', 'Action Failed');
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'CUSTOMER' | 'TEAM' | 'ADMIN' | 'SUPERADMIN') => {
    if (currentAdmin?.role !== 'SUPERADMIN') {
      showAdminToast('Only Super Admin has authority to assign or change user roles.', 'error', 'Permission Denied');
      return;
    }

    if (selectedUser?.email === 'oxytriumdynamics@gmail.com') {
      showAdminToast('The master Super Admin account cannot be modified.', 'error', 'Protected Account');
      return;
    }

    try {
      const defaultModules = newRole === 'TEAM' && (!selectedUser?.assignedModules || selectedUser.assignedModules.length === 0)
        ? ['orders', 'products']
        : selectedUser?.assignedModules || [];

      const updated = await updateAdminUser(userId, {
        role: newRole,
        ...(newRole === 'TEAM' ? { assignedModules: defaultModules } : {}),
      } as any);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, role: updated.role, assignedModules: updated.assignedModules || defaultModules }
            : u
        )
      );
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) =>
          prev
            ? { ...prev, role: updated.role, assignedModules: updated.assignedModules || defaultModules }
            : null
        );
      }
      setFeedback(`User role updated to ${newRole}`);
      showAdminToast(`User role updated to ${newRole}`, 'success', 'Role Updated');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err: any) {
      showAdminToast(err.message || 'Error updating user role', 'error', 'Update Failed');
    }
  };

  const handleToggleModule = async (moduleKey: string) => {
    if (!selectedUser || currentAdmin?.role !== 'SUPERADMIN') return;
    const current = selectedUser.assignedModules || [];
    const updatedModules = current.includes(moduleKey)
      ? current.filter((m) => m !== moduleKey)
      : [...current, moduleKey];

    try {
      await updateAdminUser(selectedUser.id, { assignedModules: updatedModules } as any);
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, assignedModules: updatedModules } : u))
      );
      setSelectedUser((prev) => (prev ? { ...prev, assignedModules: updatedModules } : null));
      showAdminToast('Module permissions updated.', 'success', 'Permissions Saved');
    } catch (err: any) {
      showAdminToast(err.message || 'Failed to update module permissions', 'error', 'Update Failed');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Search & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wider text-white">
            USER ACCOUNTS &amp; CUSTOMER DIRECTORY
          </h2>
          <p className="text-xs text-white/50 font-mono">
            {total} registered operators and verified customer accounts
            {search && <span className="text-white/70 ml-1">· matching &quot;{search}&quot;</span>}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => handleRoleFilterChange(e.target.value as any)}
              className="bg-[#0f0f0f] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white/80 font-mono focus:outline-none focus:border-white/30 cursor-pointer appearance-none pr-8"
            >
              <option value="ALL">All Roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="TEAM">Team Member</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPERADMIN">Super Admin</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Name, Email, Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl py-2.5 pl-10 pr-9 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 font-mono"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Refresh Button */}
          <button
            onClick={() => loadUsers(page, search, roleFilter, limit)}
            disabled={isLoading}
            title="Refresh Directory"
            className="p-2.5 rounded-xl border border-white/10 bg-[#0f0f0f] hover:bg-white/5 text-white/70 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-white' : ''}`} />
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs animate-in fade-in">
          {feedback}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/10 text-[10px] font-mono text-white/50 uppercase tracking-widest">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">USER IDENTITY</th>
                <th className="py-3.5 px-4">ROLE</th>
                <th className="py-3.5 px-4">PHONE &amp; CONTACT</th>
                <th className="py-3.5 px-4">ORDERS</th>
                <th className="py-3.5 px-4">TOTAL SPENT</th>
                <th className="py-3.5 px-4">REGISTERED</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-white/40 font-mono">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-white/30" />
                    <span>Loading User Directory...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-white/40 font-mono">
                    <Users className="w-6 h-6 mx-auto mb-2 opacity-30" />
                    <span>No users found matching query.</span>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white block text-xs">
                          {u.firstName && !u.firstName.toLowerCase().startsWith('chrome:') && !u.firstName.toLowerCase().includes('call method')
                            ? `${u.firstName} ${u.lastName || ''}`.trim()
                            : (u.phone ? `Customer (${u.phone})` : 'Customer Account')}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/80 border border-white/15">
                          {formatRebelId(u.id)}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/50 font-mono block mt-0.5">
                        {u.email}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                            u.role === 'SUPERADMIN'
                              ? 'bg-[#d8ac52] text-black font-extrabold shadow-sm'
                              : u.role === 'ADMIN'
                              ? 'bg-white text-black font-bold'
                              : u.role === 'TEAM'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-white/10 text-white/70 border border-white/15'
                          }`}
                        >
                          {u.role === 'TEAM' ? 'TEAM' : u.role}
                        </span>
                        {u.isRestricted && (
                          <span className="inline-block px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase bg-white/10 text-white/50 border border-white/20">
                            DEACTIVATED
                          </span>
                        )}
                      </div>
                      {u.role === 'TEAM' && u.assignedModules && u.assignedModules.length > 0 && (
                        <span className="text-[9px] font-mono text-white/40 block mt-1">
                          {u.assignedModules.length} module{u.assignedModules.length > 1 ? 's' : ''} assigned
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-white/70">
                      <span>{u.phone || 'No phone'}</span>
                    </td>

                    <td className="py-4 px-4 font-mono text-white font-semibold">
                      {u.ordersCount ?? 0}
                    </td>

                    <td className="py-4 px-4 font-mono text-white font-bold">
                      ₹{(u.totalSpent ?? 0).toLocaleString('en-IN')}
                    </td>

                    <td className="py-4 px-4 font-mono text-[10px] text-white/50">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white text-xs font-mono transition-colors cursor-pointer"
                        >
                          Dossier
                        </button>
                        {currentAdmin?.role === 'SUPERADMIN' &&
                          u.email !== 'oxytriumdynamics@gmail.com' &&
                          u.id !== currentAdmin.id && (
                            <button
                              onClick={() => setUserToDelete(u)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors cursor-pointer"
                              title="Permanently Delete User from Database (Super Admin Only)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>

                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="border-t border-white/10 bg-white/[0.02] px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-3 text-white/60 text-[11px]">
            <span>
              Showing{' '}
              <strong className="text-white">
                {total === 0 ? 0 : (page - 1) * limit + 1}
              </strong>
              –
              <strong className="text-white">
                {Math.min(page * limit, total)}
              </strong>{' '}
              of <strong className="text-white">{total}</strong> users
            </span>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-white/40">Per page:</span>
              <select
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-white text-[11px] focus:outline-none focus:border-white/40 cursor-pointer"
              >
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(1)}
              disabled={page <= 1 || isLoading}
              title="First Page"
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || isLoading}
              title="Previous Page"
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Prev</span>
            </button>

            <div className="flex items-center gap-1 mx-1">
              {getPageNumbers(page, totalPages).map((p, idx) =>
                p === 'ellipsis' ? (
                  <span key={`ellipsis-${idx}`} className="px-1.5 text-white/30 text-[11px]">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    disabled={isLoading}
                    className={`min-w-[30px] h-7 px-2 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                      p === page
                        ? 'bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                        : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
              title="Next Page"
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="text-[11px] hidden sm:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={page >= totalPages || isLoading}
              title="Last Page"
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Modal: User Dossier ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0e0e0e] border border-white/15 rounded-3xl p-6 sm:p-7 text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                  USER PROFILE DOSSIER · {formatRebelId(selectedUser.id)}
                </span>
                <h3 className="text-lg font-bold font-mono text-white uppercase">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/40 uppercase block">Account Credentials</span>
                  <span className="text-[9.5px] font-mono text-white font-bold bg-white/10 px-2 py-0.5 rounded border border-white/15">
                    {formatRebelId(selectedUser.id)}
                  </span>
                </div>
                <p className="text-white font-mono">{selectedUser.email}</p>
                <p className="text-white/60 font-mono">Mobile: {selectedUser.phone || 'None'}</p>
                <p className="text-white/70 font-mono text-[11px]">
                  Email Verified: {selectedUser.emailVerified ? 'YES' : 'NO'}
                </p>
              </div>

              {/* Role & Privilege Management */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/40 uppercase block">
                    Role & Privilege Management
                  </span>
                  {currentAdmin?.role === 'SUPERADMIN' ? (
                    <span className="text-[9px] font-mono text-white bg-white/10 px-2 py-0.5 rounded border border-white/20">
                      SUPER ADMIN CONTROLS
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-white/40">
                      READ ONLY
                    </span>
                  )}
                </div>

                {selectedUser.email === 'oxytriumdynamics@gmail.com' ? (
                  <div className="p-2.5 rounded-lg bg-white/10 border border-white/20 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                    <span className="text-xs font-mono font-bold text-white">
                      MASTER SUPER ADMIN (Protected & Immutable)
                    </span>
                  </div>
                ) : currentAdmin?.role === 'SUPERADMIN' ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      {(['CUSTOMER', 'TEAM', 'ADMIN'] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => handleRoleChange(selectedUser.id, r)}
                          className={`flex-1 px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                            selectedUser.role === r
                              ? r === 'TEAM'
                                ? 'bg-emerald-400 text-black font-extrabold shadow-sm'
                                : 'bg-white text-black font-extrabold shadow-sm'
                              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {r === 'ADMIN' ? 'Admin' : r === 'TEAM' ? 'Team Member' : 'Customer'}
                        </button>
                      ))}
                    </div>

                    {selectedUser.role === 'TEAM' && (
                      <div className="space-y-2 p-3 rounded-xl bg-white/[0.03] border border-emerald-500/20">
                        <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                          ASSIGNED MODULE RESPONSIBILITIES
                        </span>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {MODULE_OPTIONS.map((m) => {
                            const isChecked = (selectedUser.assignedModules || []).includes(m.key);
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
                                  onChange={() => handleToggleModule(m.key)}
                                  className="rounded border-white/20 text-emerald-400 focus:ring-0 cursor-pointer"
                                />
                                <span className="truncate">{m.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <p className="text-[10px] font-mono text-white/40 leading-relaxed">
                      Super Admin retains full authority. Admins manage day-to-day operations. Team members only access assigned modules.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="font-mono text-xs font-bold text-white uppercase">
                      {selectedUser.role}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      Only Super Admin can assign or change roles
                    </span>
                  </div>
                )}
              </div>

              {/* Account Restriction Enforcement (Super Admin only) */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/40 uppercase block">
                    Account Access Enforcement
                  </span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      selectedUser.isRestricted
                        ? 'bg-white/10 text-white/50 border border-white/20'
                        : 'bg-white/5 text-white border border-white/20'
                    }`}
                  >
                    {selectedUser.isRestricted ? 'RESTRICTED' : 'ACTIVE'}
                  </span>
                </div>

                {selectedUser.email === 'oxytriumdynamics@gmail.com' ? (
                  <p className="text-[10px] font-mono text-white/40">
                    Master account cannot be restricted.
                  </p>
                ) : currentAdmin?.role === 'SUPERADMIN' ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleToggleRestrict(selectedUser.id, !!selectedUser.isRestricted)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                        selectedUser.isRestricted
                          ? 'bg-white text-black hover:bg-neutral-200'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      {selectedUser.isRestricted ? 'Lift Account Restriction' : 'Restrict User Account'}
                    </button>
                    <p className="text-[10px] font-mono text-white/40 leading-relaxed">
                      Restricting a user account instantly terminates all active access tokens and prevents future logins.
                    </p>
                  </div>
                ) : (
                  <p className="text-[10px] font-mono text-white/40">
                    Only Super Admin can restrict or unrestrict users.
                  </p>
                )}
              </div>

              {/* Saved Addresses */}
              {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-white/40 uppercase block">Registered Addresses</span>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {selectedUser.addresses.map((a: any, i: number) => (
                      <div key={i} className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px]">
                        <p className="text-white">{a.line1}</p>
                        <p className="text-white/50">{a.city}, {a.state} - {a.postalCode}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Super Admin Danger Zone: Permanent Account Deletion */}
              {currentAdmin?.role === 'SUPERADMIN' &&
                selectedUser.email !== 'oxytriumdynamics@gmail.com' &&
                selectedUser.id !== currentAdmin.id && (
                  <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/25 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-red-400 font-bold uppercase block">
                        DANGER ZONE · PERMANENT REMOVAL
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                        IRREVERSIBLE
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-white/50 leading-relaxed">
                      Permanently delete this user from the database along with all associated addresses, orders, reviews, and carts.
                    </p>
                    <button
                      onClick={() => {
                        const target = selectedUser;
                        setSelectedUser(null);
                        setUserToDelete(target);
                      }}
                      className="w-full py-2 px-3 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Permanently Delete User From DB</span>
                    </button>
                  </div>
                )}
            </div>


            <div className="pt-2 flex justify-end border-t border-white/10">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Delete User Confirmation (SUPERADMIN Only) ── */}
      {userToDelete && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0e0e0e] border border-red-500/30 rounded-3xl p-6 text-white space-y-5 shadow-2xl">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider block">
                  SUPER ADMIN ACTION · IRREVERSIBLE
                </span>
                <h3 className="text-base font-bold font-mono text-white">
                  Permanently Delete User?
                </h3>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-white/40">User ID:</span>
                <span className="font-bold text-white">{formatRebelId(userToDelete.id)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40">Name:</span>
                <span className="font-bold text-white">{userToDelete.firstName} {userToDelete.lastName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40">Email:</span>
                <span className="text-white truncate max-w-[200px]">{userToDelete.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40">Role:</span>
                <span className="font-bold text-white uppercase">{userToDelete.role}</span>
              </div>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              Are you sure you want to completely purge <span className="font-mono text-white font-bold">{userToDelete.email}</span>? All related database records (addresses, orders, cart items, wishlist, reviews, and activity tokens) will be completely erased. This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeletingUser}
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-bold uppercase transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingUser}
                onClick={handleConfirmDeleteUser}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase transition-all cursor-pointer shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {isDeletingUser ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Purging...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

