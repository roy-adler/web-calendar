# Web Calendar

A weekly calendar widget that displays events from any public ICS feed. Configure it visually, then embed it in any website with a single snippet.

## Features

- **Configurator UI** — set your ICS feed URL, pick an accent color, and get a ready-to-copy embed snippet
- Weekly grid view (Monday–Sunday) with day columns
- Event display with time, title, and location
- Week navigation (previous / today / next)
- Today highlighting
- Customizable accent color via `data-accent`
- Minimal ICS parser — no external calendar libraries
- Embeddable widget — drop into any website with a single script tag

## Quick Start

```bash
docker build -t web-calendar .
docker run -p 3000:3000 web-calendar
```

Open [http://localhost:3000](http://localhost:3000) to access the configurator, where you can set up your calendar and copy the embed code.

## Embedding as a Plugin

Include `web-calendar.js` and add a `data-web-calendar` element. Use the configurator at `/` to generate the snippet, or write it by hand:

### With a pre-configured ICS URL (no input field)

```html
<div data-web-calendar data-url="https://example.com/feed.ics" data-accent="#e63946"></div>
<script src="https://your-server.com/web-calendar.js" data-server="https://your-server.com"></script>
```

### Without a URL (shows input field)

```html
<div data-web-calendar></div>
<script src="https://your-server.com/web-calendar.js" data-server="https://your-server.com"></script>
```

### JavaScript API

```html
<div id="my-calendar"></div>
<script src="https://your-server.com/web-calendar.js"></script>
<script>
  new WebCalendar('#my-calendar', {
    url: 'https://example.com/feed.ics',
    accent: '#e63946',
    server: 'https://your-server.com'
  });
</script>
```

### Configuration

| Attribute / Option | Description |
|---|---|
| `data-url` / `url` | ICS feed URL. If provided, the calendar loads immediately with no input field. If omitted, an input field is shown. |
| `data-accent` / `accent` | Accent hex color (e.g. `#e63946`). Drives event badges, today highlight, and buttons. Defaults to `#4f6ef7`. |
| `data-server` / `server` | Base URL of the server running the `/api/feed` proxy (needed to avoid CORS). Can be set on the `<script>` tag or on each element. |

### Proxy server

The widget fetches ICS feeds through the `/api/feed` proxy endpoint to avoid browser CORS restrictions. When embedding on an external site, set `data-server` to the URL where this app is hosted.

## How It Works

- **Configurator** (`public/index.html`) — setup page where you configure URL, colors, and copy the embed snippet. Uses the widget for a live preview.
- **Widget** (`public/web-calendar.js`) — self-contained embeddable calendar with ICS parser, all in vanilla JS.
- **Backend** (`server.js`) — a small Express server that serves the static files and proxies ICS feed requests to avoid CORS.

## License

See [LICENSE](LICENSE).
