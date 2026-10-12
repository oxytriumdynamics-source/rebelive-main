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
} from 'lucide-react';
import { fetchAdminUsers, updateAdminUser, AdminUser } from '@/lib/adminApi';
import { showAdminToast } from '@/components/root/AdminToaster';

const MONO = "'JetBrains Mono', monospace";

export function RootUsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [feedback, setFeedback] = useState('');

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminUsers({ search: search || undefined });
      setUsers(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  const handleRoleChange = async (userId: string, newRole: 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN') => {
    try {
      const updated = await updateAdminUser(userId, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u)));
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => (prev ? { ...prev, role: updated.role } : null));
      }
      setFeedback(`User role updated to ${newRole}`);
      showAdminToast(`User role updated to ${newRole}`, 'success', 'Role Updated');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err: any) {
      showAdminToast(err.message || 'Error updating user role', 'error', 'Update Failed');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Search & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wider text-white">
            USER ACCOUNTS & CUSTOMER DIRECTORY
          </h2>
          <p className="text-xs text-white/50 font-mono">
            {total} registered operators and verified customer accounts
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Name, Email, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 font-mono"
          />
        </form>
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
                <th className="py-3.5 px-4">PHONE & CONTACT</th>
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
                      <span className="font-bold text-white block text-xs">
                        {u.firstName} {u.lastName}
                      </span>
                      <span className="text-[10px] text-white/50 font-mono block">
                        {u.email}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                          u.role === 'SUPERADMIN'
                            ? 'bg-white text-black border border-white'
                            : u.role === 'ADMIN'
                            ? 'bg-white/20 text-white border border-white/30'
                            : 'bg-white/10 text-white/70 border border-white/15'
                        }`}
                      >
                        {u.role}
                      </span>
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
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white text-xs font-mono transition-colors cursor-pointer"
                      >
                        Dossier
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: User Dossier ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0e0e0e] border border-white/15 rounded-3xl p-6 sm:p-7 text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                  USER PROFILE DOSSIER
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
                <span className="text-[10px] font-mono text-white/40 uppercase block">Account Credentials</span>
                <p className="text-white font-mono">{selectedUser.email}</p>
                <p className="text-white/60 font-mono">Mobile: {selectedUser.phone || 'None'}</p>
                <p className="text-white/70 font-mono text-[11px]">
                  Email Verified: {selectedUser.emailVerified ? 'YES' : 'NO'}
                </p>
              </div>

              {/* Role Toggle */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <span className="text-[10px] font-mono text-white/40 uppercase block">Privilege Elevation</span>
                <div className="flex gap-2">
                  {(['CUSTOMER', 'ADMIN', 'SUPERADMIN'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(selectedUser.id, r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                        selectedUser.role === r
                          ? 'bg-white text-black font-extrabold shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
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
    </div>
  );
}
