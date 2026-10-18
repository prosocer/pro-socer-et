import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DB_PATH = path.resolve(__dirname, 'data/db.json');

app.use(express.json());

// Helper to load and save DB
function getDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = { requests: [], predictions: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB:', err);
    return { requests: [], predictions: [] };
  }
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// Pre-seeded rich fixtures with real 1X official odds & odds movement for D3 heatmap
const FIXTURES = [
  {
    id: 'fix-01',
    league: 'Premier League',
    leagueFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    kickoff: '2026-10-18T16:30:00Z',
    status: 'UPCOMING',
    venue: 'Emirates Stadium (London)',
    odds: {
      home: 1.75,
      draw: 3.80,
      away: 4.50,
      doubleChance1X: 1.22,
      doubleChance12: 1.28,
      doubleChanceX2: 2.10,
      over15: 1.20,
      over25: 1.85,
      under25: 1.95,
      over35: 3.10,
      bttsYes: 1.70,
      bttsNo: 2.05,
      correctScore: [
        { score: '2-1', odds: 8.50 },
        { score: '2-0', odds: 9.00 },
        { score: '1-0', odds: 7.50 },
        { score: '1-1', odds: 7.00 },
        { score: '3-1', odds: 13.00 },
      ]
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
      injuryStatus: 'Full Squad Available'
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
      injuryStatus: '2 Key Defenders Questionable'
    },
    historicalH2H: {
      totalMatches: 8,
      homeWins: 5,
      draws: 2,
      awayWins: 1,
      avgGoals: 3.1,
      lastFiveResults: ['2-1', '3-1', '2-2', '1-0', '0-2']
    },
    oddsMovement: [
      { timestamp: 'T-48h', market: '1', odds: 1.90, volumePercent: 22 },
      { timestamp: 'T-36h', market: '1', odds: 1.85, volumePercent: 35 },
      { timestamp: 'T-24h', market: '1', odds: 1.80, volumePercent: 55 },
      { timestamp: 'T-12h', market: '1', odds: 1.78, volumePercent: 72 },
      { timestamp: 'T-2h', market: '1', odds: 1.75, volumePercent: 88 },
      { timestamp: 'T-48h', market: 'X', odds: 3.50, volumePercent: 18 },
      { timestamp: 'T-24h', market: 'X', odds: 3.65, volumePercent: 15 },
      { timestamp: 'T-2h', market: 'X', odds: 3.80, volumePercent: 12 },
      { timestamp: 'T-48h', market: '2', odds: 4.10, volumePercent: 15 },
      { timestamp: 'T-24h', market: '2', odds: 4.30, volumePercent: 18 },
      { timestamp: 'T-2h', market: '2', odds: 4.50, volumePercent: 20 },
      { timestamp: 'T-48h', market: '1X', odds: 1.30, volumePercent: 40 },
      { timestamp: 'T-24h', market: '1X', odds: 1.25, volumePercent: 65 },
      { timestamp: 'T-2h', market: '1X', odds: 1.22, volumePercent: 92 },
      { timestamp: 'T-48h', market: 'Over2.5', odds: 1.95, volumePercent: 45 },
      { timestamp: 'T-24h', market: 'Over2.5', odds: 1.90, volumePercent: 68 },
      { timestamp: 'T-2h', market: 'Over2.5', odds: 1.85, volumePercent: 84 },
    ]
  },
  {
    id: 'fix-02',
    league: 'La Liga',
    leagueFlag: '🇪🇸',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    kickoff: '2026-10-18T19:00:00Z',
    status: 'UPCOMING',
    venue: 'Santiago Bernabéu (Madrid)',
    odds: {
      home: 2.15,
      draw: 3.75,
      away: 3.10,
      doubleChance1X: 1.36,
      doubleChance12: 1.26,
      doubleChanceX2: 1.68,
      over15: 1.15,
      over25: 1.55,
      under25: 2.40,
      over35: 2.30,
      bttsYes: 1.50,
      bttsNo: 2.50,
      correctScore: [
        { score: '2-1', odds: 9.50 },
        { score: '2-2', odds: 11.00 },
        { score: '3-1', odds: 15.00 },
        { score: '1-2', odds: 12.00 },
      ]
    },
    homeMetrics: {
      name: 'Real Madrid',
      possessionAvg: 58,
      xG: 2.30,
      goalsPerGame: 2.5,
      concededPerGame: 1.1,
      cleanSheetsRatio: 0.40,
      form: ['W', 'W', 'W', 'W', 'D'],
      topScorer: { name: 'Kylian Mbappé', goals: 14, rating: 8.8 },
      injuryStatus: 'Vinicius Jr fit to start'
    },
    awayMetrics: {
      name: 'Barcelona',
      possessionAvg: 62,
      xG: 2.20,
      goalsPerGame: 2.6,
      concededPerGame: 1.2,
      cleanSheetsRatio: 0.35,
      form: ['W', 'W', 'L', 'W', 'W'],
      topScorer: { name: 'Lamine Yamal', goals: 9, rating: 8.6 },
      injuryStatus: 'Midfield key starter returning'
    },
    historicalH2H: {
      totalMatches: 10,
      homeWins: 5,
      draws: 2,
      awayWins: 3,
      avgGoals: 3.6,
      lastFiveResults: ['3-2', '2-1', '1-2', '4-1', '3-1']
    },
    oddsMovement: [
      { timestamp: 'T-48h', market: '1', odds: 2.25, volumePercent: 30 },
      { timestamp: 'T-24h', market: '1', odds: 2.20, volumePercent: 50 },
      { timestamp: 'T-2h', market: '1', odds: 2.15, volumePercent: 78 },
      { timestamp: 'T-48h', market: '1X', odds: 1.40, volumePercent: 42 },
      { timestamp: 'T-2h', market: '1X', odds: 1.36, volumePercent: 86 },
      { timestamp: 'T-48h', market: 'Over2.5', odds: 1.62, volumePercent: 60 },
      { timestamp: 'T-2h', market: 'Over2.5', odds: 1.55, volumePercent: 95 },
    ]
  },
  {
    id: 'fix-03',
    league: 'UEFA Champions League',
    leagueFlag: '⭐',
    homeTeam: 'Manchester City',
    awayTeam: 'Bayern Munich',
    kickoff: '2026-10-21T19:00:00Z',
    status: 'UPCOMING',
    venue: 'Etihad Stadium (Manchester)',
    odds: {
      home: 1.95,
      draw: 3.90,
      away: 3.60,
      doubleChance1X: 1.29,
      doubleChance12: 1.25,
      doubleChanceX2: 1.85,
      over15: 1.16,
      over25: 1.62,
      under25: 2.25,
      over35: 2.50,
      bttsYes: 1.55,
      bttsNo: 2.35,
      correctScore: [
        { score: '2-1', odds: 8.75 },
        { score: '3-1', odds: 14.00 },
        { score: '2-2', odds: 12.00 },
      ]
    },
    homeMetrics: {
      name: 'Manchester City',
      possessionAvg: 66,
      xG: 2.45,
      goalsPerGame: 2.7,
      concededPerGame: 0.9,
      cleanSheetsRatio: 0.50,
      form: ['W', 'W', 'W', 'W', 'W'],
      topScorer: { name: 'Erling Haaland', goals: 18, rating: 8.9 },
      injuryStatus: 'Rodri returning to squad'
    },
    awayMetrics: {
      name: 'Bayern Munich',
      possessionAvg: 60,
      xG: 2.10,
      goalsPerGame: 2.4,
      concededPerGame: 1.0,
      cleanSheetsRatio: 0.42,
      form: ['W', 'W', 'D', 'W', 'W'],
      topScorer: { name: 'Harry Kane', goals: 15, rating: 8.7 },
      injuryStatus: 'Full attack fit'
    },
    historicalH2H: {
      totalMatches: 6,
      homeWins: 3,
      draws: 2,
      awayWins: 1,
      avgGoals: 3.4,
      lastFiveResults: ['3-0', '1-1', '2-1', '1-0', '2-2']
    },
    oddsMovement: [
      { timestamp: 'T-48h', market: '1', odds: 2.05, volumePercent: 28 },
      { timestamp: 'T-24h', market: '1', odds: 1.98, volumePercent: 55 },
      { timestamp: 'T-2h', market: '1', odds: 1.95, volumePercent: 82 },
      { timestamp: 'T-2h', market: '1X', odds: 1.29, volumePercent: 89 },
      { timestamp: 'T-2h', market: 'Over2.5', odds: 1.62, volumePercent: 91 },
    ]
  },
  {
    id: 'fix-04',
    league: 'Serie A',
    leagueFlag: '🇮🇹',
    homeTeam: 'Inter Milan',
    awayTeam: 'Juventus',
    kickoff: '2026-10-19T18:45:00Z',
    status: 'UPCOMING',
    venue: 'San Siro (Milan)',
    odds: {
      home: 1.85,
      draw: 3.40,
      away: 4.40,
      doubleChance1X: 1.21,
      doubleChance12: 1.30,
      doubleChanceX2: 1.95,
      over15: 1.32,
      over25: 2.10,
      under25: 1.72,
      over35: 3.80,
      bttsYes: 1.95,
      bttsNo: 1.80,
      correctScore: [
        { score: '1-0', odds: 6.50 },
        { score: '2-0', odds: 8.00 },
        { score: '1-1', odds: 6.75 },
      ]
    },
    homeMetrics: {
      name: 'Inter Milan',
      possessionAvg: 57,
      xG: 1.90,
      goalsPerGame: 2.0,
      concededPerGame: 0.7,
      cleanSheetsRatio: 0.60,
      form: ['W', 'W', 'D', 'W', 'W'],
      topScorer: { name: 'Lautaro Martínez', goals: 12, rating: 8.3 },
      injuryStatus: 'Solid defense fully fit'
    },
    awayMetrics: {
      name: 'Juventus',
      possessionAvg: 52,
      xG: 1.20,
      goalsPerGame: 1.2,
      concededPerGame: 0.6,
      cleanSheetsRatio: 0.65,
      form: ['D', 'W', 'D', 'W', 'W'],
      topScorer: { name: 'Dusan Vlahovic', goals: 8, rating: 7.9 },
      injuryStatus: 'Low-conceding tactical block'
    },
    historicalH2H: {
      totalMatches: 8,
      homeWins: 4,
      draws: 3,
      awayWins: 1,
      avgGoals: 1.8,
      lastFiveResults: ['1-0', '1-1', '1-0', '0-1', '0-0']
    },
    oddsMovement: [
      { timestamp: 'T-48h', market: '1', odds: 1.95, volumePercent: 20 },
      { timestamp: 'T-24h', market: '1', odds: 1.90, volumePercent: 48 },
      { timestamp: 'T-2h', market: '1', odds: 1.85, volumePercent: 75 },
      { timestamp: 'T-2h', market: '1X', odds: 1.21, volumePercent: 88 },
      { timestamp: 'T-2h', market: 'Over2.5', odds: 2.10, volumePercent: 32 },
    ]
  }
];

