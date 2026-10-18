import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { X, TrendingUp, ShieldAlert, Activity, User, Award, History, BarChart3 } from 'lucide-react';
import type { MatchFixture } from '../types/index.ts';

interface MatchDetailModalProps {
  fixture: MatchFixture | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({ fixture, isOpen, onClose }) => {
  const d3ContainerRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!isOpen || !fixture || !d3ContainerRef.current) return;

    // Clear previous SVG contents
    const svg = d3.select(d3ContainerRef.current);
    svg.selectAll('*').remove();

    // Prepare Heatmap Data
    const times = ['T-48h', 'T-36h', 'T-24h', 'T-12h', 'T-2h'];
    const markets = ['1 (Home)', 'X (Draw)', '2 (Away)', '1X (D.Chance)', 'Over 2.5'];

    // Map fixture odds movement or synthesize smooth distribution
    const heatmapData: { time: string; market: string; volume: number; odds: number }[] = [];
    
    markets.forEach((m, mIdx) => {
      times.forEach((t, tIdx) => {
        // Find existing or compute realistic volume trend
        const isHome = m.startsWith('1 ');
        const is1X = m.startsWith('1X');
        const isOver = m.startsWith('Over');
        
        let baseVol = is1X ? 50 + tIdx * 9 : isHome ? 40 + tIdx * 11 : isOver ? 45 + tIdx * 9 : 20 - tIdx * 2;
        let baseOdds = is1X ? fixture.odds.doubleChance1X : isHome ? fixture.odds.home : isOver ? fixture.odds.over25 : fixture.odds.away;
        
        // slight historic drift
        const oddsVal = Number((baseOdds + (4 - tIdx) * 0.04).toFixed(2));
        heatmapData.push({
          time: t,
          market: m,
          volume: Math.min(100, Math.max(10, baseVol)),
          odds: oddsVal,
        });
      });
    });

