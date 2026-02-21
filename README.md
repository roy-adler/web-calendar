# Web Calendar

A simple weekly calendar viewer that displays events from any public ICS feed.

Paste an ICS feed URL (from Google Calendar, Outlook, iCloud, Infomaniak, etc.) and instantly see the current week's events in a clean grid layout.

## Features

- Weekly grid view (Monday–Sunday) with day columns
- Event display with time, title, and location
- Week navigation (previous / today / next)
- Today highlighting
- Minimal ICS parser — no external calendar libraries
- **Embeddable widget** — drop into any website with a single script tag

## Quick Start

```bash
docker build -t web-calendar .
docker run -p 3000:3000 web-calendar
```

Then open [http://localhost:3000](http://localhost:3000).

## Embedding as a Plugin

You can embed the calendar widget in any website by including `web-calendar.js` and adding a `data-web-calendar` element.

### With a pre-configured ICS URL (no input field)

If you already know the feed URL, pass it via `data-url` and the calendar renders directly — no input field shown:

```html
<div data-web-calendar data-url="https://example.com/my-calendar.ics"></div>
<script src="https://your-server.com/web-calendar.js" data-server="https://your-server.com"></script>
```

### Without a URL (shows input field)

Omit `data-url` and users get an input field to paste their own ICS URL:

```html
<div data-web-calendar></div>
<script src="https://your-server.com/web-calendar.js" data-server="https://your-server.com"></script>
```

### Multiple calendars on one page

You can place as many `data-web-calendar` elements as you want — each one becomes an independent widget:

```html
<div data-web-calendar data-url="https://example.com/team-a.ics"></div>
<div data-web-calendar data-url="https://example.com/team-b.ics"></div>
<script src="https://your-server.com/web-calendar.js" data-server="https://your-server.com"></script>
```

### JavaScript API

You can also create instances programmatically:

```html
<div id="my-calendar"></div>
<script src="https://your-server.com/web-calendar.js"></script>
<script>
  new WebCalendar('#my-calendar', {
    url: 'https://example.com/feed.ics',    // optional — omit to show input field
    server: 'https://your-server.com'        // base URL of the proxy server
  });
</script>
```

### Configuration

| Attribute / Option | Description |
|---|---|
| `data-url` / `url` | ICS feed URL. If provided, the calendar loads immediately with no input field. If omitted, an input field is shown. |
| `data-server` / `server` | Base URL of the server running the `/api/feed` proxy (needed to avoid CORS). Can be set on the `<script>` tag or on each element. |

### Proxy server

The widget fetches ICS feeds through the `/api/feed` proxy endpoint to avoid browser CORS restrictions. When embedding on an external site, set `data-server` to the URL where this app is hosted (e.g. `https://calendar.example.com`).

## How It Works

The app has two parts:

- **Frontend** (`public/index.html` + `public/web-calendar.js`) — embeddable widget with ICS parser and weekly calendar UI, all in vanilla JS.
- **Backend** (`server.js`) — a small Express server that serves the static files and proxies ICS feed requests to avoid browser CORS restrictions.

## License

See [LICENSE](LICENSE).
