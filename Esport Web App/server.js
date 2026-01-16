const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// API Routes
app.get('/api/tournaments', (req, res) => {
    res.json({
        tournaments: [
            {
                id: 1,
                name: "DAILY SCRIMS: PURGATORY CUP",
                prizePool: 2000,
                entryFee: 50,
                perKill: 15,
                maxPlayers: 48,
                currentPlayers: 32,
                status: "open"
            }
        ]
    });
});

app.get('/api/live-matches', (req, res) => {
    res.json({
        matches: [
            {
                id: 1,
                title: "AUANIG vs SUABS",
                roomId: "FG45SD",
                password: "*****",
                timeRemaining: "00:09:45",
                players: 40,
                maxPlayers: 48,
                status: "waiting"
            }
        ]
    });
});

// Serve index.html for all routes (for SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});