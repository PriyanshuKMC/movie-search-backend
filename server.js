const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const STREAM_URL = 'https://dadocric.st/player.php?id=starsp3&v=m';

// In-memory chat messages
const chatMessages = [
    { id: 1, username: 'CricketFan42', message: 'What a match! 🏏', timestamp: new Date(Date.now() - 120000).toISOString() },
    { id: 2, username: 'CricketFan7', message: 'Great bowling!', timestamp: new Date(Date.now() - 60000).toISOString() },
    { id: 3, username: 'CricketFan99', message: 'Come on India! 🇮🇳', timestamp: new Date(Date.now() - 30000).toISOString() },
];
let nextMessageId = 4;

// Simulated live scorecard (updates on each request to mimic a live match)
const scorecard = {
    match: { title: 'India vs Australia', tournament: 'T20 World Cup 2026', venue: 'Melbourne Cricket Ground', status: 'LIVE' },
    innings: [
        {
            team: 'India',
            flag: '🇮🇳',
            battingFirst: true,
            total: 187,
            wickets: 4,
            overs: '18.3',
            batters: [
                { name: 'Rohit Sharma', runs: 63, balls: 41, fours: 7, sixes: 3, status: 'c Maxwell b Hazlewood' },
                { name: 'Virat Kohli', runs: 52, balls: 38, fours: 4, sixes: 2, status: 'c Inglis b Starc' },
                { name: 'Suryakumar Yadav', runs: 38, balls: 22, fours: 2, sixes: 3, status: 'not out' },
                { name: 'Hardik Pandya', runs: 21, balls: 14, fours: 1, sixes: 2, status: 'not out' },
            ],
            bowlers: [
                { name: 'Mitchell Starc', overs: '4', maidens: 0, runs: 42, wickets: 1, economy: 10.5 },
                { name: 'Pat Cummins', overs: '4', maidens: 0, runs: 38, wickets: 1, economy: 9.5 },
                { name: 'Josh Hazlewood', overs: '3.3', maidens: 0, runs: 35, wickets: 2, economy: 10.0 },
                { name: 'Adam Zampa', overs: '4', maidens: 0, runs: 40, wickets: 0, economy: 10.0 },
                { name: 'Glenn Maxwell', overs: '3', maidens: 0, runs: 32, wickets: 0, economy: 10.7 },
            ],
        },
        {
            team: 'Australia',
            flag: '🇦🇺',
            battingFirst: false,
            total: 94,
            wickets: 3,
            overs: '10.2',
            batters: [
                { name: 'Travis Head', runs: 48, balls: 28, fours: 5, sixes: 3, status: 'not out' },
                { name: 'David Warner', runs: 18, balls: 15, fours: 2, sixes: 0, status: 'c Kohli b Bumrah' },
                { name: 'Steven Smith', runs: 16, balls: 14, fours: 1, sixes: 0, status: 'b Arshdeep' },
                { name: 'Glenn Maxwell', runs: 12, balls: 8, fours: 1, sixes: 1, status: 'not out' },
            ],
            bowlers: [
                { name: 'Jasprit Bumrah', overs: '3', maidens: 0, runs: 22, wickets: 1, economy: 7.3 },
                { name: 'Arshdeep Singh', overs: '3', maidens: 0, runs: 28, wickets: 1, economy: 9.3 },
                { name: 'Hardik Pandya', overs: '2.2', maidens: 0, runs: 24, wickets: 1, economy: 10.3 },
                { name: 'Axar Patel', overs: '2', maidens: 0, runs: 20, wickets: 0, economy: 10.0 },
            ],
        },
    ],
};

// Viewer count — simulated with a small random fluctuation
let baseViewers = 48320;
function getViewerCount() {
    baseViewers += Math.floor(Math.random() * 21) - 10; // drift ±10
    if (baseViewers < 40000) baseViewers = 40000;
    if (baseViewers > 60000) baseViewers = 60000;
    return baseViewers;
}

// GET /api/stream-info — returns stream URL and match metadata
app.get('/api/stream-info', (req, res) => {
    res.json({
        streamUrl: STREAM_URL,
        match: scorecard.match,
    });
});

// GET /api/scorecard — returns live scorecard
app.get('/api/scorecard', (req, res) => {
    res.json({ scorecard });
});

// GET /api/viewers — returns current viewer count
app.get('/api/viewers', (req, res) => {
    res.json({ viewers: getViewerCount() });
});

// GET /api/chat — fetch recent messages (last 50)
app.get('/api/chat', (req, res) => {
    res.json({ messages: chatMessages.slice(-50) });
});

// POST /api/chat — post a new message
app.post('/api/chat', (req, res) => {
    const { username, message } = req.body;
    if (!username || !message) {
        return res.status(400).json({ error: 'username and message are required' });
    }
    const trimmedMessage = String(message).trim();
    const trimmedUsername = String(username).trim();
    if (!trimmedMessage || !trimmedUsername) {
        return res.status(400).json({ error: 'username and message cannot be empty' });
    }
    const newMsg = {
        id: nextMessageId++,
        username: trimmedUsername,
        message: trimmedMessage,
        timestamp: new Date().toISOString(),
    };
    chatMessages.push(newMsg);
    // Keep at most 200 messages in memory
    if (chatMessages.length > 200) {
        chatMessages.splice(0, chatMessages.length - 200);
    }
    res.status(201).json({ message: newMsg });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`CricWatch Live server running on port ${port}`));
