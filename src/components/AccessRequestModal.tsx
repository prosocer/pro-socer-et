import React, { useState } from 'react';
import { Shield, CheckCircle, Clock, AlertTriangle, Send, X, UserCheck, Lock } from 'lucide-react';
import type { AccessRequest } from '../types/index.ts';
import { ProSoccerLogo } from './ProSoccerLogo.tsx';

interface AccessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorizedLogin: (user: AccessRequest, token: string) => void;
  onOpenAdmin: () => void;
}

export const AccessRequestModal: React.FC<AccessRequestModalProps> = ({
  isOpen,
  onClose,
  onAuthorizedLogin,
  onOpenAdmin,
}) => {
  const [tab, setTab] = useState<'request' | 'login'>('request');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'pending'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setStatusMessage({ type: 'error', text: 'Name and email are required to request private access.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/access/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.request.status === 'approved') {
          setStatusMessage({
            type: 'success',
            text: 'Account verified and approved! Logging you in...',
          });
          setTimeout(() => {
            onAuthorizedLogin(data.request, `prosoccer-token-${data.request.id}`);
            onClose();
          }, 1000);
        } else {
          setStatusMessage({
            type: 'pending',
            text: 'Access request securely saved. The administrator will review your account.',
          });
        }
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to submit request.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error connecting to backend.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatusMessage({ type: 'error', text: 'Please enter your registered email address.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setStatusMessage({ type: 'success', text: `Welcome back, ${data.user.name}! Access authorized.` });
        setTimeout(() => {
          onAuthorizedLogin(data.user, data.token);
          onClose();
        }, 1000);
      } else {
        if (data.status === 'pending') {
          setStatusMessage({
            type: 'pending',
            text: 'Your request is currently PENDING administrator approval.',
          });
        } else if (data.status === 'blocked') {
          setStatusMessage({
            type: 'error',
            text: 'Access has been BLOCKED for this email by the administrator.',
          });
        } else if (data.status === 'rejected') {
          setStatusMessage({
            type: 'error',
            text: 'Your request was DECLINED by the administrator.',
          });
        } else {
          setStatusMessage({
            type: 'error',
            text: data.error || 'No approved account found for this email. Please request access first.',
          });
        }
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to verify account with backend server.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="access-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-amber-500/40 bg-gradient-to-b from-slate-900 via-black to-slate-950 p-6 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-slate-100">
        {/* Corner Gold Light Accents */}
        <div className="gold-slash-tl opacity-40" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <ProSoccerLogo variant="mark" size="sm" />
          <h2 id="access-modal-title" className="text-xl font-black uppercase tracking-wider text-white mt-2">
            Private Access Gate
          </h2>
          <p className="text-xs text-amber-300/80 font-medium">
            PRO SOCCER ET • Verified Member Authorization
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 mb-5">
          <button
            onClick={() => { setTab('request'); setStatusMessage(null); }}
            className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition ${
              tab === 'request'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Request Access
          </button>
          <button
            onClick={() => { setTab('login'); setStatusMessage(null); }}
            className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition ${
              tab === 'login'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Authorized Sign In
          </button>
        </div>

        {/* Tab 1: Request Access Form (Only Name and Email as requested) */}
        {tab === 'request' && (
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div>
              <label htmlFor="req-name" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name *
              </label>
              <input
                id="req-name"
                type="text"
                required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-black border border-slate-700 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label htmlFor="req-email" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address *
              </label>
              <input
                id="req-email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-black border border-slate-700 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-4 py-3 text-sm font-black uppercase tracking-wider text-slate-950 hover:brightness-110 transition shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Saving Request...' : 'Submit Access Request'}
            </button>
          </form>
        )}

        {/* Tab 2: Authorized Sign In Form */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Authorized Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                placeholder="your.approved.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-black border border-slate-700 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                Each account is approved individually by the administrator.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-4 py-3 text-sm font-black uppercase tracking-wider text-slate-950 hover:brightness-110 transition shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:opacity-50 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              {isSubmitting ? 'Verifying...' : 'Verify & Enter PRO SOCCER ET'}
            </button>
          </form>
        )}

        {/* Status Feedback Message */}
        {statusMessage && (
          <div
            className={`mt-4 rounded-xl p-3 text-xs flex items-start gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                : statusMessage.type === 'pending'
                ? 'bg-amber-950/80 border border-amber-500 text-amber-300'
                : 'bg-rose-950/80 border border-rose-500 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            {statusMessage.type === 'pending' && <Clock className="w-4 h-4 shrink-0 mt-0.5" />}
            {statusMessage.type === 'error' && <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
            <span className="leading-relaxed">{statusMessage.text}</span>
          </div>
        )}

        {/* Footer Admin Link */}
        <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Administrator:</span>
          <button
            onClick={() => {
              onClose();
              onOpenAdmin();
            }}
            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            Open Admin Portal
          </button>
        </div>
      </div>
    </div>
  );
};
