export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export function formatUptime(seconds) {
  if (!seconds) return '—';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatCpu(val) {
  if (val === undefined || val === null) return '—';
  return `${(val * 100).toFixed(1)}%`;
}

export function cpuColor(val) {
  const pct = (val ?? 0) * 100;
  if (pct > 80) return 'text-red-400';
  if (pct > 50) return 'text-yellow-400';
  return 'text-green-400';
}

export function memColor(used, total) {
  if (!total) return 'text-green-400';
  const pct = (used / total) * 100;
  if (pct > 85) return 'text-red-400';
  if (pct > 65) return 'text-yellow-400';
  return 'text-green-400';
}

export function tagColor(tag) {
  const colors = {
    media: 'bg-purple-900/50 text-purple-300 border-purple-700/50',
    docker: 'bg-blue-900/50 text-blue-300 border-blue-700/50',
    network: 'bg-cyan-900/50 text-cyan-300 border-cyan-700/50',
    monitoring: 'bg-orange-900/50 text-orange-300 border-orange-700/50',
    security: 'bg-red-900/50 text-red-300 border-red-700/50',
    build: 'bg-green-900/50 text-green-300 border-green-700/50',
    auth: 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50',
    hacking: 'bg-red-900/50 text-red-300 border-red-700/50',
  };
  const key = Object.keys(colors).find((k) => tag.toLowerCase().includes(k));
  return key ? colors[key] : 'bg-gray-800/50 text-gray-400 border-gray-700/50';
}

// VM type icon
export function typeIcon(type) {
  return type === 'qemu' ? '⬜' : '📦';
}

// Friendly name + icon for known services
export const SERVICE_META = {
  'YAMS': { icon: '🎬', desc: 'Media Requests' },
  'wireguard': { icon: '🔒', desc: 'VPN' },
  'adguard': { icon: '🛡️', desc: 'DNS Blocker' },
  'twingate-connector': { icon: '🔗', desc: 'Network Connector' },
  'Twingate': { icon: '🌐', desc: 'Network Access' },
  'ubuntu': { icon: '🐧', desc: 'Ubuntu Server' },
  'build-server': { icon: '🔨', desc: 'Build / Staging' },
  'baby-tracker-api': { icon: '👶', desc: 'Baby Tracker API' },
  'Plex-Ubuntu': { icon: '🎞️', desc: 'Plex Media Server' },
  'TrueNas': { icon: '💾', desc: 'NAS / Storage' },
  'docker': { icon: '🐳', desc: 'Docker Host' },
  'uptimekuma': { icon: '📡', desc: 'Uptime Monitor' },
};