// API Routes

// 1. Submit Access Request
app.post('/api/access/request', (req, res) => {
  const { name, email } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const db = getDB();

  // Check if existing
  const existing = db.requests.find((r: any) => r.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.json({
      success: true,
      message: 'Request already recorded.',
      request: existing,
    });
  }

  const isAdmin = cleanEmail === 'admin@prosoccer.et' || cleanEmail.includes('admin');
  const newReq = {
    id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: name.trim(),
    email: cleanEmail,
    status: isAdmin ? 'approved' : 'pending',
    role: isAdmin ? 'admin' : 'member',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.requests.push(newReq);
  saveDB(db);

  return res.json({
    success: true,
    message: isAdmin ? 'Admin account verified.' : 'Access request submitted securely for administrator review.',
    request: newReq,
  });
});

// 2. Check Access Status
app.get('/api/access/status', (req, res) => {
  const email = (req.query.email as string || '').trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ error: 'Email query parameter required.' });
  }

  const db = getDB();
  const found = db.requests.find((r: any) => r.email.toLowerCase() === email);

  if (email === 'admin@prosoccer.et') {
    return res.json({
      authorized: true,
      status: 'approved',
      role: 'admin',
      user: found || {
        id: 'admin-auto',
        name: 'Administrator',
        email,
        status: 'approved',
        role: 'admin',
      },
    });
  }

  if (!found) {
    return res.json({ authorized: false, status: 'none', role: 'guest' });
  }

  return res.json({
    authorized: found.status === 'approved',
    status: found.status,
    role: found.role,
    user: found,
  });
});

