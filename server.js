const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Proxy endpoint to fetch ICS feeds (avoids CORS issues)
app.get("/api/feed", async (req, res) => {
  const feedUrl = req.query.url;
  if (!feedUrl) {
    return res.status(400).json({ error: "Missing 'url' query parameter" });
  }

  try {
    const response = await fetch(feedUrl);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Feed returned ${response.status}` });
    }
    const text = await response.text();
    res.set("Content-Type", "text/calendar; charset=utf-8");
    res.send(text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Calendar app running at http://localhost:${PORT}`);
});
