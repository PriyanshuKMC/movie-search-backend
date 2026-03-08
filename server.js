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

// GET /api/stream-info — returns stream URL and match metadata
app.get('/api/stream-info', (req, res) => {
    res.json({
        streamUrl: STREAM_URL,
        match: {
            title: 'India vs Australia',
            tournament: 'T20 World Cup 2026',
            venue: 'Melbourne Cricket Ground',
            status: 'LIVE',
        },
    });
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
