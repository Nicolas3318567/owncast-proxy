const express = require("express");
const fetch = require("node-fetch");
const app = express();

const TARGET = "http://smarterplus1.freeddns.org:8080"; // ton Owncast

// Proxy HLS
app.get("/hls/:path(*)", async (req, res) => {
  try {
    const url = `${TARGET}/hls/${req.params.path}`;
    const r = await fetch(url);
    res.set("Content-Type", r.headers.get("content-type"));
    r.body.pipe(res);
  } catch (err) {
    res.status(500).send("Erreur proxy HLS");
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("✅ Proxy Owncast Render fonctionne !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy démarré sur port ${PORT}`));
