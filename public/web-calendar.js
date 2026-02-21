(function () {
  "use strict";

  var STYLES_INJECTED = false;

  var CSS = `
    .wc-container {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1a202c;
      --wc-bg: #f8f9fa;
      --wc-card: #ffffff;
      --wc-border: #e2e8f0;
      --wc-text: #1a202c;
      --wc-text-light: #718096;
      --wc-accent: #4f6ef7;
      --wc-accent-light: #ebf0ff;
      --wc-today-bg: #f0f4ff;
      --wc-event-bg: #4f6ef7;
      --wc-event-text: #ffffff;
      --wc-radius: 10px;
    }
    .wc-container * { margin: 0; padding: 0; box-sizing: border-box; }
    .wc-feed-bar {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
    .wc-feed-bar input {
      flex: 1;
      padding: 0.65rem 1rem;
      border: 1px solid var(--wc-border);
      border-radius: var(--wc-radius);
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s;
      font-family: inherit;
      color: var(--wc-text);
      background: var(--wc-card);
    }
    .wc-feed-bar input:focus { border-color: var(--wc-accent); }
    .wc-feed-bar button {
      padding: 0.65rem 1.5rem;
      background: var(--wc-accent);
      color: #fff;
      border: none;
      border-radius: var(--wc-radius);
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;
      white-space: nowrap;
      font-family: inherit;
    }
    .wc-feed-bar button:hover { opacity: 0.85; }
    .wc-week-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .wc-week-nav .wc-label {
      font-weight: 600;
      font-size: 1.1rem;
    }
    .wc-week-nav .wc-btns {
      display: flex;
      gap: 0.4rem;
    }
    .wc-week-nav button {
      padding: 0.4rem 0.9rem;
      background: var(--wc-card);
      border: 1px solid var(--wc-border);
      border-radius: var(--wc-radius);
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 500;
      transition: background 0.15s;
      font-family: inherit;
      color: var(--wc-text);
    }
    .wc-week-nav button:hover { background: var(--wc-accent-light); }
    .wc-week-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
      background: var(--wc-border);
      border-radius: var(--wc-radius);
      overflow: hidden;
      border: 1px solid var(--wc-border);
    }
    .wc-day-col {
      background: var(--wc-card);
      min-height: 160px;
      display: flex;
      flex-direction: column;
    }
    .wc-day-col.wc-today { background: var(--wc-today-bg); }
    .wc-day-header {
      text-align: center;
      padding: 0.6rem 0.4rem;
      border-bottom: 1px solid var(--wc-border);
    }
    .wc-day-header .wc-dow {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--wc-text-light);
    }
    .wc-day-header .wc-date {
      font-size: 1.1rem;
      font-weight: 600;
      margin-top: 0.15rem;
    }
    .wc-day-col.wc-today .wc-day-header .wc-date { color: var(--wc-accent); }
    .wc-day-events {
      flex: 1;
      padding: 0.35rem;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      overflow-y: auto;
    }
    .wc-event {
      background: var(--wc-event-bg);
      color: var(--wc-event-text);
      border-radius: 6px;
      padding: 0.35rem 0.5rem;
      font-size: 0.78rem;
      line-height: 1.3;
    }
    .wc-event .wc-event-time { opacity: 0.85; font-size: 0.7rem; }
    .wc-event .wc-event-title { font-weight: 600; }
    .wc-event .wc-event-location { opacity: 0.8; font-size: 0.7rem; font-style: italic; }
    .wc-empty-state {
      text-align: center;
      color: var(--wc-text-light);
      padding: 3rem 1rem;
      font-size: 0.95rem;
    }
    .wc-status {
      text-align: center;
      padding: 1rem;
      color: var(--wc-text-light);
      font-size: 0.9rem;
    }
    .wc-status.wc-error { color: #e53e3e; }
    @media (max-width: 640px) {
      .wc-week-grid { grid-template-columns: 1fr; }
      .wc-day-col { min-height: auto; }
      .wc-day-header {
        display: flex;
        gap: 0.5rem;
        align-items: baseline;
        padding: 0.5rem 0.8rem;
      }
    }
  `;

  var DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function injectStyles() {
    if (STYLES_INJECTED) return;
    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    STYLES_INJECTED = true;
  }

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  // ---- ICS Parser ----
  function parseICS(text) {
    var parsed = [];
    var blocks = text.split("BEGIN:VEVENT");
    for (var i = 1; i < blocks.length; i++) {
      var block = blocks[i].split("END:VEVENT")[0];
      var ev = {};
      var unfolded = block.replace(/\r?\n[ \t]/g, "");
      var lines = unfolded.split(/\r?\n/);
      for (var j = 0; j < lines.length; j++) {
        var line = lines[j];
        var colonIdx = line.indexOf(":");
        if (colonIdx < 0) continue;
        var key = line.slice(0, colonIdx);
        var val = line.slice(colonIdx + 1);
        if (key.startsWith("DTSTART")) ev.dtstart = parseICSDate(key, val);
        else if (key.startsWith("DTEND")) ev.dtend = parseICSDate(key, val);
        else if (key === "SUMMARY") ev.summary = val;
        else if (key === "LOCATION") ev.location = val;
        else if (key === "DESCRIPTION") ev.description = val;
      }
      if (ev.dtstart && ev.summary) parsed.push(ev);
    }
    return parsed;
  }

  function parseICSDate(key, val) {
    var clean = val.replace(/[^0-9T]/g, "");
    if (clean.length >= 15) {
      var y = clean.slice(0, 4), m = clean.slice(4, 6), d = clean.slice(6, 8);
      var h = clean.slice(9, 11), mi = clean.slice(11, 13);
      if (val.endsWith("Z")) return new Date(Date.UTC(+y, +m - 1, +d, +h, +mi));
      return new Date(+y, +m - 1, +d, +h, +mi);
    } else if (clean.length >= 8) {
      var y = clean.slice(0, 4), m = clean.slice(4, 6), d = clean.slice(6, 8);
      return new Date(+y, +m - 1, +d);
    }
    return null;
  }

  // ---- Week helpers ----
  function getWeekStart(offset) {
    var now = new Date();
    var day = now.getDay();
    var monday = new Date(now);
    monday.setDate(now.getDate() - ((day + 6) % 7) + offset * 7);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  function formatTime(d) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // ---- WebCalendar class ----
  function WebCalendar(el, opts) {
    this.el = typeof el === "string" ? document.querySelector(el) : el;
    if (!this.el) throw new Error("WebCalendar: target element not found");

    this.opts = opts || {};
    this.events = [];
    this.weekOffset = 0;
    this.server = this.opts.server || "";

    injectStyles();
    this.el.classList.add("wc-container");

    this._calDiv = document.createElement("div");

    if (this.opts.url) {
      this.el.appendChild(this._calDiv);
      this.loadFeed(this.opts.url);
    } else {
      this._buildFeedBar();
      this.el.appendChild(this._calDiv);
      this._render();
    }
  }

  WebCalendar.prototype._buildFeedBar = function () {
    var self = this;
    var bar = document.createElement("div");
    bar.className = "wc-feed-bar";

    var input = document.createElement("input");
    input.type = "url";
    input.placeholder = "Paste an ICS feed URL here...";

    var btn = document.createElement("button");
    btn.textContent = "Load";

    btn.addEventListener("click", function () { self.loadFeed(input.value.trim()); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") self.loadFeed(input.value.trim());
    });

    bar.appendChild(input);
    bar.appendChild(btn);
    this.el.appendChild(bar);
  };

  WebCalendar.prototype.loadFeed = function (url) {
    if (!url) return;
    var self = this;
    var proxyUrl = this.server + "/api/feed?url=" + encodeURIComponent(url);

    this._calDiv.innerHTML = '<div class="wc-status">Loading…</div>';

    fetch(proxyUrl)
      .then(function (res) {
        if (!res.ok) throw new Error("Server returned " + res.status);
        return res.text();
      })
      .then(function (text) {
        self.events = parseICS(text);
        self.weekOffset = 0;
        self._render();
      })
      .catch(function (err) {
        self._calDiv.innerHTML =
          '<div class="wc-status wc-error">Failed to load feed: ' +
          escapeHtml(err.message) + "</div>";
      });
  };

  WebCalendar.prototype._render = function () {
    var self = this;

    if (this.events.length === 0 && this.weekOffset === 0 && !this.opts.url) {
      this._calDiv.innerHTML =
        '<div class="wc-empty-state">Paste an ICS feed URL above and hit Load.</div>';
      return;
    }

    if (this.events.length === 0 && this.weekOffset === 0 && this.opts.url) {
      this._calDiv.innerHTML =
        '<div class="wc-empty-state">No events found in the calendar feed.</div>';
      return;
    }

    var weekStart = getWeekStart(this.weekOffset);
    var weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    var label = weekStart.getDate() + " " + MONTHS[weekStart.getMonth()] +
      " – " + weekEnd.getDate() + " " + MONTHS[weekEnd.getMonth()] +
      " " + weekEnd.getFullYear();

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var html = '<div class="wc-week-nav">' +
      '<div class="wc-btns">' +
        '<button data-wc-nav="prev">‹ Prev</button>' +
        '<button data-wc-nav="today">Today</button>' +
        '<button data-wc-nav="next">Next ›</button>' +
      '</div>' +
      '<div class="wc-label">' + label + '</div>' +
    '</div>' +
    '<div class="wc-week-grid">';

    for (var i = 0; i < 7; i++) {
      var day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      var isToday = isSameDay(day, today);
      var dayEvents = this.events
        .filter(function (e) { return isSameDay(e.dtstart, day); })
        .sort(function (a, b) { return a.dtstart - b.dtstart; });

      html += '<div class="wc-day-col' + (isToday ? " wc-today" : "") + '">';
      html += '<div class="wc-day-header">';
      html += '<div class="wc-dow">' + DOW[i] + '</div>';
      html += '<div class="wc-date">' + day.getDate() + '</div>';
      html += '</div><div class="wc-day-events">';

      for (var j = 0; j < dayEvents.length; j++) {
        var ev = dayEvents[j];
        html += '<div class="wc-event">';
        if (ev.dtend) {
          html += '<div class="wc-event-time">' + formatTime(ev.dtstart) +
            " – " + formatTime(ev.dtend) + '</div>';
        }
        html += '<div class="wc-event-title">' + escapeHtml(ev.summary) + '</div>';
        if (ev.location) {
          html += '<div class="wc-event-location">' + escapeHtml(ev.location) + '</div>';
        }
        html += '</div>';
      }

      html += '</div></div>';
    }

    html += '</div>';
    this._calDiv.innerHTML = html;

    this._calDiv.querySelectorAll("[data-wc-nav]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var action = this.getAttribute("data-wc-nav");
        if (action === "prev") self.weekOffset--;
        else if (action === "next") self.weekOffset++;
        else self.weekOffset = 0;
        self._render();
      });
    });
  };

  // ---- Public API ----
  window.WebCalendar = WebCalendar;

  // ---- Auto-init from data attributes ----
  function autoInit() {
    var script = document.currentScript ||
      (function () {
        var scripts = document.getElementsByTagName("script");
        return scripts[scripts.length - 1];
      })();

    var server = script && script.getAttribute("data-server") || "";

    document.querySelectorAll("[data-web-calendar]").forEach(function (el) {
      if (el._webCalendar) return;
      var url = el.getAttribute("data-url") || "";
      el._webCalendar = new WebCalendar(el, {
        url: url || undefined,
        server: server || el.getAttribute("data-server") || ""
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    autoInit();
  }
})();
