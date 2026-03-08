# CricWatch Live 🏏

A full-featured online Cricket match watching space — watch live cricket matches in a beautifully designed, immersive viewing experience with live chat.

## Features

- 🎥 **Live Streaming** — Embeds a real-time cricket match stream directly in your browser
- 💬 **Live Chat** — Chat with other fans while watching the match (auto-refreshes every 3 seconds)
- 📱 **Responsive Design** — Works seamlessly on desktop and mobile devices
- 🌙 **Dark Theme** — Modern dark UI with cricket-themed green and gold accents
- ⚡ **Match Info** — Displays current match details (teams, tournament, venue)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm

### Installation

```bash
npm install
```

### Running the App

```bash
npm start
```

Then open your browser and navigate to **http://localhost:3000**

## Tech Stack

- **Backend:** Node.js, Express, cors
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (fully inline, no build step)
- **Architecture:** Single-page app served by Express static middleware

## Project Structure

```
cricwatch-live/
├── server.js        # Express server (API + static files)
├── public/
│   └── index.html   # Cricket watching space UI
├── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint           | Description                          |
|--------|--------------------|--------------------------------------|
| GET    | `/api/stream-info` | Returns stream URL and match metadata|
| GET    | `/api/chat`        | Fetch recent chat messages           |
| POST   | `/api/chat`        | Post a new chat message              |

## Screenshot

![CricWatch Live Screenshot](https://via.placeholder.com/800x450?text=CricWatch+Live+%F0%9F%8F%8F)

---

© 2026 CricWatch Live — All Rights Reserved
