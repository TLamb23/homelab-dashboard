import React from 'react';
import { formatBytes, formatUptime, formatCpu, tagColor, SERVICE_META } from '../utils.js';

function MiniBar({ value, max }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const color = pct > 85 ? 'bg-red-500' : pct > 65 ? 'bg-yellow-500' : 'bg-blue-500';
  return (
    <div className="w-full bg-[#21262d] rounded-full h-1 mt-0.5">
      <div className={`${color} h-1 rounded-full`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function VMCard({ vm, dockerContainers }) {
  const isRunning = vm.status === 'running';
  const meta = SERVICE_META[vm.name] ?? {};
  const icon = meta.icon ?? (vm.type === 'qemu' ? '⬜' : '📦');
  const desc = meta.desc ?? (vm.type === 'qemu' ? 'Virtual Machine' : 'Container');

  const cpuPct = ((vm.cpu ?? 0) * 100).toFixed(1);
  const memPct = vm.memMax > 0 ? ((vm.mem / vm.memMax) * 100).toFixed(1) : 0;

  // Special: show docker containers for docker LXC
  const isDockerHost = vm.name === 'docker' && dockerContainers;

  return (
    <div
      className={`bg-[#161b22] border rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 ${
        isRunning ? 'border-[#21262d] hover:border-[#30363d]' : 'border-[#21262d] opacity-50'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-white leading-tight">{vm.name}</h3>
              {vm.link && isRunning && (
                <a
                  href={vm.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#58a6ff] hover:text-blue-300 text-xs"
                  title="Open UI"
                >
                  ↗
                </a>
              )}
            </div>
            <p className="text-xs text-[#8b949e]">{desc}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${
                isRunning ? 'bg-green-400 pulse-dot' : 'bg-[#8b949e]'
              }`}
            />
            <span className={`text-xs ${isRunning ? 'text-green-400' : 'text-[#8b949e]'}`}>
              {vm.status}
            </span>
          </div>
          <span className="text-xs text-[#8b949e]">{vm.type === 'qemu' ? 'VM' : 'LXC'} · {vm.id}</span>
        </div>
      </div>

      {/* Stats — only if running */}
      {isRunning && (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="flex justify-between text-[#8b949e]">
              <span>CPU</span>
              <span className={cpuPct > 80 ? 'text-red-400' : cpuPct > 50 ? 'text-yellow-400' : 'text-[#e6edf3]'}>
                {cpuPct}%
              </span>
            </div>
            <MiniBar value={vm.cpu} max={1} />
          </div>
          <div>
            <div className="flex justify-between text-[#8b949e]">
              <span>RAM</span>
              <span className={memPct > 85 ? 'text-red-400' : memPct > 65 ? 'text-yellow-400' : 'text-[#e6edf3]'}>
                {formatBytes(vm.mem, 0)}
              </span>
            </div>
            <MiniBar value={vm.mem} max={vm.memMax} />
          </div>
        </div>
      )}

      {/* Uptime */}
      {isRunning && (
        <div className="text-xs text-[#8b949e]">
          up {formatUptime(vm.uptime)}
          {vm.memMax > 0 && (
            <span className="ml-2 text-[#8b949e]">· {formatBytes(vm.memMax)} alloc</span>
          )}
        </div>
      )}

      {/* Docker containers for the docker LXC */}
      {isDockerHost && (
        <div className="border-t border-[#21262d] pt-2 mt-1 flex flex-col gap-1">
          {dockerContainers.map((c) => (
            <div key={c.id} className="flex items-center justify-between text-xs">
              <span className="text-[#e6edf3]">{c.name}</span>
              <span className={c.state === 'running' ? 'text-green-400' : 'text-[#8b949e]'}>
                {c.state}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {vm.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {vm.tags.filter(Boolean).map((tag) => (
            <span
              key={tag}
              className={`text-xs px-1.5 py-0.5 rounded border ${tagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