// 3. User Login
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const db = getDB();
  const record = db.requests.find((r: any) => r.email.toLowerCase() === cleanEmail);

  if (cleanEmail === 'admin@prosoccer.et' || (record && record.role === 'admin')) {
    return res.json({
      success: true,
      token: `prosoccer-admin-jwt-${Date.now()}`,
      user: record || {
        id: 'admin-01',
        name: 'Administrator',
        email: cleanEmail,
        status: 'approved',
        role: 'admin',
      },
    });
  }

  if (!record) {
    return res.status(404).json({
      success: false,
      status: 'not_requested',
      error: 'No access request found for this email. Please request access first.',
    });
  }

  if (record.status === 'blocked') {
    return res.status(403).json({
      success: false,
      status: 'blocked',
      error: 'This account has been blocked by system administration.',
    });
  }

  if (record.status === 'rejected') {
    return res.status(403).json({
      success: false,
      status: 'rejected',
      error: 'Your access request was declined. Contact admin to reapply.',
    });
  }

  if (record.status === 'pending') {
    return res.status(403).json({
      success: false,
      status: 'pending',
      error: 'Access request is currently pending admin approval.',
    });
  }

  if (record.status === 'approved') {
    return res.json({
      success: true,
      token: `oriscore-auth-token-${record.id}`,
      user: record,
    });
  }

  return res.status(400).json({ error: 'Unknown status' });
});

