import React, { useState, useEffect } from 'react';
import { Shield, Check, X, Ban, RefreshCw, ArrowLeft, Search, Mail, Lock } from 'lucide-react';
import type { AccessRequest, AccessStatus } from '../types/index.ts';
import { ProSoccerLogo } from './ProSoccerLogo.tsx';

interface AdminPanelProps {
  onBack: () => void;
  currentAdminEmail?: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AccessStatus>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/requests');
      const data = await res.json();
      if (data.requests) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error('Failed to load admin requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId: string, action: 'approve' | 'reject' | 'block') => {
    setActionLoadingId(requestId);
    setNotification(null);
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action }),
      });
      const data = await res.json();
      if (data.success && data.request) {
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: data.request.status } : r))
        );
        const actionLabels = { approve: 'Approved', reject: 'Rejected', block: 'Blocked' };
        setNotification(`Successfully ${actionLabels[action]} access for ${data.request.name} (${data.request.email})`);
      }
    } catch (err) {
      setNotification('Failed to update request status on backend.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
    blocked: requests.filter((r) => r.status === 'blocked').length,
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-black border border-amber-500/40 hover:border-amber-400 text-amber-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to PRO SOCCER ET
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 uppercase tracking-wide">
              <Shield className="w-6 h-6 text-amber-400" />
              Access Control & Admin Portal
            </h1>
            <p className="text-xs text-amber-300/80">
              Administrator Session (Authorized) • Private authorization management
            </p>
          </div>
        </div>

        <button
          onClick={fetchRequests}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Database
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="mb-6 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-3.5 rounded-xl border text-left transition ${
            statusFilter === 'all'
              ? 'bg-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-black/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Requests</div>
          <div className="text-2xl font-black text-white font-mono mt-0.5">{counts.total}</div>
        </button>

        <button
          onClick={() => setStatusFilter('pending')}
          className={`p-3.5 rounded-xl border text-left transition ${
            statusFilter === 'pending'
              ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-black/60 border-slate-800 hover:border-amber-900/40'
          }`}
        >
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Pending Review</div>
          <div className="text-2xl font-black text-amber-300 font-mono mt-0.5">{counts.pending}</div>
        </button>

        <button
          onClick={() => setStatusFilter('approved')}
          className={`p-3.5 rounded-xl border text-left transition ${
            statusFilter === 'approved'
              ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              : 'bg-black/60 border-slate-800 hover:border-emerald-900/40'
          }`}
        >
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Authorized</div>
          <div className="text-2xl font-black text-emerald-300 font-mono mt-0.5">{counts.approved}</div>
        </button>

        <button
          onClick={() => setStatusFilter('rejected')}
          className={`p-3.5 rounded-xl border text-left transition ${
            statusFilter === 'rejected'
              ? 'bg-rose-950/40 border-rose-500 shadow-lg'
              : 'bg-black/60 border-slate-800 hover:border-rose-900/40'
          }`}
        >
          <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Declined</div>
          <div className="text-2xl font-black text-rose-300 font-mono mt-0.5">{counts.rejected}</div>
        </button>

        <button
          onClick={() => setStatusFilter('blocked')}
          className={`p-3.5 rounded-xl border text-left transition ${
            statusFilter === 'blocked'
              ? 'bg-red-950/50 border-red-500 shadow-lg'
              : 'bg-black/60 border-slate-800 hover:border-red-900/40'
          }`}
        >
          <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider">Blocked</div>
          <div className="text-2xl font-black text-red-300 font-mono mt-0.5">{counts.blocked}</div>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Filter requests by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl bg-black border border-slate-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* Requests List */}
      <div className="bg-black/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Contact Email</th>
                <th className="py-3.5 px-4">Requested Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                    No requests found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-900/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{req.name}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-300 font-mono text-xs">
                        <Mail className="w-3.5 h-3.5 text-amber-400" />
                        {req.email}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {new Date(req.createdAt).toLocaleDateString()} {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="py-3.5 px-4">
                      {req.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                          <Check className="w-3 h-3" />
                          Authorized
                        </span>
                      )}
                      {req.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                          Pending
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950/80 text-rose-300 border border-rose-500/40">
                          <X className="w-3 h-3" />
                          Declined
                        </span>
                      )}
                      {req.status === 'blocked' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-950/90 text-red-300 border border-red-600/60">
                          <Ban className="w-3 h-3" />
                          Blocked
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleAction(req.id, 'approve')}
                          disabled={actionLoadingId === req.id || req.status === 'approved'}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Approve
                        </button>

                        <button
                          onClick={() => handleAction(req.id, 'reject')}
                          disabled={actionLoadingId === req.id || req.status === 'rejected'}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-600/80 text-white hover:bg-amber-600 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          Reject
                        </button>

                        <button
                          onClick={() => handleAction(req.id, 'block')}
                          disabled={actionLoadingId === req.id || req.status === 'blocked'}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-800 text-white hover:bg-red-700 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          <Ban className="w-3 h-3" />
                          Block
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
