import type { MatchFixture, PredictionResult, AccessRequest, AccessStatus } from '../types/index.ts';

/**
 * Calculates theoretical double chance odds from standard 1X2 odds with a bookmaker margin
 */
export function calculateDoubleChanceOdds(homeOdds: number, drawOdds: number, awayOdds: number, margin = 1.05) {
  const pHome = 1 / homeOdds;
  const pDraw = 1 / drawOdds;
  const pAway = 1 / awayOdds;

  const raw1X = 1 / (pHome + pDraw);
  const raw12 = 1 / (pHome + pAway);
  const rawX2 = 1 / (pDraw + pAway);

  return {
    doubleChance1X: Number((raw1X * margin).toFixed(2)),
    doubleChance12: Number((raw12 * margin).toFixed(2)),
    doubleChanceX2: Number((rawX2 * margin).toFixed(2)),
  };
}

/**
 * Checks authorization status for a specific user email
 */
export function validateAccessStatus(
  email: string,
  records: AccessRequest[]
): { authorized: boolean; status: AccessStatus | 'none'; role: 'admin' | 'member' | 'guest'; user?: AccessRequest } {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { authorized: false, status: 'none', role: 'guest' };
  }

  // Pre-configured admin check
  if (cleanEmail === 'admin@prosoccer.et') {
    const existing = records.find(r => r.email.toLowerCase() === cleanEmail);
    return {
      authorized: true,
      status: 'approved',
      role: 'admin',
      user: existing || {
        id: 'admin-auto',
        name: 'Administrator',
        email: cleanEmail,
        status: 'approved',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  const record = records.find(r => r.email.toLowerCase() === cleanEmail);
  if (!record) {
    return { authorized: false, status: 'none', role: 'guest' };
  }

  return {
    authorized: record.status === 'approved',
    status: record.status,
    role: record.role,
    user: record,
  };
}

/**
 * Runs the Extreme Analyzer AI to produce the requested all-in-one concise prediction text
 */
export function runExtremeAnalysis(
  fixture: MatchFixture,
  targetOdds: string,
  duration: string,
  preferredMarkets: string[] = []
): PredictionResult {
  const { homeMetrics, awayMetrics, odds, historicalH2H } = fixture;

  // Calculate weighted team power indices
  const homePower = homeMetrics.xG * 1.3 + (homeMetrics.goalsPerGame * 0.9) - (homeMetrics.concededPerGame * 0.7) + 0.3; // home advantage
  const awayPower = awayMetrics.xG * 1.2 + (awayMetrics.goalsPerGame * 0.8) - (awayMetrics.concededPerGame * 0.7);

  const totalProjectedGoals = Number((homeMetrics.goalsPerGame * 0.55 + awayMetrics.goalsPerGame * 0.45 + (homeMetrics.concededPerGame + awayMetrics.concededPerGame) * 0.4).toFixed(1));

  // Determine outcome
  let primaryMarket = '';
  let doubleChancePick = '';
  let overUnderPick = '';
  let correctScore = '';
  let confidence = 85;

  if (homePower > awayPower + 0.6) {
    primaryMarket = `${fixture.homeTeam.toUpperCase()} WIN (1)`;
    doubleChancePick = `1X DOUBLE CHANCE (${odds.doubleChance1X})`;
    correctScore = totalProjectedGoals > 2.5 ? '2-1' : '2-0';
    confidence = Math.min(96, Math.floor(82 + (homePower - awayPower) * 8));
  } else if (awayPower > homePower + 0.6) {
    primaryMarket = `${fixture.awayTeam.toUpperCase()} WIN (2)`;
    doubleChancePick = `X2 DOUBLE CHANCE (${odds.doubleChanceX2})`;
    correctScore = totalProjectedGoals > 2.5 ? '1-2' : '0-2';
    confidence = Math.min(94, Math.floor(80 + (awayPower - homePower) * 8));
  } else {
    // Tight match
    if (homePower >= awayPower) {
      primaryMarket = `${fixture.homeTeam.toUpperCase()} 1X DOUBLE CHANCE (${odds.doubleChance1X})`;
      doubleChancePick = `1X DOUBLE CHANCE`;
    } else {
      primaryMarket = `${fixture.awayTeam.toUpperCase()} X2 DOUBLE CHANCE (${odds.doubleChanceX2})`;
      doubleChancePick = `X2 DOUBLE CHANCE`;
    }
    correctScore = '1-1';
    confidence = 88;
  }

  if (totalProjectedGoals >= 2.5) {
    overUnderPick = `OVER 2.5 GOALS (${odds.over25})`;
  } else {
    overUnderPick = `UNDER 2.5 GOALS (${odds.under25})`;
  }

  // Build the user-requested all-in-one concise prediction string:
  // e.g. "ARSENAL WON (1) • 1X DOUBLE CHANCE (1.28) • OVER 2.5 GOALS (1.85) • SCORE 2-1"
  const segments = [
    primaryMarket,
    doubleChancePick,
    overUnderPick,
    `SCORE ${correctScore}`,
  ];

  const predictionText = segments.join(' • ');

  const homeWinProb = Math.round((1 / odds.home) / ((1 / odds.home) + (1 / odds.draw) + (1 / odds.away)) * 100);
  const awayWinProb = Math.round((1 / odds.away) / ((1 / odds.home) + (1 / odds.draw) + (1 / odds.away)) * 100);
  const drawProb = 100 - homeWinProb - awayWinProb;

  return {
    id: `pred-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    fixtureId: fixture.id,
    match: `${fixture.homeTeam} vs ${fixture.awayTeam}`,
    league: fixture.league,
    predictionText,
    selectedMarkets: [primaryMarket, doubleChancePick, overUnderPick, `Score ${correctScore}`],
    targetOddsRange: targetOdds,
    durationOption: duration,
    confidenceScore: confidence,
    extremeMetrics: {
      winProbabilityHome: homeWinProb,
      winProbabilityDraw: drawProb,
      winProbabilityAway: awayWinProb,
      projectedGoals: totalProjectedGoals,
      xGFactor: `${homeMetrics.xG.toFixed(2)} vs ${awayMetrics.xG.toFixed(2)}`,
      keyDriver: `Form + H2H (${historicalH2H.homeWins}W-${historicalH2H.draws}D-${historicalH2H.awayWins}L) & ${homeMetrics.topScorer.name} in form`,
    },
    timestamp: new Date().toISOString(),
    status: 'PENDING',
  };
}

export function formatBirr(amount: number): string {
  return new Intl.NumberFormat('en-US').format(amount) + ' Birr';
}
