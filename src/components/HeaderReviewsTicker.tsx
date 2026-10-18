import React from 'react';
import { Award, TrendingUp, CheckCircle, Flame } from 'lucide-react';

interface ReviewItem {
  id: string;
  name: string;
  city: string;
  winAmount: string;
  comment: string;
  avatarColor: string;
  initials: string;
  timeAgo: string;
}

const REVIEWS: ReviewItem[] = [
  {
    id: 'r1',
    name: 'Abebe Kebede',
    city: 'Addis Ababa',
    winAmount: '1,000 Birr',
    comment: 'wow i won 1k birr on 1X double chance in 87th min! oriscore is unmatched 🔥',
    avatarColor: 'from-emerald-600 to-teal-700',
    initials: 'AK',
    timeAgo: '2m ago',
  },
  {
    id: 'r2',
    name: 'Selamawit D.',
    city: 'Hawassa',
    winAmount: '4,500 ETB',
    comment: 'Withdrew straight to Telebirr! The AI extreme analyzer called Arsenal 2-1 perfectly ⚽',
    avatarColor: 'from-blue-600 to-indigo-700',
    initials: 'SD',
    timeAgo: '6m ago',
  },
  {
    id: 'r3',
    name: 'Dawit Bekele',
    city: 'Bishoftu',
    winAmount: '2,800 Birr',
    comment: 'Over 2.5 goals + 1X double chance combo locked in early. Super reliable predictions!',
    avatarColor: 'from-amber-600 to-orange-700',
    initials: 'DB',
    timeAgo: '11m ago',
  },
  {
    id: 'r4',
    name: 'Yared Tadesse',
    city: 'Addis Ababa',
    winAmount: '5,400 ETB',
    comment: 'Extreme analyzer filtered the real market drift from fake odds. Won 5.4k Birr! 💰',
    avatarColor: 'from-purple-600 to-pink-700',
    initials: 'YT',
    timeAgo: '15m ago',
  },
  {
    id: 'r5',
    name: 'Almaz Hailu',
    city: 'Dire Dawa',
    winAmount: '1,200 Birr',
    comment: 'Real-time fixture odds are crazy accurate. Hit my 4-fold ticket today!',
    avatarColor: 'from-emerald-500 to-cyan-600',
    initials: 'AH',
    timeAgo: '21m ago',
  },
  {
    id: 'r6',
    name: 'Michael Vance',
    city: 'London',
    winAmount: '£380 GBP',
    comment: 'The D3 odds movement heatmap flagged the away drift. Clean win on Inter Milan.',
    avatarColor: 'from-red-600 to-rose-700',
    initials: 'MV',
    timeAgo: '29m ago',
  },
];

export const HeaderReviewsTicker: React.FC = () => {
  // Duplicate for seamless infinite loop
  const list = [...REVIEWS, ...REVIEWS];

  return (
    <div className="w-full bg-slate-950/90 border-b border-emerald-950/60 overflow-hidden py-2 backdrop-blur-md relative z-30 select-none">
      <div className="flex items-center">
        {/* Live Badge */}
        <div className="shrink-0 pl-3 pr-2 flex items-center gap-1.5 border-r border-slate-800/80 mr-2 z-10 bg-slate-950">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
            Live Wins
          </span>
        </div>

        {/* Scrolling reviews track */}
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee-slow flex items-center gap-6">
            {list.map((r, idx) => (
              <div
                key={`${r.id}-${idx}`}
                className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 rounded-full py-1 px-3 text-xs shrink-0 transition-colors"
              >
                {/* AI Profile Avatar Badge */}
                <div
                  className={`w-6 h-6 rounded-full bg-gradient-to-tr ${r.avatarColor} flex items-center justify-center text-[10px] font-black text-white shadow-inner ring-1 ring-white/20`}
                >
                  {r.initials}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-200 text-xs">
                    {r.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({r.city})
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40">
                    <TrendingUp className="w-2.5 h-2.5" />
                    +{r.winAmount}
                  </span>
                </div>

                <span className="text-slate-300 text-xs italic line-clamp-1 max-w-[280px]">
                  "{r.comment}"
                </span>

                <span className="text-[9px] text-slate-500 shrink-0">
                  {r.timeAgo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
