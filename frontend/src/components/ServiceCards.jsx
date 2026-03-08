import React from 'react';

function StatRow({ label, value, valueClass = 'text-[#e6edf3]' }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-[#8b949e]">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}


export function AdGuardCard({ data }) {
  const online = data?.online;
  return (
    <div className={`bg-[#161b22] border border-[#21262d] rounded-xl p-4 flex flex-col gap-3 ${!online ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🛡️</span>
          <div>
            <h3 className="text-sm font-medium text-white">AdGuard Home</h3>
            <p className="text-xs text-[#8b949e]">DNS Blocker</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${online ? 'bg-green-400 pulse-dot' : 'bg-red-400'}`} />
          <span className={`text-xs ${online ? 'text-green-400' : 'text-red-400'}`}>
            {online ? 'online' : 'offline'}
          </span>
        </div>
      </div>

      {online && data.totalQueries > 0 && (
        <div className="flex flex-col gap-1.5">
          <StatRow label="Queries today" value={data.totalQueries?.toLocaleString()} />
          <StatRow
            label="Blocked"
            value={`${data.blockedQueries?.toLocaleString()} (${data.blockRate}%)`}
            valueClass="text-green-400"
          />
          {data.avgProcessTime > 0 && (
            <StatRow label="Avg response" value={`${(data.avgProcessTime * 1000).toFixed(0)}ms`} />
          )}
          {data.version && <StatRow label="Version" value={data.version} />}
        </div>
      )}

      {online && data.totalQueries === 0 && (
        <p className="text-xs text-[#8b949e]">No stats available (auth required)</p>
      )}

      <a
        href="http://192.168.0.141"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-[#58a6ff] hover:underline mt-auto"
      >
        Open AdGuard →
      </a>
    </div>
  );
}

export function PlexCard({ data }) {
  const online = data?.online;
  return (
    <div className={`bg-[#161b22] border border-[#21262d] rounded-xl p-4 flex flex-col gap-3 ${!online ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎞️</span>
          <div>
            <h3 className="text-sm font-medium text-white">Plex</h3>
            <p className="text-xs text-[#8b949e]">Media Server</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${online ? 'bg-green-400 pulse-dot' : 'bg-red-400'}`} />
          <span className={`text-xs ${online ? 'text-green-400' : 'text-red-400'}`}>
            {online ? 'online' : 'offline'}
          </span>
        </div>
      </div>

      {online && (
        <div className="flex flex-col gap-1.5">
          {data.version && <StatRow label="Version" value={data.version} />}
          {data.activeStreams !== null && !data.needsToken && (
            <StatRow
              label="Active streams"
              value={data.activeStreams}
              valueClass={data.activeStreams > 0 ? 'text-green-400' : 'text-[#8b949e]'}
            />
          )}
          {data.needsToken && (
            <p className="text-xs text-yellow-400">Add PLEX_TOKEN to .env for stream data</p>
          )}
        </div>
      )}

      <a
        href="http://192.168.0.185:32400/web"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-[#58a6ff] hover:underline mt-auto"
      >
        Open Plex →
      </a>
    </div>
  );
}

export function UptimeKumaCard() {
  return (
    <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">📡</span>
          <div>
            <h3 className="text-sm font-medium text-white">Uptime Kuma</h3>
            <p className="text-xs text-[#8b949e]">Service Monitor</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
          <span className="text-xs text-green-400">online</span>
        </div>
      </div>
      <p className="text-xs text-[#8b949e]">View all monitors and uptime history</p>
      <a
        href="http://192.168.0.216:3001"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-[#58a6ff] hover:underline mt-auto"
      >
        Open Uptime Kuma →
      </a>
    </div>
  );
}