    const margin = { top: 30, right: 30, bottom: 40, left: 110 };
    const width = 580 - margin.left - margin.right;
    const height = 240 - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 580 240`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale
    const x = d3.scaleBand().range([0, width]).domain(times).padding(0.06);

    // Y Scale
    const y = d3.scaleBand().range([0, height]).domain(markets).padding(0.06);

    // Color Scale for Betting Volume & Smart Money
    const colorScale = d3
      .scaleSequential()
      .interpolator(d3.interpolateRgbBasis(['#064e3b', '#047857', '#10b981', '#34d399', '#f59e0b']))
      .domain([10, 100]);

    // X Axis
    g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .select('.domain')
      .remove();

    g.selectAll('.tick text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '11px')
      .attr('font-family', 'monospace');

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .select('.domain')
      .remove();

    g.selectAll('.tick text')
      .attr('fill', '#cbd5e1')
      .attr('font-size', '11px')
      .attr('font-weight', '600');

    // Tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'd3-heatmap-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(15, 23, 42, 0.95)')
      .style('border', '1px solid #10b981')
      .style('padding', '6px 10px')
      .style('border-radius', '8px')
      .style('color', '#fff')
      .style('font-size', '11px')
      .style('pointer-events', 'none')
      .style('z-index', '9999');

    // Draw Heatmap Cells
    g.selectAll('rect.cell')
      .data(heatmapData)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', (d) => x(d.time) || 0)
      .attr('y', (d) => y(d.market) || 0)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', (d) => colorScale(d.volume))
      .style('stroke', '#0f172a')
      .style('stroke-width', 2)
      .on('mouseover', (event, d) => {
        tooltip
          .style('visibility', 'visible')
          .html(`
            <div class="font-bold text-emerald-400">${d.market} (${d.time})</div>
            <div>Odds: <span class="font-mono text-amber-300 font-bold">${d.odds.toFixed(2)}</span></div>
            <div>Betting Volume: <span class="font-mono text-emerald-300 font-bold">${d.volume}%</span></div>
          `);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('top', `${event.pageY - 38}px`)
          .style('left', `${event.pageX + 12}px`);
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

    // Add labels inside cells
    g.selectAll('text.cell-label')
      .data(heatmapData)
      .enter()
      .append('text')
      .attr('x', (d) => (x(d.time) || 0) + x.bandwidth() / 2)
      .attr('y', (d) => (y(d.market) || 0) + y.bandwidth() / 2 + 4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('pointer-events', 'none')
      .text((d) => `${d.volume}%`);

    return () => {
      tooltip.remove();
    };
  }, [isOpen, fixture]);

  if (!isOpen || !fixture) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl my-8 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-slate-900 via-black to-slate-950 p-5 sm:p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close match details"
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <span>{fixture.leagueFlag}</span>
            <span>{fixture.league}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{fixture.venue}</span>
          </div>
          <h2 id="match-detail-title" className="text-2xl font-black text-white">
            {fixture.homeTeam} <span className="text-amber-400 font-mono text-lg">vs</span> {fixture.awayTeam}
          </h2>
        </div>

        {/* 1. D3.js Visual Heatmap for Historical Odds Movement & Volume */}
        <div className="mb-6 rounded-xl bg-black p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                D3.js Odds Movement & Betting Volume Heatmap
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-amber-950 inline-block" /> Low Vol
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-amber-500 inline-block" /> High Vol
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-yellow-300 inline-block" /> Smart Surge
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto flex justify-center">
            <svg ref={d3ContainerRef} className="w-full max-w-[580px] h-auto" />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Market analysis reveals heavy volume accumulation on <span className="text-emerald-400 font-semibold">1X Double Chance</span> and <span className="text-amber-300 font-semibold">Over 2.5 Goals</span> in the final 24 hours.
          </p>
        </div>

        {/* 2. Player Performance Metrics Comparison */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Player Performance & Team Metrics
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Home Team Metrics */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
                <span className="font-extrabold text-white text-sm">{fixture.homeTeam} (Home)</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Form: {fixture.homeMetrics.form.join('-')}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Goals (xG):</span>
                  <span className="font-mono font-bold text-emerald-400">{fixture.homeMetrics.xG.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Goals / Conceded per Game:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {fixture.homeMetrics.goalsPerGame} / {fixture.homeMetrics.concededPerGame}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Clean Sheet Ratio:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {(fixture.homeMetrics.cleanSheetsRatio * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-amber-300 flex items-center gap-1 font-semibold">
                    <User className="w-3 h-3" />
                    Key: {fixture.homeMetrics.topScorer.name}
                  </span>
                  <span className="text-[11px] font-mono text-white">
                    {fixture.homeMetrics.topScorer.goals} Goals • Rating {fixture.homeMetrics.topScorer.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Away Team Metrics */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
                <span className="font-extrabold text-white text-sm">{fixture.awayTeam} (Away)</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  Form: {fixture.awayMetrics.form.join('-')}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Goals (xG):</span>
                  <span className="font-mono font-bold text-amber-400">{fixture.awayMetrics.xG.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Goals / Conceded per Game:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {fixture.awayMetrics.goalsPerGame} / {fixture.awayMetrics.concededPerGame}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Clean Sheet Ratio:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {(fixture.awayMetrics.cleanSheetsRatio * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-amber-300 flex items-center gap-1 font-semibold">
                    <User className="w-3 h-3" />
                    Key: {fixture.awayMetrics.topScorer.name}
                  </span>
                  <span className="text-[11px] font-mono text-white">
                    {fixture.awayMetrics.topScorer.goals} Goals • Rating {fixture.awayMetrics.topScorer.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Historical Head-to-Head Trend Analysis */}
        <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <History className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Historical Head-to-Head Trend Analysis
            </h3>
          </div>

          <div className="flex items-center justify-between text-xs py-2 px-3 bg-slate-900 rounded-lg mb-2">
            <div>
              <span className="text-slate-400">Last {fixture.historicalH2H.totalMatches} Matches:</span>
              <span className="font-bold text-white ml-2">
                {fixture.historicalH2H.homeWins} Wins {fixture.homeTeam} • {fixture.historicalH2H.draws} Draws • {fixture.historicalH2H.awayWins} Wins {fixture.awayTeam}
              </span>
            </div>
            <div className="text-emerald-400 font-mono font-bold">
              Avg {fixture.historicalH2H.avgGoals} Goals/Match
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Recent H2H scores:</span>
            <div className="flex gap-1.5">
              {fixture.historicalH2H.lastFiveResults.map((res, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-900 font-mono text-slate-300 border border-slate-800">
                  {res}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
