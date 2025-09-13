const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const TARGET = process.env.TARGET || 'http://smarterplus1.freeddns.org:8080';
const app = express();

// Middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');   // autorise tout domaine
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range,Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Proxy vers Owncast
app.use('/hls', createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  pathRewrite: { '^/hls': '/hls' },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['access-control-allow-origin'] = '*';
    proxyRes.headers['access-control-allow-headers'] = 'Range,Content-Type';
  },
  proxyTimeout: 20000,
  timeout: 20000,
  logLevel: 'warn'
}));

app.get('/', (req, res) => res.send('✅ Proxy Owncast avec CORS OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
