import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Fingerprint, Scan, CheckCircle, Smartphone, Lock, AlertCircle } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, onVerified }) => {
  const [step, setStep] = useState<'details' | 'biometric' | 'success'>('details');
  const [telebirrNumber, setTelebirrNumber] = useState('+251993129934');
  const [transactionRef, setTransactionRef] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('details');
      setScanProgress(0);
      setIsScanning(false);
      setError(null);
    }
  }, [isOpen]);

  const handleStartBiometric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      setError('Please provide the authentic Telebirr transaction code.');
      return;
    }
    setError(null);
    setStep('biometric');
    setIsScanning(true);

    // Simulate real-time biometric scanning sequence
    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        clearInterval(interval);
        setScanProgress(100);
        setIsScanning(false);
        setTimeout(() => {
          setStep('success');
          onVerified();
        }, 800);
      } else {
        setScanProgress(current);
      }
    }, 280);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="verify-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          aria-label="Close verification modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'details' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h2 id="verify-modal-title" className="text-xl font-black text-white">
                  Telebirr VIP Verification
                </h2>
                <p className="text-xs text-slate-400">
                  Anti-fraud validation with biometric liveness check.
                </p>
              </div>
            </div>

            <form onSubmit={handleStartBiometric} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Official Merchant Telebirr Account
                </div>
                <div className="text-base font-black text-emerald-400 font-mono tracking-wide">
                  +251993129934
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  oriscore verified merchant gateway
                </div>
              </div>

              <div>
                <label htmlFor="tx-ref" className="block text-xs font-semibold text-slate-300 mb-1">
                  Telebirr Transaction Reference ID *
                </label>
                <input
                  id="tx-ref"
                  type="text"
                  required
                  placeholder="e.g. TB-9481238491"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Screenshots are strictly rejected. Enter genuine transaction ID for cryptographic verification.
                </p>
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
              >
                <Fingerprint className="w-4 h-4" />
                Proceed to Real-Time Biometric Scan
              </button>
            </form>
          </div>
        )}

        {step === 'biometric' && (
          <div className="text-center py-4">
            <h2 className="text-lg font-black text-white mb-1">
              Real-Time Biometric Liveness Verification
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Scanning facial structure & biometric token to prevent fake accounts.
            </p>

            {/* Radar scanner visual */}
            <div className="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-emerald-500/40" />
              <div className="absolute inset-4 rounded-full border border-dashed border-emerald-400/80 animate-spin" style={{ animationDuration: '6s' }} />
              
              <div className="relative z-10 w-24 h-24 rounded-full bg-slate-950 flex flex-col items-center justify-center border border-emerald-500">
                <Scan className="w-10 h-10 text-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-300 font-bold mt-1">
                  {scanProgress}%
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-950 rounded-full h-2 mb-2 overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <p className="text-xs font-mono text-emerald-400">
              {scanProgress < 50 ? 'Validating Telebirr Tx Hash...' : 'Verifying Biometric Key...'}
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-white mb-1">
              VIP Identity Verified!
            </h2>
            <p className="text-xs text-slate-300 mb-5">
              Telebirr <span className="font-mono text-emerald-400">+251993129934</span> verified with real-time biometric encryption. All VIP extreme prediction markets unlocked.
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition"
            >
              Start Predicting
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
