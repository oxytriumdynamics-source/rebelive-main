'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Search,
  RefreshCw,
  Clock,
  Filter,
  User,
  Activity,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Terminal,
  CheckCircle2,
  AlertCircle,
  FileText,
  Boxes,
  Package,
  Sliders,
  Calendar,
  Globe,
} from 'lucide-react';
import { fetchAdminActivityLogs, AdminActivityLog } from '@/lib/adminApi';
import { showAdminToast } from '@/components/root/AdminToaster';

const MONO = "'Poppins', sans-serif";

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | 'ellipsis')[] = [1];
  if (currentPage > 3) pages.push('ellipsis');
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (currentPage < totalPages - 2) pages.push('ellipsis');
  pages.push(totalPages);
  return pages;
}

export function RootActivityLogsTab() {
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'SUPERADMIN' | 'ADMIN' | 'TEAM'>('ALL');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<AdminActivityLog | null>(null);

  const loadLogs = async (
    targetPage = page,
    targetSearch = search,
    targetRole = roleFilter,
    targetEntity = entityFilter,
    targetLimit = limit
  ) => {
    setIsLoading(true);
    try {
      const res = await fetchAdminActivityLogs({
        page: targetPage,
        limit: targetLimit,
        search: targetSearch.trim() || undefined,
        role: targetRole === 'ALL' ? undefined : targetRole,
        entity: targetEntity === 'ALL' ? undefined : targetEntity,
      });
      setLogs(res.data);
      setTotal(res.total);
      setPage(res.page || targetPage);
      setTotalPages(res.totalPages || Math.max(1, Math.ceil(res.total / targetLimit)));
    } catch (err: any) {
      console.error('Failed to load activity logs:', err);
      showAdminToast(err.message || 'Failed to load activity logs', 'error', 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(1, '', 'ALL', 'ALL', limit);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page || isLoading) return;
    setPage(newPage);
    loadLogs(newPage, search, roleFilter, entityFilter, limit);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadLogs(1, search, roleFilter, entityFilter, limit);
  };

  const handleRoleChange = (role: 'ALL' | 'SUPERADMIN' | 'ADMIN' | 'TEAM') => {
    setRoleFilter(role);
    setPage(1);
    loadLogs(1, search, role, entityFilter, limit);
  };

  const handleEntityChange = (entity: string) => {
    setEntityFilter(entity);
    setPage(1);
    loadLogs(1, search, roleFilter, entity, limit);
  };

  const formatTimestamp = (ts: string) => {
    try {
      const d = new Date(ts);
      return {
        relative: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        full: d.toISOString(),
      };
    } catch {
      return { relative: ts, full: ts };
    }
  };

  const getRoleBadge = (role?: string | null) => {
    const r = (role || 'SYSTEM').toUpperCase();
    if (r === 'SUPERADMIN') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#d8ac52]/20 text-[#d8ac52] border border-[#d8ac52]/30">
          <ShieldCheck className="w-3 h-3 text-[#d8ac52]" />
          OWNER / SUPER ADMIN
        </span>
      );
    }
    if (r === 'ADMIN') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20">
          <Sliders className="w-3 h-3 text-white" />
          ADMINISTRATOR
        </span>
      );
    }
    if (r === 'TEAM') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <User className="w-3 h-3 text-emerald-400" />
          TEAM MEMBER
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-white/50 border border-white/10">
        SYSTEM
      </span>
    );
  };

  const getEntityIcon = (entity: string) => {
    const e = entity.toLowerCase();
    if (e.includes('order')) return <Package className="w-3.5 h-3.5 text-blue-400" />;
    if (e.includes('product') || e.includes('variant')) return <Boxes className="w-3.5 h-3.5 text-purple-400" />;
    if (e.includes('user') || e.includes('staff')) return <User className="w-3.5 h-3.5 text-emerald-400" />;
    if (e.includes('blog')) return <FileText className="w-3.5 h-3.5 text-amber-400" />;
    return <Activity className="w-3.5 h-3.5 text-white/60" />;
  };

  return (
    <div className="space-y-6">
      {/* ─── Header & Description ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d8ac52] animate-pulse" />
            <h2 className="text-xl font-bold uppercase tracking-tight text-white">
              AUDIT TRAIL & ACTIVITY LOGS
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white/70">
              TRACEABILITY ENGINE
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1 max-w-2xl">
            Live, tamper-proof record of every administrative event, operational mutation, and user
            access change executed across the platform.
          </p>
        </div>

        <button
          onClick={() => loadLogs(page, search, roleFilter, entityFilter, limit)}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Trail</span>
        </button>
      </div>

      {/* ─── Filter Bar ─── */}
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by action, email, actor name, or entity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#181818] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 font-sans"
            />
          </form>

          {/* Role Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-white/40 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> ROLE:
            </span>
            {(['ALL', 'SUPERADMIN', 'ADMIN', 'TEAM'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleChange(r)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  roleFilter === r
                    ? 'bg-white text-black font-semibold'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {r === 'ALL' ? 'ALL' : r === 'SUPERADMIN' ? 'SUPER ADMIN' : r}
              </button>
            ))}
          </div>

          {/* Entity Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-white/40 mr-1">MODULE:</span>
            {['ALL', 'Order', 'Product', 'User', 'BlogPost', 'Query'].map((ent) => (
              <button
                key={ent}
                type="button"
                onClick={() => handleEntityChange(ent)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  entityFilter === ent
                    ? 'bg-[#d8ac52] text-black font-semibold'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {ent === 'BlogPost' ? 'Blog' : ent}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Activity Log List ─── */}
      <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-white/40 font-mono text-xs">
            <RefreshCw className="w-5 h-5 animate-spin text-white" />
            <span>PULLING PLATFORM AUDIT RECORDS...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-white/40 text-xs">
            <Activity className="w-8 h-8 text-white/20 mb-1" />
            <p className="font-semibold text-white/70">No activity logs found</p>
            <p className="text-[11px] text-white/40">Try adjusting your search query or role filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {logs.map((log) => {
              const ts = formatTimestamp(log.createdAt);
              return (
                <div
                  key={log.id}
                  className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left info: Icon, Action, Entity, Details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5">
                      {getEntityIcon(log.entity)}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-white tracking-wide">
                          {log.action}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-white/60 border border-white/10">
                          {log.entity} {log.entityId ? `· #${log.entityId}` : ''}
                        </span>
                      </div>

                      {/* Actor Information */}
                      <div className="flex items-center gap-2 text-xs text-white/70 flex-wrap">
                        <span className="font-medium text-white">{log.actorName || log.actorEmail}</span>
                        <span className="text-white/30">•</span>
                        <span className="font-mono text-[11px] text-white/40">{log.actorEmail}</span>
                        <span className="text-white/30">•</span>
                        {getRoleBadge(log.actorRole)}
                      </div>

                      {/* Details summary */}
                      {log.details && (
                        <div className="pt-1">
                          <p className="text-[11px] font-mono text-white/50 truncate max-w-2xl bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/5">
                            {typeof log.details === 'string'
                              ? log.details
                              : JSON.stringify(log.details).replace(/"/g, '')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right info: IP address, Timestamp, Details button */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono">
                      <Clock className="w-3.5 h-3.5 text-white/40" />
                      <span title={ts.full}>{ts.relative}</span>
                    </div>

                    {log.ipAddress && (
                      <span className="text-[10px] font-mono text-white/30 flex items-center gap-1">
                        <Globe className="w-2.5 h-2.5" />
                        {log.ipAddress}
                      </span>
                    )}

                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Pagination Bar ─── */}
        {!isLoading && totalPages > 1 && (
          <div className="p-4 border-t border-white/10 bg-[#0e0e0e] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-white/40 font-mono">
              Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total} events
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 px-1">
                {getPageNumbers(page, totalPages).map((p, idx) =>
                  p === 'ellipsis' ? (
                    <span key={`el-${idx}`} className="px-2 text-white/30 font-mono">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`min-w-[28px] h-7 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                        page === p
                          ? 'bg-white text-black font-bold'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Detailed Inspect Modal ─── */}
      {selectedLog && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#101010] border border-white/20 rounded-3xl p-6 sm:p-7 text-white space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-[#d8ac52]" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    EVENT RECORD INSPECTION
                  </h3>
                  <p className="text-[10px] font-mono text-white/40">Log ID: {selectedLog.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-white/[0.02] p-4 rounded-2xl border border-white/5">
              <div>
                <span className="text-[10px] font-mono uppercase text-white/40 block">ACTION</span>
                <span className="font-mono font-bold text-white">{selectedLog.action}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-white/40 block">ENTITY</span>
                <span className="font-mono text-white">{selectedLog.entity}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-white/40 block">ACTOR</span>
                <span className="text-white">{selectedLog.actorName || selectedLog.actorEmail}</span>
                <div className="mt-1">{getRoleBadge(selectedLog.actorRole)}</div>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-white/40 block">TIMESTAMP</span>
                <span className="font-mono text-white/80">{selectedLog.createdAt}</span>
                {selectedLog.ipAddress && (
                  <p className="text-[10px] text-white/40 mt-1 font-mono">IP: {selectedLog.ipAddress}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block">
                METADATA / DETAILS
              </span>
              <pre className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs font-mono text-emerald-400 overflow-x-auto max-h-60">
                {JSON.stringify(selectedLog.details || {}, null, 2)}
              </pre>
            </div>

            {selectedLog.userAgent && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block">
                  CLIENT USER AGENT
                </span>
                <p className="text-[11px] font-mono text-white/40 break-all bg-white/[0.02] p-2 rounded-lg border border-white/5">
                  {selectedLog.userAgent}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
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
