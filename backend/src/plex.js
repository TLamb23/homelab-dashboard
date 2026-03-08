import axios from 'axios';

export async function getPlexData() {
  const PLEX_IP = process.env.PLEX_IP;
  const PLEX_PORT = process.env.PLEX_PORT || 32400;
  const PLEX_TOKEN = process.env.PLEX_TOKEN || '';

  try {
    const headers = PLEX_TOKEN ? { 'X-Plex-Token': PLEX_TOKEN } : {};
    const params = PLEX_TOKEN ? { 'X-Plex-Token': PLEX_TOKEN } : {};

    const [identityRes, sessionsRes] = await Promise.allSettled([
      axios.get(`http://${PLEX_IP}:${PLEX_PORT}/identity`, { headers, timeout: 5000 }),
      PLEX_TOKEN
        ? axios.get(`http://${PLEX_IP}:${PLEX_PORT}/status/sessions`, { params, timeout: 5000 })
        : Promise.reject(new Error('No token')),
    ]);

    const online = identityRes.status === 'fulfilled';
    let version = null;
    let activeStreams = null;

    if (online) {
      const d = identityRes.value.data;
      // Plex can return JSON or XML depending on client
      if (typeof d === 'object') {
        version = d?.MediaContainer?.version ?? null;
      } else {
        // XML fallback: split on version= and find multi-part semver
        const parts = String(d).split('version=');
        for (const part of parts.slice(1)) {
          const q = part[0];
          const val = part.slice(1, part.indexOf(q, 1));
          if (val && val.split('.').length >= 3) { version = val; break; }
        }
      }
    }

    if (sessionsRes.status === 'fulfilled') {
      const d = sessionsRes.value.data;
      activeStreams = typeof d === 'object'
        ? (d?.MediaContainer?.size ?? 0)
        : parseInt(String(d).match(/size="(\d+)"/)?.[1] ?? '0');
    }

    return { online, version, activeStreams, needsToken: !PLEX_TOKEN };
  } catch {
    return { online: false };
  }
}
