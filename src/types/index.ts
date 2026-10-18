export type AccessStatus = 'pending' | 'approved' | 'rejected' | 'blocked';

export interface AccessRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  reason?: string;
  status: AccessStatus;
  role: 'admin' | 'member' | 'guest';
  createdAt: string;
  updatedAt: string;
}

export interface MatchOdds {
  home: number;
  draw: number;
  away: number;
  doubleChance1X: number;
  doubleChance12: number;
  doubleChanceX2: number;
  over15: number;
  over25: number;
  under25: number;
  over35: number;
  bttsYes: number;
  bttsNo: number;
  correctScore: { score: string; odds: number }[];
}

export interface TeamMetric {
  name: string;
  possessionAvg: number;
  xG: number;
  goalsPerGame: number;
  concededPerGame: number;
  cleanSheetsRatio: number;
  form: ('W' | 'D' | 'L')[];
  topScorer: { name: string; goals: number; rating: number };
  injuryStatus: string;
}

export interface MatchFixture {
  id: string;
  league: string;
  leagueFlag: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  status: 'UPCOMING' | 'LIVE' | 'FINISHED';
  currentScore?: string;
  minute?: number;
  venue: string;
  odds: MatchOdds;
  homeMetrics: TeamMetric;
  awayMetrics: TeamMetric;
  historicalH2H: {
    totalMatches: number;
    homeWins: number;
    draws: number;
    awayWins: number;
    avgGoals: number;
    lastFiveResults: string[];
  };
  oddsMovement: {
    timestamp: string;
    market: '1' | 'X' | '2' | '1X' | 'Over2.5';
    odds: number;
    volumePercent: number;
  }[];
}

export interface PredictionResult {
  id: string;
  fixtureId: string;
  match: string;
  league: string;
  predictionText: string;
  selectedMarkets: string[];
  targetOddsRange: string;
  durationOption: string;
  confidenceScore: number;
  extremeMetrics: {
    winProbabilityHome: number;
    winProbabilityDraw: number;
    winProbabilityAway: number;
    projectedGoals: number;
    xGFactor: string;
    keyDriver: string;
  };
  timestamp: string;
  status?: 'WON' | 'PENDING' | 'LOST';
}

export interface UserStats {
  totalPredictions: number;
  wonPredictions: number;
  winRate: number;
  roiYield: number;
  currentStreak: number;
  totalBirrProfited: number;
}
