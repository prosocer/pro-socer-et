import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Cpu, Sparkles, CheckCircle2, Copy, BarChart2, Calendar, Target, Trophy, Clock, Check } from 'lucide-react';
import type { MatchFixture, PredictionResult } from '../types/index.ts';
import { runExtremeAnalysis } from '../utils/predictionEngine.ts';
import { ProSoccerLogo } from './ProSoccerLogo.tsx';

interface PredictionWizardProps {
  fixtures: MatchFixture[];
  onCompletePrediction: (result: PredictionResult) => void;
  onOpenMatchDetail: (fixture: MatchFixture) => void;
  onClose: () => void;
}

export const PredictionWizard: React.FC<PredictionWizardProps> = ({
  fixtures,
  onCompletePrediction,
  onOpenMatchDetail,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Wizard state
  const [selectedLeague, setSelectedLeague] = useState<string>('All');
  const [selectedFixtureId, setSelectedFixtureId] = useState<string>(fixtures[0]?.id || '');
  const [oddsRange, setOddsRange] = useState<string>('1.50 - 2.50 (Balanced)');
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(['1X2', '1X Double Chance', 'Over 2.5 Goals', 'Correct Score']);
  const [duration, setDuration] = useState<string>("Today's Fixtures");

  // Output
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const leagues = ['All', 'Premier League', 'La Liga', 'UEFA Champions League', 'Serie A'];

  const filteredFixtures = fixtures.filter(
    (f) => selectedLeague === 'All' || f.league === selectedLeague
  );

  const selectedFixture = fixtures.find((f) => f.id === selectedFixtureId) || fixtures[0];

  const handleNextToOdds = () => {
    if (!selectedFixture) return;
    setStep(2);
  };

  const handleNextToDuration = () => {
    setStep(3);
  };

  const handleRunExtremeAnalyzer = () => {
    setStep(4);
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      if (selectedFixture) {
        const generated = runExtremeAnalysis(
          selectedFixture,
          oddsRange,
          duration,
          selectedMarkets
        );
        setResult(generated);
        onCompletePrediction(generated);
      }
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.predictionText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleMarket = (m: string) => {
    if (selectedMarkets.includes(m)) {
      if (selectedMarkets.length > 1) {
        setSelectedMarkets(selectedMarkets.filter((item) => item !== m));
      }
    } else {
      setSelectedMarkets([...selectedMarkets, m]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900/95 via-black/95 to-slate-950/95 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] backdrop-blur-xl text-slate-100 relative">
      {/* Corner Gold Light Accents */}
      <div className="gold-slash-tl opacity-35" />

      {/* Top Logo Mark */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <ProSoccerLogo variant="compact" />
        <button
          onClick={onClose}
          className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1 rounded-lg hover:bg-slate-800 transition"
        >
          Close
        </button>
      </div>

      {/* Step Indicators */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          <span>Step {step} of 4</span>
          <span className="text-amber-400">
            {step === 1 && '1. Select League & Match'}
            {step === 2 && '2. Set 1X Odds & Markets'}
            {step === 3 && '3. Duration / How Long'}
            {step === 4 && '4. AI Extreme Analyzer'}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: SELECT LEAGUE & FIXTURE */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              Select League
            </label>
            <div className="flex flex-wrap gap-2">
              {leagues.map((lg) => (
                <button
                  key={lg}
                  onClick={() => setSelectedLeague(lg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    selectedLeague === lg
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-black text-slate-300 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {lg}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              Choose Match Fixture (Official 1X Odds)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {filteredFixtures.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFixtureId(f.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                    selectedFixtureId === f.id
                      ? 'bg-amber-950/30 border-amber-400 shadow-md ring-1 ring-amber-400'
                      : 'bg-black/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span>{f.leagueFlag} {f.league}</span>
                    <span className="font-mono text-amber-400 font-bold">{f.status}</span>
                  </div>

                  <div className="font-black text-white text-sm mb-2">
                    {f.homeTeam} <span className="text-amber-400 text-xs">vs</span> {f.awayTeam}
                  </div>

                  <div className="grid grid-cols-3 gap-1 bg-slate-950 rounded p-1.5 text-center text-[10px] font-mono text-slate-300 border border-slate-800">
                    <div>1: <span className="font-bold text-white">{f.odds.home}</span></div>
                    <div>X: <span className="font-bold text-white">{f.odds.draw}</span></div>
                    <div>2: <span className="font-bold text-white">{f.odds.away}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-3 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleNextToOdds}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-6 py-2.5 text-sm font-black uppercase tracking-wider text-slate-950 hover:brightness-110 transition shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer"
            >
              Next: Odds & Markets
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SET ODDS & MARKETS */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="p-3.5 rounded-xl bg-black border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Selected Match</span>
              <div className="text-base font-extrabold text-white">
                {selectedFixture?.homeTeam} vs {selectedFixture?.awayTeam}
              </div>
            </div>
            <button
              onClick={() => selectedFixture && onOpenMatchDetail(selectedFixture)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/20"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              View D3 Odds Heatmap
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-amber-400" />
              Target 1X Official Odds Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { range: '1.20 - 1.65 (High Safety)', desc: 'Heavy favorite / safe slip' },
                { range: '1.50 - 2.50 (Balanced)', desc: 'Optimal value & return' },
                { range: '2.60 - 5.00+ (High Yield)', desc: 'Aggressive multiplier' },
              ].map((item) => (
                <div
                  key={item.range}
                  onClick={() => setOddsRange(item.range)}
                  className={`p-3 rounded-xl border cursor-pointer text-left transition ${
                    oddsRange === item.range
                      ? 'bg-amber-950/40 border-amber-400 shadow-md ring-1 ring-amber-400'
                      : 'bg-black/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{item.range}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Include Markets (1X Double Chance, Over/Under, Correct Score)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                '1X2 Match Winner',
                '1X Double Chance',
                'Over 2.5 Goals',
                'Under 2.5 Goals',
                'Both Teams To Score',
                'Correct Score',
              ].map((m) => {
                const active = selectedMarkets.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMarket(m)}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition ${
                      active
                        ? 'bg-amber-950/50 border-amber-400 text-amber-300'
                        : 'bg-black border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{m}</span>
                    {active && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={handleNextToDuration}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-6 py-2.5 text-sm font-black uppercase tracking-wider text-slate-950 hover:brightness-110 transition shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer"
            >
              Next: Duration
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DURATION / HOW IT LONGS */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              Duration / How Long It Longs
            </label>
            <p className="text-xs text-slate-400 mb-4">
              Select time horizon for game schedule and odds settlement.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Next 3 Hours', sub: 'Imminent kickoff & live market drift' },
                { label: "Today's Fixtures", sub: 'Full day match slate' },
                { label: '24 Hours Ahead', sub: 'Early price lock & double chance' },
                { label: '3 Days / Weekend Accumulator', sub: 'Multi-match weekend ticket' },
              ].map((d) => (
                <div
                  key={d.label}
                  onClick={() => setDuration(d.label)}
                  className={`p-3.5 rounded-xl border cursor-pointer text-left transition ${
                    duration === d.label
                      ? 'bg-amber-950/40 border-amber-400 shadow-md ring-1 ring-amber-400'
                      : 'bg-black/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-bold text-white">{d.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{d.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={handleRunExtremeAnalyzer}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-6 py-2.5 text-sm font-black uppercase tracking-wider text-slate-950 hover:brightness-110 transition shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              Launch Extreme Analyzer AI
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI EXTREME ANALYZER RESULTS */}
      {step === 4 && (
        <div className="space-y-6">
          {isAnalyzing ? (
            <div className="py-12 text-center">
              <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border border-dashed border-amber-400 animate-spin" />
                <Cpu className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-white mb-1">
                Extreme Analyzer AI Running...
              </h3>
              <p className="text-xs text-amber-300/80 font-mono">
                Computing player xG, 1X double chance margin, & historical trend matrix
              </p>
            </div>
          ) : result ? (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="p-5 rounded-2xl bg-black border-2 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.3)] relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    PRO SOCCER ET AI Prediction (All-In-One Text)
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
                    Confidence: {result.confidenceScore}%
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-lg sm:text-xl font-black text-white font-mono tracking-tight leading-snug">
                  {result.predictionText}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Official 1X Odds Matrix • Real-Time Analyzed
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-500/40 transition cursor-pointer"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied to Clipboard!' : 'Copy Prediction Text'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-black p-3 rounded-xl border border-slate-800 text-center">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Home Win Prob</div>
                  <div className="text-sm font-bold text-white font-mono">
                    {result.extremeMetrics.winProbabilityHome}%
                  </div>
                </div>
                <div className="border-x border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Draw Prob</div>
                  <div className="text-sm font-bold text-white font-mono">
                    {result.extremeMetrics.winProbabilityDraw}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Projected Goals</div>
                  <div className="text-sm font-bold text-amber-400 font-mono">
                    {result.extremeMetrics.projectedGoals}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2 justify-between items-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-white px-3 py-2 cursor-pointer"
                >
                  Predict Another Match
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => selectedFixture && onOpenMatchDetail(selectedFixture)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition cursor-pointer"
                  >
                    <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                    View Odds Heatmap
                  </button>
                  <button
                    onClick={onClose}
                    className="flex items-center gap-1.5 px-6 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 hover:brightness-110 transition cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
