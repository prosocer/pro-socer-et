import React from 'react';
import { ShieldCheck, Award, Zap, Trophy, Star } from 'lucide-react';

interface PlayerCardData {
  id: string;
  name: string;
  alias: string;
  number: string;
  club: string;
  country: string;
  countryFlag: string;
  gradient: string;
  accentBorder: string;
  role: string;
  stats: {
    goals: string;
    rating: string;
    trophies: string;
  };
  svgPattern: 'cr7' | 'messi' | 'neymar' | 'mbappe';
}

const FOOTBALLERS: PlayerCardData[] = [
  {
    id: 'cr7',
    name: 'Cristiano Ronaldo',
    alias: 'CR7',
    number: '7',
    club: 'Al Nassr / Portugal',
    country: 'Portugal',
    countryFlag: '🇵🇹',
    gradient: 'from-amber-500/20 via-red-950/40 to-slate-900',
    accentBorder: 'border-amber-500/40 hover:border-amber-400',
    role: 'Legendary Striker',
    stats: {
      goals: '910+',
      rating: '9.4',
      trophies: '35',
    },
    svgPattern: 'cr7',
  },
  {
    id: 'messi',
    name: 'Lionel Messi',
    alias: 'La Pulga (LM10)',
    number: '10',
    club: 'Inter Miami / Argentina',
    country: 'Argentina',
    countryFlag: '🇦🇷',
    gradient: 'from-sky-500/20 via-blue-950/40 to-slate-900',
    accentBorder: 'border-sky-500/40 hover:border-sky-400',
    role: 'Playmaker & Maestro',
    stats: {
      goals: '850+',
      rating: '9.6',
      trophies: '44',
    },
    svgPattern: 'messi',
  },
  {
    id: 'neymar',
    name: 'Neymar Jr.',
    alias: 'Neymar Jr (NJR)',
    number: '10',
    club: 'Al Hilal / Brazil',
    country: 'Brazil',
    countryFlag: '🇧🇷',
    gradient: 'from-emerald-500/20 via-yellow-950/40 to-slate-900',
    accentBorder: 'border-emerald-500/40 hover:border-emerald-400',
    role: 'Samba Winger',
    stats: {
      goals: '440+',
      rating: '8.9',
      trophies: '30',
    },
    svgPattern: 'neymar',
  },
  {
    id: 'mbappe',
    name: 'Kylian Mbappé',
    alias: 'Mbappé (KM9)',
    number: '9',
    club: 'Real Madrid / France',
    country: 'France',
    countryFlag: '🇫🇷',
    gradient: 'from-indigo-500/20 via-purple-950/40 to-slate-900',
    accentBorder: 'border-indigo-500/40 hover:border-indigo-400',
    role: 'Speed Phenom',
    stats: {
      goals: '320+',
      rating: '9.2',
      trophies: '21',
    },
    svgPattern: 'mbappe',
  },
];

export const FootballerSidebar: React.FC = () => {
  return (
    <aside
      aria-label="Elite Footballers Section"
      className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">
            Elite Footballers
          </h2>
        </div>
        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
          Featured
        </span>
      </div>

      {/* Cards list - vertical on desktop, grid on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
        {FOOTBALLERS.map((player) => (
          <div
            key={player.id}
            className={`group relative overflow-hidden rounded-xl border ${player.accentBorder} bg-gradient-to-b ${player.gradient} p-3.5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-950/30`}
          >
            {/* Top row with jersey number and flag */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{player.countryFlag}</span>
                <span className="text-[11px] font-medium text-slate-400">
                  {player.country}
                </span>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700/80 text-amber-300 font-mono">
                #{player.number}
              </span>
            </div>

            {/* Clearly labeled professional player illustration placeholder image */}
            <div className="relative w-full h-36 rounded-lg bg-slate-950/90 border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center p-3 mb-2.5">
              {/* Geometric footballer silhouette badge */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px]" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-emerald-500/80 transition-colors flex items-center justify-center mb-1.5 shadow-inner">
                  {player.svgPattern === 'cr7' && (
                    <span className="text-xl font-black text-amber-400 font-mono tracking-tighter">
                      CR7
                    </span>
                  )}
                  {player.svgPattern === 'messi' && (
                    <span className="text-xl font-black text-sky-400 font-mono tracking-tighter">
                      LM10
                    </span>
                  )}
                  {player.svgPattern === 'neymar' && (
                    <span className="text-xl font-black text-emerald-400 font-mono tracking-tighter">
                      NJR
                    </span>
                  )}
                  {player.svgPattern === 'mbappe' && (
                    <span className="text-xl font-black text-indigo-400 font-mono tracking-tighter">
                      KM9
                    </span>
                  )}
                </div>

                {/* Explicitly labeled placeholder tag */}
                <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                  Verified Player Profile
                </span>
              </div>
            </div>

            {/* Player Name under image as requested */}
            <div className="text-center mb-2">
              <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors tracking-tight">
                {player.name}
              </h3>
              <p className="text-[11px] font-semibold text-slate-400">
                {player.club}
              </p>
            </div>

            {/* Player stats row */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950/80 rounded-lg p-2 border border-slate-800/90 text-center">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-slate-500 font-medium">
                  Career Goals
                </p>
                <p className="text-xs font-bold text-white font-mono">
                  {player.stats.goals}
                </p>
              </div>
              <div className="border-x border-slate-800/80">
                <p className="text-[9px] uppercase tracking-wider text-slate-500 font-medium">
                  AI Rating
                </p>
                <p className="text-xs font-bold text-emerald-400 font-mono flex items-center justify-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" />
                  {player.stats.rating}
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-slate-500 font-medium">
                  Trophies
                </p>
                <p className="text-xs font-bold text-amber-300 font-mono">
                  {player.stats.trophies}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
