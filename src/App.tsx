import React, { useState, useEffect } from 'react';
import { ProSoccerLogo } from './components/ProSoccerLogo.tsx';
import { PredictionWizard } from './components/PredictionWizard.tsx';
import { AccessRequestModal } from './components/AccessRequestModal.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { MatchDetailModal } from './components/MatchDetailModal.tsx';
import type { MatchFixture, PredictionResult, AccessRequest } from './types/index.ts';
import { ChevronRight, Lock } from 'lucide-react';

export default function App() {
  const [fixtures, setFixtures] = useState<MatchFixture[]>([]);
  const [currentUser, setCurrentUser] = useState<AccessRequest | null>(null);

  // Modals & views
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeFixtureForModal, setActiveFixtureForModal] = useState<MatchFixture | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  // Check stored session & fetch fixtures
  useEffect(() => {
    const savedEmail = localStorage.getItem('prosoccer_user_email');
    if (savedEmail) {
      fetch(`/api/access/status?email=${encodeURIComponent(savedEmail)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.authorized && data.user) {
            setCurrentUser(data.user);
          }
        })
        .catch((err) => console.error('Failed to verify session', err));
    }

    fetch('/api/fixtures')
      .then((r) => r.json())
      .then((data) => {
        if (data.fixtures) {
          setFixtures(data.fixtures);
        }
      })
      .catch((err) => console.error('Failed to fetch fixtures', err));
  }, []);

  const handleAuthorizedLogin = (user: AccessRequest) => {
    setCurrentUser(user);
    localStorage.setItem('prosoccer_user_email', user.email);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('prosoccer_user_email');
  };

  const handlePredictClick = () => {
    if (!currentUser || currentUser.status !== 'approved') {
      setIsAccessModalOpen(true);
      return;
    }
    setShowWizard(true);
  };

  const handlePredictionSaved = async (pred: PredictionResult) => {
    try {
      await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pred),
      });
    } catch (e) {
      console.error('Failed to record prediction', e);
    }
  };

  if (isAdminOpen) {
    return (
      <div className="min-h-screen bg-[#02050b] text-slate-100 font-sans stadium-reference-bg">
        <AdminPanel onBack={() => setIsAdminOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02050b] text-slate-100 flex flex-col justify-between font-sans stadium-reference-bg relative selection:bg-amber-400 selection:text-black">
      {/* Corner Gold Ribbon Light Accents from Reference Image */}
      <div className="gold-slash-tl" />
      <div className="gold-slash-br" />

      {/* Top Banner with Official PRO SOCCER ET Logo & Social Icons */}
      <header className="w-full max-w-6xl mx-auto pt-6 px-4 sm:px-6 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
          <ProSoccerLogo variant="full" size="md" />

          {/* Social Channels & Auth Indicator matching reference image */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 text-slate-300">
              {/* TikTok */}
              <span className="w-8 h-8 rounded-full bg-black/70 border border-amber-400/40 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition cursor-pointer" title="TikTok">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.04.86.12V9.37a6.32 6.32 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.69a8.16 8.16 0 0 0 4.76 1.52V7.76c-.36 0-1.01-.39-1-.95z"/>
                </svg>
              </span>
              {/* Telegram */}
              <span className="w-8 h-8 rounded-full bg-black/70 border border-amber-400/40 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition cursor-pointer" title="Telegram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </span>
              {/* YouTube */}
              <span className="w-8 h-8 rounded-full bg-black/70 border border-amber-400/40 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition cursor-pointer" title="YouTube">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </span>
              {/* X */}
              <span className="w-8 h-8 rounded-full bg-black/70 border border-amber-400/40 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition cursor-pointer" title="X">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </span>
            </div>

            {/* Auth status indicator */}
            {currentUser && currentUser.status === 'approved' ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-300 bg-black/80 px-3 py-1 rounded-full border border-amber-500/40">
                  {currentUser.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAccessModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold rounded-full bg-black/80 border border-amber-400/50 text-amber-300 hover:border-amber-300 transition cursor-pointer"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Sign In / Request Access</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Center Stage */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-16 w-full max-w-4xl mx-auto relative z-10">
        {!showWizard ? (
          <div className="w-full flex flex-col items-center text-center animate-in fade-in duration-500">
            {/* Circular Glowing Logo Badge matching reference image */}
            <div className="mb-8">
              <ProSoccerLogo variant="badge" size="md" />
            </div>

            {/* Poster Headline from Reference Image */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider text-white mb-2 font-sans drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
              SMART <span className="text-gold-gradient">PREDICTIONS</span>
            </h2>
            <p className="text-base sm:text-xl font-black uppercase tracking-[0.25em] text-slate-200 mb-10 drop-shadow-md">
              BETTER RESULTS
            </p>

            {/* Signature Illuminated Gold Pill Button: ( ⚽ PREDICT > ) */}
            <div className="mb-6">
              <button
                onClick={handlePredictClick}
                aria-label="Predict Football Match"
                className="predict-pill-btn px-12 sm:px-16 py-4 sm:py-5 rounded-full flex items-center gap-4 cursor-pointer group"
              >
                {/* Gold Soccer Ball Icon */}
                <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                  <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="44" stroke="#fbbf24" strokeWidth="6" fill="#1c1917" />
                    <polygon points="50,30 68,44 61,64 39,64 32,44" fill="#fbbf24" />
                    <line x1="50" y1="30" x2="50" y2="8" stroke="#fbbf24" strokeWidth="5" />
                    <line x1="68" y1="44" x2="88" y2="40" stroke="#fbbf24" strokeWidth="5" />
                    <line x1="61" y1="64" x2="76" y2="82" stroke="#fbbf24" strokeWidth="5" />
                    <line x1="39" y1="64" x2="24" y2="82" stroke="#fbbf24" strokeWidth="5" />
                    <line x1="32" y1="44" x2="12" y2="40" stroke="#fbbf24" strokeWidth="5" />
                  </svg>
                </div>
                <span className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white group-hover:text-amber-300 transition-colors">
                  PREDICT
                </span>
                <ChevronRight className="w-7 h-7 text-amber-400 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>

            {/* STUDY | ANALYZE | PREDICT subtitle as in reference image */}
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.35em] text-amber-400/90 drop-shadow">
              STUDY <span className="text-slate-600 font-normal mx-1.5">|</span> ANALYZE <span className="text-slate-600 font-normal mx-1.5">|</span> PREDICT
            </p>

            {/* Note: The 3 feature cards and bottom banner were removed as requested */}
          </div>
        ) : (
          /* ACTIVE PREDICTION WIZARD */
          <div className="w-full animate-in zoom-in-95 duration-300">
            <PredictionWizard
              fixtures={fixtures}
              onCompletePrediction={handlePredictionSaved}
              onOpenMatchDetail={(f) => setActiveFixtureForModal(f)}
              onClose={() => setShowWizard(false)}
            />
          </div>
        )}
      </main>

      {/* Footer matching reference image signature */}
      <footer className="w-full border-t border-amber-500/20 bg-black/90 backdrop-blur-md py-6 px-4 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ProSoccerLogo variant="mark" size="sm" />
            <div className="text-left">
              <span className="text-xs font-black uppercase tracking-widest text-white">
                PRO SOCCER <span className="text-amber-400">ET</span>
              </span>
              <div className="text-[9px] font-bold tracking-wider text-slate-500 uppercase">
                FOOTBALL PREDICTIONS
              </div>
            </div>
          </div>

          {/* Cursive Signature: Predict Smarter. */}
          <div className="text-center">
            <span className="font-script text-3xl sm:text-4xl text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]">
              Predict Smarter.
            </span>
          </div>

          {/* Admin & Access Links */}
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            <button
              onClick={() => setIsAccessModalOpen(true)}
              className="hover:text-amber-400 transition cursor-pointer"
            >
              Request Access
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-amber-400 transition cursor-pointer"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AccessRequestModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        onAuthorizedLogin={handleAuthorizedLogin}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <MatchDetailModal
        fixture={activeFixtureForModal}
        isOpen={!!activeFixtureForModal}
        onClose={() => setActiveFixtureForModal(null)}
      />
    </div>
  );
}