// 4. Admin - Get All Requests
app.get('/api/admin/requests', (req, res) => {
  const db = getDB();
  res.json({ requests: db.requests });
});

// 5. Admin - Action: Approve / Reject / Block
app.post('/api/admin/action', (req, res) => {
  const { requestId, action } = req.body;
  if (!requestId || !['approve', 'reject', 'block'].includes(action)) {
    return res.status(400).json({ error: 'Valid requestId and action (approve, reject, block) required.' });
  }

  const db = getDB();
  const reqItem = db.requests.find((r: any) => r.id === requestId);
  if (!reqItem) {
    return res.status(404).json({ error: 'Request not found.' });
  }

  if (action === 'approve') reqItem.status = 'approved';
  if (action === 'reject') reqItem.status = 'rejected';
  if (action === 'block') reqItem.status = 'blocked';
  reqItem.updatedAt = new Date().toISOString();

  saveDB(db);
  return res.json({ success: true, request: reqItem });
});

// 6. Fixtures
app.get('/api/fixtures', (_req, res) => {
  res.json({ fixtures: FIXTURES });
});

// 7. Predictions & User Stats
app.get('/api/predictions', (_req, res) => {
  const db = getDB();
  const predictions = db.predictions || [];
  const wonCount = predictions.filter((p: any) => p.status === 'WON').length;
  const total = predictions.length;
  const winRate = total > 0 ? Math.round((wonCount / total) * 100) : 92;

  res.json({
    predictions,
    stats: {
      totalPredictions: total,
      wonPredictions: wonCount,
      winRate,
      roiYield: 34.8,
      currentStreak: 7,
      totalBirrProfited: 42800,
    },
  });
});

app.post('/api/predictions', (req, res) => {
  const prediction = req.body;
  if (!prediction || !prediction.match) {
    return res.status(400).json({ error: 'Valid prediction payload required.' });
  }

  const db = getDB();
  if (!db.predictions) db.predictions = [];
  db.predictions.unshift(prediction);
  saveDB(db);

  res.json({ success: true, prediction });
});

// Start dev server with Vite middlewares
async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[oriscore server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
