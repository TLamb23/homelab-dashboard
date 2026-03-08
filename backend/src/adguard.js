import axios from 'axios';

export async function getAdGuardData() {
  const ADGUARD_IP = process.env.ADGUARD_IP;
  const user = process.env.ADGUARD_USER || '';
  const pass = process.env.ADGUARD_PASS || '';

  const auth = user && pass ? { username: user, password: pass } : undefined;

  try {
    const [statsRes, statusRes] = await Promise.all([
      axios.get(`http://${ADGUARD_IP}/control/stats`, { auth, timeout: 5000 }),
      axios.get(`http://${ADGUARD_IP}/control/status`, { auth, timeout: 5000 }),
    ]);

    const s = statsRes.data;
    const blocked = s.num_blocked_filtering ?? 0;
    const total = s.num_dns_queries ?? 0;

    return {
      online: true,
      totalQueries: total,
      blockedQueries: blocked,
      blockRate: total > 0 ? Math.round((blocked / total) * 100) : 0,
      avgProcessTime: s.avg_processing_time ?? 0,
      topBlockedDomains: s.top_blocked_domains?.slice(0, 5) ?? [],
      version: statusRes.data?.version ?? null,
      running: statusRes.data?.running ?? true,
    };
  } catch {
    return { online: false };
  }
}
