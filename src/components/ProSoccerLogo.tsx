import React from 'react';

interface ProSoccerLogoProps {
  className?: string;
  variant?: 'full' | 'badge' | 'mark' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ProSoccerLogo: React.FC<ProSoccerLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  // Exact SVG Logo of the athletic 'P' with Soccer Ball and Golden Speed Streaks from Reference Image
  const LogoMark = ({ iconSize = 56 }: { iconSize?: number }) => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]"
    >
      <defs>
        {/* Exact vibrant gold gradients */}
        <linearGradient id="gold-streak-main" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0" />
          <stop offset="25%" stopColor="#fbbf24" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        <linearGradient id="p-white-gradient" x1="20%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="85%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        <radialGradient id="soccer-ball-shade" cx="42%" cy="38%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#475569" />
        </radialGradient>
      </defs>

      {/* 3 Golden Speed Streaks shooting to the left as in reference logo */}
      {/* 1. Top streak */}
      <polygon
        points="10,40 54,42 52,47 8,42"
        fill="url(#gold-streak-main)"
        filter="drop-shadow(0 0 4px rgba(245,158,11,0.8))"
      />
      {/* 2. Middle streak (longest) */}
      <polygon
        points="2,50 56,51 54,57 0,53"
        fill="url(#gold-streak-main)"
        filter="drop-shadow(0 0 6px rgba(245,158,11,0.9))"
      />
      {/* 3. Bottom streak */}
      <polygon
        points="14,61 52,59 50,64 12,64"
        fill="url(#gold-streak-main)"
        filter="drop-shadow(0 0 4px rgba(245,158,11,0.8))"
      />

      {/* The athletic letter 'P' shape */}
      <path
        d="M 32 86 L 47 86 L 47 62 C 47 62 55 62 66 62 C 84 62 96 52 96 36 C 96 18 82 12 62 12 L 32 12 Z"
        fill="url(#p-white-gradient)"
      />

      {/* Inner cutout opening of the 'P' for the soccer ball */}
      <path
        d="M 47 24 L 62 24 C 74 24 81 29 81 37 C 81 46 74 50 62 50 L 47 50 Z"
        fill="#050811"
      />

      {/* Soccer Ball nested inside the upper curve of the 'P' */}
      <g transform="translate(63, 37)">
        {/* Ball Circle */}
        <circle cx="0" cy="0" r="14.5" fill="url(#soccer-ball-shade)" stroke="#090d16" strokeWidth="1.2" />

        {/* Center Pentagon Panel */}
        <polygon
          points="0,-4.5 4.3,-1.4 2.7,3.6 -2.7,3.6 -4.3,-1.4"
          fill="#0a0f1d"
        />

        {/* Soccer Ball Seams radiating to outer edge */}
        <line x1="0" y1="-4.5" x2="0" y2="-14.5" stroke="#0a0f1d" strokeWidth="1.2" />
        <line x1="4.3" y1="-1.4" x2="13.8" y2="-4.5" stroke="#0a0f1d" strokeWidth="1.2" />
        <line x1="2.7" y1="3.6" x2="8.8" y2="11.8" stroke="#0a0f1d" strokeWidth="1.2" />
        <line x1="-2.7" y1="3.6" x2="-8.8" y2="11.8" stroke="#0a0f1d" strokeWidth="1.2" />
        <line x1="-4.3" y1="-1.4" x2="-13.8" y2="-4.5" stroke="#0a0f1d" strokeWidth="1.2" />

        {/* Outer Pentagon Patches */}
        <polygon points="-7.5,-11.5 -2.5,-13.5 0,-14.5 -5,-10.5" fill="#0a0f1d" />
        <polygon points="11.5,-8.5 14,-4 14.5,-1 10.5,-6.5" fill="#0a0f1d" />
        <polygon points="11.5,7.5 8,12 10.5,13.5 13.5,8.5" fill="#0a0f1d" />
        <polygon points="-11.5,7.5 -8,12 -10.5,13.5 -13.5,8.5" fill="#0a0f1d" />

        {/* Gloss highlight */}
        <ellipse cx="-4" cy="-5" rx="3.5" ry="2" fill="#ffffff" fillOpacity="0.4" />
      </g>
    </svg>
  );

  // 1. Mark Only
  if (variant === 'mark') {
    const sizePx = size === 'sm' ? 36 : size === 'md' ? 52 : size === 'lg' ? 72 : 96;
    return <LogoMark iconSize={sizePx} />;
  }

  // 2. Exact Circular Glowing Profile Badge (as in the reference image left panel)
  if (variant === 'badge') {
    return (
      <div className={`relative flex flex-col items-center justify-center p-7 sm:p-9 rounded-full aspect-square border-2 border-amber-400 bg-gradient-to-b from-slate-900/90 via-black to-slate-950 shadow-[0_0_40px_rgba(245,158,11,0.5)] ${className}`}>
        {/* Outer subtle glow ring */}
        <div className="absolute inset-1.5 rounded-full border border-amber-300/40 pointer-events-none" />

        <LogoMark iconSize={size === 'sm' ? 52 : size === 'md' ? 74 : size === 'lg' ? 96 : 120} />

        <div className="mt-3 text-center">
          <div className="text-sm sm:text-base font-black tracking-widest text-white uppercase font-sans drop-shadow-md">
            PRO SOCCER
          </div>
          <div className="flex items-center justify-center gap-2 mt-0.5">
            <span className="w-5 h-[1.5px] bg-amber-400" />
            <span className="text-xs sm:text-sm font-black tracking-widest text-amber-400 font-sans">ET</span>
            <span className="w-5 h-[1.5px] bg-amber-400" />
          </div>
        </div>
      </div>
    );
  }

  // 3. Compact Logo
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <LogoMark iconSize={42} />
        <div>
          <div className="text-lg font-black tracking-tight text-white uppercase font-sans leading-none">
            PRO SOCCER <span className="text-amber-400">ET</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[9px] tracking-[0.2em] font-extrabold text-amber-300 uppercase">
            <span className="w-3 h-[1px] bg-amber-400/80" />
            <span>FOOTBALL PREDICTIONS</span>
            <span className="w-3 h-[1px] bg-amber-400/80" />
          </div>
        </div>
      </div>
    );
  }

  // 4. Full Hero Banner Logo (Exact top banner from reference image)
  const iconPixel = size === 'sm' ? 48 : size === 'md' ? 68 : size === 'lg' ? 88 : 110;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center gap-3 sm:gap-4 justify-center">
        <LogoMark iconSize={iconPixel} />
        <div className="text-left">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider text-white uppercase font-sans leading-none drop-shadow-[0_2px_20px_rgba(255,255,255,0.25)]">
            PRO SOCCER <span className="text-white">ET</span>
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2">
            <span className="h-[2px] w-6 sm:w-14 bg-amber-400" />
            <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.28em] text-white">
              FOOTBALL PREDICTIONS
            </span>
            <span className="h-[2px] w-6 sm:w-14 bg-amber-400" />
          </div>
        </div>
      </div>

      {/* ANALYZE / PREDICT / WIN Tagline as in reference image */}
      <div className="flex items-center gap-3 sm:gap-5 mt-3 text-[10px] sm:text-xs font-black tracking-[0.35em] text-amber-400 uppercase">
        <span className="text-amber-400">ANALYZE</span>
        <span className="text-slate-600 font-normal">/</span>
        <span className="text-white">PREDICT</span>
        <span className="text-slate-600 font-normal">/</span>
        <span className="text-amber-400">WIN</span>
      </div>
    </div>
  );
};
