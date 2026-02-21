(function () {
  "use strict";

  var STYLES_INJECTED = false;

  var CSS = `
    .wc-container {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1a202c;
      background: var(--wc-bg);
      padding: 1.25rem;
      border-radius: var(--wc-radius);
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
    .wc-view-select {
      padding: 0.4rem 0.6rem;
      background: var(--wc-card);
      border: 1px solid var(--wc-border);
      border-radius: var(--wc-radius);
      font-size: 0.85rem;
      font-weight: 500;
      font-family: inherit;
      color: var(--wc-text);
      cursor: pointer;
      outline: none;
      margin-left: 0.4rem;
    }
    .wc-view-select:focus { border-color: var(--wc-accent); }
    .wc-day-view {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .wc-day-event-card {
      background: var(--wc-card);
      border: 1px solid var(--wc-border);
      border-radius: var(--wc-radius);
      padding: 0.75rem 1rem;
      border-left: 3px solid var(--wc-accent);
    }
    .wc-day-event-card .wc-event-time {
      font-size: 0.8rem;
      color: var(--wc-text-light);
      margin-bottom: 0.15rem;
    }
    .wc-day-event-card .wc-event-title {
      font-weight: 600;
      font-size: 0.95rem;
    }
    .wc-day-event-card .wc-event-location {
      font-size: 0.8rem;
      color: var(--wc-text-light);
      font-style: italic;
      margin-top: 0.1rem;
    }
    .wc-day-event-card .wc-event-desc {
      font-size: 0.8rem;
      color: var(--wc-text-light);
      margin-top: 0.25rem;
      line-height: 1.4;
    }
    .wc-day-empty {
      text-align: center;
      color: var(--wc-text-light);
      padding: 2rem 1rem;
      font-size: 0.9rem;
    }
    .wc-month-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
      background: var(--wc-border);
      border-radius: var(--wc-radius);
      overflow: hidden;
      border: 1px solid var(--wc-border);
    }
    .wc-month-dow {
      background: var(--wc-card);
      text-align: center;
      padding: 0.5rem 0.25rem;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--wc-text-light);
    }
    .wc-month-day {
      background: var(--wc-card);
      min-height: 80px;
      padding: 0.25rem;
      display: flex;
      flex-direction: column;
    }
    .wc-month-day.wc-outside { opacity: 0.35; }
    .wc-month-day.wc-today { background: var(--wc-today-bg); }
    .wc-month-day-num {
      font-size: 0.78rem;
      font-weight: 600;
      padding: 0.1rem 0.25rem;
      margin-bottom: 0.1rem;
    }
    .wc-month-day.wc-today .wc-month-day-num { color: var(--wc-accent); }
    .wc-month-events {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1px;
      overflow: hidden;
    }
    .wc-month-event {
      font-size: 0.68rem;
      padding: 0.1rem 0.25rem;
      border-radius: 3px;
      background: var(--wc-event-bg);
      color: var(--wc-event-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.4;
    }
    .wc-month-more {
      font-size: 0.65rem;
      color: var(--wc-text-light);
      padding: 0.05rem 0.25rem;
    }
    @media (max-width: 640px) {
      .wc-month-day { min-height: 50px; }
      .wc-month-event { font-size: 0.6rem; }
    }
    .wc-next-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem 0;
    }
    .wc-next-card {
      background: var(--wc-card);
      border: 1px solid var(--wc-border);
      border-radius: var(--wc-radius);
      padding: 1.5rem 2rem;
      width: 100%;
      max-width: 480px;
      text-align: center;
    }
    .wc-next-when {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--wc-accent);
      margin-bottom: 0.75rem;
    }
    .wc-next-title {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .wc-next-time {
      font-size: 0.95rem;
      color: var(--wc-text-light);
      margin-bottom: 0.25rem;
    }
    .wc-next-location {
      font-size: 0.85rem;
      color: var(--wc-text-light);
      font-style: italic;
    }
    .wc-next-desc {
      font-size: 0.85rem;
      color: var(--wc-text-light);
      margin-top: 0.75rem;
      line-height: 1.5;
    }
    .wc-next-countdown {
      font-size: 0.85rem;
      color: var(--wc-text-light);
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--wc-border);
    }
    .wc-next-position {
      font-size: 0.8rem;
      color: var(--wc-text-light);
      margin-top: 0.75rem;
    }
  `;

  function hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    var n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function tint(hex, amount) {
    var rgb = hexToRgb(hex);
    return rgbToHex(
      Math.round(rgb[0] + (255 - rgb[0]) * amount),
      Math.round(rgb[1] + (255 - rgb[1]) * amount),
      Math.round(rgb[2] + (255 - rgb[2]) * amount)
    );
  }

  function shade(hex, amount) {
    var rgb = hexToRgb(hex);
    return rgbToHex(
      Math.round(rgb[0] * (1 - amount)),
      Math.round(rgb[1] * (1 - amount)),
      Math.round(rgb[2] * (1 - amount))
    );
  }

  function mix(base, blend, amount) {
    var b = hexToRgb(base);
    var m = hexToRgb(blend);
    return rgbToHex(
      Math.round(b[0] + (m[0] - b[0]) * amount),
      Math.round(b[1] + (m[1] - b[1]) * amount),
      Math.round(b[2] + (m[2] - b[2]) * amount)
    );
  }

  var DEFAULTS = {
    accent: "#4f6ef7",
    bg: "#f8f9fa",
    textColor: "#1a202c",
    cardColor: "#ffffff",
    radius: "10",
    view: "week"
  };

  function applyStyles(el, opts) {
    var s = el.style;
    var accent = opts.accent || DEFAULTS.accent;
    var card = opts.cardColor || DEFAULTS.cardColor;

    s.setProperty("--wc-accent", accent);
    s.setProperty("--wc-event-bg", accent);
    s.setProperty("--wc-accent-light", mix(card, accent, 0.15));
    s.setProperty("--wc-today-bg", mix(card, accent, 0.10));

    if (opts.bg) s.setProperty("--wc-bg", opts.bg);
    if (opts.textColor) {
      s.setProperty("--wc-text", opts.textColor);
      s.setProperty("color", opts.textColor);
      s.setProperty("--wc-text-light", tint(opts.textColor, 0.4));
    }
    if (opts.cardColor) {
      s.setProperty("--wc-card", card);
      s.setProperty("--wc-border", shade(card, 0.12));
    }
    if (opts.radius != null) {
      s.setProperty("--wc-radius", opts.radius + "px");
    }
  }

  var SCRIPT_ORIGIN = (function () {
    var s = document.currentScript;
    if (!s || !s.src) return "";
    try { return new URL(s.src).origin; } catch (e) { return ""; }
  })();

  var DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

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

  function formatCountdown(ms) {
    if (ms <= 0) return "Happening now";
    var mins = Math.floor(ms / 60000);
    var hrs = Math.floor(mins / 60);
    var days = Math.floor(hrs / 24);
    if (days > 0) return "Starts in " + days + " day" + (days !== 1 ? "s" : "") + (hrs % 24 > 0 ? ", " + (hrs % 24) + " hr" : "");
    if (hrs > 0) return "Starts in " + hrs + " hr" + (hrs !== 1 ? "s" : "") + (mins % 60 > 0 ? ", " + (mins % 60) + " min" : "");
    if (mins > 0) return "Starts in " + mins + " min";
    return "Starting now";
  }

  function getDayStart(offset) {
    var d = new Date();
    d.setDate(d.getDate() + offset);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function getMonthData(offset) {
    var now = new Date();
    var month = now.getMonth() + offset;
    var year = now.getFullYear();
    year += Math.floor(month / 12);
    month = ((month % 12) + 12) % 12;
    var firstDay = new Date(year, month, 1);
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var startDow = (firstDay.getDay() + 6) % 7;
    return { year: year, month: month, daysInMonth: daysInMonth, startDow: startDow };
  }

  // ---- WebCalendar class ----
  function WebCalendar(el, opts) {
    this.el = typeof el === "string" ? document.querySelector(el) : el;
    if (!this.el) throw new Error("WebCalendar: target element not found");

    this.opts = opts || {};
    this.events = [];
    this.weekOffset = 0;
    this.dayOffset = 0;
    this.monthOffset = 0;
    this.nextOffset = 0;
    this.server = this.opts.server || SCRIPT_ORIGIN || "";

    injectStyles();
    this.el.classList.add("wc-container");
    applyStyles(this.el, this.opts);

    this._calDiv = document.createElement("div");

    if (this.opts.url) {
      this.el.appendChild(this._calDiv);
      this.loadFeed(this.opts.url);
    } else if (this.opts.noInput) {
      this.el.appendChild(this._calDiv);
      this._render();
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
    var view = this.opts.view || "week";
    var offset = view === "day" ? this.dayOffset : view === "month" ? this.monthOffset : view === "next" ? this.nextOffset : this.weekOffset;

    if (this.events.length === 0 && offset === 0) {
      var msg = this.opts.url
        ? "No events found in the calendar feed."
        : this.opts.noInput
          ? "Enter an ICS feed URL and click Load."
          : "Paste an ICS feed URL above and hit Load.";
      this._calDiv.innerHTML = '<div class="wc-empty-state">' + msg + '</div>';
      return;
    }

    if (view === "day") this._renderDay();
    else if (view === "month") this._renderMonth();
    else if (view === "next") this._renderNext();
    else this._renderWeek();
  };

  WebCalendar.prototype._navHtml = function (label) {
    var view = this.opts.view || "week";
    return '<div class="wc-week-nav">' +
      '<div class="wc-btns">' +
        '<button data-wc-nav="prev">\u2039 Prev</button>' +
        '<button data-wc-nav="today">Today</button>' +
        '<button data-wc-nav="next">Next \u203a</button>' +
        '<select class="wc-view-select" data-wc-view>' +
          '<option value="day"' + (view === "day" ? " selected" : "") + '>Day</option>' +
          '<option value="week"' + (view === "week" ? " selected" : "") + '>Week</option>' +
          '<option value="month"' + (view === "month" ? " selected" : "") + '>Month</option>' +
          '<option value="next"' + (view === "next" ? " selected" : "") + '>Next</option>' +
        '</select>' +
      '</div>' +
      '<div class="wc-label">' + label + '</div>' +
    '</div>';
  };

  WebCalendar.prototype._bindNavListeners = function () {
    var self = this;
    var view = this.opts.view || "week";

    this._calDiv.querySelectorAll("[data-wc-nav]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var action = this.getAttribute("data-wc-nav");
        if (view === "day") {
          if (action === "prev") self.dayOffset--;
          else if (action === "next") self.dayOffset++;
          else self.dayOffset = 0;
        } else if (view === "month") {
          if (action === "prev") self.monthOffset--;
          else if (action === "next") self.monthOffset++;
          else self.monthOffset = 0;
        } else if (view === "next") {
          if (action === "prev") { self.nextOffset--; if (self.nextOffset < 0) self.nextOffset = 0; }
          else if (action === "next") self.nextOffset++;
          else self.nextOffset = 0;
        } else {
          if (action === "prev") self.weekOffset--;
          else if (action === "next") self.weekOffset++;
          else self.weekOffset = 0;
        }
        self._render();
      });
    });

    var viewSelect = self._calDiv.querySelector("[data-wc-view]");
    if (viewSelect) {
      viewSelect.addEventListener("change", function () {
        self.opts.view = this.value;
        self._render();
      });
    }
  };

  WebCalendar.prototype._renderWeek = function () {
    var weekStart = getWeekStart(this.weekOffset);
    var weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    var label = weekStart.getDate() + " " + MONTHS[weekStart.getMonth()] +
      " \u2013 " + weekEnd.getDate() + " " + MONTHS[weekEnd.getMonth()] +
      " " + weekEnd.getFullYear();

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var html = this._navHtml(label) + '<div class="wc-week-grid">';

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
            " \u2013 " + formatTime(ev.dtend) + '</div>';
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
    this._bindNavListeners();
  };

  WebCalendar.prototype._renderDay = function () {
    var day = getDayStart(this.dayOffset);
    var dowNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var label = dowNames[day.getDay()] + ", " +
      MONTHS_FULL[day.getMonth()] + " " + day.getDate() + ", " + day.getFullYear();

    var dayEvents = this.events
      .filter(function (e) { return isSameDay(e.dtstart, day); })
      .sort(function (a, b) { return a.dtstart - b.dtstart; });

    var html = this._navHtml(label) + '<div class="wc-day-view">';

    if (dayEvents.length === 0) {
      html += '<div class="wc-day-empty">No events for this day</div>';
    } else {
      for (var i = 0; i < dayEvents.length; i++) {
        var ev = dayEvents[i];
        html += '<div class="wc-day-event-card">';
        if (ev.dtend) {
          html += '<div class="wc-event-time">' + formatTime(ev.dtstart) +
            " \u2013 " + formatTime(ev.dtend) + '</div>';
        }
        html += '<div class="wc-event-title">' + escapeHtml(ev.summary) + '</div>';
        if (ev.location) {
          html += '<div class="wc-event-location">' + escapeHtml(ev.location) + '</div>';
        }
        if (ev.description) {
          html += '<div class="wc-event-desc">' + escapeHtml(ev.description) + '</div>';
        }
        html += '</div>';
      }
    }

    html += '</div>';
    this._calDiv.innerHTML = html;
    this._bindNavListeners();
  };

  WebCalendar.prototype._renderMonth = function () {
    var md = getMonthData(this.monthOffset);
    var label = MONTHS_FULL[md.month] + " " + md.year;
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var html = this._navHtml(label) + '<div class="wc-month-grid">';

    for (var d = 0; d < 7; d++) {
      html += '<div class="wc-month-dow">' + DOW[d] + '</div>';
    }

    var startDate = new Date(md.year, md.month, 1);
    startDate.setDate(startDate.getDate() - md.startDow);
    var totalDays = md.startDow + md.daysInMonth;
    var rows = Math.ceil(totalDays / 7);
    var totalCells = rows * 7;

    for (var i = 0; i < totalCells; i++) {
      var cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + i);
      var isOutside = cellDate.getMonth() !== md.month;
      var isToday = isSameDay(cellDate, today);

      var classes = "wc-month-day";
      if (isOutside) classes += " wc-outside";
      if (isToday) classes += " wc-today";

      html += '<div class="' + classes + '">';
      html += '<div class="wc-month-day-num">' + cellDate.getDate() + '</div>';

      var cellEvents = this.events
        .filter(function (e) { return isSameDay(e.dtstart, cellDate); })
        .sort(function (a, b) { return a.dtstart - b.dtstart; });

      html += '<div class="wc-month-events">';
      var maxShow = 2;
      for (var j = 0; j < Math.min(cellEvents.length, maxShow); j++) {
        html += '<div class="wc-month-event">' + escapeHtml(cellEvents[j].summary) + '</div>';
      }
      if (cellEvents.length > maxShow) {
        html += '<div class="wc-month-more">+' + (cellEvents.length - maxShow) + ' more</div>';
      }
      html += '</div></div>';
    }

    html += '</div>';
    this._calDiv.innerHTML = html;
    this._bindNavListeners();
  };

  WebCalendar.prototype._renderNext = function () {
    var now = new Date();
    var upcoming = this.events
      .filter(function (e) { return e.dtstart >= now; })
      .sort(function (a, b) { return a.dtstart - b.dtstart; });

    var idx = this.nextOffset;
    if (idx >= upcoming.length) idx = upcoming.length - 1;
    if (idx < 0) idx = 0;
    this.nextOffset = idx;

    var label = "Up Next";
    var html = this._navHtml(label) + '<div class="wc-next-view">';

    if (upcoming.length === 0) {
      html += '<div class="wc-day-empty">No upcoming events</div>';
    } else {
      var ev = upcoming[idx];
      var dowNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      var dateStr = dowNames[ev.dtstart.getDay()] + ", " +
        MONTHS_FULL[ev.dtstart.getMonth()] + " " + ev.dtstart.getDate() + ", " + ev.dtstart.getFullYear();
      var countdown = formatCountdown(ev.dtstart - now);

      html += '<div class="wc-next-card">';
      html += '<div class="wc-next-when">' + escapeHtml(dateStr) + '</div>';
      html += '<div class="wc-next-title">' + escapeHtml(ev.summary) + '</div>';
      if (ev.dtend) {
        html += '<div class="wc-next-time">' + formatTime(ev.dtstart) + " \u2013 " + formatTime(ev.dtend) + '</div>';
      }
      if (ev.location) {
        html += '<div class="wc-next-location">' + escapeHtml(ev.location) + '</div>';
      }
      if (ev.description) {
        html += '<div class="wc-next-desc">' + escapeHtml(ev.description) + '</div>';
      }
      html += '<div class="wc-next-countdown">' + escapeHtml(countdown) + '</div>';
      html += '</div>';
      if (upcoming.length > 1) {
        html += '<div class="wc-next-position">' + (idx + 1) + ' of ' + upcoming.length + ' upcoming</div>';
      }
    }

    html += '</div>';
    this._calDiv.innerHTML = html;
    this._bindNavListeners();
  };

  WebCalendar.prototype.setAccent = function (color) {
    this.opts.accent = color;
    applyStyles(this.el, this.opts);
  };

  WebCalendar.prototype.setOption = function (key, value) {
    this.opts[key] = value;
    if (key === "view") {
      this._render();
    } else {
      applyStyles(this.el, this.opts);
    }
  };

  WebCalendar.DEFAULTS = DEFAULTS;

  // ---- Public API ----
  window.WebCalendar = WebCalendar;

  // ---- Auto-init from data attributes ----
  function autoInit() {
    document.querySelectorAll("[data-web-calendar]").forEach(function (el) {
      if (el._webCalendar) return;
      var url = el.getAttribute("data-url") || "";
      var accent = el.getAttribute("data-accent") || "";
      var bg = el.getAttribute("data-bg") || "";
      var textColor = el.getAttribute("data-text-color") || "";
      var cardColor = el.getAttribute("data-card-color") || "";
      var radius = el.getAttribute("data-radius");
      var view = el.getAttribute("data-view") || "";
      el._webCalendar = new WebCalendar(el, {
        url: url || undefined,
        accent: accent || undefined,
        bg: bg || undefined,
        textColor: textColor || undefined,
        cardColor: cardColor || undefined,
        radius: radius != null ? radius : undefined,
        view: view || undefined
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    autoInit();
  }
})();
