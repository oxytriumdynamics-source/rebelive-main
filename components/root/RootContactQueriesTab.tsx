'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  RefreshCw,
  Clock,
  Phone,
  User,
  CheckCircle2,
  Eye,
  Zap,
  Slash,
  Trash2,
  X,
  FileText,
  AlertCircle,
  Tag,
  ArrowRight,
  Send,
  HelpCircle,
} from 'lucide-react';
import {
  fetchContactQueries,
  updateContactQueryStatus,
  deleteContactQuery,
  AdminContactQuery,
  QueryStatus,
  QueryCounts,
} from '@/lib/adminApi';
import { showAdminToast } from './AdminToaster';

const MONO = "'JetBrains Mono', monospace";
const SANS = "'Poppins', sans-serif";

const STATUS_CONFIG: Record<
  QueryStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  NEW: {
    label: 'New',
    bg: 'bg-white',
    text: 'text-black font-bold',
    border: 'border-white',
    icon: Clock,
  },
  VIEWED: {
    label: 'Viewed',
    bg: 'bg-white/10',
    text: 'text-white',
    border: 'border-white/20',
    icon: Eye,
  },
  IN_PROCESS: {
    label: 'In Process',
    bg: 'bg-white/20',
    text: 'text-white',
    border: 'border-white/30',
    icon: Zap,
  },
  RESOLVED: {
    label: 'Resolved',
    bg: 'bg-white/10',
    text: 'text-white',
    border: 'border-white/20',
    icon: CheckCircle2,
  },
  IGNORED: {
    label: 'Ignored',
    bg: 'bg-white/5',
    text: 'text-white/40',
    border: 'border-white/10',
    icon: Slash,
  },
};

