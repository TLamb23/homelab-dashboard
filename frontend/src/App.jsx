import React, { useState, useEffect, useCallback } from 'react';
import NodeBanner from './components/NodeBanner.jsx';
import VMCard from './components/VMCard.jsx';
import { AdGuardCard, PlexCard, UptimeKumaCard } from './components/ServiceCards.jsx';

const API = '/api';
const REFRESH_INTERVAL = 20000; // 20 seconds

function LastUpdated({ time }) {
  if (!time) return null;
  return (
    <span className="text-xs text-[#8b949e]">
      updated {new Date(time).toLocaleTimeString()}
    </span>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API}/all`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setLastUpdated(Date.now());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  const proxmox = data?.proxmox;
  const docker = data?.docker;
  const adguard = data?.adguard;
  const plex = data?.plex;

  // Sort: running first, then stopped
  const vms = proxmox?.vms
    ? [...proxmox.vms].sort((a, b) => {
        if (a.status === b.status) return a.name.localeCompare(b.name);
        return a.status === 'running' ? -1 : 1;
      })
    : [];

  const runningCount = vms.filter((v) => v.status === 'running').length;
  const stoppedCount = vms.filter((v) => v.status !== 'running').length;

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#e6edf3] p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">🏠 lambertlab</h1>
          <p className="text-xs text-[#8b949e] mt-0.5">Home Lab Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <LastUpdated time={lastUpdated} />
          <button
            onClick={fetchData}
            className="text-xs text-[#58a6ff] hover:text-blue-300 border border-[#21262d] rounded-lg px-3 py-1.5 hover:border-[#30363d] transition-colors"
          >
            ↺ Refresh
          </button>
        </div>
      </div>

      {loading && !data && (
        <div className="flex items-center justify-center h-64">
          <div className="text-[#8b949e] text-sm">Connecting to lambertlab...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 mb-6 text-sm text-red-400">
          ⚠ API error: {error}
        </div>
      )}

      {proxmox?.error && (
        <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-xl p-4 mb-6 text-sm text-yellow-400">
          ⚠ Proxmox: {proxmox.error}
        </div>
      )}

      {/* Node Banner */}
      {proxmox?.node && <NodeBanner node={proxmox.node} />}

      {/* VM / Container count */}
      {vms.length > 0 && (
        <div className="flex items-center gap-4 mb-4 text-xs text-[#8b949e]">
          <span>
            <span className="text-green-400 font-medium">{runningCount}</span> running
          </span>
          <span>
            <span className="text-[#8b949e] font-medium">{stoppedCount}</span> stopped
          </span>
          <span className="text-[#30363d]">|</span>
          <span>{vms.length} total</span>
        </div>
      )}

      {/* VM Grid */}
      {vms.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {vms.map((vm) => (
            <VMCard
              key={vm.id}
              vm={vm}
              dockerContainers={vm.name === 'docker' && Array.isArray(docker) ? docker : null}
            />
          ))}
        </div>
      )}

      {/* Service Cards */}
      <div className="border-t border-[#21262d] pt-6 mb-2">
        <h2 className="text-xs font-medium text-[#8b949e] uppercase tracking-widest mb-4">Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AdGuardCard data={adguard} />
          <PlexCard data={plex} />
          <UptimeKumaCard />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-[#8b949e]">
        Auto-refreshes every 20s · Proxmox 8 · lambertlab
      </div>
    </div>
  );
}
