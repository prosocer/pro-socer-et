import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDoubleChanceOdds, validateAccessStatus, runExtremeAnalysis } from './predictionEngine.ts';
import type { MatchFixture, AccessRequest } from '../types/index.ts';

test('calculateDoubleChanceOdds computes valid 1X, 12, and X2 margins', () => {
  const result = calculateDoubleChanceOdds(2.0, 3.4, 3.8);
  assert.ok(result.doubleChance1X > 1.0 && result.doubleChance1X < 2.0);
  assert.ok(result.doubleChanceX2 > 1.0 && result.doubleChanceX2 < 3.8);
  assert.ok(result.doubleChance12 > 1.0);
});

test('validateAccessStatus permits admin and approved accounts, rejects unknown/pending', () => {
  const mockRecords: AccessRequest[] = [
    {
      id: '1',
      name: 'Approved User',
      email: 'approved@test.com',
      status: 'approved',
      role: 'member',
      createdAt: '2026-10-01',
      updatedAt: '2026-10-01',
    },
    {
      id: '2',
      name: 'Pending User',
      email: 'pending@test.com',
      status: 'pending',
      role: 'guest',
      createdAt: '2026-10-01',
      updatedAt: '2026-10-01',
    },
  ];

  // Admin auto-approval check
  const adminCheck = validateAccessStatus('admin@prosoccer.et', mockRecords);
  assert.equal(adminCheck.authorized, true);
  assert.equal(adminCheck.role, 'admin');

  // Approved user check
  const approvedCheck = validateAccessStatus('approved@test.com', mockRecords);
  assert.equal(approvedCheck.authorized, true);
  assert.equal(approvedCheck.role, 'member');

  // Pending user check
  const pendingCheck = validateAccessStatus('pending@test.com', mockRecords);
  assert.equal(pendingCheck.authorized, false);
  assert.equal(pendingCheck.status, 'pending');

  // Unknown user check
  const unknownCheck = validateAccessStatus('stranger@test.com', mockRecords);
  assert.equal(unknownCheck.authorized, false);
  assert.equal(unknownCheck.status, 'none');
});

test('runExtremeAnalysis outputs concise all-in-one prediction text with double chance and over/under', () => {
  const mockFixture: MatchFixture = {
    id: 'f1',
    league: 'Premier League',
    leagueFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    kickoff: '2026-10-18T16:30:00Z',
    status: 'UPCOMING',
    venue: 'Emirates Stadium',
    odds: {
      home: 1.75,
      draw: 3.8,
      away: 4.5,
      doubleChance1X: 1.22,
      doubleChance12: 1.28,
      doubleChanceX2: 2.1,
      over15: 1.2,
      over25: 1.85,
      under25: 1.95,
      over35: 3.1,
      bttsYes: 1.7,
      bttsNo: 2.05,
      correctScore: [{ score: '2-1', odds: 8.5 }],
    },
    homeMetrics: {
      name: 'Arsenal',
      possessionAvg: 61,
      xG: 2.15,
      goalsPerGame: 2.3,
      concededPerGame: 0.8,
      cleanSheetsRatio: 0.45,
      form: ['W', 'W', 'W', 'D', 'W'],
      topScorer: { name: 'Bukayo Saka', goals: 11, rating: 8.4 },
      injuryStatus: 'Full Squad',
    },
    awayMetrics: {
      name: 'Chelsea',
      possessionAvg: 54,
      xG: 1.35,
      goalsPerGame: 1.4,
      concededPerGame: 1.5,
      cleanSheetsRatio: 0.25,
      form: ['W', 'L', 'D', 'W', 'L'],
      topScorer: { name: 'Cole Palmer', goals: 10, rating: 8.1 },
      injuryStatus: '2 Defenders Questionable',
    },
    historicalH2H: {
      totalMatches: 8,
      homeWins: 5,
      draws: 2,
      awayWins: 1,
      avgGoals: 3.1,
      lastFiveResults: ['2-1', '3-1', '2-2', '1-0', '0-2'],
    },
    oddsMovement: [],
  };

  const prediction = runExtremeAnalysis(mockFixture, '1.50 - 2.50', 'Today');
  assert.ok(prediction.predictionText.length > 0);
  assert.ok(prediction.predictionText.includes('ARSENAL'));
  assert.ok(prediction.predictionText.includes('DOUBLE CHANCE'));
  assert.ok(prediction.confidenceScore >= 80);
});
