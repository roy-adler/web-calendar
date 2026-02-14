# Web Calendar

A simple weekly calendar viewer that displays events from any public ICS feed.

Paste an ICS feed URL (from Google Calendar, Outlook, iCloud, Infomaniak, etc.) and instantly see the current week's events in a clean grid layout.

## Features

- Weekly grid view (Monday–Sunday) with day columns
- Event display with time, title, and location
- Week navigation (previous / today / next)
- Today highlighting
- Minimal ICS parser — no external calendar libraries

## Quick Start

```bash
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000).

## Docker

```bash
docker build -t web-calendar .
docker run -p 3000:3000 web-calendar
```

## How It Works

The app has two parts:

- **Frontend** (`public/index.html`) — input bar, ICS parser, and weekly calendar UI, all in a single file with vanilla HTML/CSS/JS.
- **Backend** (`server.js`) — a small Express server that serves the static files and proxies ICS feed requests to avoid browser CORS restrictions.

## License

See [LICENSE](LICENSE).