export function RootContactQueriesTab() {
  const [queries, setQueries] = useState<AdminContactQuery[]>([]);
  const [counts, setCounts] = useState<QueryCounts>({
    total: 0,
    new: 0,
    viewed: 0,
    in_process: 0,
    resolved: 0,
    ignored: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | QueryStatus>('ALL');
  const [selectedQuery, setSelectedQuery] = useState<AdminContactQuery | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchContactQueries(statusFilter === 'ALL' ? undefined : statusFilter, search);
      setQueries(res.data);
      setCounts(res.counts);
    } catch (err) {
      console.error('Error fetching contact queries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleStatusChange = async (queryId: string, newStatus: QueryStatus, adminNote?: string) => {
    setIsUpdatingStatus(queryId);
    try {
      const updated = await updateContactQueryStatus(queryId, newStatus, adminNote);
      setQueries((prev) => prev.map((q) => (q.id === queryId ? updated : q)));
      if (selectedQuery?.id === queryId) {
        setSelectedQuery(updated);
      }
      showAdminToast(
        `Inquiry marked as ${STATUS_CONFIG[newStatus].label}`,
        newStatus === 'RESOLVED' ? 'success' : newStatus === 'IGNORED' ? 'warning' : 'info'
      );
      // Reload stats
      const refreshed = await fetchContactQueries(statusFilter === 'ALL' ? undefined : statusFilter, search);
      setCounts(refreshed.counts);
    } catch (err: any) {
      showAdminToast(err?.message || 'Failed to update status', 'error');
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleDelete = async (queryId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the contact query from "${name}"?`)) {
      return;
    }
    try {
      await deleteContactQuery(queryId);
      setQueries((prev) => prev.filter((q) => q.id !== queryId));
      if (selectedQuery?.id === queryId) setSelectedQuery(null);
      showAdminToast('Contact inquiry deleted successfully.', 'info');
      const refreshed = await fetchContactQueries(statusFilter === 'ALL' ? undefined : statusFilter, search);
      setCounts(refreshed.counts);
    } catch (err: any) {
      showAdminToast(err?.message || 'Failed to delete query', 'error');
    }
  };

  const openDetail = (query: AdminContactQuery) => {
    setSelectedQuery(query);
    setNoteDraft(query.adminNote || '');
    // If opening a new query, mark it as viewed automatically
    if (query.status === 'NEW') {
      handleStatusChange(query.id, 'VIEWED');
    }
  };

  const saveAdminNote = async () => {
    if (!selectedQuery) return;
    await handleStatusChange(selectedQuery.id, selectedQuery.status, noteDraft);
  };

  return (
    <div style={{ fontFamily: SANS }} className="space-y-6">
      {/* ─── Header & Top Actions ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-widest text-white/70 uppercase bg-white/5 px-2 py-0.5 rounded border border-white/10">
              STOREFRONT INBOX
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-1 flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-white" />
            Contact Inquiries
          </h2>
          <p className="text-xs text-white/50 font-mono mt-0.5">
            Customer messages, inquiries, and questions submitted via /contact
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ─── KPI Stats Row ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total', count: counts.total, filter: 'ALL', color: 'border-white/10 text-white bg-white/[0.02]' },
          { label: 'New', count: counts.new, filter: 'NEW', color: 'border-white/20 text-white bg-white/5' },
          { label: 'Viewed', count: counts.viewed, filter: 'VIEWED', color: 'border-white/15 text-white/90 bg-white/[0.03]' },
          { label: 'In Process', count: counts.in_process, filter: 'IN_PROCESS', color: 'border-white/20 text-white bg-white/5' },
          { label: 'Resolved', count: counts.resolved, filter: 'RESOLVED', color: 'border-white/25 text-white bg-white/[0.04]' },
          { label: 'Ignored', count: counts.ignored, filter: 'IGNORED', color: 'border-white/10 text-white/50 bg-black' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setStatusFilter(item.filter as any)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              statusFilter === item.filter
                ? 'ring-2 ring-white/40 bg-white/10'
                : 'hover:bg-white/5'
            } ${item.color}`}
          >
            <p className="text-[10px] font-mono uppercase text-white/50">{item.label}</p>
            <p className="text-xl font-bold font-mono mt-0.5">{item.count}</p>
          </button>
        ))}
      </div>

      {/* ─── Search & Filters Bar ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none]">
          {(['ALL', 'NEW', 'VIEWED', 'IN_PROCESS', 'RESOLVED', 'IGNORED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-black shadow'
                  : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
              }`}
            >
              {st === 'ALL' ? 'All Inquiries' : STATUS_CONFIG[st].label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative sm:w-72">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full bg-[#111] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 font-mono"
          />
        </form>
      </div>

      {/* ─── Queries List / Table ─── */}
      {isLoading ? (
        <div className="p-12 rounded-2xl bg-[#0b0b0b] border border-white/10 text-center font-mono text-xs text-white/40">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-white" />
          Loading contact queries...
        </div>
      ) : queries.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0b0b0b] border border-white/10 text-center font-mono text-xs text-white/40 space-y-2">
          <Mail className="w-8 h-8 mx-auto text-white/20 mb-2" />
          <p className="text-white text-sm font-bold">No Contact Queries Found</p>
          <p className="text-white/40 max-w-sm mx-auto">
            {search
              ? 'No queries matched your search query. Try clearing the search filter.'
              : statusFilter !== 'ALL'
              ? `No inquiries currently marked as ${STATUS_CONFIG[statusFilter].label}.`
              : 'Customer queries submitted on the /contact page will automatically appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {queries.map((q) => {
            const config = STATUS_CONFIG[q.status] || STATUS_CONFIG.NEW;
            const StatusIcon = config.icon;
            const fullName = `${q.firstName} ${q.lastName}`.trim();
            const dateStr = new Date(q.createdAt).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={q.id}
                className="rounded-2xl bg-[#0b0b0b] border border-white/10 hover:border-white/20 p-4 sm:p-5 transition-all shadow-lg space-y-3.5 group"
              >
                {/* Header Row: Contact info & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white font-mono shrink-0">
                      {q.firstName.charAt(0).toUpperCase()}
                      {q.lastName ? q.lastName.charAt(0).toUpperCase() : ''}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-white">{fullName}</h4>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border font-semibold ${config.bg} ${config.text} ${config.border}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-white/50 font-mono mt-0.5 flex-wrap">
                        <a
                          href={`mailto:${q.email}`}
                          className="hover:text-white transition-colors flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          {q.email}
                        </a>
                        {q.phone && (
                          <a
                            href={`tel:${q.phone}`}
                            className="hover:text-white transition-colors flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            +91 {q.phone}
                          </a>
                        )}
                        <span className="text-white/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {dateStr}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Status Markings */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-white/40 font-mono mr-1 hidden sm:inline">Mark as:</span>
                    {(['VIEWED', 'IN_PROCESS', 'RESOLVED', 'IGNORED'] as const).map((targetStatus) => {
                      const isCurrent = q.status === targetStatus;
                      const isBusy = isUpdatingStatus === q.id;
                      return (
                        <button
                          key={targetStatus}
                          onClick={() => handleStatusChange(q.id, targetStatus)}
                          disabled={isBusy || isCurrent}
                          className={`px-2 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-white/20 text-white cursor-default'
                              : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5'
                          } disabled:opacity-40`}
                          title={`Mark query as ${STATUS_CONFIG[targetStatus].label}`}
                        >
                          {STATUS_CONFIG[targetStatus].label}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => openDetail(q)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono font-semibold transition-colors cursor-pointer"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => handleDelete(q.id, fullName)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete query"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Service Tags if any */}
                {q.services && q.services.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-white/40 font-mono flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" />
                      Topic:
                    </span>
                    {q.services.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/70"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Message Body */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-white/80 leading-relaxed font-light">
                  <p className="whitespace-pre-line">{q.message}</p>
                </div>

                {/* Admin Note if present */}
                {q.adminNote && (
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/80 font-mono flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-white/60 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white">Internal Admin Note: </span>
                      {q.adminNote}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Query Detail & Note Modal ─── */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-[#0e0e0e] border border-white/20 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/60">
                  INQUIRY DETAILS
                </span>
                <h3 className="text-lg font-bold text-white uppercase">
                  {selectedQuery.firstName} {selectedQuery.lastName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuery(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-white/40 uppercase">Email</p>
                <a
                  href={`mailto:${selectedQuery.email}`}
                  className="font-semibold text-white hover:underline block truncate mt-0.5"
                >
                  {selectedQuery.email}
                </a>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-white/40 uppercase">Phone Number</p>
                <a
                  href={`tel:${selectedQuery.phone}`}
                  className="font-semibold text-white hover:underline block truncate mt-0.5"
                >
                  {selectedQuery.phone ? `+91 ${selectedQuery.phone}` : 'Not provided'}
                </a>
              </div>
            </div>

            {/* Services */}
            {selectedQuery.services && selectedQuery.services.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] font-mono uppercase text-white/40">Inquiry Topics</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedQuery.services.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-xs text-white font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Message */}
            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase text-white/40">Full Message</p>
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                {selectedQuery.message}
              </div>
            </div>

            {/* Status Change Buttons */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <p className="text-[10px] font-mono uppercase text-white/40">Update Status</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['VIEWED', 'IN_PROCESS', 'RESOLVED', 'IGNORED'] as const).map((st) => {
                  const isCurrent = selectedQuery.status === st;
                  return (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedQuery.id, st, noteDraft)}
                      className={`p-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
                        isCurrent
                          ? 'bg-white text-black border-white'
                          : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10'
                      }`}
                    >
                      {STATUS_CONFIG[st].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Internal Admin Note */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-mono uppercase text-white/40 block">
                Internal Admin Note (Private)
              </label>
              <textarea
                rows={2}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Add notes about actions taken, follow-up callbacks, or customer details..."
                className="w-full bg-[#141414] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 font-mono resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={saveAdminNote}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RootContactQueriesTab;
