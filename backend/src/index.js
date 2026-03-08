import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env manually
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');
try {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
  }
} catch {}

import { getProxmoxData } from './proxmox.js';
import { getDockerData } from './docker.js';
import { getAdGuardData } from './adguard.js';
import { getPlexData } from './plex.js';

const app = express();
app.use(cors());
app.use(express.json());

// Cache layer
const cache = {};
const CACHE_TTL = 15000; // 15 seconds

async function cached(key, fn) {
  const now = Date.now();
  if (cache[key] && now - cache[key].ts < CACHE_TTL) return cache[key].data;
  try {
    const data = await fn();
    cache[key] = { data, ts: now };
    return data;
  } catch (err) {
    if (cache[key]) return cache[key].data; // return stale on error
    throw err;
  }
}

app.get('/api/proxmox', async (req, res) => {
  try {
    const data = await cached('proxmox', getProxmoxData);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/docker', async (req, res) => {
  try {
    const data = await cached('docker', getDockerData);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/adguard', async (req, res) => {
  try {
    const data = await cached('adguard', getAdGuardData);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/plex', async (req, res) => {
  try {
    const data = await cached('plex', getPlexData);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/all', async (req, res) => {
  const [proxmox, docker, adguard, plex] = await Promise.allSettled([
    cached('proxmox', getProxmoxData),
    cached('docker', getDockerData),
    cached('adguard', getAdGuardData),
    cached('plex', getPlexData),
  ]);
  res.json({
    proxmox: proxmox.status === 'fulfilled' ? proxmox.value : { error: proxmox.reason?.message },
    docker: docker.status === 'fulfilled' ? docker.value : { error: docker.reason?.message },
    adguard: adguard.status === 'fulfilled' ? adguard.value : { error: adguard.reason?.message },
    plex: plex.status === 'fulfilled' ? plex.value : { error: plex.reason?.message },
  });
});

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`Dashboard API running on :${PORT}`));
