import React from 'react';
import { formatBytes, formatUptime } from '../utils.js';

function Bar({ value, max, color = 'bg-blue-500' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const barColor =
    pct > 85 ? 'bg-red-500' : pct > 65 ? 'bg-yellow-500' : color;
  return (
    <div className="w-full bg-[#21262d] rounded-full h-1.5 mt-1">
      <div
        className={`${barColor} h-1.5 rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function NodeBanner({ node }) {
  if (!node) return null;

  const cpuPct = ((node.cpu ?? 0) * 100).toFixed(1);
  const memPct = node.memTotal > 0 ? ((node.mem / node.memTotal) * 100).toFixed(1) : 0;
  const diskPct = node.diskTotal > 0 ? ((node.disk / node.diskTotal) * 100).toFixed(1) : 0;

  return (
    <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🖥️</span>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-wide">lambertlab</h1>
            <p className="text-xs text-[#8b949e]">Proxmox {node.pveVersion?.split('/')[1] ?? ''} · {node.cpuModel?.split('@')[0].trim()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8b949e]">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 pulse-dot" />
          <span>up {formatUptime(node.uptime)}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#8b949e]">CPU</span>
            <span className={cpuPct > 80 ? 'text-red-400' : cpuPct > 50 ? 'text-yellow-400' : 'text-green-400'}>
              {cpuPct}%
            </span>
          </div>
          <Bar value={node.cpu} max={1} color="bg-blue-500" />
          <p className="text-xs text-[#8b949e] mt-1">{node.cpuCores} vCPUs · load {node.loadAvg?.[0] ?? '—'}</p>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#8b949e]">RAM</span>
            <span className={memPct > 85 ? 'text-red-400' : memPct > 65 ? 'text-yellow-400' : 'text-green-400'}>
              {memPct}%
            </span>
          </div>
          <Bar value={node.mem} max={node.memTotal} color="bg-violet-500" />
          <p className="text-xs text-[#8b949e] mt-1">
            {formatBytes(node.mem)} / {formatBytes(node.memTotal)}
          </p>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#8b949e]">Root FS</span>
            <span className={diskPct > 85 ? 'text-red-400' : diskPct > 65 ? 'text-yellow-400' : 'text-green-400'}>
              {diskPct}%
            </span>
          </div>
          <Bar value={node.disk} max={node.diskTotal} color="bg-amber-500" />
          <p className="text-xs text-[#8b949e] mt-1">
            {formatBytes(node.disk)} / {formatBytes(node.diskTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
